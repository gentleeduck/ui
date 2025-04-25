/**
 * A map of variant names to their allowed value keys.
 *
 * @template TVariants
 *   A record whose keys are variant names and whose values are
 *   maps of allowed variant-value names to their CSS class strings.
 */
export type VariantProps<
  TVariants extends Record<string, Record<string, string>>,
> = {
  /**
   * For each variant key K in TVariants, you can optionally specify
   * one of the keys of TVariants[K] to select that variant value.
   */
  [K in keyof TVariants]?: keyof TVariants[K]
}

/**
 * Options for generating a class‑variance‑authority style mapper.
 *
 * @template TVariants
 *   A record whose keys are variant names and whose values are
 *   maps of allowed variant-value names to their CSS class strings.
 */
export interface VariantsOptions<
  TVariants extends Record<string, Record<string, string>>,
> {
  /**
   * A map of variant names to their possible value‑to‑class mappings.
   */
  variants: TVariants

  /**
   * Optional defaults for each variant key.
   * Each default must be one of the keys of the corresponding variants map.
   */
  defaultVariants?: VariantProps<TVariants>
}

/**
 * Props that can be passed to a component using cva
 */
export type CvaProps<TVariants extends Record<string, Record<string, string>>> = 
  VariantProps<TVariants> & { 
    className?: string; 
    class?: string 
  }
