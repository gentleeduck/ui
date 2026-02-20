import { n as ColorFormat } from "./colors-DGCMPxyb.js";

//#region src/hooks/use-colors.d.ts
declare function useColors(): {
  format: "className" | "hex" | "hsl" | "oklch" | "rgb" | "var";
  isLoading: boolean;
  lastCopied: string;
  setFormat: (format: ColorFormat) => void;
  setLastCopied: (lastCopied: string) => void;
};
//#endregion
export { useColors as t };
//# sourceMappingURL=use-colors-DrRy3eOt.d.ts.map