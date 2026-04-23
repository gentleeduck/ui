use duck_diagnostic::{Diagnostic, Label, Span};

use crate::{Lexer, diagnostic::Code, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_jsx_tag(&mut self) {
    let mut is_close_tag = false;

    if self.peek() == Some('/') {
      self.advance();
      is_close_tag = true;
      self.emit(TokenKind::JsxCloseTagStart); //  </
    } else {
      self.emit(TokenKind::JsxOpenTagStart); // <
    }

    self.consume_whitespaces();

    // lex tag name e.g. Button, MyCard
    self.consume_while(|c, _| c.is_alphanumeric() || c == '.');
    self.emit(TokenKind::JsxTagName);

    self.consume_whitespaces();

    let c = self.source[self.current..].chars().next();
    if c == Some('/') {
      self.advance(); // consume the /
      self.advance(); // consume the >
      return self.emit(TokenKind::JsxSelfClosingEnd);
    }

    while let Some(cc) = self.get_current_char()
      && cc.is_alphabetic()
    {
      self.lex_jsx_attribute();
      if self.get_current_char() == Some(' ') {
        self.consume_whitespaces();
      }
    }

    self.advance();
    if is_close_tag {
      return self.emit(TokenKind::JsxCloseTagEnd);
    }
    return self.emit(TokenKind::JsxOpenTagEnd);
  }

  pub(crate) fn lex_jsx_attribute(&mut self) {
    self.consume_while(|c, _| c != '=' && c.is_alphabetic());
    self.emit(TokenKind::JsxAttributeName);

    if let Some(c) = self.get_current_char() {
      if c != '=' {
        self.emit_diagnostic(Diagnostic::new(Code::InvalidJsxAttribute, "invlaid jsx attribute"));
      }

      self.advance(); // consume the =
      self.emit(TokenKind::Eq);

      let kind: char;
      if let Some(c) = self.get_current_char()
        && (c == '"' || c == '\'')
      {
        kind = c;
        self.advance(); // consue the ' | "
        self.emit(TokenKind::Quote);

        self.consume_till('\"');
        self.emit(TokenKind::String);

        if let Some(c) = self.get_current_char()
          && (c == '\'' || c == '"')
          && c == kind
        {
          self.advance();
          self.emit(TokenKind::Quote);
        }
      }
    }
  }

  pub(crate) fn lex_expression(&mut self) {
    // opening '{' already consumed by caller
    self.emit(TokenKind::ExpressionStart);

    // track nesting depth for expressions like { a ? { b } : c }
    let mut depth = 1usize;

    while !self.is_eof() {
      match self.peek() {
        Some('{') => {
          self.advance();
          depth += 1;
        },
        Some('}') => {
          depth -= 1;
          if depth == 0 {
            // emit the raw expression content before consuming '}'
            self.emit(TokenKind::Text);
            self.advance(); // consume closing '}'
            return self.emit(TokenKind::ExpressionEnd);
          }
          self.advance();
        },
        Some('\n') => {
          // expressions cannot span multiple lines unless inside nested braces
          if depth == 1 {
            self.emit_diagnostic(
              Diagnostic::new(Code::UnterminatedExpression, "unterminated expression")
                .with_label(Label::primary(
                  Span::new("", self.line, self.column, 1),
                  Some("expression not closed before end of line".to_string()),
                ))
                .with_help("close the expression with `}`"),
            );
          }
          self.advance();
        },
        Some(_) => {
          self.advance();
        },
        None => break,
      }
    }

    self.emit_diagnostic(
      Diagnostic::new(Code::UnterminatedExpression, "unterminated expression")
        .with_label(Label::primary(
          Span::new("", self.line, self.column, 1),
          Some("reached end of file before closing `}`".to_string()),
        ))
        .with_help("close the expression with `}`"),
    );
  }
}
