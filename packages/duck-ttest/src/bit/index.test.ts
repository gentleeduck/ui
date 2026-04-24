import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { BitAnd, BitNot, BitOr, BitXor, FromBits, PopCount, ShiftLeft, ShiftRight } from '.'

// FromBits — little-endian
type Test_FromBits_Five = AssertTrue<Equal<FromBits<[1, 0, 1]>, 5>, 'FromBits<[1,0,1]> = 5'>
type Test_FromBits_Zero = AssertTrue<Equal<FromBits<[0, 0, 0]>, 0>, 'all zeros = 0'>

// BitAnd
type Test_And = AssertTrue<Equal<BitAnd<[1, 1, 0, 1], [1, 0, 1, 1]>, [1, 0, 0, 1]>, 'AND is bitwise min'>

// BitOr
type Test_Or = AssertTrue<Equal<BitOr<[1, 0, 0, 0], [0, 1, 0, 1]>, [1, 1, 0, 1]>, 'OR is bitwise max'>

// BitXor
type Test_Xor = AssertTrue<Equal<BitXor<[1, 1, 0, 1], [1, 0, 1, 1]>, [0, 1, 1, 0]>, 'XOR differs when bits differ'>

// BitNot
type Test_Not = AssertTrue<Equal<BitNot<[1, 0, 1, 1]>, [0, 1, 0, 0]>, 'NOT inverts each bit'>

// ShiftLeft / ShiftRight — bit-tuple rotations
type Test_ShiftLeft = AssertTrue<
  Equal<ShiftLeft<[1, 0, 1, 0], 1>, [0, 1, 0, 1]>,
  'ShiftLeft inserts 0 on the right, drops high bits'
>
type Test_ShiftRight = AssertTrue<
  Equal<ShiftRight<[0, 1, 0, 1], 1>, [1, 0, 1, 0]>,
  'ShiftRight drops low bits, pads with 0'
>

// PopCount
type Test_PopCount = AssertTrue<Equal<PopCount<[1, 0, 1, 1, 0, 1]>, 4>, 'counts 1-bits'>
type Test_PopCount_Zero = AssertTrue<Equal<PopCount<[0, 0, 0]>, 0>, 'no 1-bits = 0'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_FromBits_Five,
  Test_FromBits_Zero,
  Test_And,
  Test_Or,
  Test_Xor,
  Test_Not,
  Test_PopCount,
  Test_PopCount_Zero,
  Test_ShiftLeft,
  Test_ShiftRight,
]
