use duck_diagnostic::{Diagnostic, Label, Span};

use crate::{Lexer, diagnostic::Code, token::TokenKind};

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
        || c == '`'
        || c == '<'
        || (c == '/' && self.peek_next() == Some('>'))
        || c == ')'
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
  }

  pub(crate) fn lex_link(&mut self) {
    self.emit(TokenKind::Bracket);
    self.consume_while(|c, _| c != ']');
    self.emit(TokenKind::Text);

    if let Some(c) = self.get_current_char()
      && c != ']'
    {
      self.emit_diagnostic(
        Diagnostic::new(Code::UnterminatedExpression, "unterminated link")
          .with_label(Label::primary(
            Span::new("", self.line, self.column, 1),
            Some("link not closed before end of line".to_string()),
          ))
          .with_help("close the link with `]`"),
      );
    }

    self.advance();
    self.emit(TokenKind::Bracket);
  }

  pub(crate) fn lex_image(&mut self) {
    self.emit(TokenKind::Bang);

    if let Some(c) = self.get_current_char()
      && c == '['
    {
      self.advance();
      self.lex_link();
    }
  }

  pub(crate) fn lex_comment(&mut self) {
    // caller consumed '<', dispatch confirmed peek() == '!'
    // check for <!-- without advancing, so we can fall back cleanly
    if !(self.peek() == Some('!')
      && self.peek_next() == Some('-'))
    {
      return self.lex_text();
    }

    // peek further: need the second '-'
    let saved = self.current;
    self.advance(); // !
    self.advance(); // first -
    if self.peek() != Some('-') {
      self.current = saved;
      return self.lex_text();
    }
    self.advance(); // second -
    self.emit(TokenKind::HTMLCommentStart);

    // consume comment content until -->
    loop {
      if self.is_eof() {
        self.emit(TokenKind::Text);
        return;
      }

      if self.peek() == Some('-') && self.peek_next() == Some('-') {
        let content_end = self.current;
        self.advance(); // first -
        self.advance(); // second -
        if self.peek() == Some('>') {
          self.advance(); // >

          // emit content before the -->
          let saved_current = self.current;
          self.current = content_end;
          self.emit(TokenKind::Text);

          // emit -->
          self.start = content_end;
          self.current = saved_current;
          self.emit(TokenKind::HTMLCommentEnd);
          return;
        }
        // not -->, keep going
        continue;
      }

      let c = self.advance();
      if c == '\n' {
        self.line += 1;
        self.column = 0;
      }
    }
  }
}
