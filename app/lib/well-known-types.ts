/**
 * Registry of canonical type names that have a dedicated reference page.
 *
 * Used by `LinkedTypeName.vue` to hyperlink type names that appear in auto-generated
 * meta components (entity-component-meta, action-meta, query-meta, json-schema field rows).
 *
 * Keys are exact identifier matches (case-sensitive). When a tokenizer encounters
 * `Link`, `Link[]`, `Link | undefined`, etc., the `Link` token is wrapped in a link
 * to the URL below; surrounding syntax is left as plain text.
 */
export const WELL_KNOWN_TYPES: Record<string, string> = {
  // Link union and its variants
  Link: '/frontend/api-reference/common-types/link',
  LinkReference: '/frontend/api-reference/common-types/link#linkreference',
  LinkUrl: '/frontend/api-reference/common-types/link#linkurl',
  LinkAnchor: '/frontend/api-reference/common-types/link#linkanchor',
  LinkPage: '/frontend/api-reference/common-types/link#linkpage',
  LinkPageType: '/frontend/api-reference/common-types/link#linkpagetype',

  // Media union and its variants
  Media: '/frontend/api-reference/common-types/media',
  MediaImage: '/frontend/api-reference/common-types/media#mediaimage',
  MediaVideo: '/frontend/api-reference/common-types/media#mediavideo',
  MediaSourceImage: '/frontend/api-reference/common-types/media#mediasourceimage',
  MediaSourceVideo: '/frontend/api-reference/common-types/media#mediasourcevideo',
  MediaSourcePlaceholder: '/frontend/api-reference/common-types/media#mediasourceplaceholder',

  // Money
  Money: '/frontend/api-reference/common-types/money',

  // UnitPrice
  UnitPrice: '/frontend/api-reference/common-types/unit-price',

  // Measurement
  Measurement: '/frontend/api-reference/common-types/measurement',
  MeasurementUnit: '/frontend/api-reference/common-types/measurement#unit',
};
