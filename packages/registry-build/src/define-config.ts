import type { RegistryBuildConfig, RegistryItemType } from './types'

type ConfigArrayItem<TValue> = TValue extends readonly (infer TItem)[] ? TItem : never
type ConfigKeys<TValue> = Extract<keyof NonNullable<TValue>, string>
type ValidationError<TName extends string> = { [TKey in TName]: never }
type ValidateRegistryKeySet<TKeys extends string, TName extends string> = [Exclude<TKeys, RegistryItemType>] extends [never]
  ? unknown
  : ValidationError<TName>
type ValidateRegistryItemTypeSet<TValue extends string, TName extends string> = [Exclude<TValue, RegistryItemType>] extends [never]
  ? unknown
  : ValidationError<TName>

type ConfigRegistryItemTypes<TConfig extends RegistryBuildConfig> =
  | Extract<keyof NonNullable<TConfig['sources']>, RegistryItemType>
  | Extract<keyof NonNullable<TConfig['targetPaths']>, RegistryItemType>
  | Extract<keyof NonNullable<NonNullable<TConfig['importMappings']>['packageMappings']>, RegistryItemType>
  | Extract<ConfigArrayItem<NonNullable<NonNullable<TConfig['componentIndex']>['excludeTypes']>>, RegistryItemType>
  | Extract<ConfigArrayItem<NonNullable<NonNullable<TConfig['schema']>['itemTypes']>>, RegistryItemType>
  | Extract<
      ConfigArrayItem<NonNullable<TConfig['registries']>[keyof NonNullable<TConfig['registries']>]> extends {
        type: infer TType
      }
        ? TType
        : never,
      RegistryItemType
    >

type StrictRegistryBuildConfig<TConfig extends RegistryBuildConfig> = RegistryBuildConfig<
  [ConfigRegistryItemTypes<TConfig>] extends [never] ? RegistryItemType : ConfigRegistryItemTypes<TConfig>
>

type DefineConfigValidation<TConfig extends RegistryBuildConfig> =
  & ValidateRegistryKeySet<
    ConfigKeys<TConfig['sources']>,
    '__registry_build_invalid_source_keys__'
  >
  & ValidateRegistryKeySet<
    ConfigKeys<TConfig['targetPaths']>,
    '__registry_build_invalid_target_path_keys__'
  >
  & ValidateRegistryKeySet<
    ConfigKeys<NonNullable<TConfig['importMappings']>['packageMappings']>,
    '__registry_build_invalid_package_mapping_keys__'
  >
  & ValidateRegistryItemTypeSet<
    ConfigArrayItem<NonNullable<NonNullable<TConfig['componentIndex']>['excludeTypes']>>,
    '__registry_build_invalid_component_index_types__'
  >
  & ValidateRegistryItemTypeSet<
    ConfigArrayItem<NonNullable<NonNullable<TConfig['schema']>['itemTypes']>>,
    '__registry_build_invalid_schema_item_types__'
  >

export function defineConfig<const TConfig extends RegistryBuildConfig>(
  config: TConfig & StrictRegistryBuildConfig<TConfig> & DefineConfigValidation<TConfig>,
) {
  return config
}
