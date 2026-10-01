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

  test('a coupon discounts the items subtotal, never shipping', () => {
    expect(cartTotals([mug, poster], 'SAVE10')).toEqual({
      subtotalCents: 4900,
      shippingCents: 500,
      discountCents: 490,
      totalCents: 4910,
    })
  })

  test('the discount does not move when shipping moves', () => {
    const shipped = cartTotals([mug, poster], 'SAVE10') // $49.00 subtotal -> pays $5.00 shipping
    const free = cartTotals([{ name: 'Chair', priceCents: 10000, quantity: 1 }], 'SAVE10') // $100.00 -> ships free
    expect(shipped.shippingCents).toBe(500)
    expect(free.shippingCents).toBe(0)
    expect(shipped.discountCents).toBe(490)
    expect(free.discountCents).toBe(1000)
    expect(shipped.totalCents).toBe(4910)
    expect(free.totalCents).toBe(9000)
  })

  test('formats cents', () => {
    expect(formatCents(5400)).toBe('$54.00')
  })
})
