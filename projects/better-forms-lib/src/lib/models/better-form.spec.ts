import { getLatestValue } from '../utils/test.utils';
import { BetterForm, UpdateInformation } from './better-form';

interface TestValue {
  a?: number;
  b: {
    c: string;
  };
}

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

  describe('#value', () => {
    it('should return the current value', () => {
      expect(form.value).toEqual(initialValue);
    });
  });

  describe('#setValue', () => {
    it('should set a new value', () => {
      const newValue: TestValue = {
        b: {
          c: 'otherTest'
        }
      };
      form.setValue(newValue);

      expect(form.value).toEqual(newValue);
    });
  });

  describe('#updatePath', () => {
    it('should update a value based on the path', () => {
      form.updatePath(['b', 'c'], 'update');

      expect(form.value).toEqual({
        ...initialValue,
        b: {
          c: 'update'
        }
      });
    });

    it('should not throw an error if the path does not exists', () => {
      expect(() => form.updatePath(['b', 'd'], 'update')).not.toThrowError();
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

      const newValue: TestValue = { b: { c: 'c' }};
      form.setValue(newValue);

      await expectValueChangeToBeTriggeredWith(newValue);
    });

    it('should trigger on updatePath', async () => {
      await expectValueChangeToBeTriggeredWith(initialValue);

      const newValue: TestValue = {
        ...initialValue,
        b: { c: 'c' }
      };
      form.updatePath(['b', 'c'], 'c');

      await expectValueChangeToBeTriggeredWith(newValue);
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

      const newValue: TestValue = { b: { c: 'c' }};
      form.setValue(newValue);

      expect(onUpdateCallback).toHaveBeenCalledWith({
        path: [],
        newValue
      });
    });

    it('should trigger on updatePath', async () => {
      expect(onUpdateCallback).not.toHaveBeenCalled();

      form.updatePath(['b', 'c'], 'c');

      expect(onUpdateCallback).toHaveBeenCalledWith({
        path: ['b', 'c'],
        newValue: 'c'
      });
    });
  });
});
