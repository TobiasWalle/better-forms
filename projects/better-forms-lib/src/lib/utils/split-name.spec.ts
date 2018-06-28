import { splitName } from './split-name';

describe('splitName', () => {
  it('should split a path', () => {
    expect(splitName('a.b.c')).toEqual(['a', 'b', 'c']);
  });

  it('should split a empty path', () => {
    expect(splitName('')).toEqual([]);
  });
});
