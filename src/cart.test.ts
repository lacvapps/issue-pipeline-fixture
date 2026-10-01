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

  test('a coupon on an order that pays shipping discounts the items only', () => {
    expect(cartTotals([mug, poster], 'SAVE10')).toEqual({
      subtotalCents: 4900,
      shippingCents: 500,
      discountCents: 490,
      totalCents: 4910,
    })
  })

  test('a coupon never changes shipping', () => {
    const withCoupon = cartTotals([mug, poster], 'SAVE10')
    const withoutCoupon = cartTotals([mug, poster])
    expect(withCoupon.shippingCents).toBe(withoutCoupon.shippingCents)
    expect(withCoupon.shippingCents).toBe(500)
    expect(withoutCoupon.totalCents).toBe(5400)
  })

  test('SAVE25 also discounts the items only', () => {
    expect(cartTotals([mug, poster], 'SAVE25')).toEqual({
      subtotalCents: 4900,
      shippingCents: 500,
      discountCents: 1225,
      totalCents: 4175,
    })
  })
})
