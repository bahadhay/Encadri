import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <!-- Label -->
      <label *ngIf="label" [for]="inputId" class="block text-sm font-medium text-gray-700 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>

      <!-- Input wrapper -->
      <div class="relative">
        <!-- Leading icon -->
        <div *ngIf="leadingIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span [innerHTML]="leadingIcon" class="text-gray-400"></span>
        </div>

        <!-- Input -->
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [(ngModel)]="value"
          (blur)="onTouched()"
          [class]="getInputClasses()"
          [ngClass]="{
            'pl-10': leadingIcon,
            'pr-10': trailingIcon || error
          }" />

        <!-- Trailing icon -->
        <div *ngIf="trailingIcon && !error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span [innerHTML]="trailingIcon" class="text-gray-400"></span>
        </div>

        <!-- Error icon -->
        <div *ngIf="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <!-- Helper text or error message -->
      <p *ngIf="helperText && !error" class="mt-2 text-sm text-gray-500">
        {{ helperText }}
      </p>
      <p *ngIf="error" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string;
  @Input() helperText?: string;
  @Input() error = false;
  @Input() errorMessage?: string;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() leadingIcon?: string;
  @Input() trailingIcon?: string;
  @Input() inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  private _value = '';

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this._value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getInputClasses(): string {
    const baseClasses = 'block w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';

    const stateClasses = this.error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

    const disabledClasses = this.disabled
      ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
      : 'bg-white text-gray-900';

    return `${baseClasses} ${stateClasses} ${disabledClasses}`;
  }
}
