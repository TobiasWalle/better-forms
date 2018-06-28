import { Directive, forwardRef, HostListener } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DefaultValueAccessorDirective),
  multi: true
};

@Directive({
  /* tslint:disable-next-line */
  selector: 'input:not([type=checkbox]):not([type=number])[betterFormName],textarea[betterFormName]',
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class DefaultValueAccessorDirective extends DefaultValueAccessor {
  @HostListener('input', ['$event'])
  public handleInput(event: KeyboardEvent): void {
    (this as any)._handleInput((event.target as any).value);
  }

  @HostListener('blur')
  public handleBlur(): void {
    this.onTouched();
  }

  @HostListener('compositionstart')
  public handleCompositionStart(): void {
    (this as any)._compositionStart();
  }

  @HostListener('compositionend', ['$event'])
  public handleCompositionEnd(event: CompositionEvent): void {
    (this as any)._compositionEnd((event.target as any).value);
  }
}
