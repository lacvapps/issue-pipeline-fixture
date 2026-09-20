import { expect, test } from 'bun:test'
import { slugify } from './slugify'

test('strips trailing exclamation mark', () => {
  expect(slugify('Hello!')).toBe('hello')
})

test('strips trailing question mark', () => {
  expect(slugify('What now?')).toBe('what-now')
})

test('strips trailing ellipsis', () => {
  expect(slugify('Loading...')).toBe('loading')
})

test('strips mixed trailing punctuation', () => {
  expect(slugify('Ready?!')).toBe('ready')
})

test('returns empty string for all-punctuation input', () => {
  expect(slugify('???')).toBe('')
})
