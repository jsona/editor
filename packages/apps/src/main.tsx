import 'monaco-editor/esm/vs/editor/editor.all.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import jsonaWorker from "monaco-jsona/dist/jsona.worker.js?worker";
import { register, startLsp, DEFAULT_CONFIGURATION } from "monaco-jsona";

let uri = monaco.Uri.parse('root:///input.jsona');
let worker = new jsonaWorker();
let c = startLsp(worker);
c.sendNotification("internal/setup", { debug: import.meta.env.DEV });
c.onRequest("workspace/configuration", async (parmas) => {
  return Array.from(Array(parmas.length)).map(() => DEFAULT_CONFIGURATION);
});
c.onNotification("jsona/initializeWorkspace", () => {
  c.sendRequest("jsona/associatedSchema", { documentUri: uri.toString() });
});
register(monaco);
monaco.editor.create(document.getElementById("container"), {
  model: monaco.editor.getModel(uri) || monaco.editor.createModel(`{ @jsonaschema("schema") }`, 'jsona', uri),
  glyphMargin: true,
  lightbulb: {
    enabled: true
  }
})
