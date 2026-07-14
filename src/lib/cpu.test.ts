import { describe, expect, it } from 'vitest'
import { CPU_PRESETS, createCpuState, parseProgram, stepCpu } from './cpu'

describe('SAP-1 instruction emulator', () => {
  it('executes the addition preset through halt', () => {
    const { instructions, errors } = parseProgram(CPU_PRESETS.add)
    expect(errors).toEqual([])

    let state = createCpuState()
    for (let i = 0; i < instructions.length; i += 1) state = stepCpu(state, instructions)

    expect(state.accumulator).toBe(15)
    expect(state.output).toBe(15)
    expect(state.halted).toBe(true)
    expect(state.cycle).toBe(4)
  })

  it('executes subtraction with 8-bit arithmetic', () => {
    const { instructions } = parseProgram(CPU_PRESETS.subtract)
    let state = createCpuState()
    for (let i = 0; i < instructions.length; i += 1) state = stepCpu(state, instructions)
    expect(state.accumulator).toBe(12)
    expect(state.output).toBe(12)
  })

  it('rejects an operand outside the 4-bit instruction field', () => {
    const result = parseProgram('LDA 16\nHALT')
    expect(result.errors[0]).toContain('0 to 15')
  })
})
