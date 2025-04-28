
// @ts-noCheck
function foo<T extends string>(n: User<T>): User<T> | null {
  if (typeof n === 'string') {
    return n
  } else {
    return null
  }
}

type NUser<T> = {
  name: T
  str: string
}

type User<T extends string = string> = T extends 'Admin'
  ? NUser<T> & {
    is_admin: true
  }
  : NUser<T>

const a = foo({
  name: 'Admin',
  str: 'foo',
  is_admin: true,
})

  //
  //ss type insertion/generics
  ? User < TypeInsert > {
    TypeInsert id = "223";
    name = "Steve";
    employeeID = 1234567890;
  }

//vanilla js compiled to:
let User: {
    id: "223",
    name: "Steve",
    employeeID: 1234567890,
  }, UserTypes = typeInsert => ({
    id: typeInsert,
    name: "string",
    employeeID: "number"
  });




for (const index of Object.entries(User)) {
  let
    [key, value] = index,
    type = UserTypes[key]
    ;

  if (typeof User[key] !== UserTypes("string")[key])
    return new Error(`Expected ${UserTypes("string")[key]}, got ${typeof User[key]}`)
}
