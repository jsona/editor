import { customElement, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { html, LitElement } from 'lit';
import { bsStyle } from './shareStyles';
import './code-editor';

@customElement('header-bar')
export class HeaderBar extends LitElement {
  static styles = [
    bsStyle,
  ]

  @query('#navbar') 
  private navbar: HTMLDivElement;

  private _activeNavIdx = 0;
  private _title = 'Jsona Editor';
  private _navs = [
    ['Core', 'index.html'],
    ['Schema', 'schema.html'],
    ['Openapi', 'openapi.html'],
  ]

  connectedCallback(): void {
    super.connectedCallback();
    let pathname = location.pathname;
    if (pathname !== "/") {
      for (let i = 0; i < this._navs.length; i++) {
        let nav = this._navs[i];
        if (pathname.endsWith(nav[1])) {
          this._activeNavIdx = i;
          break;
        }
      }
    }
  }

  protected render() {
    return html`
      <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">${this._title}</a>
            <button class="navbar-toggler" type="button" @click="${this._toggleNavbar}" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbar">
              <ul class="navbar-nav me-auto">
                ${this._navs.map(([name, path], i) => {
                  return html`
                    <li class="nav-item">
                      <a class="nav-link ${classMap({active: this._activeNavIdx === i})}" href="${path}">${name}</a>
                    </li>
                  `
                })}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    `;
  }

  private _toggleNavbar(e: Event) {
    if (this.navbar.classList.contains('show')) {
      this.navbar.classList.remove('show');
    } else {
      this.navbar.classList.add('show');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'header-bar': HeaderBar;
  }
}