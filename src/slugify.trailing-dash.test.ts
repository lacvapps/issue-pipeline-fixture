import { expect, test } from 'bun:test'
import { slugify } from './slugify'

test('strips trailing dash from trailing punctuation', () => {
  expect(slugify('Great Deal!')).toBe('great-deal')
})

test('strips trailing dash from trailing ellipsis-style punctuation', () => {
  expect(slugify('Wait... what?')).toBe('wait-what')
})

test('strips multiple trailing dashes', () => {
  expect(slugify('Wow!!!')).toBe('wow')
})

test('unaffected: no trailing punctuation', () => {
  expect(slugify('Hello World')).toBe('hello-world')
})
