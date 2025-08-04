// -------------------------------------------
// InferSchema Test Cases
// -------------------------------------------

import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { InferSchema } from '.'

// -------------------------------------------
// Test 1 – Basic SQL Types
// -------------------------------------------

type SQLTest_Basic = InferSchema<`
  CREATE TABLE users (
    id INT PRIMARY KEY,
    email TEXT NOT NULL
  )
`>

type Test_InferSchema_Basic = AssertTrue<
  Equal<
    SQLTest_Basic,
    {
      id: number
      email: string
    }
  >,
  'Expected id: number and email: string'
>

// -------------------------------------------
// Test 2 – Mixed SQL Types
// -------------------------------------------

type SQLTest_Mixed = InferSchema<`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255),
    active BOOLEAN DEFAULT true,
    age FLOAT
  )
`>

type Test_InferSchema_Mixed = AssertTrue<
  Equal<
    SQLTest_Mixed,
    {
      id: number
      name: string
      active: boolean
      age: number
    }
  >,
  'Expected correct mapping for INTEGER, VARCHAR, BOOLEAN, FLOAT'
>

// -------------------------------------------
// Test 3 – Extended Types
// -------------------------------------------

type SQLTest_Extended = InferSchema<`
  CREATE TABLE metrics (
    value DOUBLE PRECISION,
    recorded DATE,
    uid UUID
  )
`>

type Test_InferSchema_Extended = AssertTrue<
  Equal<
    SQLTest_Extended,
    {
      value: number
      recorded: string
      uid: string
    }
  >,
  'Expected DOUBLE PRECISION → number, DATE → string, UUID → string'
>

// -------------------------------------------
// Test 4 – Formatting Tolerance
// -------------------------------------------

type SQLTest_Formatted = InferSchema<`
  CREATE TABLE
    items (
      item_id    INT   PRIMARY KEY ,
      name TEXT ,
      price  FLOAT DEFAULT 0.0
    )
`>

type Test_InferSchema_Formatted = AssertTrue<
  Equal<
    SQLTest_Formatted,
    {
      item_id: number
      name: string
      price: number
    }
  >,
  'Expected parser to handle indents, spaces, and line breaks'
>

// -------------------------------------------
// Test 5 – Unsupported SQL Types
// -------------------------------------------

type SQLTest_Unknown = InferSchema<`
  CREATE TABLE unknowns (
    id INT,
    meta JSON,
    blob BLOB
  )
`>

type Test_InferSchema_Unknown = AssertTrue<
  Equal<
    SQLTest_Unknown,
    {
      id: number
      meta: unknown
      blob: unknown
    }
  >,
  'Expected unknown for unsupported SQL types like JSON, BLOB'
>
