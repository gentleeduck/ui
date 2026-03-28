use crate::{Lexer, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_heading(&mut self) {
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

    self.emit(TokenKind::Heading(level))
  }

  pub(crate) fn lex_text(&mut self) {
    while let Some(c) = self.peek() {
      if c == '\n'
        || c == '/'
        || c == '*'
          && !self.is_eof()
          && self.source[self.current - 1..].chars().next() != Some('\\')
        || (c == '_'
          && !self.is_eof()
          && self.source[self.current - 1..].chars().next() != Some('\\'))
      {
        break;
      }
      self.advance();
    }

    self.emit(TokenKind::Text)
  }

  pub(crate) fn lex_bold(&mut self) {
    // the first '*' is already consumed by caller

    self.consume_while(|c, _| c == '*');
    let at_line_end = self.get_current_char() == Some('\n') || self.is_eof();

    match self.get_current_lexeme() {
      "*" => self.emit(TokenKind::Italic(1)),
      "**" => self.emit(TokenKind::Bold(2)),
      "***" if at_line_end => self.emit(TokenKind::ThematicBreak),
      "***" => self.emit(TokenKind::Bold(3)),
      _ => self.emit(TokenKind::Text),
    }
  }

  pub(crate) fn lex_italic(&mut self) {
    // the first '_' is already consumed by caller

    self.consume_while(|c, _| c == '_');
    let c = self.get_current_char();

    match self.get_current_lexeme() {
      "_" => self.emit(TokenKind::Italic(1)),
      "__" => self.emit(TokenKind::Bold(2)),
      "___" if c == Some('\n') => self.emit(TokenKind::ThematicBreak),
      _ => self.emit(TokenKind::Text),
    }

    // // case 1: _italic_
    // if !self.match_next_char_consume('_') {
    //   return Ok(TokenKind::Italic(1));
    // }
    //
    // // case 2: __bold__
    // return Ok(TokenKind::Bold(2));
  }
}
