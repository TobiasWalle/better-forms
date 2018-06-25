import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { BetterForm } from '../models/better-form';
import { splitName } from '../utils/split-name';

@Directive({
  selector: 'form[betterForm]'
})
export class FormDirective implements OnInit, OnDestroy {
  /**
   * An instance of the BetterForm class to control the form.
   * This input is required.
   */
  @Input()
  public betterForm?: BetterForm<any>;

  private valueAccessors: Record<string, ControlValueAccessor> = {};
  private onDestroy$ = new Subject<void>();

  /** @inheritDoc */
  public ngOnInit(): void {
    this.getForm().onUpdate.subscribe(update => {
      this.updateValueAccessors(update.path);
    });
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  /**
   * Register a new value accessor for the form
   * @param {string} name The name of the value accessor.
   * @param {ControlValueAccessor} valueAccessor The valueAccessor to set for the name
   */
  public registerControlValueAccessor(name: string, valueAccessor: ControlValueAccessor): void {
    if (this.valueAccessors[name]) {
      throw new Error(`Value Accessor with name "${name}" already registered`);
    }

    valueAccessor.registerOnChange((newValue: any) => this.onValueChange(name, newValue));
    this.valueAccessors[name] = valueAccessor;
    this.updateValueAccessors(splitName(name));
  }

  /**
   * Remove a registered value accessor.
   * @param {string} name The name of the value accessor to remove.
   */
  public unregisterControlValueAccessor(name: string): void {
    this.valueAccessors[name].registerOnChange(emptyFunction);
    delete this.valueAccessors[name];
  }

  private onValueChange(name: string, newValue: any): void {
    const path = splitName(name);
    this.getForm().updatePath(path, newValue);
  }

  private updateValueAccessors(updatedPath: string[] = []): void {
    const namePrefix = updatedPath.join('.');
    const form = this.getForm();
    Object.keys(this.valueAccessors)
      .filter(name => name.startsWith(namePrefix))
      .forEach(name => {
        const valueAccessor = this.valueAccessors[name];
        valueAccessor.writeValue(form.getByPath(splitName(name)));
      });
  }

  private getForm(): BetterForm {
    if (this.betterForm == null) {
      throw new Error('The Input "betterForm" is required');
    }
    return this.betterForm;
  }
}

function emptyFunction() {
}
