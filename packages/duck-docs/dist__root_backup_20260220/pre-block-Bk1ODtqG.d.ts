import { t as Event } from "./events-DW6VsR3n.js";
import { t as NpmCommands } from "./unist-BYKbr-MG.js";
import * as react_jsx_runtime57 from "react/jsx-runtime";

//#region src/components/mdx/mdx-components/code/pre-block.d.ts
type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  __rawString__?: string;
  __withMeta__?: boolean;
  __title__?: string;
  __event__?: Event['name'];
} & NpmCommands;
declare function PreBlock({
  className,
  __rawString__,
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  __bunCommand__,
  __withMeta__,
  __event__,
  __title__,
  children,
  ...props
}: CodeBlockProps): react_jsx_runtime57.JSX.Element;
declare function ShellCommand({
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  __bunCommand__
}: NpmCommands): react_jsx_runtime57.JSX.Element;
//#endregion
export { PreBlock as n, ShellCommand as r, CodeBlockProps as t };
//# sourceMappingURL=pre-block-Bk1ODtqG.d.ts.map