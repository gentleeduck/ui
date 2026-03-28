use core::fmt;

use duck_diagnostic::Span;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Token {
  pub kind: TokenKind,
  pub span: Span,
  pub raw: String,
}

impl Token {
  pub fn new(kind: TokenKind, span: Span, raw: String) -> Self {
    Self { kind, span, raw }
  }
}

impl fmt::Display for Token {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let escaped = self.raw.replace('\n', "\\n").replace('\t', "\\t");
    write!(f, "{}({:?})", self.kind, escaped)
  }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum TokenKind {
  // Frontmatter
  FrontmatterStart,   // opening ---
  FrontmatterContent, // raw YAML content between --- delimiters
  FrontmatterEnd,     // closing ---
  ThematicBreak,      // ---

  // Top-level MDX statements
  Import, // import ... from '...'
  Export, // export const ...

  // Block-level Markdown
  Heading(u8), // # level 1-6

  // Inline Markdown
  Text,       // plain text content
  Bold(u8),   // ** or __ — carries the delimiter count
  Italic(u8), // * or _ — carries the delimiter count

  // JSX
  JsxOpenTagStart,   //
  JsxOpenTagEnd,     // >
  JsxCloseTagStart,  // </
  JsxCloseTagEnd,    // >
  JsxSelfClosingEnd, // />
  JsxTagName,        // component or element name e.g. Button
  JsxAttributeName,  // attribute name e.g. color
  JsxAttributeValue, // attribute value e.g. "red" or {expr}

  // Expressions
  ExpressionStart,   // {
  ExpressionEnd,     // }
  BlockQuote,        // >
  OrderedListItem,   // 1. or 1)
  UnorderedListItem, // * or -
  CodeStart(u8),
  CodeEnd(u8),
  Bracket,
  Bang,
  ParenOpen,
  ParenClose,
  // Punctuation
  Eq,     // = (used in JSX attribute assignment)
  String, // quoted string literal e.g. "red"

  HTMLCommentStart, // <!--
  HTMLCommentEnd,   //  -->

  MarkdownCommentStart, // {/*
  MarkdownCommentEnd,   //  */}

  // Trivia
  Newline,    // \n
  Whitespace, // spaces and tabs
  Quote,      // " | '

  // End of file
  Eof,
}

impl TokenKind {
  pub fn is_trivia(&self) -> bool {
    matches!(self, TokenKind::Whitespace | TokenKind::Newline | TokenKind::Quote)
  }
}

impl fmt::Display for TokenKind {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let s = match self {
      TokenKind::FrontmatterStart => "FrontmatterStart",
      TokenKind::FrontmatterContent => "FrontmatterContent",
      TokenKind::FrontmatterEnd => "FrontmatterEnd",
      TokenKind::ThematicBreak => "ThematicBreak",
      TokenKind::Import => "Import",
      TokenKind::Export => "Export",
      TokenKind::Heading(_) => "Heading",
      TokenKind::Text => "Text",
      TokenKind::Bold(_) => "Bold",
      TokenKind::Italic(_) => "Italic",
      TokenKind::JsxOpenTagStart => "JsxOpenTagStart",
      TokenKind::JsxCloseTagStart => "JsxCloseTagStart",
      TokenKind::JsxCloseTagEnd => "JsxCloseTagEnd",
      TokenKind::JsxOpenTagEnd => "JsxOpenTagEnd",
      TokenKind::JsxSelfClosingEnd => "JsxSelfClosingEnd",
      TokenKind::JsxTagName => "JsxTagName",
      TokenKind::JsxAttributeName => "JsxAttribute",
      TokenKind::JsxAttributeValue => "JsxAttributeValue",
      TokenKind::ExpressionStart => "ExpressionStart",
      TokenKind::ExpressionEnd => "ExpressionEnd",
      TokenKind::BlockQuote => "BlockQuote",
      TokenKind::OrderedListItem => "OrderedListItem",
      TokenKind::UnorderedListItem => "UnorderedListItem",
      TokenKind::CodeEnd(_) => "CodeBlock",
      TokenKind::CodeStart(_) => "InlineCode",
      TokenKind::Bracket => "Link",
      TokenKind::Bang => "Image",
      TokenKind::ParenOpen => "Paren",
      TokenKind::ParenClose => "ParenClose",
      TokenKind::HTMLCommentStart => "HTMLCommentStart",
      TokenKind::HTMLCommentEnd => "HTMLCommentEnd",
      TokenKind::MarkdownCommentStart => "MarkdownCommentStart",
      TokenKind::MarkdownCommentEnd => "MarkdownCommentEnd",
      TokenKind::Eq => "Eq",
      TokenKind::String => "String",
      TokenKind::Newline => "Newline",
      TokenKind::Whitespace => "Whitespace",
      TokenKind::Quote => "Qoute",
      TokenKind::Eof => "Eof",
    };
    write!(f, "{}", s)
  }
}
