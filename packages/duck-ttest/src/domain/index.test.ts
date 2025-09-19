import type { AssertTrue } from '~/assert'
import type { Equal, ShallowEqual } from '~/equality'
import type { HexColor, Jsonify, RgbColorString, UuidString } from '.'

// -------------------------------
// ✅ Jsonify
// -------------------------------

type RawUser = {
  id: number
  name: string
  password: string
  createdAt: Date
  toJSON(): string
  preferences: {
    theme: string
    notify: boolean
    secret?: () => void
  }
  scores: number[]
}

type ExpectedSanitizedUser = {
  id: number
  name: string
  preferences: {
    theme: string
    notify: boolean
  }
  scores: number[]
}

type Test_Jsonify = AssertTrue<
  ShallowEqual<Jsonify<RawUser>, ExpectedSanitizedUser>,
  'Jsonify<RawUser> should remove Date, functions, and sensitive fields'
>

type Test_JsonifyRecursive = AssertTrue<
  Equal<
    Jsonify<{
      items: {
        name: string
        callback: () => void
        created: Date
      }[]
    }>,
    {
      items: {
        name: string
      }[]
    }
  >,
  'Jsonify should recursively strip functions and Dates in arrays'
>

// -------------------------------
// ✅ HexColor
// -------------------------------

declare const validHexColor: HexColor
// const testHex2: HexColor = 'ffffff'  // ❌ compile-time error

const testHex1: HexColor = '#ffffff'
type Test_HexColor = AssertTrue<Equal<typeof testHex1, `#${string}`>, 'HexColor should start with #'>

// -------------------------------
// ✅ RgbColorString
// -------------------------------

declare const rgb1: RgbColorString
const testRgb: RgbColorString = 'rgb(255, 0, 100)'
// const testRgbInvalid: RgbColorString = '#ff00ff'  // ❌ compile-time error

type Test_RgbColor = AssertTrue<
  Equal<typeof testRgb, `rgb(${number}, ${number}, ${number})`>,
  "RgbColorString should follow 'rgb(R, G, B)' format"
>

// -------------------------------
// ✅ UuidString
// -------------------------------

const uuid: UuidString = '550e8400-e29b-41d4-a716-446655440000'
// const uuidInvalid: UuidString = 'not-a-uuid'  // ❌ compile-time error

type Test_Uuid = AssertTrue<
  Equal<typeof uuid, `${string}-${string}-${string}-${string}-${string}`>,
  'UuidString should follow UUID v4 format'
>

/* @__IGNORED__@ */ type _IGNORE = [Test_Jsonify, Test_JsonifyRecursive, Test_HexColor, Test_RgbColor, Test_Uuid]
