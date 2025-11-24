import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
      [class.opacity-0]="!isOpen"
      (click)="closeOnBackdrop && close()">
    </div>

    <!-- Modal -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="closeOnBackdrop && close()">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          [class]="getModalClasses()"
          (click)="$event.stopPropagation()">

          <!-- Header -->
          <div *ngIf="title || showClose" class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 *ngIf="title" class="text-xl font-semibold text-gray-900">{{ title }}</h3>
            <ng-content select="[modalHeader]"></ng-content>

            <button
              *ngIf="showClose"
              (click)="close()"
              class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          <div *ngIf="hasFooter" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <ng-content select="[modalFooter]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title?: string;
  @Input() size: ModalSize = 'md';
  @Input() showClose = true;
  @Input() closeOnBackdrop = true;
  @Input() hasFooter = false;

  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    if (this.isOpen) {
      this.disableBodyScroll();
    }
  }

  ngOnDestroy() {
    this.enableBodyScroll();
  }

  close() {
    this.isOpen = false;
    this.enableBodyScroll();
    this.closed.emit();
  }

  getModalClasses(): string {
    const baseClasses = 'relative bg-white rounded-2xl shadow-xl transform transition-all';

    const sizeClasses = {
      sm: 'max-w-sm w-full',
      md: 'max-w-md w-full',
      lg: 'max-w-2xl w-full',
      xl: 'max-w-4xl w-full',
      full: 'max-w-7xl w-full mx-4'
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  private disableBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  private enableBodyScroll() {
    document.body.style.overflow = '';
  }
}
