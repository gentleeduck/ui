use crate::{Lexer, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_frontmatter(&mut self) {
    // first '-' already consumed by caller, consume remaining two

    self.consume_while(|c, _| c == '-');

    // thematic break if: not exactly 3 dashes, already reserved, not at file start,
    // or no closing --- exists in the remaining source
    if self.get_current_lexeme().len() != 3
      || self.frontmatter_reserved
      || self.current > 3
      || !self.source[self.current..].contains("\n---")
    {
      self.emit(TokenKind::ThematicBreak);
      return;
    }

    // emit the opening ---
    self.emit(TokenKind::FrontmatterStart);

    // skip newline after opening ---
    if self.peek() == Some('\n') {
      self.advance();
      self.line += 1;
      self.column = 0;
      self.start = self.current;
    }

    // consume content line by line until closing --- at column 0
    loop {
      if self.is_eof() {
        // no closing --- found, treat the opening --- as a thematic break
        self.emit(TokenKind::FrontmatterContent);
        break;
      }

      // at the start of a line, check for closing ---
      if self.column == 0 && self.peek() == Some('-') && self.peek_next() == Some('-') {
        let content_end = self.current;
        self.consume_while(|c, _| c == '-');

        if self.current - content_end == 3 {
          // emit content (everything before the closing ---)
          let saved_current = self.current;
          self.current = content_end;
          self.emit(TokenKind::FrontmatterContent);

          // set up for FrontmatterEnd
          self.start = content_end;
          self.current = saved_current;
          self.frontmatter_reserved = true;

          self.emit(TokenKind::FrontmatterEnd);
          break;
        }

        // not exactly 3 dashes, keep consuming
        continue;
      }

      // consume the rest of the line (everything up to \n)
      self.consume_while(|c, _| c != '\n');

      // consume the newline
      if self.peek() == Some('\n') {
        self.advance();
        self.line += 1;
        self.column = 0;
      }
    }
  }
}
