import { describe, expect, it } from 'vitest'
import { profileWorkload } from './profiler'

describe('interconnect profiler', () => {
  it('models lower latency and higher utilization for CXL at 70B', () => {
    const pcie = profileWorkload(70, 'pcie')
    const cxl = profileWorkload(70, 'cxl')

    expect(cxl.latencyMs).toBeLessThan(pcie.latencyMs)
    expect(cxl.gpuUtilization).toBeGreaterThan(pcie.gpuUtilization)
    expect(pcie.starved).toBe(true)
    expect(cxl.starved).toBe(false)
  })

  it('uses FP16 model footprint', () => {
    expect(profileWorkload(7, 'pcie').modelSizeGB).toBe(14)
    expect(profileWorkload(70, 'cxl').modelSizeGB).toBe(140)
  })
})
