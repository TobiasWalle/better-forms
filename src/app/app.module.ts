import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BetterFormsLibModule } from '../../projects/better-forms-lib/src/lib/better-forms-lib.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BetterFormsLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
