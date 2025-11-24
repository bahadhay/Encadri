import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ' + customClass"
      [ngClass]="{
        'hover:shadow-md transition-shadow cursor-pointer': clickable,
        'p-6': !noPadding
      }">
      <!-- Card Header -->
      <div *ngIf="title || headerTemplate" class="mb-4" [class.pb-4]="title" [class.border-b]="title" [class.border-gray-200]="title">
        <div *ngIf="title && !headerTemplate" class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <ng-content select="[cardHeaderAction]"></ng-content>
        </div>
        <ng-container *ngIf="headerTemplate">
          <ng-content select="[cardHeader]"></ng-content>
        </ng-container>
      </div>

      <!-- Card Body -->
      <div [class]="bodyClass">
        <ng-content></ng-content>
      </div>

      <!-- Card Footer -->
      <div *ngIf="footerTemplate" class="mt-4 pt-4 border-t border-gray-200">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title?: string;
  @Input() headerTemplate = false;
  @Input() footerTemplate = false;
  @Input() clickable = false;
  @Input() noPadding = false;
  @Input() customClass = '';
  @Input() bodyClass = '';
}
