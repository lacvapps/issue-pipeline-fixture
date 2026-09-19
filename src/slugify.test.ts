/**
 * Baseline regression suite. All of these pass at HEAD (before the bug is
 * fixed) — none of them end the input in punctuation, so none of them
 * exercise the planted bug. The pipeline's implementer is expected to add a
 * *new* test that does exercise it (see ../ISSUE.md); this file should not
 * need to change.
 */
import { expect, test } from 'bun:test'
import { slugify } from './slugify'

test('lowercases and hyphenates', () => {
  expect(slugify('Hello World')).toBe('hello-world')
})

test('collapses repeated separators', () => {
  expect(slugify('foo   bar')).toBe('foo-bar')
})

test('strips leading punctuation', () => {
  expect(slugify('---Foo Bar')).toBe('foo-bar')
})

test('handles already-slugified input', () => {
  expect(slugify('already-a-slug')).toBe('already-a-slug')
})

// regression tests for issue #60
test('strips trailing punctuation — exclamation mark', () => {
  expect(slugify('Great Deal!')).toBe('great-deal')
})
test('strips trailing punctuation — question mark', () => {
  expect(slugify('Wait... what?')).toBe('wait-what')
})
test('strips trailing punctuation — ellipsis', () => {
  expect(slugify('Loading...')).toBe('loading')
})
test('strips trailing punctuation — multiple trailing symbols', () => {
  expect(slugify('Buy now!!!')).toBe('buy-now')
})
test('strips both leading and trailing punctuation together', () => {
  expect(slugify('---Hello World!--')).toBe('hello-world')
})
