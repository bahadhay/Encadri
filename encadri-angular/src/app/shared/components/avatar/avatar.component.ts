import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getAvatarClasses()" [title]="name">
      <!-- Image -->
      <img
        *ngIf="src && !imageError"
        [src]="src"
        [alt]="name"
        (error)="onImageError()"
        class="w-full h-full object-cover" />

      <!-- Initials fallback -->
      <span
        *ngIf="!src || imageError"
        [class]="getInitialsClasses()">
        {{ getInitials() }}
      </span>

      <!-- Status indicator -->
      <span
        *ngIf="status"
        [class]="getStatusClasses()"
        [ngClass]="getStatusColorClass()">
      </span>
    </div>
  `
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() name = '';
  @Input() size: AvatarSize = 'md';
  @Input() status?: 'online' | 'offline' | 'away' | 'busy';
  @Input() customClass = '';

  imageError = false;

  onImageError() {
    this.imageError = true;
  }

  getInitials(): string {
    if (!this.name) return '?';

    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }

  getAvatarClasses(): string {
    const baseClasses = 'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-medium flex-shrink-0';

    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${this.customClass}`.trim();
  }

  getInitialsClasses(): string {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-xl'
    };

    return sizeClasses[this.size];
  }

  getStatusClasses(): string {
    const baseClasses = 'absolute rounded-full border-2 border-white';

    const positionClasses = {
      xs: 'w-2 h-2 bottom-0 right-0',
      sm: 'w-2.5 h-2.5 bottom-0 right-0',
      md: 'w-3 h-3 bottom-0 right-0',
      lg: 'w-3.5 h-3.5 bottom-0 right-0',
      xl: 'w-4 h-4 bottom-0.5 right-0.5'
    };

    return `${baseClasses} ${positionClasses[this.size]}`;
  }

  getStatusColorClass(): string {
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500'
    };

    return this.status ? statusColors[this.status] : '';
  }
}
