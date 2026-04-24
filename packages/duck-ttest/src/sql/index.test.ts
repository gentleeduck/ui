// -------------------------------------------
// InferSchema Test Cases
// -------------------------------------------

import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { InferSchema, ResolveFields } from '.'

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
      name?: string | null
      id: number
      active?: boolean
      age?: number | null
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
      value?: number | null
      recorded?: string | null
      uid?: string | null
    }
  >,
  'Expected DOUBLE PRECISION -> number, DATE -> string, UUID -> string'
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
      name?: string | null
      item_id: number
      price?: number
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
      id?: number | null
      meta?: any
      blob?: Uint8Array<ArrayBufferLike> | null
    }
  >,
  'Expected unknown for unsupported SQL types like JSON, BLOB'
>

const AnimalSQL = `
  CREATE TABLE animals (
    animal_id UUID PRIMARY KEY,
    species TEXT NOT NULL,
    birth_date DATE,
    death_date DATE,
    weight_kg FLOAT,
    mother_id UUID REFERENCES animals(animal_id) NOT NULL,
    father_id UUID REFERENCES animals(animal_id),
    enclosure_id UUID REFERENCES enclosures(enclosure_id),
    feeding_plan_id UUID REFERENCES feeding_plans(plan_id),
    genetic_code TEXT,
    endangered BOOLEAN DEFAULT false,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at DATE DEFAULT CURRENT_DATE
  )
`

const EnclosureSQL = `
  CREATE TABLE enclosures (
    enclosure_id UUID PRIMARY KEY,
    name TEXT,
    area_sq_meters FLOAT,
    is_indoor BOOLEAN,
    last_cleaned DATE
  )
`

const FeedingPlanSQL = `
  CREATE TABLE feeding_plans (
    plan_id UUID PRIMARY KEY,
    name TEXT,
    schedule TEXT,
    calories_per_day INT,
    protein_ratio FLOAT
  )
`
type Animal = InferSchema<typeof AnimalSQL>
type Enclosure = InferSchema<typeof EnclosureSQL>
type FeedingPlan = InferSchema<typeof FeedingPlanSQL>

type ResolvedAnimal = ResolveFields<
  Animal,
  {
    animals: Animal
    enclosures: Enclosure
    feeding_plans: FeedingPlan
  }
>

// --- Example usage and test types ---

// Test case 1: Basic table with various constraints
type TestSQL1 = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT DEFAULT 18,
    bio TEXT,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`

// Test case 2: Table with foreign keys and nullable fields
type TestSQL2 = `
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    user_id INT REFERENCES users(id),
    published BOOLEAN DEFAULT false,
    category ENUM('tech', 'lifestyle', 'business') NOT NULL
  )
`

// Test case 3: Table with no auto-increment primary key
type TestSQL3 = `
  CREATE TABLE settings (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false
  )
`

// Test the inferred schemas
type UserSchema = InferSchema<TestSQL1>
type PostSchema = InferSchema<TestSQL2>
type SettingsSchema = InferSchema<TestSQL3>

/* @__IGNORED__@ */ type _IGNORE = [
  TestSQL1,
  TestSQL2,
  TestSQL3,
  Test_InferSchema_Basic,
  Test_InferSchema_Extended,
  Test_InferSchema_Formatted,
  Test_InferSchema_Unknown,
  Test_InferSchema_Mixed,
  ResolvedAnimal,
  UserSchema,
  PostSchema,
  SettingsSchema,
]
