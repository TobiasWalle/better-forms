import { Component } from '@angular/core';
import { BetterForm } from '../../projects/better-forms-lib/src/lib/models/better-form';

interface User {
  firstName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form = new BetterForm<User>({
    initialValue: {
      firstName: 'Tobias'
    }
  });
}
