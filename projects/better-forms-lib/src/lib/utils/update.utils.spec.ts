import { getByPath, setImmutable } from './update.utils';

describe('setImmutable', () => {
  it('should update an object', () => {
    const object = Object.freeze({
      a: {
        b: 1
      },
      c: 2
    });

    const newObject = setImmutable(object, ['a', 'b'], 2);

    expect(object).toEqual(({
      a: {
        b: 1
      },
      c: 2
    }));
    expect(newObject).toEqual({
      a: {
        b: 2
      },
      c: 2
    });
  });

  it('should update an path that is not defined', () => {
    const object = Object.freeze({
      a: {
        b: 1
      },
      c: 2
    });

    const newObject = setImmutable(object, ['d'], 3);

    expect(newObject).toEqual({
      a: {
        b: 1
      },
      c: 2,
      d: 3
    });
  });

  it('should update arrays', () => {
    const object = Object.freeze({
      a: [],
    });

    let newObject = setImmutable(object, ['a', '0'], 2);

    expect(newObject).toEqual({
      a: [2]
    });

    newObject = setImmutable(object, ['a', '0'], 3);

    expect(newObject).toEqual({
      a: [3]
    });

    newObject = setImmutable(object, ['a', '0'], undefined);

    expect(newObject).toEqual({
      a: [undefined]
    });
  });
});

describe('getByPath', () => {
  it('should get a value by the path', () => {
    expect(getByPath({ a: { b: 1 } }, ['a', 'b'])).toBe(1);
  });

  it('should throw error if the path does not exists', () => {
    expect(() => getByPath({ a: { b: 1 } }, ['a', 'c'])).toThrowErrorMatchingSnapshot();
  });

  it('should not throw error if the path is undefined', () => {
    expect(getByPath({ a: { b: undefined } }, ['a', 'b'])).toBe(undefined);
  });
});
