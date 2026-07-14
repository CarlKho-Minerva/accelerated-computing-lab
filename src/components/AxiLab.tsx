import { CheckCircle2, ShieldAlert, Swords } from 'lucide-react'
import { useState } from 'react'
import { AXI_SCENARIOS, type AxiScenario } from '../lib/axi'

const SIGNALS = ['ACLK', 'AWVALID', 'AWREADY', 'WVALID', 'WREADY', 'COLLISION'] as const

function waveformPath(values: number[], width = 640, height = 36) {
  const step = width / values.length
  const high = 7
  const low = height - 7
  let path = `M 0 ${values[0] ? high : low}`

  values.forEach((value, index) => {
    const x = (index + 1) * step
    path += ` H ${x}`
    const next = values[index + 1]
    if (next !== undefined && next !== value) path += ` V ${next ? high : low}`
  })

  return path
}

function WaveRow({
  label,
  values,
  highlights,
  severity,
}: {
  label: (typeof SIGNALS)[number]
  values: number[]
  highlights: number[]
  severity: 'pass' | 'warning' | 'error'
}) {
  const isAlert = label === 'COLLISION'
  const color = severity === 'error' ? '#ff5252' : severity === 'warning' ? '#f5a524' : isAlert ? '#5a6377' : '#76b900'
  const activeHighlights = label === 'ACLK' ? [] : highlights

  return (
    <div className="grid grid-cols-[5.5rem_minmax(32rem,1fr)] items-center border-b border-line last:border-b-0 sm:grid-cols-[7rem_minmax(32rem,1fr)]">
      <div className={`px-3 font-mono text-[10px] sm:text-[11px] ${isAlert ? 'text-amber' : 'text-[#a7afbe]'}`}>
        {label === 'COLLISION' ? 'ALERT' : label}
      </div>
      <svg viewBox="0 0 640 36" className="h-9 w-full" role="img" aria-label={`${label} timing signal`}>
        {values.map((_, index) => (
          <line
            key={index}
            x1={index * 80}
            x2={index * 80}
            y1="0"
            y2="36"
            stroke="#1c1f2b"
            strokeWidth="1"
          />
        ))}
        {activeHighlights.map((index) => (
          <rect
            key={index}
            x={index * 80}
            y="0"
            width="80"
            height="36"
            fill={severity === 'error' ? '#ff5252' : severity === 'warning' ? '#f5a524' : '#76b900'}
            opacity="0.1"
          />
        ))}
        <path d={waveformPath(values)} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

export function AxiLab() {
  const [scenario, setScenario] = useState<AxiScenario>('normal')
  const [history, setHistory] = useState<string[]>([AXI_SCENARIOS.normal.message])
  const current = AXI_SCENARIOS[scenario]

  const runScenario = (next: AxiScenario) => {
    setScenario(next)
    setHistory((entries) => [...entries.slice(-3), AXI_SCENARIOS[next].message])
  }

  const severityClass = {
    pass: 'text-signal border-signal/40 bg-signal/10',
    warning: 'text-amber border-amber/40 bg-amber/10',
    error: 'text-critical border-critical/40 bg-critical/10',
  }[current.severity]

  return (
    <div className="mt-8 overflow-hidden border border-line bg-panel">
      <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 overflow-x-auto bg-[#090b0f]">
          <div className="min-w-[46rem]">
            <div className="grid h-12 grid-cols-[5.5rem_minmax(32rem,1fr)] items-center border-b border-line sm:grid-cols-[7rem_minmax(32rem,1fr)]">
              <div className="px-3 font-mono text-[10px] uppercase text-muted">Signal</div>
              <div className="grid grid-cols-8 text-center font-mono text-[10px] text-[#60697d]">
                {Array.from({ length: 8 }, (_, index) => (
                  <span key={index}>C{index + 1}</span>
                ))}
              </div>
            </div>
            {SIGNALS.map((signal) => (
              <WaveRow
                key={signal}
                label={signal}
                values={current.signals[signal]}
                highlights={current.highlights}
                severity={current.severity}
              />
            ))}
          </div>
        </div>

        <aside className="border-t border-line bg-surface p-5 lg:border-l lg:border-t-0">
          <div className="font-mono text-[11px] uppercase text-muted">Scoreboard state</div>
          <div className={`mt-4 border px-3 py-2 font-mono text-xs ${severityClass}`}>{current.label}</div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Target address</dt>
              <dd className="font-mono text-ink">{current.address}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Policy</dt>
              <dd className="font-mono text-right text-ink">write-through</dd>
            </div>
            <div>
              <dt className="mb-2 text-muted">Result</dt>
              <dd className="text-sm leading-6 text-[#c3c9d4]">{current.detail}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0 border-b border-line bg-[#080a0e] p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase text-muted">
            <span>cocotb / assertions.log</span>
            <span>{history.length} events</span>
          </div>
          <div className="min-h-32 space-y-2 overflow-hidden font-mono text-[11px] leading-5">
            {history.map((entry, index) => (
              <div
                key={`${entry}-${index}`}
                className={
                  entry.includes('Error')
                    ? 'text-critical'
                    : entry.includes('Scoreboard')
                      ? 'text-amber'
                      : 'text-signal'
                }
              >
                <span className="mr-2 text-[#525b6e]">{String(index + 1).padStart(2, '0')}</span>
                {entry}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2 p-3 sm:grid-cols-3 lg:w-[34rem] lg:grid-cols-1">
          <button type="button" className="command-button" onClick={() => runScenario('normal')}>
            <CheckCircle2 size={15} aria-hidden="true" />
            Run valid handshake
          </button>
          <button type="button" className="command-button command-button-amber" onClick={() => runScenario('collision')}>
            <Swords size={15} aria-hidden="true" />
            Force write-read collision
          </button>
          <button type="button" className="command-button command-button-critical" onClick={() => runScenario('violation')}>
            <ShieldAlert size={15} aria-hidden="true" />
            Inject protocol violation
          </button>
        </div>
      </div>
    </div>
  )
}
