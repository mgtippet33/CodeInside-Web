import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
export class CommonValidators {
    // Validates there are no whitespaces
    public static noWhiteSpace(control: FormControl): ValidationErrors {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
    }

    // Email validation exactly like the backend
    public static emailPattern(control: FormControl): ValidationErrors {
        if (control.value?.trim().length === 0) { return null; }
        const emailReg = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,})+)$/;
        return emailReg.test(control.value) ? null : { emailPattern: true };
    }

    // Password validation: Minimum eight characters, at least one letter and one number
    public static passwordPattern(control: FormControl): ValidationErrors {
        if (control.value?.trim().length === 0) { return null; }
        const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordReg.test(control.value) ? null : { passwordPattern: true };
    }

    // Date validation
    public static datePattern(control: FormControl): ValidationErrors {
        if (control.value?.trim().length === 0) { return null; }
        const dateReg = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        return dateReg.test(control.value) ? null : { datePattern: true };
    }

    public static matchingFieldsValidator(controlName: string, matchingControlName: string): ValidationErrors {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.emailValidators) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ fieldsMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    // custom validator to check that two fields do not match
    public static nonMatchingFieldsValidator(controlName: string, nonMatchingField: string): ValidationErrors {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const nonMatchingFieldControl = formGroup.controls[nonMatchingField];
            if (nonMatchingFieldControl.errors && !nonMatchingFieldControl.errors.emailValidators) {
                // return if another validator has already found an error on the nonMatchingFieldControl
                return;
            }
            // set error on matchingControl if validation fails
            if ((control.value === nonMatchingFieldControl.value) && nonMatchingFieldControl.value !== '') {
                nonMatchingFieldControl.setErrors({ nonMatchingField: true });
            } else {
                nonMatchingFieldControl.setErrors(null);
            }
        };
    }
}