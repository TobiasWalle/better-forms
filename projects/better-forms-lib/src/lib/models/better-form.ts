import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { getByPath, setImmutable } from '../utils/update.utils';

export interface UpdateInformation {
  /** The path that has been updated */
  path: string[];
  /** The new value of the path */
  newValue: any;
}

export interface BetterFormOptions<T> {
  initialValue: T;
}

export class BetterForm<T> {
  private valueSubject: BehaviorSubject<T>;
  public valueChange: Observable<T>;

  private onUpdateSubject: Subject<UpdateInformation> = new Subject<UpdateInformation>();

  /**
   * Observable that updates every time a value gets updated. It provides information
   * about the update like the updated path or value.
   */
  public onUpdate: Observable<UpdateInformation> = this.onUpdateSubject.asObservable();

  /** The current form value */
  public get value(): T {
    return this.valueSubject.value;
  }

  constructor(options: BetterFormOptions<T>) {
    this.valueSubject = new BehaviorSubject<T>(options.initialValue);
    this.valueChange = this.valueSubject.asObservable();
  }

  /** Override the current form value with a new one */
  public setValue(value: T): void {
    this.triggerUpdate([], value);
  }

  /**
   * Update a specific part of the form value.
   * Use with caution, as this operation is not typesafe yet.
   * @param {string[]} path The path to update
   * @param value The new value for the path.
   */
  public updatePath(path: string[], value: any): void {
    this.triggerUpdate(path, value);
  }

  /**
   * Get a specific value in the form.
   * Use with caution, as this operation is not typesafe yet.
   * @param {string[]} path The path to get the value from.
   * @returns {any} The value behind the path.
   */
  public getByPath(path: string[]): any {
    return getByPath(this.value, path);
  }

  private triggerUpdate(path: string[], newValue: any): void {
    const newFormValue = setImmutable(this.value, path, newValue);
    this.valueSubject.next(newFormValue);
    this.onUpdateSubject.next({ path, newValue });
  }
}
