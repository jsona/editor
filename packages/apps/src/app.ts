import { customElement } from 'lit/decorators.js';
import { LitElement, html } from 'lit';
import "./code-editor";

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`
      <div>
       <code-editor code=${`{ @jsonaschema("schema") }`} lang="jsona" path=${"file:///editor.jsona"} />
      </div>
    `;
  }
}