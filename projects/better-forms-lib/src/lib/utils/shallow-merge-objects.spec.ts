import { shallowMergeObjects } from './shallow-merge-objects';

describe('shallowMergeObjects', () => {
  it('should shallow merge a list of objects', () => {
    const objects = [
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: { a: 1 } },
      { d: { b: 1 } },
    ];
    const expectedObject = {
      a: 1,
      b: 2,
      c: 3,
      d: { b: 1 },
    };

    expect(shallowMergeObjects(objects)).toEqual(expectedObject);
  });
});
