export type MemoryArchitecture = 'pcie' | 'cxl'

export interface ArchitectureSpec {
  id: MemoryArchitecture
  shortLabel: string
  label: string
  bandwidthGBs: number
  latencyNs: number
  color: string
}

export interface ProfilePoint {
  parametersB: number
  modelSizeGB: number
  demandGBs: number
  bandwidthUsedGBs: number
  latencyMs: number
  gpuUtilization: number
  starved: boolean
}

export const ARCHITECTURES: Record<MemoryArchitecture, ArchitectureSpec> = {
  pcie: {
    id: 'pcie',
    shortLabel: 'PCIe Gen 5',
    label: 'PCIe Gen 5 x16',
    bandwidthGBs: 64,
    latencyNs: 600,
    color: '#ff5252',
  },
  cxl: {
    id: 'cxl',
    shortLabel: 'CXL 3.0',
    label: 'CXL 3.0 pooled memory',
    bandwidthGBs: 250,
    latencyNs: 250,
    color: '#38bdf8',
  },
}

export const PARAMETER_SAMPLES = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70]

export function profileWorkload(parametersB: number, architecture: MemoryArchitecture): ProfilePoint {
  const spec = ARCHITECTURES[architecture]
  const modelSizeGB = parametersB * 2
  const demandGBs = parametersB * 2.35
  const activeTrafficWindowGB = parametersB * 0.2
  const baseComputeMs = 6 + parametersB * 0.12
  const transferMs = (activeTrafficWindowGB / spec.bandwidthGBs) * 1000
  const transactionOverheadMs = (spec.latencyNs * 16_000) / 1_000_000
  const pressureRatio = demandGBs / spec.bandwidthGBs
  const queuePenaltyMs = pressureRatio > 1 ? (pressureRatio - 1) ** 2 * 48 : 0
  const latencyMs = baseComputeMs + transferMs + transactionOverheadMs + queuePenaltyMs
  const gpuUtilization = Math.min(97, 91 / Math.max(1, pressureRatio))

  return {
    parametersB,
    modelSizeGB,
    demandGBs,
    bandwidthUsedGBs: Math.min(demandGBs, spec.bandwidthGBs),
    latencyMs,
    gpuUtilization,
    starved: demandGBs > spec.bandwidthGBs * 0.82,
  }
}

export function profileSeries(architecture: MemoryArchitecture): ProfilePoint[] {
  return PARAMETER_SAMPLES.map((parametersB) => profileWorkload(parametersB, architecture))
}
