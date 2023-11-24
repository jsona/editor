import{j as g}from"./index-22565a6c.js";import{m as w,r as _,P as j}from"./Page-72bf3d11.js";let u,h=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});h.decode();let d=new Uint8Array;function b(){return d.byteLength===0&&(d=new Uint8Array(u.memory.buffer)),d}function x(e,n){return h.decode(b().subarray(e,e+n))}const a=new Array(32).fill(void 0);a.push(void 0,null,!0,!1);let l=a.length;function A(e){l===a.length&&a.push(a.length+1);const n=l;return l=a[n],a[n]=e,n}let p=0,m=new TextEncoder("utf-8");const O=typeof m.encodeInto=="function"?function(e,n){return m.encodeInto(e,n)}:function(e,n){const t=m.encode(e);return n.set(t),{read:e.length,written:t.length}};function S(e,n,t){if(t===void 0){const o=m.encode(e),f=n(o.length);return b().subarray(f,f+o.length).set(o),p=o.length,f}let r=e.length,i=n(r);const y=b();let s=0;for(;s<r;s++){const o=e.charCodeAt(s);if(o>127)break;y[i+s]=o}if(s!==r){s!==0&&(e=e.slice(s)),i=t(i,r,r=s+e.length*3);const o=b().subarray(i+s,i+r),f=O(e,o);s+=f.written}return p=s,i}function W(e){return a[e]}function R(e){e<36||(a[e]=l,l=e)}function E(e){const n=W(e);return R(e),n}function U(e){const n=S(e,u.__wbindgen_export_0,u.__wbindgen_export_1),t=p,r=u.parse(n,t);return E(r)}function L(e,n){const t=JSON.parse(x(e,n));return A(t)}function T(){const e={};return e["./index_bg.js"]={},e["./index_bg.js"].parse=U,e["./index_bg.js"].__wbindgen_json_parse=L,e}async function v(e,n){if(typeof Response=="function"&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(e,n)}catch(r){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",r);else throw r}const t=await e.arrayBuffer();return await WebAssembly.instantiate(t,n)}else{const t=await WebAssembly.instantiate(e,n);return t instanceof WebAssembly.Instance?{instance:t,module:e}:t}}let c={};async function M(e){if(c.input===e&&c.module)return c.module;let n=e;const t=T();typeof e>"u"&&(e=new URL("/editor/assets/index_bg-b7bf33d7.wasm",self.location)),(typeof e=="string"||typeof Request=="function"&&e instanceof Request||typeof URL=="function"&&e instanceof URL)&&(e=fetch(e));const{instance:r}=await v(await e,t);return u=r.exports,d=new Uint8Array,c.input=n,c.module=t["./index_bg.js"],c.module}const k=`// A sample json schema

{ @jsonaschema("schema")
  bool: true, @default
  int: 3, @schema({maximum:9})
  number: 3.14,
  string: "abc",
  array: [ @compound("oneOf")
    3,
    "abc",
  ],
  object: {
    key: "value" @pattern(".*")
  }
}`,C=e=>M().then(n=>n.parse(e));function P(){return g(j,{placeholder:k,tabs:[{name:"toSchema",file:"schema.json",convert:w(C,e=>JSON.stringify(e,null,2)),render:_}]})}export{P as default};
