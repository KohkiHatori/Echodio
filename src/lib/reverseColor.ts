/**
 * Returns the opposite (inverted) color of a given hex or rgb color string.
 * @param hex - The color string in the format '#RRGGBB', '#RGB', or 'rgb(r, g, b)'.
 * @returns The opposite color as a hex string in the format '#RRGGBB'.
 */
export function reverseColor(hex: string): string {
  if (typeof hex !== 'string') return '#000000';
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
    console.log("Reversed color", `#${r}${g}${b}`);
    return `#${r}${g}${b}`;
  }
  // Support rgb(r, g, b) format
  const rgbMatch = hex.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    const r = 255 - parseInt(rgbMatch[1], 10);
    const g = 255 - parseInt(rgbMatch[2], 10);
    const b = 255 - parseInt(rgbMatch[3], 10);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  return '#000000';
}
