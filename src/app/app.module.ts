import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BetterFormsLibModule } from '../../projects/better-forms-lib/src/lib/better-forms-lib.module';

import { AppComponent } from './app.component';
import { MyRequiredValidatorDirective } from './required.directive';

@NgModule({
  declarations: [
    MyRequiredValidatorDirective,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BetterFormsLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
