use std::cell::RefMut;

use duck_diagnostic::{Diagnostic, DiagnosticEngine, Span};

use crate::diagnostic::Code;
use crate::token::{Token, TokenKind};

pub mod diagnostic;
mod lexers;
pub mod token;
mod utils;

pub struct Lexer<'engine> {
  pub source: String,
  pub tokens: Vec<Token>,
  pub start: usize,
  pub current: usize,
  pub line: usize,
  pub column: usize,
  pub engine: RefMut<'engine, DiagnosticEngine<Code>>,
  pub frontmatter_reserved: bool,
}

impl<'engine> Lexer<'engine> {
  pub fn new(source: String, engine: RefMut<'engine, DiagnosticEngine<Code>>) -> Self {
    Self {
      source,
      tokens: Vec::new(),
      start: 0,
      current: 0,
      line: 0,
      column: 0,
      engine: engine,
      frontmatter_reserved: false,
    }
  }

  pub fn scan_tokens(&mut self) -> Result<(), std::io::Error> {
    while !self.is_eof() {
      self.start = self.current;
      let c = self.advance();

      self.lex_tokens(c);
    }

    self.emit(TokenKind::Eof);
    Ok(())
  }

  pub(crate) fn emit_diagnostic(&mut self, diagnostic: Diagnostic<Code>) {
    self.engine.emit(diagnostic);
  }

  fn emit(&mut self, kind: TokenKind) {
    if kind.is_trivia() {
      self.start = self.current;
      return;
    }

    let span = Span::new("index.mdx", self.line, self.column, self.current - self.start);

    self.tokens.push(Token::new(kind, span, self.get_current_lexeme().to_string()));
    self.start = self.current;
  }
}
