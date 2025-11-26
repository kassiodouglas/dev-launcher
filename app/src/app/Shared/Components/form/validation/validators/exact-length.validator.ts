import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exactLength(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null || value === '') return null; // não valida campo vazio (use required separadamente)

    return value.length === length
      ? null
      : { exactLength: { requiredLength: length, actualLength: value.length } };
  };
}
