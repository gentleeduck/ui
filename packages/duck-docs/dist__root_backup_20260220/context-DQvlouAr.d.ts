import { a as RegistryIndex, i as DocsSiteConfig, n as DocsContextValue, r as DocsEntry, t as DocsConfig } from "./context.types-DaHZ8T0w.js";
import * as React$1 from "react";
import * as react_jsx_runtime71 from "react/jsx-runtime";

//#region src/context/context.d.ts
declare function DocsProvider({
  children,
  docs,
  docsConfig,
  registryIndex,
  siteConfig
}: {
  children: React$1.ReactNode;
  docs?: DocsEntry[];
  docsConfig: DocsConfig;
  registryIndex?: RegistryIndex;
  siteConfig: DocsSiteConfig;
}): react_jsx_runtime71.JSX.Element;
declare function useDocsContext(): DocsContextValue;
declare function useDocsConfig(): DocsConfig;
declare function useSiteConfig(): DocsSiteConfig;
declare function useDocsEntries(): DocsEntry[] | undefined;
declare function useRegistryIndex(): RegistryIndex | undefined;
//#endregion
export { useRegistryIndex as a, useDocsEntries as i, useDocsConfig as n, useSiteConfig as o, useDocsContext as r, DocsProvider as t };
//# sourceMappingURL=context-DQvlouAr.d.ts.map