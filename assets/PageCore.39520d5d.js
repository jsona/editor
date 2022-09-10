import{m as A,r as v,P as L}from"./Page.e6aa314f.js";import{j as I}from"./index.df513f27.js";let r,E=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});E.decode();let p=new Uint8Array;function y(){return p.byteLength===0&&(p=new Uint8Array(r.memory.buffer)),p}function w(n,e){return E.decode(y().subarray(n,n+e))}const u=new Array(32).fill(void 0);u.push(void 0,null,!0,!1);let d=u.length;function h(n){d===u.length&&u.push(u.length+1);const e=d;return d=u[e],u[e]=n,e}function k(n){return u[n]}let l=0,m=new TextEncoder("utf-8");const M=typeof m.encodeInto=="function"?function(n,e){return m.encodeInto(n,e)}:function(n,e){const t=m.encode(n);return e.set(t),{read:n.length,written:t.length}};function j(n,e,t){if(t===void 0){const a=m.encode(n),c=e(a.length);return y().subarray(c,c+a.length).set(a),l=a.length,c}let o=n.length,s=e(o);const _=y();let i=0;for(;i<o;i++){const a=n.charCodeAt(i);if(a>127)break;_[s+i]=a}if(i!==o){i!==0&&(n=n.slice(i)),s=t(s,o,o=i+n.length*3);const a=y().subarray(s+i,s+o);i+=M(n,a).written}return l=i,s}let x=new Int32Array;function f(){return x.byteLength===0&&(x=new Int32Array(r.memory.buffer)),x}function N(n){n<36||(u[n]=d,d=n)}function g(n){const e=k(n);return N(n),e}function R(n){const e=j(n,r.__wbindgen_export_0,r.__wbindgen_export_1),t=l,o=r.parse(e,t);return g(o)}function C(n){const e=j(n,r.__wbindgen_export_0,r.__wbindgen_export_1),t=l,o=r.parseAst(e,t);return g(o)}function F(n){try{const a=r.__wbindgen_add_to_stack_pointer(-16);r.stringifyAst(a,h(n));var e=f()[a/4+0],t=f()[a/4+1],o=f()[a/4+2],s=f()[a/4+3],_=e,i=t;if(s)throw _=0,i=0,g(o);return w(_,i)}finally{r.__wbindgen_add_to_stack_pointer(16),r.__wbindgen_export_2(_,i)}}function T(n,e){try{const c=r.__wbindgen_add_to_stack_pointer(-16),S=j(n,r.__wbindgen_export_0,r.__wbindgen_export_1),W=l;r.format(c,S,W,h(e));var t=f()[c/4+0],o=f()[c/4+1],s=f()[c/4+2],_=f()[c/4+3],i=t,a=o;if(_)throw i=0,a=0,g(s);return w(i,a)}finally{r.__wbindgen_add_to_stack_pointer(16),r.__wbindgen_export_2(i,a)}}function U(n,e){const t=JSON.parse(w(n,e));return h(t)}function D(n,e){const t=k(e),o=JSON.stringify(t===void 0?null:t),s=j(o,r.__wbindgen_export_0,r.__wbindgen_export_1),_=l;f()[n/4+1]=_,f()[n/4+0]=s}function J(n,e){const t=new Error(w(n,e));return h(t)}function z(n){g(n)}function P(){const n={};return n["./index_bg.js"]={},n["./index_bg.js"].parse=R,n["./index_bg.js"].parseAst=C,n["./index_bg.js"].stringifyAst=F,n["./index_bg.js"].format=T,n["./index_bg.js"].__wbindgen_json_parse=U,n["./index_bg.js"].__wbindgen_json_serialize=D,n["./index_bg.js"].__wbindgen_error_new=J,n["./index_bg.js"].__wbindgen_object_drop_ref=z,n}async function B(n,e){if(typeof Response=="function"&&n instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(n,e)}catch(o){if(n.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",o);else throw o}const t=await n.arrayBuffer();return await WebAssembly.instantiate(t,e)}else{const t=await WebAssembly.instantiate(n,e);return t instanceof WebAssembly.Instance?{instance:t,module:n}:t}}let b={};async function O(n){if(b.input===n&&b.module)return b.module;const e=P();typeof n>"u"&&(n=new URL("/editor/assets/index_bg.5493e962.wasm",self.location)),(typeof n=="string"||typeof Request=="function"&&n instanceof Request||typeof URL=="function"&&n instanceof URL)&&(n=fetch(n));const{instance:t}=await B(await n,e);return r=t.exports,p=new Uint8Array,b.input=n,b.module=e["./index_bg.js"],b.module}const V=`// A sample jsona doc

/*
 multiple line comment
*/

// single line comment

{
    @null /* abc */ @nullVerbose(null)
    @bool(true) // single line comment
    @float(3.14)
    @number(-3)
    @string('abc "def" ghi')
    @array([3,4])
    @object({
        k1: "v1",
        k2: "v2",
    })

    nullValue: /* xyz */ null,
    boolTrue: true,
    boolFalse: false,
    float: 3.14,
    floatNegative: -3.14,
    floatNegativeWithoutInteger: -.14,
    floatNegativeWithoutDecimal: -3.,
    integer: 3,
    hex: 0x1a,
    binary: 0b01,
    octal: 0o12,
    integerNegative: -3,
    stringSingleQuota: 'abc "def" ghi',
    stringDoubleQuota: "abc 'def' ghi",
    stringBacktick: \`abc
def \\\`
xyz\`,
    stringEscape1: '\\0\\b\\f\\n\\r\\t\\u000b\\'\\\\\\xA9\\u00A9\\u{2F804}',
    stringEscape2: "\\0\\b\\f\\n\\r\\t\\u000b\\'\\\\\\xA9\\u00A9\\u{2F804}",
    stringEscape3: \`\\0\\b\\f\\n\\r\\t\\u000b\\'\\\\\\xA9\\u00A9\\u{2F804}\`,
    arrayEmpty: [], 
    arrayEmptyMultiLine: [ @array
    ],
    arrayEmptyWithAnnotation: [], @array
    arraySimple: [ @array
        "a", @upper
        "b",
    ],
    arrayOnline: ["a", "b"], @array
    arrayExtraComma: ["a", "b",],
    objectEmpty: {},
    objectEmptyMultiLine: { @object
    },
    objectEmptyWithAnnotation: {}, @def("Object4")
    objectSimple: { @ref("Object4")
        k1: "v1", @upper
        k2: "v2",
    },
    objectOneLine: { k1: "v1", k2: "v2" }, @object
    objectExtraComma: { k1: "v1", k2: "v2", },
}
`,q=n=>O().then(e=>e.parse(n)),H=n=>O().then(e=>e.parseAst(n));function G(){return I(L,{placeholder:V,tabs:[{name:"toJson",file:"plain.json",convert:A(q,n=>JSON.stringify(n,null,2)),render:v},{name:"toAst",file:"ast.json",convert:A(H,n=>JSON.stringify(n,null,2)),render:v}]})}export{G as default};
