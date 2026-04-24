import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  Assign,
  CamelCaseKeys,
  CommonKeys,
  ConditionalExcept,
  ConditionalKeys,
  ConditionalPick,
  DeepCamelCaseKeys,
  DeepMutable,
  DeepNonNullable,
  DeepOmit,
  DeepPartial,
  DeepPick,
  DeepReadonly,
  DeepReplaceValue,
  DeepRequired,
  DiffKeys,
  DistributedOmit,
  DistributedPick,
  EmptyObject,
  Entries,
  Except,
  FromEntries,
  Get,
  HasSameKeys,
  Invert,
  IsEmptyRecord,
  KebabCaseKeys,
  KeysOfUnion,
  MergeAll,
  MergeDeep,
  MergeExclusive,
  Mutable,
  NonEmptyObject,
  OmitIndexSignature,
  OmitNever,
  Override,
  OverrideProperties,
  PartialBy,
  PascalCaseKeys,
  Paths,
  PickByType,
  PickOptional,
  PickRequired,
  Pluck,
  ReadonlyBy,
  RenameKey,
  ReplaceValue,
  RequireAllOrNone,
  RequireAtLeastOne,
  RequiredBy,
  RequireExactlyOne,
  Schema,
  SetKeyType,
  SetOptional,
  SharedKeys,
  Simplify,
  SnakeCaseKeys,
  UnknownRecord,
  ValueOf,
  Without,
} from '.'

// Simplify
type Test_Simplify = AssertTrue<Equal<Simplify<{ a: 1 } & { b: 2 }>, { a: 1; b: 2 }>, 'Simplify flattens intersection'>

// Override / Assign
type Test_Override = AssertTrue<
  Equal<Override<{ a: 1; b: 2 }, { b: 'new'; c: 3 }>, { a: 1; b: 'new'; c: 3 }>,
  'Override lets B win on overlap'
>
type Test_Assign = AssertTrue<Equal<Assign<{ a: 1 }, { b: 2 }>, { a: 1; b: 2 }>, 'Assign is an alias for Override'>

// DeepPartial
type Test_DeepPartial = AssertTrue<
  Equal<DeepPartial<{ a: { b: number; c: string } }>, { a?: { b?: number; c?: string } }>,
  'DeepPartial recurses into nested objects'
>

// DeepRequired
type Test_DeepRequired = AssertTrue<
  Equal<DeepRequired<{ a?: { b?: number } }>, { a: { b: number } }>,
  'DeepRequired recurses'
>

// DeepReadonly
type Test_DeepReadonly = AssertTrue<
  Equal<DeepReadonly<{ a: { b: number } }>, { readonly a: { readonly b: number } }>,
  'DeepReadonly recurses'
>

// DeepMutable
type Test_DeepMutable = AssertTrue<
  Equal<DeepMutable<{ readonly a: { readonly b: number } }>, { a: { b: number } }>,
  'DeepMutable strips readonly recursively'
>

// DeepNonNullable
type Test_DeepNonNullable = AssertTrue<
  Equal<DeepNonNullable<{ a: string | null; b: { c: number | undefined } }>, { a: string; b: { c: number } }>,
  'DeepNonNullable strips nulls recursively'
>

// Mutable
type Test_Mutable = AssertTrue<
  Equal<Mutable<{ readonly a: 1; readonly b: 2 }>, { a: 1; b: 2 }>,
  'Mutable strips top-level readonly'
>

// PartialBy / RequiredBy / ReadonlyBy
type Test_PartialBy = AssertTrue<
  Equal<PartialBy<{ a: 1; b: 2 }, 'b'>, { a: 1; b?: 2 }>,
  'PartialBy makes selected keys optional'
>
type Test_RequiredBy = AssertTrue<
  Equal<RequiredBy<{ a?: 1; b?: 2 }, 'a'>, { a: 1; b?: 2 }>,
  'RequiredBy makes selected keys required'
>
type Test_ReadonlyBy = AssertTrue<
  Equal<ReadonlyBy<{ a: 1; b: 2 }, 'a'>, { readonly a: 1; b: 2 }>,
  'ReadonlyBy marks selected keys readonly'
>

// ValueOf
type Test_ValueOf = AssertTrue<Equal<ValueOf<{ a: 1; b: 'x' }>, 1 | 'x'>, 'ValueOf returns union of values'>

// Entries / FromEntries
type Test_Entries = AssertTrue<
  Equal<Entries<{ a: 1; b: 2 }>, ['a', 1] | ['b', 2]>,
  'Entries produces union of key/value pairs'
>
type Test_FromEntries = AssertTrue<
  Equal<FromEntries<['a', 1] | ['b', 2]>, { a: 1; b: 2 }>,
  'FromEntries builds object from pairs'
>

// Invert
type Test_Invert = AssertTrue<Equal<Invert<{ a: 'x'; b: 'y' }>, { x: 'a'; y: 'b' }>, 'Invert swaps keys and values'>

// RenameKey
type Test_RenameKey = AssertTrue<
  Equal<RenameKey<{ a: 1; b: 2 }, 'a', 'c'>, { b: 2; c: 1 }>,
  'RenameKey renames one key'
>

// RequireAtLeastOne
type Test_RequireAtLeastOne_Valid_A = AssertTrue<
  Equal<Extract<RequireAtLeastOne<{ a?: 1; b?: 2 }, 'a' | 'b'>, { a: 1 }>, { a: 1; b?: 2 }>,
  'RequireAtLeastOne produces a-required variant'
>

// RequireExactlyOne narrows correctly
type ExactOnePair = RequireExactlyOne<{ a?: 1; b?: 2; c?: 3 }, 'a' | 'b'>
// biome-ignore lint/correctness/noUnusedVariables: exists to type-check the union
type Test_RequireExactlyOne_Has_A = Extract<ExactOnePair, { a: 1 }>

// RequireAllOrNone compiles cleanly
// biome-ignore lint/correctness/noUnusedVariables: exists to type-check
type Test_RequireAllOrNone = RequireAllOrNone<{ a?: 1; b?: 2; c?: 3 }, 'a' | 'b'>

// NonEmptyObject
type Test_NonEmpty_Pass = AssertTrue<Equal<NonEmptyObject<{ a: 1 }>, { a: 1 }>, 'NonEmptyObject passes when filled'>
// biome-ignore lint/suspicious/noExplicitAny: empty-record check
type Test_NonEmpty_Empty = AssertTrue<
  Equal<NonEmptyObject<Record<string, never>>, Record<string, never>>,
  'NonEmptyObject keeps record<string, never> since keyof is string'
>

// DeepPick / DeepOmit
type Test_DeepPick = AssertTrue<
  Equal<DeepPick<{ a: { b: { c: 1; d: 2 } } }, 'a.b.c'>, { a: { b: { c: 1 } } }>,
  'DeepPick descends into nested keys'
>
type Test_DeepOmit = AssertTrue<
  Equal<DeepOmit<{ a: { b: { c: 1; d: 2 } } }, 'a.b.c'>, { a: { b: { d: 2 } } }>,
  'DeepOmit descends into nested keys'
>

// Get
type Test_Get = AssertTrue<Equal<Get<{ a: { b: { c: number } } }, 'a.b.c'>, number>, 'Get returns value at path'>
type Test_Get_Missing = AssertTrue<
  Equal<Get<{ a: { b: number } }, 'a.x'>, undefined>,
  'Get returns undefined on missing key'
>

// Paths
type Test_Paths = AssertTrue<
  Equal<Paths<{ a: { b: number }; c: string }>, 'a' | 'c' | 'a.b'>,
  'Paths enumerates string + dotted paths'
>

// Except
type Test_Except = AssertTrue<Equal<Except<{ a: 1; b: 2; c: 3 }, 'b'>, { a: 1; c: 3 }>, 'Except removes keys'>

// MergeDeep
type Test_MergeDeep = AssertTrue<
  Equal<MergeDeep<{ a: { x: 1; y: 2 } }, { a: { y: 'overridden'; z: 3 } }>, { a: { x: 1; y: 'overridden'; z: 3 } }>,
  'MergeDeep recurses into nested objects'
>

// OverrideProperties
type Test_OverrideProperties = AssertTrue<
  Equal<OverrideProperties<{ a: 1; b: 2 }, { b: 'x' }>, { a: 1; b: 'x' }>,
  'OverrideProperties requires keys to already exist'
>

// KeysOfUnion
type Test_KeysOfUnion = AssertTrue<
  Equal<KeysOfUnion<{ a: 1 } | { b: 2 } | { a: 3; c: 4 }>, 'a' | 'b' | 'c'>,
  'KeysOfUnion collects keys across union members'
>

// OmitIndexSignature / PickIndexSignature
interface WithIndex {
  known: string
  [key: string]: unknown
}
type Test_OmitIndex = AssertTrue<
  Equal<keyof OmitIndexSignature<WithIndex>, 'known'>,
  'OmitIndexSignature drops the index and keeps known keys'
>

// Schema
type Test_Schema = AssertTrue<
  Equal<Schema<{ a: number; b: { c: string; d: boolean[] } }, 'X'>, { a: 'X'; b: { c: 'X'; d: ReadonlyArray<'X'> } }>,
  'Schema replaces every leaf with V'
>

// SetOptional / SetRequired / SetReadonly / SetMutable aliases
type Test_SetOptional = AssertTrue<
  Equal<SetOptional<{ a: 1; b: 2 }, 'b'>, { a: 1; b?: 2 }>,
  'SetOptional is alias for PartialBy'
>

// OmitNever / Without / ReplaceValue
type Test_OmitNever = AssertTrue<
  Equal<OmitNever<{ a: 1; b: never; c: 3 }>, { a: 1; c: 3 }>,
  'OmitNever drops never-valued keys'
>
type Test_Without = AssertTrue<
  Equal<Without<{ a: string; b: number; c: string }, string>, { b: number }>,
  'Without drops by value-type'
>
type Test_ReplaceValue = AssertTrue<
  Equal<ReplaceValue<{ a: string; b: number; c: string }, string, boolean>, { a: boolean; b: number; c: boolean }>,
  'ReplaceValue swaps matching values'
>

// PickRequired / PickOptional
type Test_PickRequired = AssertTrue<
  Equal<PickRequired<{ a: 1; b?: 2; c: 3 }>, { a: 1; c: 3 }>,
  'PickRequired keeps only required keys'
>
type Test_PickOptional = AssertTrue<
  Equal<PickOptional<{ a: 1; b?: 2; c: 3 }>, { b?: 2 }>,
  'PickOptional keeps only optional keys'
>

// ConditionalPick / ConditionalExcept
type Test_ConditionalPick = AssertTrue<
  Equal<ConditionalPick<{ a: number; b: string; c: number }, number>, { a: number; c: number }>,
  'ConditionalPick keeps keys whose value extends U'
>
type Test_ConditionalExcept = AssertTrue<
  Equal<ConditionalExcept<{ a: number; b: string; c: number }, number>, { b: string }>,
  'ConditionalExcept drops keys whose value extends U'
>

// MergeExclusive
type Test_MergeExclusive_A = AssertTrue<
  Equal<Extract<MergeExclusive<{ a: 1 }, { b: 2 }>, { a: 1 }>, { a: 1 } & { b?: never }>,
  'MergeExclusive produces mutually-exclusive variants'
>

// Key-case transforms (shallow)
type Test_CamelCaseKeys = AssertTrue<
  Equal<CamelCaseKeys<{ hello_world: 1; foo_bar: 2 }>, { helloWorld: 1; fooBar: 2 }>,
  'CamelCaseKeys transforms keys'
>
type Test_SnakeCaseKeys = AssertTrue<
  Equal<SnakeCaseKeys<{ helloWorld: 1 }>, { hello_world: 1 }>,
  'SnakeCaseKeys transforms keys'
>
type Test_KebabCaseKeys = AssertTrue<
  Equal<KebabCaseKeys<{ helloWorld: 1 }>, { 'hello-world': 1 }>,
  'KebabCaseKeys transforms keys'
>
type Test_PascalCaseKeys = AssertTrue<
  Equal<PascalCaseKeys<{ hello_world: 1 }>, { HelloWorld: 1 }>,
  'PascalCaseKeys transforms keys'
>

// DeepCamelCaseKeys
type Test_DeepCamelCaseKeys = AssertTrue<
  Equal<
    DeepCamelCaseKeys<{ hello_world: { nested_key: number; arr: { deep_prop: string }[] } }>,
    { helloWorld: { nestedKey: number; arr: { deepProp: string }[] } }
  >,
  'DeepCamelCaseKeys recurses through nested objects and arrays'
>

// MergeAll
type Test_MergeAll = AssertTrue<
  Equal<MergeAll<[{ a: 1 }, { b: 2 }, { a: 'x' }]>, { a: 'x'; b: 2 }>,
  'MergeAll merges left-to-right with later wins'
>

// Pluck
type Test_Pluck = AssertTrue<Equal<Pluck<{ a: number; b: string }, 'a'>, number>, 'Pluck gets value'>

// SetKeyType
type Test_SetKeyType = AssertTrue<
  Equal<SetKeyType<{ a: number; b: string }, 'a', boolean>, { a: boolean; b: string }>,
  'SetKeyType replaces type of one key'
>

// SharedKeys / DiffKeys
type Test_SharedKeys = AssertTrue<Equal<SharedKeys<{ a: 1; b: 2 }, { b: 3; c: 4 }>, 'b'>, 'SharedKeys picks overlap'>
type Test_DiffKeys = AssertTrue<Equal<DiffKeys<{ a: 1; b: 2 }, { b: 3; c: 4 }>, 'a'>, 'DiffKeys picks A-only keys'>

// PickByType / OmitByType aliases
type Test_PickByType = AssertTrue<
  Equal<PickByType<{ a: number; b: string; c: number }, number>, { a: number; c: number }>,
  'PickByType aliases ConditionalPick'
>

// DeepReplaceValue
type Test_DeepReplaceValue = AssertTrue<
  Equal<
    DeepReplaceValue<{ a: string; b: { c: string; d: number } }, string, boolean>,
    { a: boolean; b: { c: boolean; d: number } }
  >,
  'DeepReplaceValue recurses'
>

// HasSameKeys
type Test_HasSameKeys_Yes = AssertTrue<
  HasSameKeys<{ a: 1; b: 2 }, { a: 'x'; b: 'y' }>,
  'same keys regardless of value types'
>
type Test_HasSameKeys_No = AssertFalse<HasSameKeys<{ a: 1; b: 2 }, { a: 1; c: 3 }>, 'different keys'>

// CommonKeys — union of objects' common keys
type Test_CommonKeys = AssertTrue<
  Equal<CommonKeys<{ a: 1; x: 0 } | { a: 2; y: 0 } | { a: 3; z: 0 }>, 'a'>,
  'CommonKeys intersects keyof across union'
>

// ConditionalKeys (alias of KeysOfType)
type Test_ConditionalKeys = AssertTrue<
  Equal<ConditionalKeys<{ a: number; b: string; c: number }, number>, 'a' | 'c'>,
  'ConditionalKeys picks keys whose value extends condition'
>

// DistributedOmit / DistributedPick — preserves union branches
type _DU = { type: 'a'; a: 1; shared: true } | { type: 'b'; b: 2; shared: true }
type Test_DistributedOmit = AssertTrue<
  Equal<DistributedOmit<_DU, 'shared'>, { type: 'a'; a: 1 } | { type: 'b'; b: 2 }>,
  'DistributedOmit preserves per-branch shape'
>
type Test_DistributedPick = AssertTrue<
  Equal<DistributedPick<_DU, 'type'>, { type: 'a' } | { type: 'b' }>,
  'DistributedPick preserves per-branch discriminator'
>

// EmptyObject / UnknownRecord / IsEmptyRecord
type Test_EmptyObject = AssertTrue<Equal<EmptyObject, Record<PropertyKey, never>>, 'EmptyObject is nominally empty'>
type Test_EmptyObject_Rejects = AssertFalse<
  { a: 1 } extends EmptyObject ? true : false,
  'EmptyObject rejects non-empty records'
>
type Test_UnknownRecord = AssertTrue<Equal<UnknownRecord[string], unknown>, 'UnknownRecord[string] is unknown'>
// biome-ignore lint/complexity/noBannedTypes: testing the literal empty-object
type Test_IsEmptyRecord_True = AssertTrue<IsEmptyRecord<{}>, 'literal {} has no keys'>
type Test_IsEmptyRecord_False = AssertFalse<IsEmptyRecord<{ a: 1 }>, '{ a: 1 } has a key'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Simplify,
  Test_Override,
  Test_Assign,
  Test_DeepPartial,
  Test_DeepRequired,
  Test_DeepReadonly,
  Test_DeepMutable,
  Test_DeepNonNullable,
  Test_Mutable,
  Test_PartialBy,
  Test_RequiredBy,
  Test_ReadonlyBy,
  Test_ValueOf,
  Test_Entries,
  Test_FromEntries,
  Test_Invert,
  Test_RenameKey,
  Test_RequireAtLeastOne_Valid_A,
  Test_RequireExactlyOne_Has_A,
  Test_RequireAllOrNone,
  Test_NonEmpty_Pass,
  Test_NonEmpty_Empty,
  Test_DeepPick,
  Test_DeepOmit,
  Test_Get,
  Test_Get_Missing,
  Test_Paths,
  Test_Except,
  Test_MergeDeep,
  Test_OverrideProperties,
  Test_KeysOfUnion,
  Test_OmitIndex,
  Test_Schema,
  Test_SetOptional,
  Test_OmitNever,
  Test_Without,
  Test_ReplaceValue,
  Test_PickRequired,
  Test_PickOptional,
  Test_ConditionalPick,
  Test_ConditionalExcept,
  Test_MergeExclusive_A,
  Test_CamelCaseKeys,
  Test_SnakeCaseKeys,
  Test_KebabCaseKeys,
  Test_PascalCaseKeys,
  Test_DeepCamelCaseKeys,
  Test_MergeAll,
  Test_Pluck,
  Test_SetKeyType,
  Test_SharedKeys,
  Test_DiffKeys,
  Test_PickByType,
  Test_DeepReplaceValue,
  Test_HasSameKeys_Yes,
  Test_HasSameKeys_No,
  Test_CommonKeys,
  Test_ConditionalKeys,
  Test_DistributedOmit,
  Test_DistributedPick,
  Test_EmptyObject,
  Test_EmptyObject_Rejects,
  Test_UnknownRecord,
  Test_IsEmptyRecord_True,
  Test_IsEmptyRecord_False,
]
