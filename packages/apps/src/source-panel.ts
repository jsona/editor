import { customElement } from 'lit/decorators.js';
import { html, LitElement } from 'lit';
import './code-editor';
import './tab-bar';
import { bsStyle } from './shareStyles';

@customElement('source-panel')
export class SourcePanel extends LitElement {
  static styles = [
    bsStyle,
  ]

  protected render() {
    return html`
      <div class="d-flex">
        <tab-bar class="flex-grow-1" .names=${['source']}></tab-bar>
        <div class="btn-group pe-3" role="group">
          <button type="button" class="btn btn-outline-primary" @click=${this._run}>run</button>
        </div>
      </div>
      <code-editor 
        height="90vh"
        code=${``} 
        lang="plaintext" 
        path=${"file:///source.txt"}
        .options=${{
          glyphMargin: true,
          automaticLayout: true,
          lightbulb: {
            enabled: true
          },
        }}
        @execute=${this._run}
      ></code-editor>
    `
  }

  private _run() {
    console.log('run');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'source-panel': SourcePanel;
  }
}