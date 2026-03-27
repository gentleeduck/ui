use duck_diagnostic::{Diagnostic, Label, Span};

use crate::{Lexer, diagnostic::Code, token::TokenKind};

impl Lexer {
  pub(crate) fn lex_frontmatter(&mut self) -> Result<TokenKind, ()> {
    // first '-' already consumed by caller, consume remaining two
    self.advance(); // second -
    self.advance(); // third -

    // emit the opening ---
    self.emit(TokenKind::FrontmatterStart);

    // skip newline after opening ---
    if self.peek() == Some('\n') {
      self.advance();
      self.line += 1;
      self.column = 0;
    }

    // mark start of content
    self.start = self.current;
    let mut content = String::new();

    // consume until closing --- at start of line
    loop {
      if self.is_eof() {
        self.emit_diagnostic(
          Diagnostic::new(Code::InvalidFrontMatter, "unterminated frontmatter".to_string())
            .with_label(Label::primary(
              Span::new("", 0, self.start, content.len()),
              Some("frontmatter opened here but never closed".into()),
            ))
            .with_help("add a closing --- on its own line".to_string()),
        );
        return Err(());
      }

      // check for closing ---
      if self.column == 0 && self.peek() == Some('-') && self.peek_next() == Some('-') {
        // peek two ahead to check third dash
        let saved = self.current;
        self.advance(); // -
        self.advance(); // -
        if self.peek() == Some('-') {
          self.advance(); // -

          // emit content (trim trailing newline)
          let trimmed = content.trim_end_matches('\n').to_string();
          if !trimmed.is_empty() {
            self.emit(TokenKind::FrontmatterContent(trimmed));
          }

          // skip newline after closing ---
          if self.peek() == Some('\n') {
            self.advance();
            self.line += 1;
            self.column = 0;
          }

          self.start = self.current;
          return Ok(TokenKind::FrontmatterEnd);
        }

        // not a closing ---, the dashes are content
        content.push_str("--");
        self.current = saved;
        self.advance();
        self.advance();
        continue;
      }

      let c = self.advance();
      content.push(c);
      if c == '\n' {
        self.line += 1;
        self.column = 0;
      }
    }
  }
}
