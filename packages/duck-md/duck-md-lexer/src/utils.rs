use crate::{Lexer, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_tokens(&mut self, c: char) {
    match c {
      '\n' => self.lex_newline(),
      '\r' | '\t' | ' ' => self.lex_whitespace(),

      '(' => self.emit(TokenKind::ParenOpen),
      ')' => self.emit(TokenKind::ParenClose),
      '[' => self.lex_link(),
      '!' if self.peek() == Some('[') => self.lex_image(),
      '`' => self.lex_code(),
      '-' if self.peek() == Some(' ') => self.lex_unordered_list_item(),
      '0'..='9' if self.peek() == Some('.') => self.lex_ordered_list_item(),
      '-' if self.peek() == Some('-') && self.peek_next() == Some('-') => self.lex_frontmatter(),
      '#' => self.lex_heading(),
      '*' => self.lex_bold(),
      '_' => self.lex_italic(),
      '<' if self.peek() == Some('!') => self.lex_comment(),
      '<' => self.lex_jsx_tag(),
      '>' => self.emit(TokenKind::BlockQuote),
      '=' => self.emit(TokenKind::Eq),
      _ => self.lex_text(),
    };
  }

  pub(crate) fn is_eof(&self) -> bool {
    self.current >= self.source.len()
  }

  pub(crate) fn advance(&mut self) -> char {
    if self.is_eof() {
      return '\0';
    }

    let remaining = &self.source[self.current..];
    let mut iter = remaining.char_indices();
    let (_, ch) = iter.next().unwrap();

    if let Some((next_byte_idx, _)) = iter.next() {
      self.current += next_byte_idx;
    } else {
      self.current = self.source.len();
    }

    self.column += 1;
    ch
  }

  pub(crate) fn peek(&self) -> Option<char> {
    if self.is_eof() {
      return None;
    }
    self.source[self.current..].chars().next()
  }

  pub(crate) fn peek_next(&self) -> Option<char> {
    if self.is_eof() {
      return None;
    }
    let mut iter = self.source[self.current..].chars();
    iter.next();
    iter.next()
  }

  pub(crate) fn get_current_lexeme(&self) -> &str {
    self.source.get(self.start..self.current).unwrap_or("")
  }

  pub(crate) fn match_next_char_consume(&mut self, expected: char) -> bool {
    if let Some(c) = self.peek() {
      if c == expected {
        self.advance();
        return true;
      }
    }
    false
  }

  pub(crate) fn match_current_char(&mut self, expected: char) -> bool {
    if let Some(c) = self.source[self.current..].chars().next() {
      if c == expected {
        return true;
      }
    }
    false
  }

  pub(crate) fn consume_while(&mut self, mut predicate: impl FnMut(char, Option<char>) -> bool) {
    while let Some(c) = self.peek() {
      let next = self.peek_next();
      if predicate(c, next) {
        self.advance();
      } else {
        break;
      }
    }
  }

  pub(crate) fn consume_till(&mut self, c: char) {
    while let Some(cc) = self.peek() {
      if c != cc {
        self.advance();
      } else {
        break;
      }
    }
  }

  pub(crate) fn get_current_char(&mut self) -> Option<char> {
    self.source[self.current..].chars().next()
  }

  pub(crate) fn consume_whitespaces(&mut self) {
    let mut n = 0;
    while let Some(c) = self.get_current_char() {
      if c == ' ' || c == '\t' {
        self.advance();
        n += 1;
      } else {
        break;
      }
    }
    if n > 0 {
      self.emit(TokenKind::Whitespace);
    }
  }
}
