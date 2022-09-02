import { customElement, property } from 'lit/decorators.js';
import { html, css, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { bsStyle } from './shareStyles';

@customElement('tab-bar')
export class TabBar extends LitElement {
  static styles = [
    bsStyle,
  ] 

  @property() names: string[];
  @property() selectIdx: number = 0;
  protected render() {
    return html`
      <ul class="nav nav-tabs" role="tablist">
        ${this.names.map((name, i) => {
          return html`
            <li class="nav-item" role="presentation">
              <a class="nav-link ${classMap({active: i === this.selectIdx})}" role="tab">${name}</a>
            </li>
          `
        })}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-bar': TabBar;
  }
}