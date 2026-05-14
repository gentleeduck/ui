/** Assert `T` is `true`; otherwise surface `Msg` as a compile error. */
export type AssertTrue<T extends true, Msg extends string> = T extends true ? true : neverError<Msg>

type neverError<Msg extends string> = Msg & never

/** Assert `T` is `false`; otherwise surface `Msg` as a compile error. */
export type AssertFalse<T extends false, Msg extends string> = T extends false ? true : neverError<Msg>
