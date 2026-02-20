import { Pluggable } from "unified";

//#region src/velite/config.d.ts
type DocsVeliteConfigOptions = {
  docsPattern?: string;
  rehypePlugins?: Pluggable[];
  rehypePluginsBefore?: Pluggable[];
  remarkPlugins?: Pluggable[];
  remarkPluginsBefore?: Pluggable[];
};
declare function createDocsVeliteConfig({
  docsPattern,
  rehypePlugins,
  rehypePluginsBefore,
  remarkPlugins,
  remarkPluginsBefore
}?: DocsVeliteConfigOptions): any;
declare const docsVeliteConfig: any;
//#endregion
export { DocsVeliteConfigOptions, createDocsVeliteConfig, docsVeliteConfig };
//# sourceMappingURL=config.d.ts.map