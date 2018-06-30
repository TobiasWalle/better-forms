import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { shallowMergeObjects } from '../utils/shallow-merge-objects';
import { splitName } from '../utils/split-name';
import { getByPath, setImmutable } from '../utils/update.utils';
import { NgValidator } from './ng-validators';
import { resolveAsync } from './resolve-async';

export type Errors = Record<string, Record<string, ValidationErrors> | undefined>;

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
  private _value: T;
  public valueChange: Observable<T>;

  private onUpdateSubject: Subject<UpdateInformation> = new Subject<UpdateInformation>();

  /**
   * Observable that updates every time a value gets updated. It provides information
   * about the update like the updated path or value.
   */
  public onUpdate: Observable<UpdateInformation> = this.onUpdateSubject.asObservable();

  /**
   * A mapping for the errors in the form. It has the following form:
   * { [name]: { [errorName]: errorMessage } }
   * @returns {Errors} A mapping of all the form errors
   */
  public get errors(): Errors {
    return this._errors;
  }

  private _errors: Errors = {};
  private errorsSubject = new BehaviorSubject(this._errors);
  public errorsChange: Observable<Errors> = this.errorsSubject.asObservable();

  private validationsFunctions: Record<string, NgValidator[]> = {};


  /** The current form value */
  public get value(): T {
    return this._value;
  }

  constructor(options: BetterFormOptions<T>) {
    this._value = options.initialValue;
    this.valueSubject = new BehaviorSubject<T>(options.initialValue);
    this.valueChange = this.valueSubject.asObservable();
  }

  /** Override the current form value with a new one */
  public async setValue(value: T): Promise<void> {
    await this.triggerUpdate([], value);
  }

  /**
   * Update a specific part of the form value.
   * Use with caution, as this operation is not typesafe yet.
   * @param {string[]} path The path to update
   * @param value The new value for the path.
   */
  public async updatePath(path: string[], value: any): Promise<void> {
    await this.triggerUpdate(path, value);
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

  private async triggerUpdate(path: string[], newValue: any): Promise<void> {
    const newFormValue = setImmutable(this.value, path, newValue);
    this._value = newFormValue;
    await this.updateValidationErrors(path);
    this.valueSubject.next(newFormValue);
    this.onUpdateSubject.next({ path, newValue });
  }

  /**
   * Set the validators for a specific path
   * @param {string[]} path The path to set the validators for
   * @param {NgValidator[]} validators The validators to set
   */
  public async setValidators(path: string[], validators: NgValidator[]): Promise<void> {
    this.validationsFunctions[path.join('.')] = validators;
    await this.updateValidationErrors(path);
  }

  /**
   * Remove all validators from a specific path
   * @param {string[]} path The path to remove the validators from
   */
  public removeValidators(path: string[]): void {
    const name = path.join('.');
    delete this.validationsFunctions[name];
    delete this._errors[name];
  }

  private async updateValidationErrors(pathPrefix: string[]): Promise<void> {
    const namePrefix = pathPrefix.join('.');
    await Promise.all(
      Object.keys(this.validationsFunctions)
      .filter((name: string) => name.startsWith(namePrefix))
      .map(name => ({name, validators: this.validationsFunctions[name]}))
      .map(async ({name, validators}) => {
        const error = await validateAll(this.getByPath(splitName(name)), validators);
        if (error) {
          this._errors[name] = error;
        } else {
          delete this._errors[name];
        }
      })
    );
    this.errorsSubject.next(this._errors);
  }
}

async function validateAll(value: any, validators: NgValidator[]): Promise<ValidationErrors | null> {
  const validationResults = await Promise.all(validators.map(validator => validate(value, validator)));
  const errors = validationResults.filter(error => error != null);
  if (errors.length > 0) {
    return shallowMergeObjects(errors);
  } else {
    return null;
  }
}

function validate(value: any, validator: NgValidator): Promise<ValidationErrors | null> {
  const fakeControl: AbstractControl = { value } as any;
  if (isValidator(validator)) {
    return resolveAsync(validator.validate(fakeControl));
  } else {
    return resolveAsync(validator(fakeControl));
  }
}

function isValidator(validator: NgValidator): validator is Validator {
  return typeof validator === 'object' && 'validate' in validator;
}
