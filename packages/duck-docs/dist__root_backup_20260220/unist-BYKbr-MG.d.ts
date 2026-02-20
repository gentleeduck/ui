import { Node } from "unist";

//#region src/types/unist.d.ts
declare module 'unist' {
  interface Data {
    meta?: string;
  }
}
interface UnistNode extends Node {
  type: string;
  name?: string;
  tagName?: string;
  value?: string;
  properties?: {
    __rawString__?: string;
    __className__?: string;
    __title__?: string;
    __marks__?: string[];
    __event__?: string;
    __isMermaid__?: boolean;
    __mermaidLightSvg__?: string;
    __mermaidDarkSvg__?: string;
    className?: string[];
    [key: string]: unknown;
  } & NpmCommands;
  attributes?: {
    name: string;
    value: unknown;
    type?: string;
  }[];
  children?: UnistNode[];
}
interface UnistTree extends Node {
  children: UnistNode[];
}
interface NpmCommands {
  __npmCommand__?: string;
  __yarnCommand__?: string;
  __pnpmCommand__?: string;
  __bunCommand__?: string;
}
//#endregion
export { UnistNode as n, UnistTree as r, NpmCommands as t };
//# sourceMappingURL=unist-BYKbr-MG.d.ts.map