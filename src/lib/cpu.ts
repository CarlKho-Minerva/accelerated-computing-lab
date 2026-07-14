export type Opcode = 'LDA' | 'ADD' | 'SUB' | 'OUT' | 'HLT'

export interface Instruction {
  opcode: Opcode
  operand?: number
  source: string
}

export interface ParseResult {
  instructions: Instruction[]
  errors: string[]
}

export interface CpuState {
  pc: number
  ir: string
  accumulator: number
  bRegister: number
  aluOutput: number
  output: number | null
  halted: boolean
  cycle: number
  activeIndex: number | null
  operation: string
  trace: string[]
}

const OPCODE_BITS: Record<Opcode, string> = {
  LDA: '0001',
  ADD: '0010',
  SUB: '0011',
  OUT: '1110',
  HLT: '1111',
}

const OPERAND_OPS = new Set<Opcode>(['LDA', 'ADD', 'SUB'])

export const CPU_PRESETS = {
  add: 'LDA 5\nADD 10\nOUT\nHALT',
  subtract: 'LDA 15\nSUB 3\nOUT\nHALT',
} as const

export function toBinary(value: number, width: number): string {
  return (value >>> 0).toString(2).padStart(width, '0').slice(-width)
}

export function parseProgram(source: string): ParseResult {
  const instructions: Instruction[] = []
  const errors: string[] = []
  const lines = source
    .replaceAll('->', '\n')
    .split('\n')
    .map((line) => line.replace(/\(.*?\)/g, '').trim())
    .filter(Boolean)

  if (lines.length > 16) {
    errors.push('Program exceeds the 4-bit address space (16 instructions).')
  }

  lines.slice(0, 16).forEach((line, index) => {
    const [rawOpcode, rawOperand, ...extra] = line.split(/\s+/)
    const normalized = rawOpcode.toUpperCase() === 'HALT' ? 'HLT' : rawOpcode.toUpperCase()

    if (!Object.hasOwn(OPCODE_BITS, normalized)) {
      errors.push(`Line ${index + 1}: unknown opcode "${rawOpcode}".`)
      return
    }

    const opcode = normalized as Opcode
    if (extra.length > 0) {
      errors.push(`Line ${index + 1}: too many operands.`)
      return
    }

    if (OPERAND_OPS.has(opcode)) {
      const operand = Number(rawOperand)
      if (!Number.isInteger(operand) || operand < 0 || operand > 15) {
        errors.push(`Line ${index + 1}: ${opcode} expects an integer from 0 to 15.`)
        return
      }
      instructions.push({ opcode, operand, source: `${opcode} ${operand}` })
      return
    }

    if (rawOperand !== undefined) {
      errors.push(`Line ${index + 1}: ${opcode} does not take an operand.`)
      return
    }
    instructions.push({ opcode, source: opcode })
  })

  if (instructions.length === 0 && errors.length === 0) {
    errors.push('Enter at least one instruction.')
  }

  return { instructions, errors }
}

export function createCpuState(): CpuState {
  return {
    pc: 0,
    ir: '00000000',
    accumulator: 0,
    bRegister: 0,
    aluOutput: 0,
    output: null,
    halted: false,
    cycle: 0,
    activeIndex: null,
    operation: 'IDLE',
    trace: ['[CPU] Reset complete. Clock gated; registers cleared.'],
  }
}

export function encodeInstruction(instruction: Instruction): string {
  return `${OPCODE_BITS[instruction.opcode]}${toBinary(instruction.operand ?? 0, 4)}`
}

export function stepCpu(state: CpuState, program: Instruction[]): CpuState {
  if (state.halted) return state

  const instruction = program[state.pc]
  if (!instruction) {
    return {
      ...state,
      halted: true,
      operation: 'PROGRAM COMPLETE',
      trace: [...state.trace, `[cycle ${state.cycle + 1}] No instruction at PC=${state.pc}; clock halted.`],
    }
  }

  const currentPc = state.pc
  const nextPc = (currentPc + 1) & 0x0f
  const operand = instruction.operand ?? 0
  let accumulator = state.accumulator
  let bRegister = state.bRegister
  let aluOutput = state.aluOutput
  let output = state.output
  let operation: string = instruction.opcode
  let halted = false
  let detail = ''

  switch (instruction.opcode) {
    case 'LDA':
      accumulator = operand
      aluOutput = operand
      detail = `A <- ${operand}`
      break
    case 'ADD':
      bRegister = operand
      aluOutput = (accumulator + operand) & 0xff
      detail = `${accumulator} + ${operand} = ${aluOutput}`
      accumulator = aluOutput
      operation = 'ADD'
      break
    case 'SUB':
      bRegister = operand
      aluOutput = (accumulator - operand + 256) & 0xff
      detail = `${accumulator} - ${operand} = ${aluOutput}`
      accumulator = aluOutput
      operation = 'SUB'
      break
    case 'OUT':
      output = accumulator
      detail = `OUT <- ${accumulator}`
      break
    case 'HLT':
      halted = true
      operation = 'CLOCK HALTED'
      detail = 'Control word HLT asserted'
      break
  }

  return {
    pc: nextPc,
    ir: encodeInstruction(instruction),
    accumulator,
    bRegister,
    aluOutput,
    output,
    halted,
    cycle: state.cycle + 1,
    activeIndex: currentPc,
    operation,
    trace: [...state.trace.slice(-5), `[cycle ${state.cycle + 1}] ${instruction.source}: ${detail}`],
  }
}
