use duck_diagnostic::{DiagnosticCode, Severity};

#[derive(Debug, Clone)]
pub enum Code {
  // Errors
  InvalidCharacter,
  InvalidFrontMatter,
  UnterminatedString,
  UnterminatedExpression,
  UnexpectedEof,

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
      Self::EmptyFrontMatter => "W001",
    }
  }

  fn severity(&self) -> Severity {
    match self {
      Self::InvalidCharacter
      | Self::InvalidFrontMatter
      | Self::UnterminatedString
      | Self::UnterminatedExpression
      | Self::UnexpectedEof => Severity::Error,

      Self::EmptyFrontMatter => Severity::Warning,
    }
  }
}
