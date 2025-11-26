import { ValidatorFn, AbstractControl } from "@angular/forms";

export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) return null;
    return control.value === matchingControl.value
      ? null
      : { mustMatch: true };
  };
}
