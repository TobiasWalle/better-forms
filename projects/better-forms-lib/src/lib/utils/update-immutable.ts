const immutable: any = require('object-path-immutable');

export function setImmutable<T>(original: T, path: string[], newValue: any): T {
  return immutable.set(original, path, newValue);
}

export function getByPath<T>(object: T, path: string[]): any {
  return path.reduce((nextObject: any, key: string) => {
    if (key in nextObject) {
      return nextObject[key];
    }
    throw new Error(`Couldn't find "${path}" on object. "${key}" doesn not exists on ${nextObject}.`);
  }, object);
}

