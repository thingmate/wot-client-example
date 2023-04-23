export function clampPageIndex(
  index: number,
  count: number,
): number {
  return Math.max(0, Math.min(count - 1, index));
}
