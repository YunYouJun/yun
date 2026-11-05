import { describe, expect, it } from 'vitest'
import { eyeSplit, faceCenter, projectEye, xiaoyunCloud } from '../src/index'

const degrees = Math.PI / 180

describe('spherical eye projection', () => {
  it('keeps both eyes symmetric at rest', () => {
    const center = faceCenter(xiaoyunCloud)
    const left = projectEye(xiaoyunCloud, 0, 0, -1)
    const right = projectEye(xiaoyunCloud, 0, 0, 1)

    expect(left.x + right.x).toBeCloseTo(center[0] * 2, 8)
    expect(left.y).toBeCloseTo(right.y, 8)
    expect(left.depth).toBeCloseTo(right.depth, 8)
    expect(Math.abs(left.a)).toBeCloseTo(Math.abs(right.a), 8)
  })

  it('makes the near eye wider and deeper when the head turns', () => {
    const left = projectEye(xiaoyunCloud, 55 * degrees, 0, -1)
    const right = projectEye(xiaoyunCloud, 55 * degrees, 0, 1)

    expect(left.depth).toBeGreaterThan(right.depth)
    expect(Math.abs(left.a)).toBeGreaterThan(Math.abs(right.a))
    expect(left.depth - right.depth).toBeGreaterThan(0.2)
  })

  it('uses an orthonormal tangent basis', () => {
    const projection = projectEye(xiaoyunCloud, 28 * degrees, -9 * degrees, 1)
    const determinant = Math.abs(projection.a * projection.d - projection.b * projection.c)

    expect(determinant).toBeCloseTo(projection.depth, 8)
    expect(projection.depth).toBeGreaterThan(0)
  })

  it('puts the far eye behind the face at an extreme turn', () => {
    const farEye = projectEye(xiaoyunCloud, 80 * degrees, 0, 1)

    expect(farEye.depth).toBeLessThan(0.02)
  })

  it('derives a valid eye arc from the rig spacing', () => {
    expect(eyeSplit(xiaoyunCloud)).toBeGreaterThan(0)
    expect(eyeSplit(xiaoyunCloud)).toBeLessThan(Math.PI / 2)
  })
})
