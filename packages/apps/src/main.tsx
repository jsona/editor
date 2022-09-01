import 'monaco-editor/esm/vs/editor/editor.all.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { register, startLsp, currentDocUris } from "monaco-jsona";
import jsonaWorker from "monaco-jsona/dist/jsona.worker.js?worker";

let worker = new jsonaWorker();
register(monaco);
startLsp({
  worker,
  debug: import.meta.env.DEV,
});

const uri = monaco.Uri.parse('root:///input.jsona');
currentDocUris.add(uri.toString());
monaco.editor.create(document.getElementById("container"), {
  model: monaco.editor.getModel(uri) || monaco.editor.createModel(`{ @jsonaschema("schema") }`, 'jsona', uri),
  glyphMargin: true,
  lightbulb: {
    enabled: true
  }
})
