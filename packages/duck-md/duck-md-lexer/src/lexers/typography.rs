use crate::{Lexer, token::TokenKind};

impl<'engine> Lexer<'engine> {
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

    if !self.match_current_char(' ') {
      return self.lex_text();
    }

    Ok(TokenKind::Heading(level))
  }

  pub(crate) fn lex_text(&mut self) -> Result<TokenKind, ()> {
    while let Some(c) = self.peek() {
      if c == '\n' || c == '/' || c == '*' || c == '_' {
        break;
      }
      self.advance();
    }

    Ok(TokenKind::Text)
  }

  pub(crate) fn lex_bold(&mut self) -> Result<TokenKind, ()> {
    // the first '*' is already consumed by caller

    // case 1: *italic*
    if !self.match_next_char_consume('*') {
      return Ok(TokenKind::Italic(1));
    }

    // case 2: **bold**
    if self.match_next_char_consume('*') {
      self.advance(); // consume the third *
      return Ok(TokenKind::Bold(3));
    }

    // case 3: ***bold***
    Ok(TokenKind::Bold(2))
  }

  pub(crate) fn lex_italic(&mut self) -> Result<TokenKind, ()> {
    // the first '_' is already consumed by caller

    // case 1: _italic_
    if !self.match_next_char_consume('_') {
      return Ok(TokenKind::Italic(1));
    }

    // case 2: __bold__
    return Ok(TokenKind::Bold(2));
  }
}
