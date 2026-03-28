use crate::{Lexer, token::TokenKind};

impl<'engine> Lexer<'engine> {
  pub(crate) fn lex_ordered_list_item(&mut self) {
    self.consume_while(|c, _| c.is_digit(10));
    self.emit(TokenKind::OrderedListItem);
  }

  pub(crate) fn lex_unordered_list_item(&mut self) {
    self.consume_while(|c, _| c == '-');
    self.emit(TokenKind::UnorderedListItem);
  }
}
