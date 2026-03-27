use core::fmt;

use duck_diagnostic::Span;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Token {
  pub kind: TokenKind,
  pub span: Span,
}

impl Token {
  pub fn new(kind: TokenKind, span: Span) -> Self {
    Self { kind, span }
  }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum TokenKind {
  FrontmatterStart,
  FrontmatterEnd,

  FrontmatterContent(String),
  Import,
  Export,
  Heading(u8),
  Text,

  ExpressionStart,
  ExpressionEnd,

  BoldStart,
  BoldEnd,

  ItalicStart,
  ItalicEnd,

  JsxStartTag,
  JsxEndTag,
  JsxSelfClosingTag,
  JsxAttribute,
  JsxAttributeValue,

  Newline,
  Whitespace,
  Eof,
}

impl TokenKind {
  pub fn is_trivia(&self) -> bool {
    matches!(self, TokenKind::Whitespace)
  }
}

impl fmt::Display for TokenKind {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let s = match self {
      TokenKind::FrontmatterStart => "FrontMatterStart",
      TokenKind::FrontmatterEnd => "FrontMatterEnd",

      TokenKind::FrontmatterContent(_) => "FrontMatterContent",
      TokenKind::Import => "Import",
      TokenKind::Export => "Export",
      TokenKind::Heading(_) => "Heading",
      TokenKind::Text => "Text",

      TokenKind::ExpressionStart => "ExpressionStart",
      TokenKind::ExpressionEnd => "ExpressionEnd",

      TokenKind::BoldStart => "BoldStart",
      TokenKind::BoldEnd => "BoldEnd",

      TokenKind::ItalicStart => "ItalicStart",
      TokenKind::ItalicEnd => "ItalicEnd",

      TokenKind::JsxStartTag => "JsxStartTag",
      TokenKind::JsxEndTag => "JsxEndTag",
      TokenKind::JsxSelfClosingTag => "JsxSelfClosingTag",
      TokenKind::JsxAttribute => "JsxAttribute",
      TokenKind::JsxAttributeValue => "JsxAttributeValue",

      TokenKind::Newline => "Newline",

      TokenKind::Whitespace => "Whitespace",
      TokenKind::Eof => "Eof",
    };
    write!(f, "{}", s)
  }
}
