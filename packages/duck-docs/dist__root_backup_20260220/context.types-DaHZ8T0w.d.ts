import { i as SidebarNavItem, t as MainNavItem } from "./nav-DaMi8xsQ.js";

//#region src/context/context.types.d.ts
type DocsConfig = {
  chartsNav?: SidebarNavItem[];
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};
type DocsSiteConfig = {
  author?: {
    name: string;
    url?: string;
  };
  branding?: {
    logoDark?: string;
    logoLight?: string;
  };
  description?: string;
  githubRepo?: string;
  links?: {
    email?: string;
    github?: string;
    twitter?: string;
  };
  metaThemeColors?: {
    dark: string;
    light: string;
  };
  name: string;
  title?: string;
  url?: string;
};
type DocsEntry = {
  component?: boolean;
  content?: string;
  permalink?: string;
  slug: string;
  title: string;
  toc?: TocEntry[];
};
type TocEntry = {
  items?: TocEntry[];
  title: string;
  url: string;
};
type DocsContextValue = {
  docs?: DocsEntry[];
  docsConfig: DocsConfig;
  registryIndex?: RegistryIndex;
  siteConfig: DocsSiteConfig;
};
type RegistryIndex = Record<string, {
  component?: React.ComponentType;
} & Record<string, unknown>>;
//#endregion
export { RegistryIndex as a, DocsSiteConfig as i, DocsContextValue as n, TocEntry as o, DocsEntry as r, DocsConfig as t };
//# sourceMappingURL=context.types-DaHZ8T0w.d.ts.map