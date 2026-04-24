import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { Brand, Branded, BrandOf, Nominal, Opaque, Tagged, Unbrand } from '.'

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

// Brand is nominal — UserId and OrderId are distinct even though both wrap string
type Test_Brand_Nominal = AssertTrue<Equal<UserId extends OrderId ? true : false, false>, 'brands are nominal'>

// Underlying type is preserved (UserId is a subtype of string)
type Test_Brand_Preserves = AssertTrue<
  Equal<UserId extends string ? true : false, true>,
  'branded type is still assignable to its underlying type'
>

// Branded alias
type Test_Branded = AssertTrue<Equal<Branded<string, 'A'>, Brand<string, 'A'>>, 'Branded aliases Brand'>

// Unbrand
type Test_Unbrand = AssertTrue<Equal<Unbrand<UserId>, string>, 'Unbrand removes the tag'>
type Test_Unbrand_NonBrand = AssertTrue<Equal<Unbrand<number>, number>, 'Unbrand leaves raw types untouched'>

// Tagged
type Test_Tagged = AssertTrue<Equal<Tagged<string, 'kind', 'user'>['__kind'], 'user'>, 'Tagged adds a tag property'>

// Opaque / Nominal aliases
type Test_Opaque = AssertTrue<Equal<Opaque<string, 'X'>, Brand<string, 'X'>>, 'Opaque aliases Brand'>
type Test_Nominal = AssertTrue<Equal<Nominal<string, 'X'>, Brand<string, 'X'>>, 'Nominal aliases Brand'>

// BrandOf
type Test_BrandOf = AssertTrue<Equal<BrandOf<UserId>, 'UserId'>, 'BrandOf extracts the tag'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Brand_Nominal,
  Test_Brand_Preserves,
  Test_Branded,
  Test_Unbrand,
  Test_Unbrand_NonBrand,
  Test_Tagged,
  Test_Opaque,
  Test_Nominal,
  Test_BrandOf,
]
