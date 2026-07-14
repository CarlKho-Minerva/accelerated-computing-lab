import { RotateCcw, StepForward } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BinaryValue } from './BinaryValue'
import { CPU_PRESETS, createCpuState, parseProgram, stepCpu, toBinary } from '../lib/cpu'

function RegisterCell({
  label,
  value,
  detail,
  accent = 'neutral',
}: {
  label: string
  value: string
  detail: string
  accent?: 'green' | 'cyan' | 'neutral'
}) {
  return (
    <div className="min-h-[92px] border-b border-r border-line bg-panel p-4 last:border-r-0">
      <div className="mb-3 font-mono text-[11px] uppercase text-muted">{label}</div>
      <BinaryValue value={value} accent={accent} />
      <div className="mt-2 font-mono text-[11px] text-[#697186]">{detail}</div>
    </div>
  )
}

export function CpuLab() {
  const [source, setSource] = useState<string>(CPU_PRESETS.add)
  const [state, setState] = useState(createCpuState)
  const parsed = useMemo(() => parseProgram(source), [source])

  useEffect(() => {
    setState(createCpuState())
  }, [source])

  const loadPreset = (preset: keyof typeof CPU_PRESETS) => {
    setSource(CPU_PRESETS[preset])
  }

  const reset = () => setState(createCpuState())
  const step = () => {
    if (parsed.errors.length === 0) {
      setState((current) => stepCpu(current, parsed.instructions))
    }
  }

  const irOpcode = state.ir.slice(0, 4)
  const irAddress = state.ir.slice(4)

  return (
    <div className="mt-8 grid overflow-hidden border border-line bg-panel lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="border-b border-line bg-[#0a0c11] lg:border-b-0 lg:border-r">
        <div className="flex h-12 items-center justify-between border-b border-line px-4">
          <span className="font-mono text-xs font-medium text-ink">program.asm</span>
          <span className="font-mono text-[10px] uppercase text-muted">4-bit address</span>
        </div>

        <div className="grid grid-cols-2 border-b border-line">
          <button
            type="button"
            className={`control-tab ${source === CPU_PRESETS.add ? 'control-tab-active-green' : ''}`}
            onClick={() => loadPreset('add')}
          >
            ADD preset
          </button>
          <button
            type="button"
            className={`control-tab border-l border-line ${source === CPU_PRESETS.subtract ? 'control-tab-active-green' : ''}`}
            onClick={() => loadPreset('subtract')}
          >
            SUB preset
          </button>
        </div>

        <label className="sr-only" htmlFor="assembly-program">
          Assembly program
        </label>
        <textarea
          id="assembly-program"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          className="h-44 w-full resize-none border-0 bg-[#0a0c11] p-4 font-mono text-sm leading-7 text-[#d6dbe5] outline-none focus:bg-[#0d1016] lg:h-64"
          aria-describedby="assembly-status"
        />

        <div id="assembly-status" className="min-h-14 border-y border-line px-4 py-3 font-mono text-[11px] leading-5">
          {parsed.errors.length > 0 ? (
            parsed.errors.map((error) => (
              <div key={error} className="text-critical">
                {error}
              </div>
            ))
          ) : (
            <div className="text-[#7f899d]">{parsed.instructions.length} instructions assembled / 16 available</div>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 p-3">
          <button
            type="button"
            onClick={step}
            disabled={parsed.errors.length > 0 || state.halted}
            className="command-button command-button-green"
          >
            <StepForward size={15} aria-hidden="true" />
            Step clock
          </button>
          <button type="button" onClick={reset} className="icon-button" title="Reset registers" aria-label="Reset registers">
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2">
          <div className="font-mono text-xs text-muted">
            cycle <span className="text-ink">{String(state.cycle).padStart(2, '0')}</span>
          </div>
          <div className={`status-readout ${state.halted ? 'text-amber' : 'text-signal'}`}>
            <span className={`status-dot ${state.halted ? 'bg-amber' : 'bg-signal'}`} />
            {state.operation}
          </div>
        </div>

        <div className="grid border-b border-line sm:grid-cols-2 xl:grid-cols-3">
          <RegisterCell label="Program counter / PC" value={toBinary(state.pc, 4)} detail={`decimal ${state.pc}`} accent="cyan" />
          <RegisterCell label="Instruction / IR" value={state.ir} detail={`opcode ${irOpcode} / addr ${irAddress}`} accent="green" />
          <RegisterCell label="Accumulator / A" value={toBinary(state.accumulator, 8)} detail={`unsigned ${state.accumulator}`} accent="green" />
          <RegisterCell label="Operand / B" value={toBinary(state.bRegister, 8)} detail={`unsigned ${state.bRegister}`} />
          <RegisterCell label="ALU output" value={toBinary(state.aluOutput, 8)} detail={state.operation} accent="cyan" />
          <RegisterCell
            label="Output register"
            value={toBinary(state.output ?? 0, 8)}
            detail={state.output === null ? 'not latched' : `latched ${state.output}`}
            accent={state.output === null ? 'neutral' : 'green'}
          />
        </div>

        <div className="grid md:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="border-b border-line p-4 md:border-b-0 md:border-r">
            <div className="mb-3 font-mono text-[11px] uppercase text-muted">Microprogram</div>
            <ol className="space-y-1 font-mono text-xs">
              {parsed.instructions.map((instruction, index) => (
                <li
                  key={`${instruction.source}-${index}`}
                  className={`flex min-h-7 items-center gap-3 border-l-2 px-2 ${
                    state.activeIndex === index
                      ? 'border-signal bg-signal/10 text-ink'
                      : 'border-transparent text-[#727b8f]'
                  }`}
                >
                  <span className="text-[#4f586b]">{index.toString(16).toUpperCase()}</span>
                  <span>{instruction.source}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 bg-[#090b0f] p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase text-muted">
              <span>Execution trace</span>
              <span>8-bit data path</span>
            </div>
            <div className="min-h-40 space-y-2 overflow-hidden font-mono text-[11px] leading-5 text-[#8790a3]">
              {state.trace.map((line, index) => (
                <div key={`${line}-${index}`} className={index === state.trace.length - 1 ? 'text-[#c8ced9]' : ''}>
                  <span className="mr-2 text-signal">›</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
