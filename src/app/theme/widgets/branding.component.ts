import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="matero-branding" href="/">
      <img src="./assets/images/bobbrand.png" class="matero-branding-logo-expanded" alt="logo" />
      <span class="matero-branding-name">Bob's Simulator</span>
    </a>
  `,
})
export class BrandingComponent {}
