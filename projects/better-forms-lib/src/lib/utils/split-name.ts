export function splitName(path: string): string[] {
  return path.split('.').filter(s => s !== '');
}
