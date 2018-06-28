import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export function createMockValueAccessor(): ControlValueAccessor {
  return {
    writeValue: jest.fn(),
    registerOnChange: jest.fn(),
    registerOnTouched: jest.fn(),
    setDisabledState: jest.fn(),
  };
}

export async function getLatestValue<T>(observable: Observable<T>): Promise<T> {
  return await observable.pipe(take(1)).toPromise();
}
