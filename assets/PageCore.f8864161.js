import{m as j,r as A,P as I}from"./Page.39dfd51e.js";import{j as L}from"./index.7076e87b.js";let o,k=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});k.decode();let m=new Uint8Array;function p(){return m.byteLength===0&&(m=new Uint8Array(o.memory.buffer)),m}function w(e,n){return k.decode(p().subarray(e,e+n))}const l=new Array(32).fill(void 0);l.push(void 0,null,!0,!1);let d=l.length;function h(e){d===l.length&&l.push(l.length+1);const n=d;return d=l[n],l[n]=e,n}function E(e){return l[e]}let b=0,y=new TextEncoder("utf-8");const N=typeof y.encodeInto=="function"?function(e,n){return y.encodeInto(e,n)}:function(e,n){const t=y.encode(e);return n.set(t),{read:e.length,written:t.length}};function x(e,n,t){if(t===void 0){const a=y.encode(e),c=n(a.length);return p().subarray(c,c+a.length).set(a),b=a.length,c}let r=e.length,s=n(r);const _=p();let i=0;for(;i<r;i++){const a=e.charCodeAt(i);if(a>127)break;_[s+i]=a}if(i!==r){i!==0&&(e=e.slice(i)),s=t(s,r,r=i+e.length*3);const a=p().subarray(s+i,s+r);i+=N(e,a).written}return b=i,s}let v=new Int32Array;function u(){return v.byteLength===0&&(v=new Int32Array(o.memory.buffer)),v}function R(e){e<36||(l[e]=d,d=e)}function g(e){const n=E(e);return R(e),n}function C(e){const n=x(e,o.__wbindgen_export_0,o.__wbindgen_export_1),t=b,r=o.parse(n,t);return g(r)}function F(e){const n=x(e,o.__wbindgen_export_0,o.__wbindgen_export_1),t=b,r=o.parseAst(n,t);return g(r)}function M(e){try{const a=o.__wbindgen_add_to_stack_pointer(-16);o.stringifyAst(a,h(e));var n=u()[a/4+0],t=u()[a/4+1],r=u()[a/4+2],s=u()[a/4+3],_=n,i=t;if(s)throw _=0,i=0,g(r);return w(_,i)}finally{o.__wbindgen_add_to_stack_pointer(16),o.__wbindgen_export_2(_,i)}}function T(e,n){try{const c=o.__wbindgen_add_to_stack_pointer(-16),W=x(e,o.__wbindgen_export_0,o.__wbindgen_export_1),S=b;o.format(c,W,S,h(n));var t=u()[c/4+0],r=u()[c/4+1],s=u()[c/4+2],_=u()[c/4+3],i=t,a=r;if(_)throw i=0,a=0,g(s);return w(i,a)}finally{o.__wbindgen_add_to_stack_pointer(16),o.__wbindgen_export_2(i,a)}}function U(e,n){const t=JSON.parse(w(e,n));return h(t)}function Q(e,n){const t=E(n),r=JSON.stringify(t===void 0?null:t),s=x(r,o.__wbindgen_export_0,o.__wbindgen_export_1),_=b;u()[e/4+1]=_,u()[e/4+0]=s}function q(e,n){const t=new Error(w(e,n));return h(t)}function J(e){g(e)}function D(){const e={};return e["./index_bg.js"]={},e["./index_bg.js"].parse=C,e["./index_bg.js"].parseAst=F,e["./index_bg.js"].stringifyAst=M,e["./index_bg.js"].format=T,e["./index_bg.js"].__wbindgen_json_parse=U,e["./index_bg.js"].__wbindgen_json_serialize=Q,e["./index_bg.js"].__wbindgen_error_new=q,e["./index_bg.js"].__wbindgen_object_drop_ref=J,e}async function P(e,n){if(typeof Response=="function"&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(e,n)}catch(r){if(e.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",r);else throw r}const t=await e.arrayBuffer();return await WebAssembly.instantiate(t,n)}else{const t=await WebAssembly.instantiate(e,n);return t instanceof WebAssembly.Instance?{instance:t,module:e}:t}}let f={};async function O(e){if(f.input===e&&f.module)return f.module;let n=e;const t=D();typeof e>"u"&&(e=new URL("/editor/assets/index_bg.5493e962.wasm",self.location)),(typeof e=="string"||typeof Request=="function"&&e instanceof Request||typeof URL=="function"&&e instanceof URL)&&(e=fetch(e));const{instance:r}=await P(await e,t);return o=r.exports,m=new Uint8Array,f.input=n,f.module=t["./index_bg.js"],f.module}const B=`// A sample jsona doc

/*
 multiple line comment
*/
{ // single line comment
    null: null, @null /* inline comment */ @null2(null)
    boolTrue: true, @bool(true)
    boolFalse: false, @bool(false)
    float: 3.14, @number(3.14)
    floatNegative: -3.14, @number(-3.14)
    floatNegativeWithoutInteger: -.14, @number(-1.4)
    floatNegativeWithoutDecimal: -3., @float(-3.)
    integer: 3, @int(3)
    integerNegative: -3, @number(-3)
    integerHex: 0x1a, @number(0x1a)
    integerBinary: 0b01, @number(0b01)
    integerOctal: 0o12, @number(0o12)
    'key "single Quote"': 'value "single Quote"', @string('value "single Quote"')
    "key 'double Quote'": "value 'double Quote'", @string("value 'double Quote'")
    \`value 'backtick'
"quote"\`: \`value 'backtick'
"quote"\`, @string(\`value 'backtick'
"quote"\`)
    stringEscape1: '\\0\\b\\f\\n\\r\\t\\u000b\\'\\\\\\xA9\\u00A9\\u{2F804}',
    stringEscape2: "\\0\\b\\f\\n\\r\\t\\u000b\\'\\\\\\xA9\\u00A9\\u{2F804}",
    stringEscape3: \`\\0\\b\\f\\n\\r\\t\\u000b\\'\\\\\\xA9\\u00A9\\u{2F804}\`,

    array: [ @array
        "a",
        "b",
    ],
    arrayEmpty: [], @array
    arrayOnline: ["a", "b"], @array
    arrayExtraComma: ["a", "b",], // tailing comma

    object: { @object @def("Object4")
        k1: "v1",
        k2: "v2",
    },
    objectEmpty: {}, @object
    objectOneLine: { k1: "v1", k2: "v2" }, @object
    objectExtraComma: { k1: "v1", k2: "v2", }, // tailing comma
}`,H=e=>O().then(n=>n.parse(e)),z=e=>O().then(n=>n.parseAst(e));function G(){return L(I,{placeholder:B,tabs:[{name:"toJson",file:"plain.json",convert:j(H,e=>JSON.stringify(e,null,2)),render:A},{name:"toAst",file:"ast.json",convert:j(z,e=>JSON.stringify(e,null,2)),render:A}]})}export{G as default};
