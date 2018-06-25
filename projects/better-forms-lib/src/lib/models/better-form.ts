import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { getByPath, setImmutable } from '../utils/update-immutable';

interface UpdateInformation {
  path: string[];
  newValue: any;
}

interface BetterFormOptions<T> {
  initialValue: T;
}

export class BetterForm<T> {
  private valueSubject: BehaviorSubject<T>;
  public valueChange: Observable<T>;

  private onUpdateSubject: Subject<UpdateInformation> = new Subject<UpdateInformation>();
  public onUpdate: Observable<UpdateInformation> = this.onUpdateSubject.asObservable();

  public get value(): T {
    return this.valueSubject.value;
  }

  constructor(options: BetterFormOptions<T>) {
    this.valueSubject = new BehaviorSubject<T>(options.initialValue);
    this.valueChange = this.valueSubject.asObservable();
  }

  public setValue(value: T): void {
    this.triggerUpdate([], value);
  }

  public updatePath(path: string[], value: any): void {
    this.triggerUpdate(path, value);
  }

  public getByPath(path: string[]): any {
    return getByPath(this.value, path);
  }

  private triggerUpdate(path: string[], newValue: any): void {
    const newFormValue = setImmutable(this.value, path, newValue);
    this.valueSubject.next(newFormValue);
    this.onUpdateSubject.next({ path, newValue });
  }
}
