import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-routing-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './routing-button.component.html',
  styleUrls: ['./routing-button.component.css']
})
export class RoutingButtonComponent {
  @Input({ required: true }) routePath!: string | any[];

  @Input() additionalClasses: string = '';

  @Input() buttonId: string | null = null;

  @Input() title: string | null = null;

  @Input() disabled: boolean = false;

  constructor() { }

  get combinedClasses(): string {
    return `primary ${this.additionalClasses}`.trim();
  }
}
