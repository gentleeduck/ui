use duck_diagnostic::{DiagnosticCode, Severity};

#[derive(Debug, Clone)]
pub enum Code {
  // Errors
  InvalidCharacter,
  InvalidFrontMatter,
  UnterminatedString,
  UnterminatedExpression,
  UnexpectedEof,
  InvalidJsxSelfClosingTag,
  UnterminatedJsxTag,
  InvalidJsxClosingTag,
  InvalidJsxAttribute,
  UnterminatedCodeBlock,
  // Warnings
  EmptyFrontMatter,
}

impl DiagnosticCode for Code {
  fn code(&self) -> &str {
    match self {
      Self::InvalidCharacter => "E001",
      Self::InvalidFrontMatter => "E002",
      Self::UnterminatedString => "E003",
      Self::UnterminatedExpression => "E004",
      Self::UnexpectedEof => "E005",
      Self::InvalidJsxSelfClosingTag => "E006",
      Self::UnterminatedJsxTag => "E007",
      Self::InvalidJsxClosingTag => "E008",
      Self::InvalidJsxAttribute => "E009",
      Self::UnterminatedCodeBlock => "E010",

      Self::EmptyFrontMatter => "W001",
    }
  }

  fn severity(&self) -> Severity {
    match self {
      Self::InvalidCharacter
      | Self::InvalidFrontMatter
      | Self::UnterminatedString
      | Self::UnterminatedExpression
      | Self::InvalidJsxSelfClosingTag
      | Self::UnterminatedJsxTag
      | Self::InvalidJsxClosingTag
      | Self::InvalidJsxAttribute
      | Self::UnterminatedCodeBlock
      | Self::UnexpectedEof => Severity::Error,

      Self::EmptyFrontMatter => Severity::Warning,
    }
  }
}
