import { readFile } from "node:fs/promises";
import path from "node:path";
import { experimental_getFontFileURL } from "astro:assets";

/**
 * Load a font file for OG image generation.
 *
 * During `astro build`, the URL from `experimental_getFontFileURL` points
 * at Astro's internal prerender server (e.g. `http://[::]:PORT`), which
 * is not connectable through this environment's egress proxy, so fetching
 * it hangs until undici's Headers Timeout. The font files are already
 * copied to `dist/_astro/fonts` before routes are prerendered, so read
 * them from disk first and only fall back to the HTTP fetch (dev server,
 * or a build where `dist` is not populated yet).
 */
export async function loadOgFont(
  fontPath: string,
  requestUrl: URL
): Promise<ArrayBuffer> {
  try {
    const file = await readFile(path.join(process.cwd(), "dist", fontPath));
    return Uint8Array.from(file).buffer as ArrayBuffer;
  } catch {
    const res = await fetch(experimental_getFontFileURL(fontPath, requestUrl));
    return res.arrayBuffer();
  }
}
