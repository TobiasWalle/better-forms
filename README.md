# BetterForms

A better form library for angular which provides:

* Immutability
* Easy form initialization and updates
* Typesafety

## Installation
> The package is still in development and it is not published yet. So installation is not working at the moment.
```bash
yarn add better-forms
```

## Usage

1. Import the module
```typescript
...
import { BetterFormsModule } from 'better-forms';

@NgModule({
  ...
  imports: [
    BetterFormsModule,
  ]
})
export class AppModule { }
```

2. In your component create a `BetterForm` instance to initialize the form.
```typescript
import { Component } from '@angular/core';
import { BetterForm } from '../../projects/better-forms-lib/src/lib/models/better-form';

interface User {
  name: {
    first: string;
    last: string;
  };
  age: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public form = new BetterForm<User>({
    initialValue: {
      name: {
        first: 'Jon',
        last: 'Smith',
      },
      age: 30
    }
  });
  
  constructor() {
    this.form.valueChange.subscribe(formValue => console.log(formValue));
  }
}
```

3. Use the form in you template with the given directives
```html
<form [betterForm]="form">
  <input type="text" betterFormName="name.first"/>
  <input type="text" betterFormName="name.last"/>
  <input type="number" betterFormName="age"/>
</form>
```
