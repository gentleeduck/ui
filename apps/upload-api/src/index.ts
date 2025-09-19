import z from 'zod'

type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
} & {}

type MappedTo<
  T extends Record<string, number> | ReadonlyArray<string | number>,
  U extends unknown,
> = T extends ReadonlyArray<infer Item>
  ? { [K in `${Item & (string | number)}`]: U }
  : T extends object
    ? { [K in keyof Mutable<T>]: U }
    : never

const bucketSchema = z.object({
  created_at: z.date(),
  description: z.string(),
  id: z.string(),
  more_information: z.string(),
  name: z.string(),
  updated_at: z.date(),
  user_id: z.string(),
})

type InsertBucketType = z.infer<typeof bucketSchema>

type GetStepNeededKeys<
  TObject extends Record<string, unknown>,
  TStep extends number = 1,
> = TObject extends InsertBucketType
  ? TStep extends 1
    ? { name: true; description: true }
    : TStep extends 2
      ? { more_information: true }
      : never
  : never

type GetOriginalKeyValuesFromSchema<
  TSchema extends Record<string, unknown>,
  TObject extends Record<string, unknown>,
> = {
  [K in keyof TObject]: K extends keyof TSchema ? TSchema[K] : never
}

type GetMappedType<TObject> = {
  [TKey in keyof TObject]: TObject[TKey]
} & {}

function MultiStepDataValidation<
  TStep extends number,
  TData extends GetMappedType<
    Partial<GetOriginalKeyValuesFromSchema<InsertBucketType, GetStepNeededKeys<InsertBucketType, TStep>>>
  >,
>(step: TStep, data: TData) {
  try {
    const keysNeeded = (
      step === 1
        ? {
            description: true,
            name: true,
          }
        : step === 2 && {
            more_information: true,
          }
    ) as GetMappedType<Partial<MappedTo<Array<keyof InsertBucketType>, true>>>

    return bucketSchema.pick({ ...keysNeeded }).parse(data)
  } catch (_) {
    throw Error('failed', _)
  }
}

const currentStepType = MultiStepDataValidation(1, {
  description: 'The description of this user is wilddcuk!!',
  name: 'ahmed',
})

console.log(currentStepType)
