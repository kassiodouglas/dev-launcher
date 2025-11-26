import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateBeforeOrEqual(laterField: string, earlierField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const later = group.get(laterField)?.value;
    const earlier = group.get(earlierField)?.value;

    if (!later || !earlier) return null;

    const dateLater = new Date(later);
    const dateEarlier = new Date(earlier);

    if (dateLater > dateEarlier) {
      group.get(laterField)?.setErrors({ dateBeforeOrEqual: { earlierField } });
      return { dateBeforeOrEqual: { laterField, earlierField } };
    } else {
      if (group.get(laterField)?.hasError('dateBeforeOrEqual')) {
        group.get(laterField)?.setErrors(null);
      }
      return null;
    }
  };
}
