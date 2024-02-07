import { AbstractControl, ValidationErrors } from '@angular/forms';

export function discountPriceValidation(
  control: AbstractControl
): ValidationErrors | null {
  const field1 = control.get('price');
  const field2 = control.get('discountPrice');
  if (
    field2?.value != '' &&
    field2?.value != '' &&
    field1?.value <= field2?.value
  ) {
    return { inValidDiscountPrice: true };
  } else {
    return null;
  }
}
