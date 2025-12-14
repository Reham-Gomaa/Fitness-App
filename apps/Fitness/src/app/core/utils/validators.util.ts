import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function passwordMatchValidator(
    passwordKey: string,
    confirmPasswordKey: string
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(passwordKey)?.value;
        const confirmPassword = control.get(confirmPasswordKey)?.value;

        if (!password || !confirmPassword) {
            return null;
        }

        return password === confirmPassword ? null : {passwordMismatch: true};
    };
}
