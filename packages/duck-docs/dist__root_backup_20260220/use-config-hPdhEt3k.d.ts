import { t as Style } from "./registry-styles-Dh1Fiw2l.js";
import * as jotai_utils0 from "jotai/utils";

//#region src/hooks/use-config.d.ts
type Config = {
  style: Style['name'];
  theme: string;
  radius: number;
};
declare function useConfig(): [Config, (args_0: typeof jotai_utils0.RESET | Config | ((prev: Config) => typeof jotai_utils0.RESET | Config)) => void];
//#endregion
export { useConfig as t };
//# sourceMappingURL=use-config-hPdhEt3k.d.ts.map