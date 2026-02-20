function e(t){return t.map(t=>({...t,items:t.items?e(t.items):[],title:t.title?.replace(`undefined`,``)}))}export{e as cleanTocItems};
//# sourceMappingURL=utils.js.map