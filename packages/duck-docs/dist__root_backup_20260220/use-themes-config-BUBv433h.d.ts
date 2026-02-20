import { n as Theme } from "./themes-Bd8LhnfW.js";
import * as jotai_utils1 from "jotai/utils";

//#region src/hooks/use-themes-config.d.ts
type ThemesConfig = {
  activeTheme: Theme;
};
declare function useThemesConfig(): {
  setThemesConfig: (args_0: typeof jotai_utils1.RESET | ThemesConfig | ((prev: ThemesConfig) => typeof jotai_utils1.RESET | ThemesConfig)) => void;
  themesConfig: ThemesConfig;
};
//#endregion
export { useThemesConfig as t };
//# sourceMappingURL=use-themes-config-BUBv433h.d.ts.map