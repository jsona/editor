import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import styles from "monaco-editor/min/vs/editor/editor.main.css";
import { register, startLsp, currentDocUris, LANG_ID } from "monaco-jsona";
import jsonaWorker from "monaco-jsona/dist/jsona.worker.js?worker";

@customElement('code-editor')
export class CodeEditor extends LitElement {
  container = createRef<HTMLDivElement>();
  editor?: monaco.editor.IStandaloneCodeEditor;

  @property() path: string;
  @property() code: string;
  @property() lang: string;

  static styles = css`
    main {
      width: 90vh;
      height: 90vh;
    }
  `;

  render() {
    return html`
      <style>
        ${styles}
      </style>
      <main ${ref(this.container)}></main>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.lang == LANG_ID) {
      let worker = new jsonaWorker();
      register(monaco);
      startLsp({
        worker,
        debug: import.meta.env.DEV,
      });
      currentDocUris.add(this.path);
    }
  }

  firstUpdated() {
    const uri = monaco.Uri.parse(this.path);
    this.editor = monaco.editor.create(this.container.value!, {
      model: monaco.editor.getModel(uri) || monaco.editor.createModel(this.code, this.lang, uri),
      glyphMargin: true,
      lightbulb: {
        enabled: true
      }
    })
  }

  disconnectedCallback(): void {
    currentDocUris.delete(this.path);
    this.editor?.dispose();
  }

  setValue(value: string) {
    this.editor!.setValue(value);
  }

  getValue() {
    const value = this.editor!.getValue();
    return value;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "code-editor": CodeEditor;
  }
}