import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const contentDir = path.join(repoRoot, 'content')

const TODAY = new Date()
const todayIso = TODAY.toISOString().slice(0, 10)

function walk(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p))
    else if (ent.isFile() && p.endsWith('.md')) out.push(p)
  }
  return out
}

function stripNumericPrefix(seg) {
  return seg.replace(/^\d+\./, '')
}

function slugify(seg) {
  return seg
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function inferLoc(filePath) {
  const rel = path.relative(contentDir, filePath)
  const noExt = rel.replace(/\.md$/, '')
  const parts = noExt.split(path.sep).map(stripNumericPrefix)
  const last = parts[parts.length - 1]
  const isIndex = last === '0.index' || last === 'index'
  const routeParts = (isIndex ? parts.slice(0, -1) : parts).map(slugify).filter(Boolean)
  return '/' + routeParts.join('/')
}

function hasFrontmatter(src) {
  return src.startsWith('---\n') || src.startsWith('---\r\n')
}

function splitFrontmatter(src) {
  // returns { fm: string (without fences), body: string } or null
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return null
  return { fm: m[1], body: m[2] }
}

function ensureSitemapBlock(fm, loc) {
  if (/\n?sitemap:\s*\n/.test('\n' + fm + '\n')) return fm
  const block =
    `sitemap:\n` +
    `  loc: ${loc}\n` +
    `  lastmod: ${todayIso}\n` +
    `  changefreq: monthly\n` +
    `  priority: 1.0\n`
  const trimmed = fm.trimEnd()
  return trimmed.length ? `${trimmed}\n${block}` : block
}

const files = walk(contentDir)
let changed = 0

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const loc = inferLoc(file)

  let next
  const split = splitFrontmatter(src)
  if (split) {
    const fm2 = ensureSitemapBlock(split.fm, loc)
    next = `---\n${fm2}\n---\n${split.body}`
  } else {
    // No frontmatter → add
    const fm2 = ensureSitemapBlock('', loc)
    next = `---\n${fm2}---\n\n${src}`
  }

  if (next !== src) {
    fs.writeFileSync(file, next, 'utf8')
    changed++
  }
}

console.log(`Updated sitemap frontmatter in ${changed}/${files.length} markdown files.`)

