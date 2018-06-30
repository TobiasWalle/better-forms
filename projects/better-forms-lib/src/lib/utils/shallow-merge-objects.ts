export function shallowMergeObjects<T>(objects: T[]): T {
  return objects.reduce((object, nextObject) => {
    return {
      ...object,
      ...nextObject
    };
  }, {});
}
