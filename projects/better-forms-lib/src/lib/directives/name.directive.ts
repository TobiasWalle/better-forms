import { Directive, Host, Inject, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgValidator, SyncNgValidator } from '../models/ng-validators';
import { FormDirective } from './form.directive';

@Directive({
  selector: '[betterFormName]'
})
export class NameDirective implements OnInit, OnDestroy {
  @Input()
  public betterFormName?: string;

  private readonly valueAccessor: ControlValueAccessor;
  private readonly validators: NgValidator[];

  constructor(
    @Host() private form: FormDirective,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[] | null,
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: SyncNgValidator[] | null,
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: SyncNgValidator[] | null,
  ) {
    this.valueAccessor = selectValueAccessor(valueAccessors);
    this.validators = [
      ...(validators || []),
      ...(asyncValidators || [])
    ];
  }

  /** @inheritDoc */
  public async ngOnInit(): Promise<void> {
    await this.form.register(this.getName(), this.valueAccessor, this.validators);
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    this.form.unregister(this.getName());
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
