import { ControlValueAccessor } from '@angular/forms';

export function createMockValueAccessor(): ControlValueAccessor {
  return {
    writeValue: jest.fn(),
    registerOnChange: jest.fn(),
    registerOnTouched: jest.fn(),
    setDisabledState: jest.fn(),
  };
}
