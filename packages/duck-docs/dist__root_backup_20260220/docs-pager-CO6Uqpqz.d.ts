import { n as NavItem, r as NavItemWithChildren } from "./nav-DaMi8xsQ.js";
import { t as DocsConfig } from "./context.types-DaHZ8T0w.js";
import * as react_jsx_runtime61 from "react/jsx-runtime";

//#region src/components/docs/docs-pager.d.ts
interface DocsPagerProps {
  doc: {
    slug?: string;
    title: string;
  };
}
declare function DocsPagerBottom({
  doc
}: DocsPagerProps): react_jsx_runtime61.JSX.Element | null;
declare function DocsPagerTop({
  doc
}: DocsPagerProps): react_jsx_runtime61.JSX.Element | null;
declare function getPagerForDoc(doc: DocsPagerProps['doc'], docsConfig: DocsConfig): {
  next: NavItem | null | undefined;
  prev: NavItem | null | undefined;
};
declare function flatten(links: NavItemWithChildren[]): NavItem[];
//#endregion
export { getPagerForDoc as i, DocsPagerTop as n, flatten as r, DocsPagerBottom as t };
//# sourceMappingURL=docs-pager-CO6Uqpqz.d.ts.map