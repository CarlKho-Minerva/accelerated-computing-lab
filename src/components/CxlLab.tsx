import { Activity, Gauge, MemoryStick, Network } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  ARCHITECTURES,
  profileSeries,
  profileWorkload,
  type MemoryArchitecture,
  type ProfilePoint,
} from '../lib/profiler'

const CHART = {
  width: 760,
  height: 320,
  left: 58,
  right: 22,
  top: 24,
  bottom: 42,
}

function pathForSeries(series: ProfilePoint[], yMax: number) {
  const plotWidth = CHART.width - CHART.left - CHART.right
  const plotHeight = CHART.height - CHART.top - CHART.bottom

  return series
    .map((point, index) => {
      const x = CHART.left + ((point.parametersB - 7) / 63) * plotWidth
      const y = CHART.top + plotHeight - (point.latencyMs / yMax) * plotHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  accent = 'neutral',
}: {
  icon: typeof Activity
  label: string
  value: string
  detail: string
  accent?: 'green' | 'cyan' | 'critical' | 'neutral'
}) {
  const accentClass = {
    green: 'text-signal',
    cyan: 'text-cxl',
    critical: 'text-critical',
    neutral: 'text-ink',
  }[accent]

  return (
    <div className="border-b border-r border-line bg-panel p-4 last:border-r-0">
      <div className="mb-5 flex items-center justify-between text-muted">
        <span className="font-mono text-[10px] uppercase">{label}</span>
        <Icon size={15} aria-hidden="true" />
      </div>
      <div className={`font-mono text-xl font-medium ${accentClass}`}>{value}</div>
      <div className="mt-2 font-mono text-[10px] text-[#667084]">{detail}</div>
    </div>
  )
}

export function CxlLab() {
  const [parameters, setParameters] = useState(28)
  const [architecture, setArchitecture] = useState<MemoryArchitecture>('pcie')
  const pcieSeries = useMemo(() => profileSeries('pcie'), [])
  const cxlSeries = useMemo(() => profileSeries('cxl'), [])
  const profile = profileWorkload(parameters, architecture)
  const selectedSpec = ARCHITECTURES[architecture]
  const yMax = Math.ceil(Math.max(...pcieSeries.map((point) => point.latencyMs)) / 50) * 50
  const plotWidth = CHART.width - CHART.left - CHART.right
  const plotHeight = CHART.height - CHART.top - CHART.bottom
  const selectedX = CHART.left + ((parameters - 7) / 63) * plotWidth
  const selectedY = CHART.top + plotHeight - (profile.latencyMs / yMax) * plotHeight

  return (
    <div className="mt-8 overflow-hidden border border-line bg-panel">
      <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 bg-[#090b0f] p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-xs font-medium text-ink">latency_profile.svg</div>
              <div className="mt-1 font-mono text-[10px] text-muted">FP16 / active traffic window / first-order model</div>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-muted">
              <span className="flex items-center gap-2"><i className="h-0.5 w-4 bg-critical" />PCIe</span>
              <span className="flex items-center gap-2"><i className="h-0.5 w-4 bg-cxl" />CXL</span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="h-auto min-h-[250px] w-full"
            role="img"
            aria-label={`Latency comparison for ${parameters} billion parameters using ${selectedSpec.label}`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = CHART.top + plotHeight - ratio * plotHeight
              return (
                <g key={ratio}>
                  <line x1={CHART.left} x2={CHART.width - CHART.right} y1={y} y2={y} stroke="#1c1f2b" />
                  <text x={CHART.left - 10} y={y + 4} textAnchor="end" fill="#626b7e" fontSize="10" fontFamily="IBM Plex Mono">
                    {Math.round(yMax * ratio)}
                  </text>
                </g>
              )
            })}
            {[7, 21, 35, 49, 63, 70].map((value) => {
              const x = CHART.left + ((value - 7) / 63) * plotWidth
              return (
                <g key={value}>
                  <line x1={x} x2={x} y1={CHART.top} y2={CHART.top + plotHeight} stroke="#12151d" />
                  <text x={x} y={CHART.height - 17} textAnchor="middle" fill="#626b7e" fontSize="10" fontFamily="IBM Plex Mono">
                    {value}B
                  </text>
                </g>
              )
            })}
            <text x="12" y="15" fill="#7d8597" fontSize="10" fontFamily="IBM Plex Mono">LATENCY / MS</text>
            <path
              d={pathForSeries(pcieSeries, yMax)}
              fill="none"
              stroke="#ff5252"
              strokeWidth={architecture === 'pcie' ? 3 : 1.5}
              opacity={architecture === 'pcie' ? 1 : 0.35}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={pathForSeries(cxlSeries, yMax)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={architecture === 'cxl' ? 3 : 1.5}
              opacity={architecture === 'cxl' ? 1 : 0.35}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={selectedX}
              x2={selectedX}
              y1={CHART.top}
              y2={CHART.top + plotHeight}
              stroke={selectedSpec.color}
              strokeDasharray="4 4"
              opacity="0.8"
            />
            <circle cx={selectedX} cy={selectedY} r="5" fill="#090b0f" stroke={selectedSpec.color} strokeWidth="3" />
            <rect x={Math.min(selectedX + 10, 645)} y={Math.max(selectedY - 30, 8)} width="94" height="23" fill="#141620" stroke="#2b3040" />
            <text
              x={Math.min(selectedX + 57, 692)}
              y={Math.max(selectedY - 15, 23)}
              textAnchor="middle"
              fill="#f2f5f7"
              fontSize="10"
              fontFamily="IBM Plex Mono"
            >
              {profile.latencyMs.toFixed(1)} ms
            </text>
          </svg>
        </div>

        <div className="border-t border-line bg-surface p-5 lg:border-l lg:border-t-0">
          <div className="font-mono text-[11px] uppercase text-muted">Memory architecture</div>
          <div className="mt-4 grid grid-cols-2 border border-line">
            {(Object.keys(ARCHITECTURES) as MemoryArchitecture[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setArchitecture(id)}
                className={`min-h-14 px-3 font-mono text-xs transition-colors first:border-r first:border-line ${
                  architecture === id
                    ? id === 'cxl'
                      ? 'bg-cxl/10 text-cxl'
                      : 'bg-critical/10 text-[#ff7a7a]'
                    : 'bg-[#0e1118] text-muted hover:text-ink'
                }`}
                aria-pressed={architecture === id}
              >
                {ARCHITECTURES[id].shortLabel}
              </button>
            ))}
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Bandwidth</dt>
              <dd className="font-mono text-ink">{selectedSpec.bandwidthGBs} GB/s</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Fabric latency</dt>
              <dd className="font-mono text-ink">{selectedSpec.latencyNs} ns</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Model footprint</dt>
              <dd className="font-mono text-ink">{profile.modelSizeGB.toFixed(0)} GB</dd>
            </div>
          </dl>

          <div className={`mt-6 border p-3 ${profile.starved ? 'border-critical/50 bg-critical/10' : 'border-signal/40 bg-signal/10'}`}>
            <div className={`font-mono text-xs font-medium ${profile.starved ? 'text-critical' : 'text-signal'}`}>
              {profile.starved ? 'GPU STARVED' : 'GPU FED'}
            </div>
            <p className="mt-2 text-xs leading-5 text-[#aeb5c3]">
              {profile.starved ? 'Memory-bound bottleneck; request pressure exceeds the sustainable fabric window.' : 'Fabric headroom keeps the accelerator queue supplied.'}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-[#0a0c11] p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <label htmlFor="model-scale" className="font-mono text-[11px] uppercase text-muted">Model scale</label>
          <output htmlFor="model-scale" className="font-mono text-2xl font-medium text-ink">{parameters}B</output>
        </div>
        <input
          id="model-scale"
          type="range"
          min="7"
          max="70"
          step="1"
          value={parameters}
          onChange={(event) => setParameters(Number(event.target.value))}
          className="profiler-range mt-5 w-full"
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-[#5f687b]"><span>7B</span><span>70B</span></div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Gauge} label="Execution latency" value={`${profile.latencyMs.toFixed(1)} ms`} detail="modeled end-to-end" accent={profile.starved ? 'critical' : 'green'} />
        <Metric icon={Network} label="Bandwidth draw" value={`${profile.bandwidthUsedGBs.toFixed(1)} GB/s`} detail={`${profile.demandGBs.toFixed(1)} GB/s requested`} accent="cyan" />
        <Metric icon={Activity} label="GPU utilization" value={`${profile.gpuUtilization.toFixed(0)}%`} detail="queue supply estimate" accent={profile.starved ? 'critical' : 'green'} />
        <Metric icon={MemoryStick} label="FP16 footprint" value={`${profile.modelSizeGB.toFixed(0)} GB`} detail={`${parameters}B × 2 bytes`} />
      </div>

      <details className="group border-t border-line bg-[#080a0e] p-4 text-xs text-muted">
        <summary className="cursor-pointer font-mono text-[11px] uppercase text-[#949daf] focus:outline-none focus:text-ink">
          Model assumptions and limits
        </summary>
        <p className="mt-3 max-w-4xl leading-6">
          This is a transparent first-order browser model, not a hardware benchmark. It assumes FP16 weights, a 20% active transfer window,
          16,000 fabric transactions, and workload demand scaling at 2.35 GB/s per billion parameters. Queue pressure adds a nonlinear penalty
          after link saturation so the model exposes architecture tradeoffs without presenting synthetic values as measured silicon results.
        </p>
      </details>
    </div>
  )
}
