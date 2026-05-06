import type { DocsJSONSchema } from '../introspection';

/** Expected output for a structural-id schema (inline object type recovered). */
export const VUE_INLINE_OBJECT_RECOVERED: DocsJSONSchema = {
  type: 'object',
  properties: {
    href: { id: 'string', title: 'string' },
    text: { id: 'string', title: 'string' },
  },
  required: ['href', 'text'],
};

/** Expected output for the Vue Component opaque framework type. */
export const VUE_OPAQUE_COMPONENT: DocsJSONSchema = {
  id: 'Component',
  title: 'Component',
};
