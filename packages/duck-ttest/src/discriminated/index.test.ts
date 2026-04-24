import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { IsDiscriminated, Matchers, NarrowByTag, OmitTag, PayloadOf, TagsOf } from '.'

type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string }
  | { type: 'resize'; w: number; h: number }

// NarrowByTag
type Test_Narrow = AssertTrue<
  Equal<NarrowByTag<Event, 'type', 'click'>, { type: 'click'; x: number; y: number }>,
  'NarrowByTag extracts the matching variant'
>
type Test_Narrow_Miss = AssertTrue<Equal<NarrowByTag<Event, 'type', 'nope'>, never>, 'NarrowByTag miss is never'>

// TagsOf
type Test_TagsOf = AssertTrue<
  Equal<TagsOf<Event, 'type'>, 'click' | 'keypress' | 'resize'>,
  'TagsOf collects all tag values'
>

// OmitTag
type Test_OmitTag = AssertTrue<
  Equal<OmitTag<Event, 'type'>, { x: number; y: number } | { key: string } | { w: number; h: number }>,
  'OmitTag strips the tag from every variant'
>

// PayloadOf
type Test_Payload = AssertTrue<
  Equal<PayloadOf<Event, 'type', 'click'>, { x: number; y: number }>,
  'PayloadOf returns tag-stripped variant'
>

// IsDiscriminated
type Test_IsDiscriminated = AssertTrue<IsDiscriminated<Event, 'type'>, 'Event is discriminated by type'>
type Test_IsDiscriminated_No = AssertFalse<
  IsDiscriminated<{ a: 1 } | { a: 1 }, 'a'>,
  'union with single shared tag value is not meaningful discrim'
>

// Matchers
type Test_Matchers_Keys = AssertTrue<
  Equal<keyof Matchers<Event, 'type', string>, 'click' | 'keypress' | 'resize'>,
  'Matchers produces a handler per variant tag'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Narrow,
  Test_Narrow_Miss,
  Test_TagsOf,
  Test_OmitTag,
  Test_Payload,
  Test_IsDiscriminated,
  Test_IsDiscriminated_No,
  Test_Matchers_Keys,
]
