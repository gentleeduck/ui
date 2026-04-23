use crate::{Lexer, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_whitespace(&mut self) {
    while let Some(c) = self.peek() {
      if c == ' ' || c == '\t' || c == '\r' {
        self.advance();
      } else {
        break;
      }
    }
    self.emit(TokenKind::Whitespace)
  }

  pub(crate) fn lex_newline(&mut self) {
    self.line += 1;
    self.column = 0;
    self.emit(TokenKind::Newline)
  }
}
