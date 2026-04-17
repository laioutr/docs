import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { stripEmbeddedFonts } from '../../utils/excalidraw/strip-fonts';

const publicDir = join(process.cwd(), 'public');

export default defineCachedEventHandler(
  async (event) => {
    // Nitro catch-all `[...path].svg` produces param key `path.svg` (includes .svg suffix)
    const pathParam = getRouterParams(event)['path.svg'];
    if (!pathParam) {
      throw createError({ statusCode: 400, statusMessage: 'Missing path' });
    }

    // Resolve and guard against path traversal
    const svgPath = resolve(publicDir, pathParam);
    if (!svgPath.startsWith(publicDir)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }

    let raw: string;
    try {
      raw = await readFile(svgPath, 'utf-8');
    } catch {
      throw createError({ statusCode: 404, statusMessage: `Not found: ${pathParam}` });
    }

    setHeader(event, 'Content-Type', 'image/svg+xml');
    return stripEmbeddedFonts(raw);
  },
  { maxAge: 60 * 60, swr: true, getKey: (event) => getRouterParams(event)['path.svg'] || '' },
);
