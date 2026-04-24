import type { AssertFalse, AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { AbstractClass, Class, ConstructorParametersSafe, InstanceTypeSafe, IsClass } from '.'

class Foo {
  hello() {}
}
class Bar {
  constructor(
    public n: number,
    public s: string,
  ) {}
}

// Class
type Test_Class = AssertTrue<Equal<typeof Foo extends Class<Foo> ? true : false, true>, 'Foo is a Class<Foo>'>

// AbstractClass accepts concrete classes too
type Test_AbstractClass = AssertTrue<
  Equal<typeof Foo extends AbstractClass<Foo> ? true : false, true>,
  'concrete class also satisfies AbstractClass'
>

// InstanceTypeSafe
type Test_InstanceType = AssertTrue<Equal<InstanceTypeSafe<typeof Foo>, Foo>, 'InstanceTypeSafe returns instance type'>
type Test_InstanceType_NonClass = AssertTrue<
  Equal<InstanceTypeSafe<string>, never>,
  'InstanceTypeSafe of non-class is never'
>

// ConstructorParametersSafe
type Test_CtorParams = AssertTrue<
  Equal<ConstructorParametersSafe<typeof Bar>, [number, string]>,
  'ConstructorParametersSafe extracts constructor params'
>

// IsClass
type Test_IsClass_Yes = AssertTrue<IsClass<typeof Foo>, 'Foo is a class'>
type Test_IsClass_No = AssertFalse<IsClass<string>, 'string is not a class'>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Class,
  Test_AbstractClass,
  Test_InstanceType,
  Test_InstanceType_NonClass,
  Test_CtorParams,
  Test_IsClass_Yes,
  Test_IsClass_No,
]
