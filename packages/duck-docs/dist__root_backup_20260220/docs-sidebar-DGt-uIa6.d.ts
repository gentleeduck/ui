import { i as SidebarNavItem } from "./nav-DaMi8xsQ.js";
import { t as DocsConfig } from "./context.types-DaHZ8T0w.js";
import * as react_jsx_runtime63 from "react/jsx-runtime";

//#region src/components/docs/docs-sidebar.d.ts
interface DocsSidebarNavProps {
  config?: DocsConfig;
}
declare function DocsSidebarNav({
  config
}: DocsSidebarNavProps): 0 | react_jsx_runtime63.JSX.Element | undefined;
interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
  className?: string;
  depth?: number;
  accordionDefault?: boolean;
}
declare function DocsSidebarNavItems({
  items,
  pathname,
  className,
  depth,
  accordionDefault
}: DocsSidebarNavItemsProps): 0 | react_jsx_runtime63.JSX.Element;
declare function DocsSidebarNavItem({
  item,
  pathname,
  depth,
  accordionDefault
}: {
  item: SidebarNavItem;
  pathname: string | null;
  depth?: number;
  accordionDefault?: boolean;
}): react_jsx_runtime63.JSX.Element;
//#endregion
export { DocsSidebarNavProps as i, DocsSidebarNavItem as n, DocsSidebarNavItems as r, DocsSidebarNav as t };
//# sourceMappingURL=docs-sidebar-DGt-uIa6.d.ts.map