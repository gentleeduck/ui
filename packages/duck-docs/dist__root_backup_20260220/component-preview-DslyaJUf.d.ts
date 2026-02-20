import * as React$1 from "react";
import * as react_jsx_runtime73 from "react/jsx-runtime";

//#region src/components/mdx/mdx-components/code/component-preview.d.ts
interface ComponentPreviewProps extends React$1.HTMLAttributes<HTMLDivElement> {
  name: string;
  extractClassname?: boolean;
  extractedClassNames?: string;
  align?: 'center' | 'start' | 'end';
  description?: string;
  hideCode?: boolean;
  showSettings?: boolean;
}
declare function ComponentPreview({
  name,
  children,
  className,
  extractClassname,
  extractedClassNames,
  align,
  description,
  hideCode,
  showSettings,
  ...props
}: ComponentPreviewProps): react_jsx_runtime73.JSX.Element;
declare const BuildTab: () => react_jsx_runtime73.JSX.Element;
declare const TABS: {
  name: string;
  value: string;
}[];
//#endregion
export { ComponentPreview as n, TABS as r, BuildTab as t };
//# sourceMappingURL=component-preview-DslyaJUf.d.ts.map