use duck_diagnostic::{Diagnostic, Label, Span};

use crate::{Lexer, diagnostic::Code, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_frontmatter(&mut self) {
    // first '-' already consumed by caller, consume remaining two

    self.consume_while(|c, _| c == '-');

    // if we're at the end of the file, emit a ThematicBreak or it's length is not 3 or it's already reserved
    if self.get_current_lexeme().len() != 3 || (self.frontmatter_reserved || self.current > 3) {
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
        self.emit_diagnostic(
          Diagnostic::new(Code::InvalidFrontMatter, "unterminated frontmatter")
            .with_label(Label::primary(
              Span::new("", self.line, self.column, self.current - self.start),
              Some("frontmatter opened here but never closed".to_string()),
            ))
            .with_help("add a closing --- on its own line"),
        );
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
