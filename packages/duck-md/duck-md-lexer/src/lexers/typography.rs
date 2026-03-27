use crate::{Lexer, token::TokenKind};

impl Lexer {
  pub(crate) fn lex_heading(&mut self) -> Result<TokenKind, ()> {
    let mut level = 1;
    while let Some(c) = self.peek() {
      if c == '#' {
        level += 1;
      } else {
        break;
      }
      self.advance();
    }

    if !self.match_char(' ') {
      return self.lex_text();
    }

    Ok(TokenKind::Heading(level))
  }

  pub(crate) fn lex_text(&mut self) -> Result<TokenKind, ()> {
    while let Some(c) = self.peek() {
      if c == '\n' {
        break;
      }
      self.advance();
    }
    Ok(TokenKind::Text)
  }

  pub(crate) fn lex_bold(&mut self) -> Result<TokenKind, ()> {
    if !self.match_char('*') {
      return self.lex_text();
    }

    Ok(TokenKind::BoldStart)
  }
}
