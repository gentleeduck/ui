import React from "react";
import * as react_jsx_runtime28 from "react/jsx-runtime";

//#region src/components/layouts/site-header/header-shell.d.ts
type HeaderRootProps = React.HTMLAttributes<HTMLElement>;
type HeaderContainerProps = React.HTMLAttributes<HTMLDivElement>;
type HeaderBrandProps = {
  className?: string;
  href?: string;
  logoClassName?: string;
  name?: string;
  nameClassName?: string;
  showName?: boolean;
};
type HeaderSectionProps = React.HTMLAttributes<HTMLDivElement>;
declare function HeaderRoot({
  className,
  ...props
}: HeaderRootProps): react_jsx_runtime28.JSX.Element;
declare function HeaderContainer({
  className,
  children,
  ...props
}: HeaderContainerProps): react_jsx_runtime28.JSX.Element;
declare function HeaderBrand({
  className,
  href,
  logoClassName,
  name,
  nameClassName,
  showName
}: HeaderBrandProps): react_jsx_runtime28.JSX.Element;
declare function HeaderSection({
  className,
  ...props
}: HeaderSectionProps): react_jsx_runtime28.JSX.Element;
//#endregion
export { HeaderSection as i, HeaderContainer as n, HeaderRoot as r, HeaderBrand as t };
//# sourceMappingURL=header-shell-B6anteTW.d.ts.map