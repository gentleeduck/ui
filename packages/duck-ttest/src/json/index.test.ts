import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { IsJsonValue, JSONArray, JSONObject, JSONPrimitive, Jsonifiable, Jsonify } from '.'

// JSONPrimitive
type Test_JSONPrimitive = AssertTrue<
  Equal<JSONPrimitive, string | number | boolean | null>,
  'JSONPrimitive is the 4 JSON scalars'
>

// JSONObject / JSONArray shape checks
type Test_JSONObject_Compatible = AssertTrue<
  Equal<JSONObject extends Record<string, unknown> ? true : false, true>,
  'JSONObject is a string-keyed record'
>
type Test_JSONArray_Compatible = AssertTrue<
  Equal<JSONArray extends Array<unknown> ? true : false, true>,
  'JSONArray is an array'
>

// Jsonify strips functions and Date
interface RawUser {
  id: number
  name: string
  password: string
  createdAt: Date
  toJSON(): string
}
type Test_Jsonify = AssertTrue<
  Equal<Jsonify<RawUser>, { id: number; name: string }>,
  'Jsonify strips Date/Function/sensitive keys'
>

// IsJsonValue
type Test_IsJsonValue_Yes = AssertTrue<IsJsonValue<{ a: 1; b: 'x' }>, 'plain record is JSON'>
type Test_IsJsonValue_No = AssertFalse<IsJsonValue<{ a: Date }>, 'Date is not JSON'>

// Jsonifiable respects toJSON
interface WithToJSON {
  value: number
  toJSON(): { serialized: string }
}
type Test_Jsonifiable_ToJSON = AssertTrue<
  Equal<Jsonifiable<WithToJSON>, { serialized: string }>,
  'Jsonifiable uses toJSON return type'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_JSONPrimitive,
  Test_JSONObject_Compatible,
  Test_JSONArray_Compatible,
  Test_Jsonify,
  Test_IsJsonValue_Yes,
  Test_IsJsonValue_No,
  Test_Jsonifiable_ToJSON,
]
