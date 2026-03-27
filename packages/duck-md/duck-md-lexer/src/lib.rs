use duck_diagnostic::{Diagnostic, DiagnosticEngine, Span};

use crate::diagnostic::Code;
use crate::token::{Token, TokenKind};

pub mod diagnostic;
mod lexers;
pub mod token;
mod utils;

pub struct Lexer {
  pub source: String,
  pub tokens: Vec<Token>,
  pub start: usize,
  pub current: usize,
  pub line: usize,
  pub column: usize,
  pub engine: DiagnosticEngine<Code>,
}

impl Lexer {
  pub fn new(source: String) -> Self {
    Self {
      source,
      tokens: Vec::new(),
      start: 0,
      current: 0,
      line: 0,
      column: 0,
      engine: DiagnosticEngine::new(),
    }
  }

  pub fn scan_tokens(&mut self) -> Result<(), std::io::Error> {
    while !self.is_eof() {
      self.start = self.current;
      let c = self.advance();

      let token = match self.lex_tokens(c) {
        Ok(token) => token,
        Err(_) => {
          return Err(std::io::Error::other("lexing error"));
        },
      };
      self.emit(token);
    }

    self.emit(TokenKind::Eof);
    Ok(())
  }

  pub(crate) fn emit_diagnostic(&mut self, diagnostic: Diagnostic<Code>) {
    self.engine.emit(diagnostic);
  }

  fn emit(&mut self, kind: TokenKind) {
    if kind.is_trivia() {
      return;
    }

    let span = Span::new("index.mdx", self.start, self.current, self.column);

    self.tokens.push(Token::new(kind, span));
    self.start = self.current;
  }
}
