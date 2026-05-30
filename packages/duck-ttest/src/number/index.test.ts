import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  Abs,
  Add,
  Clamp,
  Compare,
  Dec,
  DigitsOf,
  Div,
  EnumerateRange,
  Eq,
  Factorial,
  Finite,
  GCD,
  Gt,
  Gte,
  Inc,
  Integer,
  IsBetween,
  IsEven,
  IsNegative,
  IsOdd,
  IsPositive,
  IsPowerOfTwo,
  IsZero,
  LCM,
  Lt,
  Lte,
  Max,
  Min,
  Mod,
  Mul,
  Negate,
  Negative,
  NonNegative,
  NumberToString,
  Positive,
  Pow,
  StringToNumber,
  Sub,
  Sum,
} from '.'

// IsZero / IsNegative / IsPositive
type Test_IsZero_True = AssertTrue<IsZero<0>, '0 is zero'>
type Test_IsZero_False = AssertFalse<IsZero<5>, '5 is not zero'>
type Test_IsNeg_True = AssertTrue<IsNegative<-3>, '-3 is negative'>
type Test_IsNeg_False = AssertFalse<IsNegative<3>, '3 is not negative'>
type Test_IsPos_True = AssertTrue<IsPositive<3>, '3 is positive'>
type Test_IsPos_False_Zero = AssertFalse<IsPositive<0>, '0 is not positive'>
type Test_IsPos_False_Neg = AssertFalse<IsPositive<-3>, '-3 is not positive'>

// Abs / Negate
type Test_Abs_Neg = AssertTrue<Equal<Abs<-7>, 7>, 'Abs of -7 is 7'>
type Test_Abs_Pos = AssertTrue<Equal<Abs<7>, 7>, 'Abs of 7 is 7'>
type Test_Negate_Pos = AssertTrue<Equal<Negate<3>, -3>, 'Negate of 3 is -3'>
type Test_Negate_Neg = AssertTrue<Equal<Negate<-3>, 3>, 'Negate of -3 is 3'>
type Test_Negate_Zero = AssertTrue<Equal<Negate<0>, 0>, 'Negate of 0 is 0'>

// Inc / Dec
type Test_Inc = AssertTrue<Equal<Inc<4>, 5>, 'Inc(4) = 5'>
type Test_Dec = AssertTrue<Equal<Dec<4>, 3>, 'Dec(4) = 3'>

// Add / Sub / Mul
type Test_Add = AssertTrue<Equal<Add<3, 4>, 7>, 'Add(3, 4) = 7'>
type Test_Sub = AssertTrue<Equal<Sub<7, 3>, 4>, 'Sub(7, 3) = 4'>
type Test_Mul = AssertTrue<Equal<Mul<3, 4>, 12>, 'Mul(3, 4) = 12'>

// Gt / Lt / Gte / Lte
type Test_Gt = AssertTrue<Gt<5, 3>, '5 > 3'>
type Test_Not_Gt = AssertFalse<Gt<3, 5>, '3 not > 5'>
type Test_Lt = AssertTrue<Lt<3, 5>, '3 < 5'>
type Test_Gte_Equal = AssertTrue<Gte<5, 5>, '5 >= 5'>
type Test_Lte_Equal = AssertTrue<Lte<5, 5>, '5 <= 5'>

// Eq / Compare
type Test_Eq = AssertTrue<Eq<5, 5>, '5 == 5'>
type Test_Not_Eq = AssertFalse<Eq<5, 6>, '5 != 6'>
type Test_Compare_Eq = AssertTrue<Equal<Compare<5, 5>, 0>, 'Compare(5, 5) = 0'>
type Test_Compare_Gt = AssertTrue<Equal<Compare<7, 3>, 1>, 'Compare(7, 3) = 1'>
type Test_Compare_Lt = AssertTrue<Equal<Compare<3, 7>, -1>, 'Compare(3, 7) = -1'>

// IsEven / IsOdd
type Test_IsEven = AssertTrue<IsEven<4>, '4 is even'>
type Test_IsOdd = AssertTrue<IsOdd<5>, '5 is odd'>
type Test_IsEven_Zero = AssertTrue<IsEven<0>, '0 is even'>

// NumberToString / StringToNumber
type Test_N2S = AssertTrue<Equal<NumberToString<42>, '42'>, 'NumberToString stringifies'>
type Test_S2N = AssertTrue<Equal<StringToNumber<'42'>, 42>, 'StringToNumber parses'>

// Integer / Positive / NonNegative / Negative / Finite
type Test_Integer = AssertTrue<Equal<Integer<5>, 5>, 'Integer accepts 5'>
type Test_Integer_Float = AssertTrue<Equal<Integer<3.14>, never>, 'Integer rejects 3.14'>
type Test_Positive = AssertTrue<Equal<Positive<5>, 5>, 'Positive accepts 5'>
type Test_Positive_Zero = AssertTrue<Equal<Positive<0>, never>, 'Positive rejects 0'>
type Test_NonNeg_Zero = AssertTrue<Equal<NonNegative<0>, 0>, 'NonNegative accepts 0'>
type Test_NonNeg_Neg = AssertTrue<Equal<NonNegative<-1>, never>, 'NonNegative rejects -1'>
type Test_Negative = AssertTrue<Equal<Negative<-3>, -3>, 'Negative accepts -3'>
type Test_Finite = AssertTrue<Equal<Finite<42>, 42>, 'Finite accepts 42'>

// Sum / Max / Min
type Test_Sum = AssertTrue<Equal<Sum<[1, 2, 3, 4]>, 10>, 'Sum adds elements'>
type Test_Max = AssertTrue<Equal<Max<[3, 7, 2, 5]>, 7>, 'Max finds maximum'>
type Test_Min = AssertTrue<Equal<Min<[3, 7, 2, 5]>, 2>, 'Min finds minimum'>

// Div / Mod
type Test_Div = AssertTrue<Equal<Div<10, 3>, 3>, 'Div floor-divides'>
type Test_Div_Exact = AssertTrue<Equal<Div<12, 4>, 3>, 'Div with exact divisor'>
type Test_Mod = AssertTrue<Equal<Mod<10, 3>, 1>, 'Mod returns remainder'>

// EnumerateRange
type Test_EnumerateRange = AssertTrue<
  Equal<EnumerateRange<2, 6>, 2 | 3 | 4 | 5>,
  'EnumerateRange<2, 6> = 2 | 3 | 4 | 5'
>

// IsBetween
type Test_IsBetween_Yes = AssertTrue<IsBetween<5, 1, 10>, '5 is between 1 and 10'>
type Test_IsBetween_Edge = AssertTrue<IsBetween<1, 1, 10>, '1 is within [1, 10]'>
type Test_IsBetween_No = AssertFalse<IsBetween<11, 1, 10>, '11 is not within [1, 10]'>

// DigitsOf
type Test_DigitsOf = AssertTrue<Equal<DigitsOf<1205>, ['1', '2', '0', '5']>, 'DigitsOf splits digits'>

// Pow / GCD / LCM / Factorial
type Test_Pow = AssertTrue<Equal<Pow<2, 5>, 32>, '2^5 = 32'>
type Test_Pow_Zero = AssertTrue<Equal<Pow<5, 0>, 1>, '5^0 = 1'>
type Test_GCD = AssertTrue<Equal<GCD<12, 18>, 6>, 'gcd(12, 18) = 6'>
type Test_GCD_Coprime = AssertTrue<Equal<GCD<7, 9>, 1>, 'coprime gcd = 1'>
type Test_LCM = AssertTrue<Equal<LCM<4, 6>, 12>, 'lcm(4, 6) = 12'>
type Test_Factorial = AssertTrue<Equal<Factorial<5>, 120>, '5! = 120'>
type Test_Factorial_Zero = AssertTrue<Equal<Factorial<0>, 1>, '0! = 1'>

// Clamp
type Test_Clamp_Mid = AssertTrue<Equal<Clamp<50, 0, 100>, 50>, 'Clamp leaves mid untouched'>
type Test_Clamp_Hi = AssertTrue<Equal<Clamp<120, 0, 100>, 100>, 'Clamp caps to Hi'>

// IsPowerOfTwo
type Test_PoT_Yes = AssertTrue<IsPowerOfTwo<16>, '16 is a power of two'>
type Test_PoT_No = AssertFalse<IsPowerOfTwo<15>, '15 is not a power of two'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_IsZero_True,
  Test_IsZero_False,
  Test_IsNeg_True,
  Test_IsNeg_False,
  Test_IsPos_True,
  Test_IsPos_False_Zero,
  Test_IsPos_False_Neg,
  Test_Abs_Neg,
  Test_Abs_Pos,
  Test_Negate_Pos,
  Test_Negate_Neg,
  Test_Negate_Zero,
  Test_Inc,
  Test_Dec,
  Test_Add,
  Test_Sub,
  Test_Mul,
  Test_Gt,
  Test_Not_Gt,
  Test_Lt,
  Test_Gte_Equal,
  Test_Lte_Equal,
  Test_Eq,
  Test_Not_Eq,
  Test_Compare_Eq,
  Test_Compare_Gt,
  Test_Compare_Lt,
  Test_IsEven,
  Test_IsOdd,
  Test_IsEven_Zero,
  Test_N2S,
  Test_S2N,
  Test_Integer,
  Test_Integer_Float,
  Test_Positive,
  Test_Positive_Zero,
  Test_NonNeg_Zero,
  Test_NonNeg_Neg,
  Test_Negative,
  Test_Finite,
  Test_Sum,
  Test_Max,
  Test_Min,
  Test_Div,
  Test_Div_Exact,
  Test_Mod,
  Test_EnumerateRange,
  Test_IsBetween_Yes,
  Test_IsBetween_Edge,
  Test_IsBetween_No,
  Test_DigitsOf,
  Test_Pow,
  Test_Pow_Zero,
  Test_GCD,
  Test_GCD_Coprime,
  Test_LCM,
  Test_Factorial,
  Test_Factorial_Zero,
  Test_Clamp_Mid,
  Test_Clamp_Hi,
  Test_PoT_Yes,
  Test_PoT_No,
]
