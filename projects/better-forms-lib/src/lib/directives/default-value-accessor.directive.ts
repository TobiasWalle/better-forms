import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DefaultValueAccessorDirective),
  multi: true
};

@Directive({
  /* tslint:disable-next-line */
  selector: 'input:not([type=checkbox])[betterFormName],textarea[betterFormName]',
  /* tslint:disable-next-line */
  host: {
    '(input)': '$any(this)._handleInput($event.target.value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': '$any(this)._compositionStart()',
    '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
  },
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class DefaultValueAccessorDirective extends DefaultValueAccessor {
}
