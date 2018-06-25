import { BetterForm } from '../models/better-form';
import { createMockValueAccessor } from '../utils/test.utils';
import { FormDirective } from './form.directive';

interface User {
  name: {
    first: string;
    last: string;
  };
  age: number;
}

describe('FormDirective', () => {
  const initialValue: User = {
    name: {
      first: 'Michael',
      last: 'Schmidt'
    },
    age: 30
  };
  let directive: FormDirective;

  beforeEach(() => {
    directive = new FormDirective();
    directive.betterForm = new BetterForm<User>({ initialValue });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should throw an error if the betterForm input is not set', () => {
    directive.betterForm = undefined;

    expect(() => directive.ngOnInit()).toThrowErrorMatchingSnapshot();
  });

  it('should register value accessors, update values and unregister', () => {
    directive.ngOnInit();

    const firstName = createMockValueAccessor();
    const age = createMockValueAccessor();
    directive.registerControlValueAccessor('name.first', firstName);
    directive.registerControlValueAccessor('age', age);

    expect(firstName.writeValue).toHaveBeenCalledWith('Michael');
    expect(age.writeValue).toHaveBeenCalledWith(30);
    expect(firstName.writeValue).toHaveBeenCalledTimes(1);
    expect(age.writeValue).toHaveBeenCalledTimes(1);

    directive.betterForm.updatePath(['age'], 21);

    expect(age.writeValue).toHaveBeenCalledWith(21);
    expect(firstName.writeValue).toHaveBeenCalledTimes(1);
    expect(age.writeValue).toHaveBeenCalledTimes(2);

    directive.betterForm.updatePath(['name', 'first'], 'Test');
    directive.betterForm.updatePath(['name', 'last'], 'LastName');

    expect(firstName.writeValue).toHaveBeenCalledWith('Test');
    expect(firstName.writeValue).toHaveBeenCalledTimes(2);
    expect(age.writeValue).toHaveBeenCalledTimes(2);

    directive.unregisterControlValueAccessor('age');

    directive.betterForm.updatePath(['age'], 20);
    expect(age.writeValue).toHaveBeenCalledTimes(2);
  });

  it('should throw error if valueAccessor is registered twice', () => {
    directive.ngOnInit();

    const age = createMockValueAccessor();
    directive.registerControlValueAccessor('age', age);

    expect(() => directive.registerControlValueAccessor('age', age)).toThrowErrorMatchingSnapshot();
  });
});
