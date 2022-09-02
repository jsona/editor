import { customElement } from 'lit/decorators.js';
import { css, html, LitElement } from 'lit';
import { bsStyle } from "./shareStyles";
import './header-bar';
import './source-panel';

@customElement('core-app')
export class CoreApp extends LitElement {
  static styles = [
    bsStyle,
    css`
      .panel {
        width: 100%;
        border: 1px solid lightgrey;
      }
    `
  ]

  protected render() {
    return html`
      <div>
        <header-bar></header-bar>
        <div class="d-flex">
          <source-panel class="panel"></source-panel>
          <div class="panel">
            <tab-bar class="flex-grow-1" .names=${['target']}></tab-bar>
            <code-editor 
              height="90vh"
              code=${``}
              lang="plaintext"
              path=${"file:///target.txt"}
              .options=${{
                lineNumbers: 'off',
                readOnly: true,
                automaticLayout: true,
              }}
            >
            </code-editor>
          </div>
        </div>
      </div>
    `;
  }
}