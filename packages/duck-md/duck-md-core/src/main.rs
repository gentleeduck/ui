use std::{cell::RefCell, fs, rc::Rc};

use duck_diagnostic::{Diagnostic, DiagnosticEngine};
use duck_md_lexer::Lexer;

fn main() -> Result<(), std::io::Error> {
  let path = String::from("./tmp/index.mdx");
  let engine = Rc::new(RefCell::new(DiagnosticEngine::new()));

  let source = match fs::read_to_string(&path) {
    Ok(content) => content,
    Err(err) => {
      eprintln!("error: could not read file: {} ({})", path, err);
      std::process::exit(66);
    },
  };

  println!("=== Source ===");
  println!("{}", source);

  // NOTE: later one when we use incremental parsing, we can pass the source obj instead of the
  // string cloning
  let mut lexer = Lexer::new(source.clone(), engine.borrow_mut());
  lexer.scan_tokens();

  println!("=== tokens ===");
  for token in &lexer.tokens {
    println!("  {}", token);
  }

  drop(lexer);
  let engine = engine.borrow();
  if engine.has_errors() || engine.has_warnings() {
    engine.print_all(&source);
  }

  Ok(())
  // match lexer.scan_tokens() {
  //   Ok(_) => {
  //     println!("=== tokens ===");
  //     println!("{:#?}", lexer.tokens);
  //   },
  //   Err(_) => {
  //     lexer.engine.print_all(&lexer.source);
  //   },
  // }

  // pub(crate) fn parse_yaml<T: serde::de::DeserializeOwned + std::fmt::Debug>(
  //   &mut self,
  //   content: &str,
  // ) -> Result<T, ()> {
  //   serde_yaml::from_str::<T>(content).map_err(|err| {
  //     self.engine.emit(
  //       Diagnostic::<Code>::new(
  //         Code::InvalidFrontMatter,
  //         format!("invalid YAML in frontmatter: {}", err),
  //       )
  //       .with_label(Label::primary(
  //         Span::new("", self.line, self.column, 1),
  //         Some("frontmatter parsed here".to_string()),
  //       ))
  //       .with_help("ensure the frontmatter is valid YAML"),
  //     );
  //   })
  // }
}
