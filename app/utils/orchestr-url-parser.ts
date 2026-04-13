// ---------------------------------------------------------------------------
// Orchestr URL parser — used by OrchestrUrl component
// ---------------------------------------------------------------------------

export interface ParamSegment {
  text: string
  role: 'structure' | 'value'
}

export interface ParamDetail {
  label: string
  value: string
  isValue?: boolean
}

export interface ParamInfo {
  kind: string
  details: ParamDetail[]
}

export interface ParsedParam {
  segments: ParamSegment[]
  info: ParamInfo
}

export interface ParsedOrchestrUrl {
  path: string
  params: ParsedParam[]
}

export function parseOrchestrUrlGrouped(url: string): ParsedOrchestrUrl {
  const qIdx = url.indexOf('?')
  if (qIdx === -1) return { path: url, params: [] }

  const path = url.substring(0, qIdx)
  const qs = url.substring(qIdx + 1)

  return {
    path,
    params: qs.split('&').map(raw => buildParam(raw)),
  }
}

function bracket(text: string, out: ParamSegment[]) {
  out.push({ text: `[${text}]`, role: 'structure' })
}

function buildParam(raw: string): ParsedParam {
  const segments: ParamSegment[] = []
  const details: ParamDetail[] = []

  const eq = raw.indexOf('=')
  const keyPart = eq >= 0 ? raw.substring(0, eq) : raw
  const valPart = eq >= 0 ? decodeURIComponent(raw.substring(eq + 1)) : null

  const br = keyPart.indexOf('[')
  const head = br >= 0 ? keyPart.substring(0, br) : keyPart
  const tail = br >= 0 ? keyPart.substring(br) : ''

  const bk: string[] = []
  const re = /\[([^\]]*)\]/g
  let m
  while ((m = re.exec(tail)) !== null) bk.push(m[1]!)

  let prefix: string | null = null
  let linkToken: string | null = null
  let keyType: string | null = null
  let filterName: string | null = null
  let rangeBound: string | null = null

  if (bk.length === 0) {
    // Root key: p=2
    segments.push({ text: head, role: 'structure' })
    keyType = head
  } else if (['p', 'l', 's', 'f'].includes(head) && head.length === 1) {
    // Root query with brackets: f[color]=red
    segments.push({ text: head, role: 'structure' })
    keyType = head
    for (let i = 0; i < bk.length; i++) {
      const seg = bk[i]!
      bracket(seg, segments)
      if (head === 'f' && i === 0) filterName = seg
      if (head === 'f' && i === 1) rangeBound = seg
    }
  } else {
    // Prefixed: products[...]=...
    prefix = head
    segments.push({ text: head, role: 'structure' })

    if (bk.length === 1) {
      // products[p]=2
      bracket(bk[0]!, segments)
      keyType = bk[0]!
    } else if (bk[0] === 'f') {
      // products[f][color]=red  or  products[f][price][min]=10
      keyType = 'f'
      bracket('f', segments)
      filterName = bk[1]!
      bracket(filterName, segments)
      if (bk.length >= 3) {
        rangeBound = bk[2]!
        bracket(rangeBound, segments)
      }
    } else {
      // Link: products[reviews][p]=3
      linkToken = bk[0]!
      bracket(linkToken, segments)
      if (bk.length >= 2) {
        keyType = bk[1]!
        bracket(keyType, segments)
        if (keyType === 'f' && bk.length >= 3) {
          filterName = bk[2]!
          bracket(filterName, segments)
          if (bk.length >= 4) {
            rangeBound = bk[3]!
            bracket(rangeBound, segments)
          }
        }
      }
    }
  }

  // Value
  if (valPart !== null) {
    segments.push({ text: '=', role: 'structure' })
    segments.push({ text: valPart, role: 'value' })
  }

  // Build kind + details
  if (prefix) details.push({ label: 'prefix', value: prefix })
  if (linkToken) details.push({ label: 'link', value: linkToken })

  let kind = linkToken ? 'Linked query' : ''

  switch (keyType) {
    case 'p':
      kind = kind ? `${kind} · Page` : 'Page'
      if (valPart) details.push({ label: 'page', value: valPart, isValue: true })
      break
    case 's':
      kind = kind ? `${kind} · Sort` : 'Sort'
      if (valPart) details.push({ label: 'sort', value: valPart, isValue: true })
      break
    case 'l':
      kind = kind ? `${kind} · Limit` : 'Limit'
      if (valPart) details.push({ label: 'limit', value: valPart, isValue: true })
      break
    case 'f':
      if (rangeBound) {
        kind = kind ? `${kind} · Range filter` : 'Range filter'
        if (filterName) details.push({ label: 'filter', value: filterName })
        details.push({ label: 'bound', value: rangeBound })
        if (valPart) details.push({ label: 'value', value: valPart, isValue: true })
      } else {
        kind = kind ? `${kind} · Filter` : 'Filter'
        if (filterName) details.push({ label: 'filter', value: filterName })
        if (valPart) details.push({ label: 'value', value: valPart, isValue: true })
      }
      break
    default:
      kind = kind || 'Parameter'
      if (valPart) details.push({ label: 'value', value: valPart, isValue: true })
  }

  return { segments, info: { kind, details } }
}