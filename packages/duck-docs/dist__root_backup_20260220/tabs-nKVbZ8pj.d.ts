import * as React$2 from "react";
import * as react_jsx_runtime96 from "react/jsx-runtime";

//#region ../registry-ui-duckui/src/tabs/tabs.d.ts

interface TabsProps extends Omit<React$2.HTMLProps<HTMLDivElement>, 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
declare function Tabs({
  value,
  defaultValue,
  onValueChange,
  ...props
}: TabsProps): react_jsx_runtime96.JSX.Element;
interface TabsListProps extends React$2.HTMLProps<HTMLUListElement> {}
declare const TabsList: ({
  className,
  ref,
  ...props
}: TabsListProps) => react_jsx_runtime96.JSX.Element;
interface TabsTriggerProps extends React$2.HTMLProps<HTMLLIElement> {
  value: string;
  defaultChecked?: boolean;
}
declare const TabsTrigger: ({
  className,
  children,
  defaultChecked,
  onClick,
  value,
  disabled,
  ref,
  ...props
}: TabsTriggerProps) => react_jsx_runtime96.JSX.Element;
declare const TabsContent: ({
  children,
  forceMount,
  className,
  value,
  ref,
  ...props
}: React$2.HTMLProps<HTMLDivElement> & {
  value: string;
  forceMount?: boolean;
}) => react_jsx_runtime96.JSX.Element;
//#endregion
//#region src/components/mdx/mdx-components/tabs.d.ts
declare function Tab({
  className,
  ...props
}: React.ComponentProps<typeof Tabs>): react_jsx_runtime96.JSX.Element;
declare function TabList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>): react_jsx_runtime96.JSX.Element;
declare function TabTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>): react_jsx_runtime96.JSX.Element;
declare function TabContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContent>): react_jsx_runtime96.JSX.Element;
//#endregion
export { TabTrigger as i, TabContent as n, TabList as r, Tab as t };
//# sourceMappingURL=tabs-nKVbZ8pj.d.ts.map