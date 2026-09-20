import { describe, it, expect } from 'bun:test'
import { slugify } from './slugify'

describe('slugify — trailing non-alphanumeric characters', () => {
  it('strips a trailing exclamation mark', () => {
    expect(slugify('Great Deal!')).toBe('great-deal')
  })

  it('strips trailing punctuation run', () => {
    expect(slugify('Wait... what?')).toBe('wait-what')
  })

  it('strips trailing whitespace-then-punct after trim', () => {
    expect(slugify('Nice!  ')).toBe('nice')
  })

  it('handles input that is only non-alphanumeric', () => {
    expect(slugify('!!!')).toBe('')
  })

  it('does not affect a clean slug', () => {
    expect(slugify('already-a-slug')).toBe('already-a-slug')
  })
})
