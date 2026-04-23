# Building a Native Rust MDX Parser — Full Plan

---

## What is MDX exactly

MDX is a superset of Markdown. It adds:
1. JSX elements inside Markdown (`<Component prop="value" />`)
2. JSX expressions inside Markdown (`{variable}`, `{2 + 2}`)
3. Import/export statements at the top level
4. Full JS expressions as children of JSX

Example:
```mdx
---
title: Hello
---

import { Button } from './Button'

export const name = "world"

# Hello {name}

Some **bold** text with a <Button color="red">click me</Button> inline.

<MyCard>
  ## Nested Markdown

  This is markdown _inside_ a JSX component.
</MyCard>
```

---

## The Core Problem

MDX is two languages interleaved. You cannot parse it with a single pass.
You need a **dual-mode parser** that switches context:

```
MARKDOWN MODE → sees <Uppercase  → switch to JSX MODE
JSX MODE      → balanced tags closed → switch back to MARKDOWN MODE
MARKDOWN MODE → sees {          → switch to EXPRESSION MODE
EXPRESSION MODE → balanced } found → switch back to MARKDOWN MODE
```

The tricky parts:
- JSX boundary detection (when does a `<` start JSX vs HTML?)
- Nested JSX (JSX inside JSX)
- Markdown inside JSX children
- Expressions `{}` inside JSX props
- Import/export at top level

---

## Parser Architecture

### Stages

```
Source Text
    │
    ▼
┌─────────────┐
│   Lexer     │  Turns raw text into tokens
└──────┬──────┘
       │
    ▼
┌─────────────┐
│   Parser    │  Turns tokens into AST nodes
└──────┬──────┘
       │
    ▼
┌─────────────┐
│  Resolver   │  Validates imports, resolves expressions
└──────┬──────┘
       │
    ▼
┌─────────────┐
│  Codegen    │  Walks AST and emits JS/HTML output
└─────────────┘
```

---

## Stage 1: Lexer (Tokenizer)

The lexer reads raw text and emits a flat list of tokens. It does NOT build a tree.

### Token Types

```rust
#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    // Markdown tokens
    Heading { level: u8, text: String },
    Paragraph(String),
    Bold(String),
    Italic(String),
    Code { lang: Option<String>, content: String },
    InlineCode(String),
    Link { text: String, href: String },
    Image { alt: String, src: String },
    HorizontalRule,
    Blockquote(String),
    ListItem { ordered: bool, depth: u8, content: String },
    HardBreak,
    SoftBreak,
    Text(String),

    // JSX tokens
    JsxOpenTag {
        name: String,
        attrs: Vec<JsxAttr>,
        self_closing: bool,
    },
    JsxCloseTag { name: String },
    JsxExpression(String),    // {expression}

    // Top-level MDX tokens
    Import(String),           // import ... from '...'
    Export(String),           // export const ...

    // Frontmatter
    Frontmatter(String),      // raw YAML/TOML between --- delimiters

    // Special
    EOF,
}

#[derive(Debug, Clone, PartialEq)]
pub struct JsxAttr {
    pub name: String,
    pub value: JsxAttrValue,
}

#[derive(Debug, Clone, PartialEq)]
pub enum JsxAttrValue {
    String(String),           // prop="value"
    Expression(String),       // prop={value}
    Boolean,                  // prop (no value = true)
}
```

### Lexer State Machine

```rust
#[derive(Debug, Clone, PartialEq)]
enum LexerMode {
    Normal,           // top-level MDX
    Markdown,         // inside markdown block
    JsxTag,           // inside < ... >
    JsxChildren,      // between open and close tag
    JsxExpression,    // inside { ... }
    Frontmatter,      // between --- delimiters
    Import,           // import statement
    Export,           // export statement
    CodeBlock,        // inside ``` ... ```
}

pub struct Lexer {
    input: Vec<char>,
    pos: usize,
    mode: LexerMode,
    mode_stack: Vec<LexerMode>,   // for nested modes
    tokens: Vec<Token>,
}
```

### Key Lexer Rules

**JSX detection** - a `<` starts JSX only if:
- The next char is an uppercase letter (components) OR
- It's a known HTML void element in a JSX context OR
- We are already inside JSX children

```rust
fn is_jsx_start(&self) -> bool {
    if self.peek() != '<' { return false; }
    let next = self.peek_at(1);
    next.is_uppercase() || next == '/'  // <Component or </Component
}
```

**Expression detection** - a `{` starts an expression:
```rust
fn is_expression_start(&self) -> bool {
    self.peek() == '{'
}
```

**Frontmatter detection** - only at the very start of the file:
```rust
fn is_frontmatter_start(&self) -> bool {
    self.pos == 0 && self.input.starts_with(&['-', '-', '-'])
}
```

---

## Stage 2: AST

The AST represents the document as a tree.

### Node Types

```rust
#[derive(Debug, Clone)]
pub enum Node {
    Document(Document),
    Frontmatter(Frontmatter),
    Import(Import),
    Export(Export),
    Heading(Heading),
    Paragraph(Paragraph),
    Text(Text),
    Bold(Box<Node>),
    Italic(Box<Node>),
    InlineCode(String),
    CodeBlock(CodeBlock),
    Link(Link),
    Image(Image),
    HorizontalRule,
    Blockquote(Vec<Node>),
    List(List),
    ListItem(ListItem),
    JsxElement(JsxElement),
    JsxSelfClosing(JsxSelfClosing),
    JsxExpression(String),
    HardBreak,
    SoftBreak,
}

#[derive(Debug, Clone)]
pub struct Document {
    pub children: Vec<Node>,
}

#[derive(Debug, Clone)]
pub struct Frontmatter {
    pub raw: String,
    pub data: serde_json::Value,
}

#[derive(Debug, Clone)]
pub struct Heading {
    pub level: u8,         // 1-6
    pub children: Vec<Node>,
    pub id: String,        // slug for anchor links
}

#[derive(Debug, Clone)]
pub struct Paragraph {
    pub children: Vec<Node>,
}

#[derive(Debug, Clone)]
pub struct Text {
    pub value: String,
}

#[derive(Debug, Clone)]
pub struct CodeBlock {
    pub lang: Option<String>,
    pub content: String,
    pub meta: Option<String>,  // e.g. "highlight=1,2,3"
}

#[derive(Debug, Clone)]
pub struct Link {
    pub href: String,
    pub title: Option<String>,
    pub children: Vec<Node>,
}

#[derive(Debug, Clone)]
pub struct Image {
    pub src: String,
    pub alt: String,
    pub title: Option<String>,
}

#[derive(Debug, Clone)]
pub struct List {
    pub ordered: bool,
    pub start: Option<u32>,
    pub children: Vec<ListItem>,
}

#[derive(Debug, Clone)]
pub struct ListItem {
    pub children: Vec<Node>,
}

#[derive(Debug, Clone)]
pub struct JsxElement {
    pub name: String,
    pub attrs: Vec<JsxAttr>,
    pub children: Vec<Node>,   // children can be Markdown nodes!
}

#[derive(Debug, Clone)]
pub struct JsxSelfClosing {
    pub name: String,
    pub attrs: Vec<JsxAttr>,
}

#[derive(Debug, Clone)]
pub struct Import {
    pub raw: String,
}

#[derive(Debug, Clone)]
pub struct Export {
    pub raw: String,
}
```

---

## Stage 3: Parser

The parser consumes the token stream and builds the AST.

### Parser Struct

```rust
pub struct Parser {
    tokens: Vec<Token>,
    pos: usize,
    errors: Vec<ParseError>,
}

impl Parser {
    pub fn parse(&mut self) -> Result<Node, ParseError> {
        let mut children = vec![];

        // Frontmatter must be first
        if let Some(fm) = self.try_parse_frontmatter() {
            children.push(fm);
        }

        // Top-level imports and exports
        while self.peek_is_import_or_export() {
            children.push(self.parse_import_or_export()?);
        }

        // Body
        while !self.is_eof() {
            children.push(self.parse_block()?);
        }

        Ok(Node::Document(Document { children }))
    }
}
```

### Block Parsing

```rust
fn parse_block(&mut self) -> Result<Node, ParseError> {
    match self.peek() {
        Token::Heading { .. }    => self.parse_heading(),
        Token::JsxOpenTag { .. } => self.parse_jsx_element(),
        Token::JsxExpression(..) => self.parse_jsx_expression(),
        Token::Code { .. }       => self.parse_code_block(),
        Token::HorizontalRule    => self.parse_hr(),
        Token::ListItem { .. }   => self.parse_list(),
        Token::Blockquote(..)    => self.parse_blockquote(),
        _                        => self.parse_paragraph(),
    }
}
```

### JSX Element Parsing (most complex)

```rust
fn parse_jsx_element(&mut self) -> Result<Node, ParseError> {
    let open = self.expect_jsx_open_tag()?;

    // Self-closing: <Component />
    if open.self_closing {
        return Ok(Node::JsxSelfClosing(JsxSelfClosing {
            name: open.name,
            attrs: open.attrs,
        }));
    }

    // Parse children — this is where Markdown re-enters
    let mut children = vec![];
    loop {
        match self.peek() {
            // Closing tag — we're done
            Token::JsxCloseTag { name } if name == open.name => {
                self.advance();
                break;
            }
            // Nested JSX
            Token::JsxOpenTag { .. } => {
                children.push(self.parse_jsx_element()?);
            }
            // Expression
            Token::JsxExpression(expr) => {
                children.push(Node::JsxExpression(expr));
                self.advance();
            }
            // EOF without closing tag — error
            Token::EOF => {
                return Err(ParseError::UnclosedJsxElement(open.name));
            }
            // Everything else is Markdown content inside JSX
            _ => {
                children.push(self.parse_block()?);
            }
        }
    }

    Ok(Node::JsxElement(JsxElement {
        name: open.name,
        attrs: open.attrs,
        children,
    }))
}
```

### Inline Parsing

Inline content (text, bold, italic, inline code, links) is parsed inside paragraphs and headings:

```rust
fn parse_inline(&mut self) -> Vec<Node> {
    let mut nodes = vec![];
    // consume tokens until we hit a block-level token
    while !self.is_block_boundary() {
        match self.peek() {
            Token::Bold(text)       => nodes.push(Node::Bold(Box::new(Node::Text(Text { value: text })))),
            Token::Italic(text)     => nodes.push(Node::Italic(Box::new(Node::Text(Text { value: text })))),
            Token::InlineCode(code) => nodes.push(Node::InlineCode(code)),
            Token::Link { text, href } => nodes.push(Node::Link(Link {
                href,
                title: None,
                children: vec![Node::Text(Text { value: text })],
            })),
            Token::JsxExpression(expr) => nodes.push(Node::JsxExpression(expr)),
            Token::JsxOpenTag { .. }   => nodes.push(self.parse_jsx_element().unwrap()),
            Token::Text(t)             => nodes.push(Node::Text(Text { value: t })),
            Token::SoftBreak           => nodes.push(Node::SoftBreak),
            Token::HardBreak           => nodes.push(Node::HardBreak),
            _ => break,
        }
        self.advance();
    }
    nodes
}
```

---

## Stage 4: Codegen

Walk the AST and emit JS output (function body that React can execute).

```rust
pub struct Codegen {
    output: String,
    indent: usize,
}

impl Codegen {
    pub fn emit(&mut self, node: &Node) -> String {
        match node {
            Node::Document(doc)        => self.emit_document(doc),
            Node::Heading(h)           => self.emit_heading(h),
            Node::Paragraph(p)         => self.emit_paragraph(p),
            Node::JsxElement(el)       => self.emit_jsx_element(el),
            Node::JsxSelfClosing(el)   => self.emit_jsx_self_closing(el),
            Node::JsxExpression(expr)  => format!("{{{}}}", expr),
            Node::Text(t)              => self.escape_text(&t.value),
            Node::Bold(child)          => format!("<strong>{}</strong>", self.emit(child)),
            Node::Italic(child)        => format!("<em>{}</em>", self.emit(child)),
            Node::InlineCode(code)     => format!("<code>{}</code>", self.escape_text(code)),
            Node::CodeBlock(cb)        => self.emit_code_block(cb),
            Node::Link(l)              => self.emit_link(l),
            Node::Image(i)             => self.emit_image(i),
            Node::HorizontalRule       => "<hr />".to_string(),
            Node::List(l)              => self.emit_list(l),
            Node::Blockquote(children) => self.emit_blockquote(children),
            _                          => String::new(),
        }
    }

    fn emit_heading(&self, h: &Heading) -> String {
        let tag = format!("h{}", h.level);
        let children: String = h.children.iter().map(|c| self.emit(c)).collect();
        format!("<{} id=\"{}\">{}</{}>", tag, h.id, children, tag)
    }

    fn emit_jsx_element(&self, el: &JsxElement) -> String {
        let attrs = self.emit_jsx_attrs(&el.attrs);
        let children: String = el.children.iter().map(|c| self.emit(c)).collect();
        format!("<{} {}>{}</{}>", el.name, attrs, children, el.name)
    }
}
```

---

## Error Handling

Good error messages are non-negotiable. Use `miette` for rich error output:

```toml
miette = { version = "5", features = ["fancy"] }
thiserror = "1"
```

```rust
#[derive(Debug, thiserror::Error, miette::Diagnostic)]
pub enum ParseError {
    #[error("Unclosed JSX element <{0}>")]
    #[diagnostic(help("Add a closing </{0}> tag"))]
    UnclosedJsxElement(String),

    #[error("Unexpected token {0:?} at line {1}")]
    UnexpectedToken(Token, usize),

    #[error("Invalid JSX attribute syntax at line {0}")]
    InvalidJsxAttr(usize),

    #[error("Unclosed expression brace at line {0}")]
    UnclosedExpression(usize),
}
```

---

## Testing Strategy

Write tests at every stage. Do not skip this.

### Lexer Tests

```rust
#[test]
fn test_lex_heading() {
    let tokens = Lexer::new("# Hello World").tokenize();
    assert_eq!(tokens[0], Token::Heading { level: 1, text: "Hello World".into() });
}

#[test]
fn test_lex_jsx_self_closing() {
    let tokens = Lexer::new("<Button color=\"red\" />").tokenize();
    assert!(matches!(tokens[0], Token::JsxOpenTag { self_closing: true, .. }));
}

#[test]
fn test_lex_jsx_with_expression_prop() {
    let tokens = Lexer::new("<Button onClick={handleClick} />").tokenize();
    // check attr value is Expression not String
}
```

### Parser Tests

```rust
#[test]
fn test_parse_jsx_with_markdown_children() {
    let src = "<Card>\n## Title\n\nSome text\n</Card>";
    let ast = Parser::new(Lexer::new(src).tokenize()).parse().unwrap();
    // assert JSX element contains Heading and Paragraph children
}

#[test]
fn test_parse_nested_jsx() {
    let src = "<Outer>\n<Inner />\n</Outer>";
    let ast = Parser::new(Lexer::new(src).tokenize()).parse().unwrap();
    // assert Outer contains Inner
}
```

### Integration Tests

```rust
#[test]
fn test_full_mdx_document() {
    let src = include_str!("fixtures/full.mdx");
    let result = parse(src).unwrap();
    let output = codegen(&result);
    let expected = include_str!("fixtures/full.expected.js");
    assert_eq!(output.trim(), expected.trim());
}
```

Keep a `tests/fixtures/` directory with real-world MDX files as test cases.

---

## Project Structure

```
mdx-parser/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── lexer/
│   │   ├── mod.rs
│   │   ├── token.rs        # Token enum
│   │   ├── lexer.rs        # Lexer struct + tokenize()
│   │   ├── markdown.rs     # Markdown-specific lexing
│   │   ├── jsx.rs          # JSX-specific lexing
│   │   └── frontmatter.rs  # Frontmatter lexing
│   ├── parser/
│   │   ├── mod.rs
│   │   ├── ast.rs          # All AST node types
│   │   ├── parser.rs       # Parser struct
│   │   ├── block.rs        # Block-level parsing
│   │   ├── inline.rs       # Inline parsing
│   │   └── jsx.rs          # JSX parsing
│   ├── codegen/
│   │   ├── mod.rs
│   │   └── js.rs           # JS/HTML output
│   └── error.rs            # ParseError types
└── tests/
    ├── lexer_tests.rs
    ├── parser_tests.rs
    ├── codegen_tests.rs
    └── fixtures/
        ├── basic.mdx
        ├── jsx_nested.mdx
        ├── expressions.mdx
        └── full.mdx
```

---

## Dependencies

```toml
[dependencies]
# Frontmatter
serde = { version = "1", features = ["derive"] }
serde_json = "1"
serde_yaml = "0.9"

# Error handling
thiserror = "1"
miette = { version = "5", features = ["fancy"] }

# Slug generation for heading IDs
slug = "0.1"

[dev-dependencies]
pretty_assertions = "1"
```

No SWC dependency — you are writing the parser yourself.

---

## Build Order (strict)

Do NOT skip steps or jump ahead.

1. **Token enum** — define all token types, no logic yet
2. **Lexer — Markdown only** — get headings, paragraphs, bold, italic, code working, write tests
3. **Lexer — Frontmatter** — detect and extract `---` blocks, write tests
4. **Lexer — JSX tags** — detect `<Component`, parse tag name and attrs, write tests
5. **Lexer — JSX expressions** — detect `{...}`, handle nesting with a counter, write tests
6. **Lexer — Import/Export** — detect top-level import/export statements, write tests
7. **AST node types** — define all structs, no logic yet
8. **Parser — Markdown blocks** — headings, paragraphs, lists, code blocks, write tests
9. **Parser — Inline** — bold, italic, links, inline code inside paragraphs, write tests
10. **Parser — JSX elements** — open tag, children (re-entrant Markdown), close tag, write tests
11. **Parser — Expressions** — `{expr}` nodes, write tests
12. **Parser — Imports/Exports** — top-level statements, write tests
13. **Codegen — basic HTML** — headings, paragraphs, bold, italic
14. **Codegen — JSX passthrough** — emit JSX elements as-is
15. **Codegen — expressions** — emit `{expr}` as-is
16. **Error messages** — add miette diagnostics to all error cases
17. **Integration tests** — test full MDX documents end to end

---

## Timeline

| Step | What | Time |
|---|---|---|
| 1-6 | Full lexer with all token types | 2 weeks |
| 7-12 | Full parser with AST | 2-3 weeks |
| 13-16 | Codegen + errors | 1 week |
| 17 | Integration tests + edge cases | 1 week |
| Total | | 6-7 weeks |

This is realistic for a medium Rust dev working on it as a side project.

---

## Hardest Parts (expect to spend extra time here)

1. **JSX boundary detection** - knowing when `<` is JSX vs a comparison operator or HTML entity
2. **Re-entrant parsing** - Markdown inside JSX children calls the same block parser recursively
3. **Expression nesting** - `{a ? <B /> : <C />}` has JSX inside an expression
4. **Multiline JSX props** - attributes that span multiple lines
5. **Error recovery** - giving useful errors without crashing on malformed input

For expression nesting specifically (JSX inside expressions inside JSX), you will need a depth counter and careful state tracking. Plan extra time here.
