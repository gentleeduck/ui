import z from 'zod'

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
} & {}

export type MappedTo<
  T extends Record<string, number> | ReadonlyArray<string | number>,
  U extends unknown,
> = T extends ReadonlyArray<infer Item>
  ? { [K in `${Item & (string | number)}`]: U }
  : T extends object
    ? { [K in keyof Mutable<T>]: U }
    : never

export const bucketSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  user_id: z.string(),
})
export type InsertBucketType = z.infer<typeof bucketSchema>

type CommonSchemaNeededType = { name: true; user_id: true }
type GetStepNeededKeys<
  TObject extends Record<string, unknown>,
  TStep extends number = 1,
> = TObject extends InsertBucketType
  ? TStep extends 1
    ? CommonSchemaNeededType
    : TStep extends 2
      ? { created_at: true; updated_at: true } & Pick<CommonSchemaNeededType, 'user_id'>
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
            name: true,
            user_id: true,
          }
        : step === 2 && {
            name: true,
            user_id: true,
            created_at: true,
            updated_at: true,
          }
    ) as GetMappedType<Partial<MappedTo<Array<keyof InsertBucketType>, true>>>

    return bucketSchema.pick({ ...keysNeeded }).parse(data)
  } catch (_) {
    console.log(_)
    throw Error('failed', _)
  }
}
const currentStepType = MultiStepDataValidation(2, {
  user_id: 'test',
  name: 1,
})

console.log(currentStepType)
