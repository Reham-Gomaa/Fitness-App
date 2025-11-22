// Core
import { Component, input } from '@angular/core';

// Inputs
import { AbstractControl } from '@angular/forms';

// Transilation
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'lib-fitness-input-error-handeling',
  imports: [TranslatePipe],
  templateUrl: './fitness-input-error-handeling.html',
  styleUrl: './fitness-input-error-handeling.scss',
})
export class FitnessInputErrorHandeling {
  control = input.required<AbstractControl>();

  readonly passwordPattern =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&\\)]).{8,}$";
    
  readonly phonePattern = '/^(\\+201|01)[0125][0-9]{8}$/';
}
