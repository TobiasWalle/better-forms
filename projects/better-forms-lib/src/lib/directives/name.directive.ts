import { Directive, Host, Inject, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormDirective } from './form.directive';

@Directive({
  selector: '[betterFormName]'
})
export class NameDirective implements OnInit, OnDestroy {
  @Input()
  public betterFormName?: string;

  private readonly valueAccessor: ControlValueAccessor;

  constructor(
    @Host() private form: FormDirective,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[] | null,
  ) {
    this.valueAccessor = selectValueAccessor(valueAccessors);
  }

  /** @inheritDoc */
  public ngOnInit(): void {
    this.form.registerControlValueAccessor(this.getName(), this.valueAccessor);
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    this.form.unregisterControlValueAccessor(this.getName());
  }

  private getName(): string {
    if (!this.betterFormName) {
      throw new Error('The "betterFormName" Input is required');
    }
    return this.betterFormName;
  }
}

function selectValueAccessor(valueAccessors: ControlValueAccessor[] | null): ControlValueAccessor {
  if (valueAccessors == null || valueAccessors.length === 0) {
    throw new Error('No ValueAccessor found');
  }
  return valueAccessors[0];
}
