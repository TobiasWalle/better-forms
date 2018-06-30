import { isObservable, Observable } from 'rxjs';

export async function resolveAsync<T>(value: T | Promise<T> | Observable<T>): Promise<T> {
  if (isObservable(value)) {
    return await (value as Observable<T>).toPromise();
  } else {
    return value;
  }
}
