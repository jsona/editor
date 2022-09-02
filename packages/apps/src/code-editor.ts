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
  private container = createRef<HTMLDivElement>();
  private editor?: monaco.editor.IStandaloneCodeEditor;

  @property() path: string;
  @property() code: string;
  @property() lang: string;

  static styles = css`
    :host {
      --editor-width: 100%;
      --editor-height: 100vh;
    }
    main {
      width: var(--editor-width);
      height: var(--editor-height);
    }
  `;

  protected render() {
    return html`
      <style>
        ${styles}
      </style>
      <main ${ref(this.container)}></main>
    `;
  }

  public connectedCallback() {
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

  public disconnectedCallback(): void {
    currentDocUris.delete(this.path);
    this.editor?.dispose();
  }

  protected firstUpdated() {
    const uri = monaco.Uri.parse(this.path);
    this.editor = monaco.editor.create(this.container.value!, {
      model: monaco.editor.getModel(uri) || monaco.editor.createModel(this.code, this.lang, uri),
      glyphMargin: true,
      lightbulb: {
        enabled: true
      }
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "code-editor": CodeEditor;
  }
}