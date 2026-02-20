//#region src/types/nav.d.ts
interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  accordion?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
}
interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}
interface MainNavItem extends NavItem {}
interface SidebarNavItem extends NavItemWithChildren {}
//#endregion
export { SidebarNavItem as i, NavItem as n, NavItemWithChildren as r, MainNavItem as t };
//# sourceMappingURL=nav-DaMi8xsQ.d.ts.map