import { z } from "zod";

//#region src/lib/colors.d.ts
declare const colorPaletteSchema: z.ZodObject<{
  colors: z.ZodArray<z.ZodObject<{
    className: z.ZodString;
    foreground: z.ZodString;
    hex: z.ZodString;
    hsl: z.ZodString;
    id: z.ZodString;
    name: z.ZodString;
    oklch: z.ZodString;
    rgb: z.ZodString;
    scale: z.ZodNumber;
    var: z.ZodString;
  }, z.core.$strip>>;
  name: z.ZodString;
}, z.core.$strip>;
type ColorPalette = z.infer<typeof colorPaletteSchema>;
declare function getColorFormat(color: Color): {
  className: string;
  hex: string;
  hsl: string;
  oklch: string;
  rgb: string;
  var: string;
};
type ColorFormat = keyof ReturnType<typeof getColorFormat>;
declare function getColors(): {
  colors: {
    className: string;
    foreground: string;
    hex: string;
    hsl: string;
    id: string;
    name: string;
    oklch: string;
    rgb: string;
    scale: number;
    var: string;
  }[];
  name: string;
}[];
type Color = ReturnType<typeof getColors>[number]['colors'][number];
//#endregion
export { getColors as a, getColorFormat as i, ColorFormat as n, ColorPalette as r, Color as t };
//# sourceMappingURL=colors-DGCMPxyb.d.ts.map