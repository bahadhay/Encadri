import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      <span *ngIf="dot" class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="getDotClass()"></span>
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() dot = false;
  @Input() customClass = '';

  getBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm'
    };

    const variantClasses = {
      primary: 'bg-indigo-100 text-indigo-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${this.customClass}`.trim();
  }

  getDotClass(): string {
    const dotClasses = {
      primary: 'bg-indigo-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600',
      info: 'bg-blue-600',
      gray: 'bg-gray-600'
    };

    return dotClasses[this.variant];
  }
}
