use crate::{Lexer, token::TokenKind};

impl Lexer {
  pub(crate) fn lex_whitespace(&mut self) -> Result<TokenKind, ()> {
    while let Some(c) = self.peek() {
      if c == ' ' || c == '\t' || c == '\r' {
        self.advance();
      } else {
        break;
      }
    }
    Ok(TokenKind::Whitespace)
  }

  pub(crate) fn lex_newline(&mut self) -> Result<TokenKind, ()> {
    self.line += 1;
    self.column = 0;
    Ok(TokenKind::Newline)
  }
}
