import type { FontData } from "astro:assets";

export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  // NOTE (Velox): default to WOFF, not TTF. During `astro build` the OG
  // endpoints fetch the font over HTTP from the live site
  // (experimental_getFontFileURL + context.url). The live site serves the
  // WOFF files for these content hashes but not the TTF ones, so asking
  // for TTF makes the build fetch fail (and hang on Headers Timeout in
  // this sandbox). Satori supports WOFF, so WOFF is safe here.
  const format = options?.format ?? "woff";

  for (const font of fonts) {
    if (font.weight === String(weight) && font.style === style) {
      const src = font.src.find(file => file.format === format) ?? font.src[0];
      if (src) return src.url;
    }
  }

  return undefined;
}
