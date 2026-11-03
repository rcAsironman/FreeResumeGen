const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const cache=new Map();
module.exports=function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);new Function('require','module','exports',ts.transpile(fs.readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}))(id=>id.startsWith('@/')?load(id.slice(2)+'.ts'):require(id),m,m.exports);return m.exports;};
