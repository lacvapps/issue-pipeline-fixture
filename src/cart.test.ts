import { describe, expect, test } from 'bun:test'
import { cartTotals, formatCents, shipping, subtotal } from './cart'

// The harness never edits this file's existing tests; a fix adds new ones.
describe('cart', () => {
  const mug = { name: 'Mug', priceCents: 1200, quantity: 2 }
  const poster = { name: 'Poster', priceCents: 2500, quantity: 1 }

  test('subtotal sums price x quantity', () => {
    expect(subtotal([mug, poster])).toBe(4900)
  })

  test('shipping is flat under the free-shipping threshold', () => {
    expect(shipping(4900)).toBe(500)
    expect(shipping(5000)).toBe(0)
    expect(shipping(0)).toBe(0)
  })

  test('totals without a coupon', () => {
    expect(cartTotals([mug, poster])).toEqual({ subtotalCents: 4900, shippingCents: 500, discountCents: 0, totalCents: 5400 })
  })

  test('a coupon on an order that already ships free', () => {
    const big = { name: 'Chair', priceCents: 10000, quantity: 1 }
    expect(cartTotals([big], 'SAVE10').totalCents).toBe(9000)
  })

  test('formats cents', () => {
    expect(formatCents(5400)).toBe('$54.00')
  })
})

// Regression: a coupon used to be sized over subtotal + shipping, so it took
// money off the shipping too. Shipping is never discounted.
describe('a coupon discounts the items subtotal only', () => {
  const mug = { name: 'Mug', priceCents: 1200, quantity: 2 }
  const poster = { name: 'Poster', priceCents: 2500, quantity: 1 }

  test('SAVE10 on an order that pays shipping', () => {
    expect(cartTotals([mug, poster], 'SAVE10')).toEqual({
      subtotalCents: 4900,
      shippingCents: 500,
      discountCents: 490,
      totalCents: 4910,
    })
  })

  test('shipping is identical with and without a coupon', () => {
    expect(cartTotals([mug, poster], 'SAVE10').shippingCents).toBe(cartTotals([mug, poster]).shippingCents)
    expect(cartTotals([mug, poster]).shippingCents).toBe(500)
    expect(cartTotals([mug, poster]).totalCents).toBe(5400)
  })

  test('SAVE25 discounts the items subtotal only', () => {
    expect(cartTotals([mug, poster], 'SAVE25')).toEqual({
      subtotalCents: 4900,
      shippingCents: 500,
      discountCents: 1225,
      totalCents: 4175,
    })
  })

  test('an order that already ships free stays free', () => {
    const chair = { name: 'Chair', priceCents: 10000, quantity: 1 }
    expect(cartTotals([chair], 'SAVE10')).toEqual({
      subtotalCents: 10000,
      shippingCents: 0,
      discountCents: 1000,
      totalCents: 9000,
    })
  })

  test('a coupon on an empty-backed cart cannot discount shipping', () => {
    expect(cartTotals([{ name: 'Sticker', priceCents: 100, quantity: 1 }], 'SAVE10')).toEqual({
      subtotalCents: 100,
      shippingCents: 500,
      discountCents: 10,
      totalCents: 590,
    })
  })
})
