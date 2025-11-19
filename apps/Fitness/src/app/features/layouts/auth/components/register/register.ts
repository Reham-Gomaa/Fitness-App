// Core
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared-components
import { FitnessInput, FitnessInputGender, Gender, FitnessInputSlider, FitnessFormRadio, RadioItem } from '@fitness-app/fitness-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FitnessInputGender,
    FitnessInput,
    RouterModule,
    FitnessInputSlider,
    FitnessFormRadio
],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;


  radioConfig: RadioItem[] = [
    { value: 'Gain weight', label: 'Gain weight' },
    { value: 'lose weight', label: 'lose weight' },
    { value: 'Get fitter', label: 'Get fitter' },
    { value: 'Gain more flexible', label: 'Gain more flexible' },
  ]

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.registerForm.valid) {
      console.log('Form Data:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onGenderChange(gender: Gender) {
    console.log('Selected gender:', gender);
  }

  onWeightChanged(newWeight: number): void {
    console.log('Weight changed to:', newWeight);
  }

  onActivityLevelChanged(newActivityLevel: string): void {
    console.log('Activity level changed to:', newActivityLevel);
  }
}
