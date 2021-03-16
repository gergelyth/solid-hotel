export function NotEmptyItem<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined;
}
