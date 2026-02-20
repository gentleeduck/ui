//#region src/lib/utils.d.ts
declare function formatDate(input: string | number): string;
declare function absoluteUrl(path: string): string;
declare const filteredObject: <T extends Record<string, any>>(keys: string[], obj: T) => Partial<T>;
declare function groupDataByNumbers<T>(strings: T[], groupSizes: number[]): T[][];
declare function groupArrays<T>(numbers: number[], arr: T[]): T[][];
//#endregion
export { groupDataByNumbers as a, groupArrays as i, filteredObject as n, formatDate as r, absoluteUrl as t };
//# sourceMappingURL=utils-B9LHy7ak.d.ts.map