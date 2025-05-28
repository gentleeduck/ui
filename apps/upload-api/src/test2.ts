import z, { ZodType } from 'zod'

type MapToType<TObject extends Record<string, unknown>, TType extends unknown> = {
  readonly [TKey in keyof TObject]?: TType
}

type GetOrinalKeyValuesFromSchema<
  TSchema extends z.ZodObject<Record<string, ZodType>>,
  TNeededKeys extends MapToType<z.infer<TSchema>, true>,
> = {
  [TKey in keyof TNeededKeys]: TKey extends keyof z.infer<TSchema> ? z.infer<TSchema>[TKey] : never
}

function MultiStepFormValidation<
  TSchema extends z.ZodObject<Record<string, ZodType>>,
  TNeededKeys extends MapToType<TSchema['_output'], true>,
  TData extends GetOrinalKeyValuesFromSchema<TSchema, TNeededKeys>,
>(schema: TSchema, neededKeys: TNeededKeys, data: TData): TData {
  try {
    return schema.pick(neededKeys as Record<string, true>).parse(data) as TData
  } catch (error) {
    throw error
  }
}

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string(),
  age: z.number(),
  address: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const data = MultiStepFormValidation(
  userSchema,
  {
    name: true,
    email: true,
    age: true,
  },
  {
    name: 'John Doe',
    email: 'asdfasdf',
    age: 24,
  },
)

export const _data = MultiStepFormValidation(
  userSchema,
  {
    address: true,
    bio: true,
  },
  {
    address: 'asdfasdf',
    bio: 'asdfasdf',
  },
)
