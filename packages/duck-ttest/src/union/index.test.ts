import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { ExcludeKeys, Only, OverlappingKeys, UnionToIntersection, XOR } from '.'

// ===== Test: UnionToIntersection =====
type UTI_Input = { a: number } | { b: string }
type UTI_Result = UnionToIntersection<UTI_Input>
type UTI_Expected = { a: number } & { b: string }

type Test_UnionToIntersection = AssertTrue<
  Equal<UTI_Result, UTI_Expected>,
  'Expected UnionToIntersection to convert union into intersection type'
>

// ===== Test: ExcludeKeys =====
type EK_Input = { a: string; b: number; c: boolean }
type EK_Result = ExcludeKeys<EK_Input, 'a' | 'c'>
type EK_Expected = { b: number }

type Test_ExcludeKeys = AssertTrue<
  Equal<EK_Result, EK_Expected>,
  'Expected ExcludeKeys to remove specified keys from object type'
>

// ===== Test: OverlappingKeys =====
type OK_A = { a: number; b: string; c: boolean }
type OK_B = { b: boolean; c: number; d: string }
type OK_Result = OverlappingKeys<OK_A, OK_B>
type OK_Expected = 'b' | 'c'

type Test_OverlappingKeys = AssertTrue<
  Equal<OK_Result, OK_Expected>,
  'Expected OverlappingKeys to return keys present in both types'
>

// ===== Test: Only =====
type OnlyA = { a: number; b: string }
type OnlyB = { b: boolean; c: string }
type Only_Result = Only<OnlyA, OnlyB>
type Only_Expected = { a: number }

type Test_Only = AssertTrue<
  Equal<Only_Result, Only_Expected>,
  'Expected Only to return properties exclusive to first type'
>

// ===== Test: XOR =====
type XOR_A = { a: string; b: number }
type XOR_B = { b: number; c: boolean }
type XOR_Result = XOR<XOR_A, XOR_B>
type XOR_Expected = { a: string } | { c: boolean }

type Test_XOR = AssertTrue<
  Equal<XOR_Result, XOR_Expected>,
  'Expected XOR to return mutually exclusive properties from either type'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_UnionToIntersection,
  Test_ExcludeKeys,
  Test_OverlappingKeys,
  Test_Only,
  Test_XOR,
]
