import { customElement, state } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { html, LitElement } from 'lit';
import './code-editor';
import './tab-bar';
import { bsStyle } from './shareStyles';

@customElement('source-panel')
export class SourcePanel extends LitElement {
  static styles = [
    bsStyle,
  ]

  @state()
  private data: Promise<string> = fetchData();

  protected render() {
    return html`
      <div class="d-flex">
        <tab-bar class="flex-grow-1" .names=${['source']}></tab-bar>
        <div class="btn-group pe-3" role="group">
          <button type="button" class="btn btn-outline-primary" @click=${this._run}>run</button>
        </div>
      </div>
      ${until(
        this.data.then(code => {
          return html`
            <code-editor 
              height="90vh"
              code=${code} 
              lang="jsona" 
              path=${"file:///source.jsona"}
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
        }),
        html`<span>Loading...</span>`
      )}
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

async function fetchData() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source");
  if (!source) {
    return '';
  }
  try {
    const res = await fetch(source)
    return res.text();
  } catch (err) {
    // TODO show toast
    return '';
  }
}
