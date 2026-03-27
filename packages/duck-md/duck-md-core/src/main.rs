use std::fs;

use duck_md_lexer::Lexer;

fn main() {
  let path = String::from("./tmp/index.mdx");

  let source = match fs::read_to_string(&path) {
    Ok(content) => content,
    Err(err) => {
      eprintln!("error: could not read file: {} ({})", path, err);
      std::process::exit(66);
    },
  };

  let mut lexer = Lexer::new(source);
  lexer.scan_tokens();

  println!("=== tokens ===");
  println!("{:#?}", lexer.tokens);

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
