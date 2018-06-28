import { NgModule } from '@angular/core';
import { DefaultValueAccessorDirective } from './directives/default-value-accessor.directive';
import { FormDirective } from './directives/form.directive';
import { NameDirective } from './directives/name.directive';
import { NumberValueAccessorDirective } from './directives/number-value-accessor.directive';

@NgModule({
  imports: [],
  declarations: [
    NameDirective,
    FormDirective,
    DefaultValueAccessorDirective,
    NumberValueAccessorDirective,
  ],
  exports: [
    NameDirective,
    FormDirective,
    DefaultValueAccessorDirective,
    NumberValueAccessorDirective,
  ]
})
export class BetterFormsLibModule {
}
