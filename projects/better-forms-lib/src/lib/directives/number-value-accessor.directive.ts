import { Directive, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DefaultValueAccessorDirective } from './default-value-accessor.directive';

export const NUMBER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberValueAccessorDirective),
  multi: true
};

@Directive({
  /* tslint:disable-next-line */
  selector: 'input[type=number][betterFormName]',
  providers: [NUMBER_VALUE_ACCESSOR],
})
export class NumberValueAccessorDirective extends DefaultValueAccessorDirective {
  @HostListener('input', ['$event'])
  public handleInput(event: KeyboardEvent): void {
    const target: HTMLInputElement = event.target as any;
    let value: string | null = target.value;
    if (value === '') {
      if (target.validity.badInput) {
        return;
      } else {
        value = null;
      }
    }
    (this as any)._handleInput(value);
  }

  /** @inheritDoc */
  public registerOnChange(fn: (value: number | string | null) => void): void {
    this.onChange = (value: string | null) => {
      if (value === '' || value == null) {
        return fn(null);
      }
      const parsedNumber = parseFloat(value);
      if (isNaN(parsedNumber)) {
        return fn(value);
      } else {
        return fn(parsedNumber);
      }
    };
  }
}
