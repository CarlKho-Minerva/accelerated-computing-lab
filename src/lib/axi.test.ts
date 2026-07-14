import { describe, expect, it } from 'vitest'
import { AXI_SCENARIOS } from './axi'

describe('AXI-Lite verification scenarios', () => {
  it('marks the collision cycle and write-through result', () => {
    const collision = AXI_SCENARIOS.collision
    expect(collision.signals.COLLISION[2]).toBe(1)
    expect(collision.message).toContain('Write-Through')
  })

  it('captures WVALID withdrawal before WREADY', () => {
    const violation = AXI_SCENARIOS.violation.signals
    expect(violation.WVALID[3]).toBe(0)
    expect(violation.WREADY[3]).toBe(0)
    expect(violation.WREADY[4]).toBe(1)
  })
})
