export type AxiScenario = 'normal' | 'collision' | 'violation'

export interface AxiScenarioData {
  label: string
  severity: 'pass' | 'warning' | 'error'
  address: string
  message: string
  detail: string
  signals: Record<'ACLK' | 'AWVALID' | 'AWREADY' | 'WVALID' | 'WREADY' | 'COLLISION', number[]>
  highlights: number[]
}

const clock = [0, 1, 0, 1, 0, 1, 0, 1]

export const AXI_SCENARIOS: Record<AxiScenario, AxiScenarioData> = {
  normal: {
    label: 'Handshake valid',
    severity: 'pass',
    address: '0x0F',
    message: '[Cocotb] Assert passed: AWVALID/AWREADY handshake complete.',
    detail: 'Address accepted on cycle 3; write data accepted on cycle 4.',
    signals: {
      ACLK: clock,
      AWVALID: [0, 1, 1, 0, 0, 0, 0, 0],
      AWREADY: [0, 0, 1, 0, 0, 0, 0, 0],
      WVALID: [0, 1, 1, 1, 0, 0, 0, 0],
      WREADY: [0, 0, 0, 1, 0, 0, 0, 0],
      COLLISION: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    highlights: [2, 3],
  },
  collision: {
    label: 'Collision handled',
    severity: 'warning',
    address: '0x0F',
    message: '[Cocotb] [Scoreboard] Write-Read collision handled. Output data correctly bypassed (Write-Through).',
    detail: 'Simultaneous read and write targeted 0x0F on cycle 3; bypass selected the incoming write data.',
    signals: {
      ACLK: clock,
      AWVALID: [0, 1, 1, 0, 0, 0, 0, 0],
      AWREADY: [0, 0, 1, 0, 0, 0, 0, 0],
      WVALID: [0, 1, 1, 1, 0, 0, 0, 0],
      WREADY: [0, 0, 1, 1, 0, 0, 0, 0],
      COLLISION: [0, 0, 1, 0, 0, 0, 0, 0],
    },
    highlights: [2],
  },
  violation: {
    label: 'Assertion failed',
    severity: 'error',
    address: '0x0F',
    message: '[Cocotb] [Assertion Error] Protocol violation: WVALID dropped before WREADY asserted on clock cycle 4!',
    detail: 'The source withdrew WVALID while the sink was back-pressuring the channel.',
    signals: {
      ACLK: clock,
      AWVALID: [0, 1, 1, 0, 0, 0, 0, 0],
      AWREADY: [0, 0, 1, 0, 0, 0, 0, 0],
      WVALID: [0, 1, 1, 0, 0, 0, 0, 0],
      WREADY: [0, 0, 0, 0, 1, 0, 0, 0],
      COLLISION: [0, 0, 0, 1, 0, 0, 0, 0],
    },
    highlights: [3, 4],
  },
}
