import { ControlValueAccessor } from '@angular/forms';
import { createMockValueAccessor } from '../utils/test.utils';
import { FormDirective } from './form.directive';
import { NameDirective } from './name.directive';

describe('NameDirective', () => {
  let directive!: NameDirective;

  const mockForm: FormDirective = {
    registerControlValueAccessor: jest.fn(),
    unregisterControlValueAccessor: jest.fn(),
  } as any;
  const mockValueAccessors: ControlValueAccessor[] = [
    createMockValueAccessor()
  ];

  beforeEach(() => {
    directive = new NameDirective(
      mockForm,
      mockValueAccessors
    );
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should throw an error if the value accessors are null or empty', () => {
    expect(() => new NameDirective(mockForm, null)).toThrowErrorMatchingSnapshot();
    expect(() => new NameDirective(mockForm, [])).toThrowErrorMatchingSnapshot();
  });

  describe('#ngOnInit', () => {
    it('should register with name', () => {
      directive.betterFormName = 'my-name';
      directive.ngOnInit();

      expect(mockForm.registerControlValueAccessor).toHaveBeenCalledWith('my-name', mockValueAccessors[0]);
    });

    it('should throw an error if name is not set', () => {
      directive.betterFormName = undefined;

      expect(() => directive.ngOnInit()).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#ngOnInit', () => {
    it('should unregister', () => {
      directive.betterFormName = 'my-name';
      directive.ngOnDestroy();

      expect(mockForm.unregisterControlValueAccessor).toHaveBeenCalledWith('my-name');
    });

    it('should throw an error if name is not set', () => {
      directive.betterFormName = undefined;

      expect(() => directive.ngOnDestroy()).toThrowErrorMatchingSnapshot();
    });
  });
});
