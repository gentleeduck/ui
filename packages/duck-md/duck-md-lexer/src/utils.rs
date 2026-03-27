use duck_diagnostic::{Diagnostic, Label, Span};

use crate::{Lexer, diagnostic::Code, token::TokenKind};

impl Lexer {
  pub(crate) fn lex_tokens(&mut self, c: char) -> Result<TokenKind, ()> {
    match c {
      '-' if self.peek() == Some('-') && self.peek_next() == Some('-') => self.lex_frontmatter(),

      '\n' => self.lex_newline(),
      '\r' | '\t' | ' ' => self.lex_whitespace(),

      '*' => self.lex_bold(),
      '#' => self.lex_heading(),

      _ => self.lex_text(),
    }
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

  pub(crate) fn match_char(&mut self, expected: char) -> bool {
    if let Some(c) = self.peek() {
      if c == expected {
        self.advance();
        return true;
      }
    }
    false
  }
}
