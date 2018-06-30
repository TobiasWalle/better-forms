import { ControlValueAccessor } from '@angular/forms';
import { createMockValueAccessor } from '../utils/test.utils';
import { FormDirective } from './form.directive';
import { NameDirective } from './name.directive';

describe('NameDirective', () => {
  let directive!: NameDirective;

  const mockForm: FormDirective = {
    register: jest.fn(),
    unregister: jest.fn(),
  } as any;
  const mockValueAccessors: ControlValueAccessor[] = [
    createMockValueAccessor()
  ];

  beforeEach(() => {
    directive = new NameDirective(
      mockForm,
      mockValueAccessors,
      null
    );
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should throw an error if the value accessors are null or empty', () => {
    expect(() => new NameDirective(mockForm, null, null)).toThrowErrorMatchingSnapshot();
    expect(() => new NameDirective(mockForm, [], null)).toThrowErrorMatchingSnapshot();
  });

  describe('#ngOnInit', () => {
    it('should register with name', async () => {
      directive.betterFormName = 'my-name';
      await directive.ngOnInit();

      expect(mockForm.register).toHaveBeenCalledWith('my-name', mockValueAccessors[0], []);
    });

    it('should throw an error if name is not set', async () => {
      directive.betterFormName = undefined;

      await expect(directive.ngOnInit()).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('#ngOnInit', () => {
    it('should unregister', () => {
      directive.betterFormName = 'my-name';
      directive.ngOnDestroy();

      expect(mockForm.unregister).toHaveBeenCalledWith('my-name');
    });

    it('should throw an error if name is not set', () => {
      directive.betterFormName = undefined;

      expect(() => directive.ngOnDestroy()).toThrowErrorMatchingSnapshot();
    });
  });
});
