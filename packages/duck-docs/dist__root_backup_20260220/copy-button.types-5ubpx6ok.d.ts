import { t as Event } from "./events-DW6VsR3n.js";
import { n as ButtonProps, t as PopoverTrigger } from "./index-CZlFw1fK.js";
import * as React$1 from "react";
import React from "react";
import * as react_jsx_runtime79 from "react/jsx-runtime";

//#region ../registry-ui-duckui/src/dropdown-menu/dropdown-menu.d.ts
declare function DropdownMenuTrigger({
  className,
  children,
  asChild,
  onClick,
  ...props
}: React$1.ComponentPropsWithoutRef<typeof PopoverTrigger>): react_jsx_runtime79.JSX.Element;
//#endregion
//#region src/components/copy-button/copy-button.types.d.ts
type DropdownMenuTriggerProps = React$1.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>;
type CopyWithClassNamesProps = DropdownMenuTriggerProps & {
  value: string;
  classNames: string;
  className?: string;
};
type CopyButtonProps = ButtonProps & {
  value: string;
  event?: Event['name'];
};
//#endregion
export { CopyWithClassNamesProps as n, DropdownMenuTriggerProps as r, CopyButtonProps as t };
//# sourceMappingURL=copy-button.types-5ubpx6ok.d.ts.map