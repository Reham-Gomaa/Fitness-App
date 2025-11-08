// Core
import { Component, forwardRef, inject, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
// Shared-components
import { FitnessInputErrorHandeling } from '../fitness-input-error-handeling/fitness-input-error-handeling';

// Translation
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-fitness-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FitnessInput),
      multi: true,
    },
  ],
  imports: [TranslateModule, FitnessInputErrorHandeling],
  templateUrl: './fitness-input.html',
  styleUrl: './fitness-input.scss',
})
export class FitnessInput implements ControlValueAccessor {
  private readonly _translate = inject(TranslateService);

  // Inputs
  id = input<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  labelText = input<string>();
  errorHandilgControl = input<AbstractControl>();

  showPassword = false;
  value = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputType() {
    if (this.type() === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }
}
