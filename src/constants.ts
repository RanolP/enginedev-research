export function playerSize(): number {
  return 16 * 3;
}

export function mapSize(): number {
  const vmin100 = Math.min(window.innerWidth, window.innerHeight);
  return vmin100;
}
