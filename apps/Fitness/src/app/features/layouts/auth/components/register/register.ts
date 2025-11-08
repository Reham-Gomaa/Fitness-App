// Core
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Shared-components
import { FitnessInput } from '@fitness-app/fitness-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FitnessInput],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;

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
}

