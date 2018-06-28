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
        first: 'Max',
        last: 'Mustermann',
      },
      age: 20
    }
  });

  constructor() {
    this.form.valueChange.subscribe(newValue => console.log(newValue));
    this.form.onUpdate.subscribe(update => console.log(update));
  }
}
