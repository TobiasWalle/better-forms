import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '@angular/forms';
import { getLatestValue } from '../utils/test.utils';
import { BetterForm, Errors } from './better-form';
import { SyncNgValidator } from './ng-validators';

interface TestValue {
  a?: number;
  b?: {
    c: string;
  };
}

const greater5: ValidatorFn = (control) => (control.value > 5 ? null : { greater5: 'Has to be greater 5' });
const smaller3: ValidatorFn = (control) => (control.value < 3 ? null : { smaller3: 'Has to be smaller 3' });
const isString: ValidatorFn = (control) => (typeof control.value === 'string' ? null : { isString: 'Has to be string' });

const makeAsync = (func: ValidatorFn): AsyncValidatorFn => control => new Promise(
  resolve => setTimeout(
    () => {
      resolve(func(control));
    },
    10
  ));
const asyncGreater5: AsyncValidatorFn = makeAsync(greater5);
const asyncIsString: AsyncValidatorFn = makeAsync(isString);

describe('BetterForm', () => {
  const initialValue: TestValue = Object.freeze({
    a: 1,
    b: {
      c: 'test'
    }
  });
  let form!: BetterForm<TestValue>;

  beforeEach(() => {
    form = new BetterForm({ initialValue });
  });

  describe('#init', () => {
    it('should be initializable with validation schema', async () => {
      form = new BetterForm({
        initialValue: {
          a: 2,
          b: {
            c: 0 as any
          }
        },
        validationSchema: {
          'a': [greater5],
          'b.c': [isString]
        }
      });
      await form.isReady;

      expect(form.errors).toEqual({
        'a': { greater5: 'Has to be greater 5' },
        'b.c': { isString: 'Has to be string' },
      });
    });
  });

  describe('#value', () => {
    it('should return the current value', () => {
      expect(form.value).toEqual(initialValue);
    });
  });

  describe('#setValue', () => {
    it('should set a new value', async () => {
      const newValue: TestValue = {
        b: {
          c: 'otherTest'
        }
      };
      await form.setValue(newValue);

      expect(form.value).toEqual(newValue);
    });
  });

  describe('#updatePath', () => {
    it('should update a value based on the path', async () => {
      await form.updatePath(['b', 'c'], 'update');

      expect(form.value).toEqual({
        ...initialValue,
        b: {
          c: 'update'
        }
      });
    });

    it('should not throw an error if the path does not exists', () => {
      return expect(form.updatePath(['b', 'd'], 'update')).resolves.toBe(undefined);
    });
  });

  describe('#getByPath', () => {
    it('should get a value by the path', () => {
      expect(form.getByPath(['b', 'c'])).toBe('test');
    });

    it('should throw an error if the value does not exists', () => {
      expect(() => form.getByPath(['b', 'd'])).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#valueChange', () => {
    async function expectValueChangeToBeTriggeredWith(value: TestValue) {
      expect(await getLatestValue(form.valueChange)).toEqual(value);
    }

    it('should trigger on setValue', async () => {
      await expectValueChangeToBeTriggeredWith(initialValue);

      const newValue: TestValue = { b: { c: 'c' } };
      await form.setValue(newValue);

      await expectValueChangeToBeTriggeredWith(newValue);
    });

    it('should trigger on updatePath', async () => {
      await expectValueChangeToBeTriggeredWith(initialValue);

      const newValue: TestValue = {
        ...initialValue,
        b: { c: 'c' }
      };
      await form.updatePath(['b', 'c'], 'c');

      await expectValueChangeToBeTriggeredWith(newValue);
    });
  });

  describe('#errorsChange', () => {
    const equal1Error = { greater1: 'The value has to be greater 1' };
    const equal1: SyncNgValidator = control => control.value === 1 ? null : equal1Error;

    async function expectErrorChangeToBeTriggeredWith(errors: Errors) {
      expect(await getLatestValue(form.errorsChange)).toEqual(errors);
    }

    it('should trigger on setValue', async () => {
      await form.setValidators(['a'], [equal1]);
      await expectErrorChangeToBeTriggeredWith({});

      await form.setValue({ a: 2 });

      await expectErrorChangeToBeTriggeredWith({ a: equal1Error });
    });

    it('should trigger on register validator', async () => {
      await form.setValue({ a: 2 });
      await expectErrorChangeToBeTriggeredWith({});

      await form.setValidators(['a'], [equal1]);

      await expectErrorChangeToBeTriggeredWith({ a: equal1Error });
    });
  });

  describe('#onUpdate', () => {
    let onUpdateCallback: jest.Mock;

    beforeEach(() => {
      onUpdateCallback = jest.fn();
      form.onUpdate.subscribe(onUpdateCallback);
    });

    it('should trigger on setValue', async () => {
      expect(onUpdateCallback).not.toHaveBeenCalled();

      const newValue: TestValue = { b: { c: 'c' } };
      await form.setValue(newValue);

      expect(onUpdateCallback).toHaveBeenCalledWith({
        path: [],
        newValue
      });
    });

    it('should trigger on updatePath', async () => {
      expect(onUpdateCallback).not.toHaveBeenCalled();

      await form.updatePath(['b', 'c'], 'c');

      expect(onUpdateCallback).toHaveBeenCalledWith({
        path: ['b', 'c'],
        newValue: 'c'
      });
    });
  });

  describe('#errors & #setValidators & #removeValidators', () => {

    it('should validate', async () => {
      await form.setValidators(['a'], [greater5, isString]);

      expect(form.errors).toEqual({
        'a': {
          greater5: 'Has to be greater 5',
          isString: 'Has to be string'
        }
      });

      await form.updatePath(['a'], 10);

      expect(form.errors).toEqual({
        'a': {
          isString: 'Has to be string'
        }
      });

      form.removeValidators(['a']);

      expect(form.errors).toEqual({});
    });

    it('should work in combination with schema', async () => {
      form = new BetterForm({
        initialValue: {
          a: 4,
          b: {
            c: 0 as any
          }
        },
        validationSchema: {
          'a': [smaller3],
        }
      });
      await form.setValidators(['a'], [greater5, isString]);

      expect(form.errors).toEqual({
        'a': {
          greater5: 'Has to be greater 5',
          smaller3: 'Has to be smaller 3',
          isString: 'Has to be string'
        }
      });
    });

    it('should work with validator objects', async () => {
      const validate: Validator = {
        validate: greater5,
      };

      await form.setValidators(['a'], [validate]);

      expect(form.errors).toEqual({
        'a': {
          greater5: 'Has to be greater 5',
        }
      });
    });

    it('should work with async validators', async () => {
      await form.setValidators(['a'], [asyncGreater5, asyncIsString]);

      expect(form.errors).toEqual({
        'a': {
          greater5: 'Has to be greater 5',
          isString: 'Has to be string'
        }
      });

      await form.updatePath(['a'], 10);

      expect(form.errors).toEqual({
        'a': {
          isString: 'Has to be string'
        }
      });

      form.removeValidators(['a']);

      expect(form.errors).toEqual({});
    });

    it('should work with async validator objects', async () => {
      const validate: AsyncValidator = {
        validate: asyncGreater5 as any,
      };

      await form.setValidators(['a'], [validate]);

      expect(form.errors).toEqual({
        'a': {
          greater5: 'Has to be greater 5',
        }
      });
    });
  });
});
