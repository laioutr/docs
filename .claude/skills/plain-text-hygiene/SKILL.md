---
name: plain-text-hygiene
description: Use when writing or editing human-facing prose - documentation pages, commit messages, code comments, READMEs, changelogs, PR descriptions, ui-messages. NOT for implementation plans, task lists, or structured technical artifacts. Removes Unicode artifacts and vocabulary patterns that signal AI-generated text.
---

# Plain Text Hygiene

## Overview

LLMs inject typographic Unicode characters and use distinctive vocabulary/structural patterns that mark text as AI-generated. This skill enforces plain-text-safe output and avoids the most detectable tells.

## When to Use

- Writing or editing `.md`, `.txt`, `.rst`, or any prose file
- Writing code comments or docstrings
- Writing commit messages, PR descriptions, changelogs
- Any output that will live in a plain text file

## Rules

### 1. ASCII-Only Characters

NEVER output these Unicode characters. Use their ASCII equivalents.

| Banned | Replacement | Note |
|---|---|---|
| `U+2014` em dash `—` | rewrite sentence | The single most famous AI tell |
| `--` double hyphen as em dash | rewrite sentence | ASCII em dash substitute, same tell |
| `U+2013` en dash `–` | `-` | |
| `U+201C` `U+201D` curly double quotes | `"` straight quote | |
| `U+2018` `U+2019` curly single quotes | `'` straight apostrophe | |
| `U+2026` ellipsis character | `...` three periods | |
| `U+00A0` non-breaking space | regular space | Invisible but detectable |
| `U+200B` zero-width space | nothing (delete) | Invisible watermark |
| `U+2011` non-breaking hyphen | `-` regular hyphen | |
| `U+2003` em space | regular space | |
| `U+2009` thin space | regular space | |

Self-check: if you are about to write `—` or `--` to insert a pause or aside, stop. Restructure the sentence instead. Use a period, semicolon, colon, or parentheses. Em dashes (in any form) are almost always replaceable with clearer punctuation.

### 2. Banned Vocabulary

Never use these words in prose. They are statistically overrepresented in LLM output and flag text immediately.

**Always replace:**

| Banned | Use instead |
|---|---|
| delve | explore, examine, look at, dig into |
| tapestry | (cut entirely - it's always filler) |
| landscape | area, space, field, domain |
| crucial | important, key, necessary |
| pivotal | important, key |
| leverage | use |
| harness | use |
| navigate (metaphor) | handle, deal with, work through |
| embark | start, begin |
| endeavour/endeavor | effort, attempt, try |
| multifaceted | complex, varied |
| robust | strong, solid, reliable |
| streamline | simplify |
| foster | encourage, support, build |
| vibrant | (cut or use a specific adjective) |
| nestled | located, in, at |
| compelling | strong, interesting, clear |
| furthermore | also, and |
| additionally | also, and |
| notably | (often cuttable - just state the thing) |
| importantly | (often cuttable) |
| comprehensive | full, complete, thorough |
| facilitate | help, enable, let |
| utilize | use |
| implement (as a verb in prose) | build, add, set up, do |

### 3. Banned Phrases

Delete or rewrite any of these on sight:

- "It's worth noting that..." - just state it
- "It's important to note..." - just state it
- "In today's rapidly evolving..." - delete entirely
- "Whether you're X or Y..." - delete the whole sentence
- "Not just X, but Y" / "Not only X, but also Y" - state Y directly. This pattern is especially sneaky because it feels like it's adding nuance. It's not - it's a rhetorical crutch. Rewrite: "the client specifies which components it needs" not "not just which types it wants, but which components it needs"
- "When it comes to..." - start with the subject
- "At the end of the day..." - delete
- "In order to" - replace with "to"
- "serves as" - replace with "is"
- "plays a crucial role" - say what it does
- "a testament to" - say what it proves or shows
- "the future looks bright" - delete or be specific
- "I hope this helps" - delete
- "Let me know if you have questions" - delete
- "Great question!" - delete

### 4. Structural Patterns to Avoid

- **Rule of three**: Don't always group things in threes. Use 2 or 4 items in lists sometimes.
- **Summary sentences**: Don't end paragraphs with a sentence that restates the paragraph.
- **Symmetric sections**: Let sections be different lengths. Not every section needs 3 paragraphs.
- **Colon-list substitution**: Don't replace causal explanation with a bulleted list. Write prose that explains *why*.
- **Inline-header bold lists**: Don't write `**Header:** description` for every item. This includes `**Full sentence.** More prose.` as a FAQ pattern. Use H3 headings or plain list items instead.

### 5. Tone

- Don't hedge with qualifier chains ("could potentially be argued to possibly..."). Commit to a statement or say you don't know.
- Don't be uniformly positive. Name tradeoffs and limitations.
- Don't over-explain obvious things in comments. Comment *why*, not *what*.
- Use "is" not "serves as". Use "use" not "utilize". Prefer short common words.

## Where Violations Hide

Code comments and JSDoc are the #1 source of `--` violations. Agents treat comments as "technical context" and rationalize that `--` is acceptable there. It is not. These rules apply equally to:

- Inline code comments (`// This is ambiguous -- it could mean...`)
- JSDoc descriptions (`@param local -- Records from the local system`)
- Block comment explanations (`/* We pick -- or synthesize -- a winner */`)

The fix is always the same: use a period, semicolon, colon, or parentheses. For example:

```
// BAD:  This is ambiguous -- it could mean deletion or missing data.
// GOOD: This is ambiguous. It could mean deletion or missing data.

// BAD:  We delegate to resolveConflict which applies the strategy to pick -- or synthesize -- a winner.
// GOOD: We delegate to resolveConflict, which applies the strategy to pick (or synthesize) a winner.
```

## Common Rationalizations

| Excuse | Reality |
|---|---|
| "Em dashes are legitimate punctuation" | They are, but in any form (`—`, `--`) they are an AI tell. Restructure the sentence. |
| "Double hyphen `--` isn't Unicode" | It's the ASCII em dash. Same pattern, same tell. Use a period, semicolon, or colon instead. |
| "`--` is fine in code comments" | Code comments are prose. Same rules apply. This is the most common violation source. |
| "This word isn't always AI-sounding" | If it's on the list, it's statistically flagged. Replace it. |
| "The style guide says to use curly quotes" | Not in plain text. Curly quotes are for typeset documents, not `.md` files. |
| "I'm only using it once" | One em dash is enough for a detector. Zero tolerance. |
| "The user didn't ask me to avoid AI tells" | This skill applies automatically to all prose output. |
| "The 'not just X, but Y' adds nuance here" | It never does. It's a rhetorical pattern, not nuance. State Y directly. |

## Quick Self-Check

Before finishing any prose output, scan for:

1. Any non-ASCII character (especially `–` `—` `"` `"` `'` `...`) or `--` double hyphen
2. Any word from the banned list
3. Any phrase from the banned list
4. Every-list-is-three-items pattern
5. Recap sentences at paragraph ends
6. `**Bold:** text` formatting pattern

If you find even one violation, fix it before outputting. Do not rationalize keeping it.
