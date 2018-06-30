import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, RequiredValidator } from '@angular/forms';

const REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyRequiredValidatorDirective),
  multi: true,
};

@Directive({
  /* tslint:disable-next-line */
  selector: ':not([type=checkbox])[required][betterFormName]',
  providers: [REQUIRED_VALIDATOR],
})
export class MyRequiredValidatorDirective extends RequiredValidator {
}
