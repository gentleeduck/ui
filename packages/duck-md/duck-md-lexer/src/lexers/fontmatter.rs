use duck_diagnostic::{Diagnostic, Label, Span};

use crate::{Lexer, diagnostic::Code, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_frontmatter(&mut self) -> Result<TokenKind, ()> {
    // first '-' already consumed by caller, consume remaining two

    self.lex_frontmatter_bound()?;

    // if we're at the end of the file, emit a ThematicBreak
    if self.frontmatter_reserved {
      return Ok(TokenKind::ThematicBreak);
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
        return Err(());
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

          return Ok(TokenKind::FrontmatterEnd);
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

  fn lex_frontmatter_bound(&mut self) -> Result<(), ()> {
    self.consume_while(|c, _| c == '-');
    if self.get_current_lexeme().len() != 3 {
      self.emit_diagnostic(
        Diagnostic::new(Code::InvalidFrontMatter, "invalid frontmatter")
          .with_label(Label::primary(
            Span::new("", self.line, self.column - 1, self.current - 1),
            Some("frontmatter must be three dashes".to_string()),
          ))
          .with_help("add three dashes to the frontmatter"),
      );
      return Err(());
    }
    Ok(())
  }
}
