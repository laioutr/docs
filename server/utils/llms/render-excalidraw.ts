import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

interface ExcalidrawElement {
  type: string;
  id: string;
  text?: string;
  containerId?: string | null;
  isDeleted?: boolean;
  startBinding?: { elementId: string } | null;
  endBinding?: { elementId: string } | null;
  boundElements?: Array<{ id: string; type: string }> | null;
}

function stripElement(el: ExcalidrawElement): Record<string, unknown> {
  const stripped: Record<string, unknown> = { type: el.type, id: el.id };

  if (el.text != null) {
    stripped.text = el.text;
  }
  if (el.containerId) {
    stripped.containerId = el.containerId;
  }

  // For shapes: include only text-binding IDs
  const textBindings = el.boundElements?.filter((b) => b.type === 'text').map((b) => b.id);
  if (textBindings?.length) {
    stripped.boundElements = textBindings;
  }

  // For arrows: include binding targets
  if (el.type === 'arrow') {
    if (el.startBinding?.elementId) stripped.startBinding = el.startBinding.elementId;
    if (el.endBinding?.elementId) stripped.endBinding = el.endBinding.elementId;
  }

  return stripped;
}

export function stripExcalidrawForLlm(data: { elements: ExcalidrawElement[] }): string {
  const stripped = data.elements
    .filter((el) => !el.isDeleted)
    .map(stripElement);
  return JSON.stringify(stripped, null, 2);
}

const publicDir = join(process.cwd(), 'public');

export async function renderExcalidrawDiagram(src: string, alt?: string): Promise<MinimarkNode[] | null> {
  const filePath = src.endsWith('.excalidraw') ? src : `${src}.excalidraw`;
  const fullPath = resolve(publicDir, filePath.replace(/^\//, ''));
  if (!fullPath.startsWith(publicDir)) return null;

  let raw: string;
  try {
    raw = await readFile(fullPath, 'utf-8');
  } catch {
    return null;
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (data.type !== 'excalidraw' || !Array.isArray(data.elements)) return null;

  const code = stripExcalidrawForLlm(data);
  const title = alt || data.elements.find((el: ExcalidrawElement) => el.type === 'text' && !el.isDeleted)?.text || 'Diagram';

  return [
    ['h4', {}, `Diagram: ${title}`],
    ['pre', { language: 'json', code }],
  ];
}
