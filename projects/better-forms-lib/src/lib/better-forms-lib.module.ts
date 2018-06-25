import { NgModule } from '@angular/core';
import { DefaultValueAccessorDirective } from './directives/default-value-accessor.directive';
import { FormDirective } from './directives/form.directive';
import { NameDirective } from './directives/name.directive';

@NgModule({
  imports: [],
  declarations: [
    NameDirective,
    FormDirective,
    DefaultValueAccessorDirective
  ],
  exports: [
    NameDirective,
    FormDirective,
    DefaultValueAccessorDirective
  ]
})
export class BetterFormsLibModule {
}
