import { of } from 'rxjs';
import { resolveAsync } from './resolve-async';

describe('resolveAsync', () => {
  it('should work', async () => {
    expect(await resolveAsync(of(1))).toBe(1);
    expect(await resolveAsync(Promise.resolve(2))).toBe(2);
    expect(await resolveAsync(3)).toBe(3);
  });
});
