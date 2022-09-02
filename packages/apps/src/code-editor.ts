import 'monaco-editor/esm/vs/editor/editor.all.js';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from 'monaco-editor/min/vs/editor/editor.main.css';
import { register, startLsp, currentDocUris } from 'monaco-jsona';
import jsonaWorker from 'monaco-jsona/dist/jsona.worker.js?worker';

@customElement('code-editor')
export class CodeEditor extends LitElement {
  private container = createRef<HTMLDivElement>();
  private editor?: monaco.editor.IStandaloneCodeEditor;

  @property() uri: string;
  @property() code: string;
  @property() width: string = "100%";
  @property() height: string = "100%";
  @property() options = {};

  protected render() {
    return html`
      <style>
        ${styles}
        .editor {
          width: ${this.width};
          height: ${this.height};
        }
      </style>
      <main class="editor" ${ref(this.container)}></main>
    `;
  }

  public connectedCallback() {
    super.connectedCallback();
    if (this.isJsona()) {
      let worker = new jsonaWorker();
      register(monaco);
      startLsp({
        worker,
        debug: import.meta.env.DEV,
      });
      currentDocUris.add(this.uri);
    }
  }

  public disconnectedCallback(): void {
    currentDocUris.delete(this.uri);
    this.editor?.dispose();
  }

  protected firstUpdated() {
    const uri = monaco.Uri.parse(this.uri);
    this.editor = monaco.editor.create(this.container.value!, {
      model: monaco.editor.getModel(uri) || monaco.editor.createModel(this.code, null, uri),
      ...this.options,
    });
    if (this.isJsona()) {
      this.editor.addCommand(monaco.KeyCode.Alt | monaco.KeyCode.Shift | monaco.KeyCode.KeyF, () => {
        this.editor.trigger('editor', 'editor.action.formatDocument', null);
      });
    }
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      this.dispatchEvent(new CustomEvent('execute', { bubbles: true, composed: true }));
    });
  }
  
  private isJsona() {
    return this.uri.endsWith("jsona")
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'code-editor': CodeEditor;
  }
}