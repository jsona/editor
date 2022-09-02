import { customElement } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import "./code-editor";

@customElement('my-app')
export class MyApp extends LitElement {
  static styles = css`
    code-editor {
      --editor-width: 100%;
      --editor-height: 90vh;
    }
  `;
  protected render() {
    return html`
      <div>
       <code-editor code=${`{ @jsonaschema("schema") }`} lang="jsona" path=${"file:///editor.jsona"}></code-editor>
      </div>
    `;
  }
}