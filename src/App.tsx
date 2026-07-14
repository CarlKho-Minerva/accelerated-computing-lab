import {
  ArrowDownRight,
  ChartNoAxesCombined,
  Cpu,
  ExternalLink,
  Github,
  GitPullRequestArrow,
  Linkedin,
  Mail,
  UserRound,
} from 'lucide-react'
import { AxiLab } from './components/AxiLab'
import { CpuLab } from './components/CpuLab'
import { CxlLab } from './components/CxlLab'
import { SectionHeading } from './components/SectionHeading'

const repositoryUrl = 'https://github.com/CarlKho-Minerva/accelerated-computing-lab'

function SkillReadout({ items }: { items: string[] }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase text-muted">Demonstrated here</div>
      <ul className="space-y-2 font-mono text-xs text-[#b4bbc8]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-signal">+</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between border-x border-line px-4 sm:px-6 lg:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="Back to top">
            <span className="grid h-8 w-8 place-items-center border border-signal/60 bg-signal/10 font-mono text-xs font-medium text-signal">CK</span>
            <span className="hidden font-mono text-xs text-[#bcc3cf] sm:inline">accelerated_computing.lab</span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-4" aria-label="Primary navigation">
            <a className="nav-link" href="#cpu">CPU</a>
            <a className="nav-link" href="#axi">AXI</a>
            <a className="nav-link" href="#cxl">CXL</a>
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="icon-button ml-2"
              aria-label="View source on GitHub"
              title="View source on GitHub"
            >
              <Github size={16} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1440px] border-x border-line">
        <section className="flex min-h-[72svh] flex-col justify-between px-5 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5 font-mono text-[11px] uppercase text-muted">
            <span>Interactive systems portfolio / build 01</span>
            <span className="flex items-center gap-2 text-signal"><i className="h-2 w-2 bg-signal" />All models local</span>
          </div>

          <div className="py-12 sm:py-16">
            <a href="https://somach.vercel.app/" target="_blank" rel="noreferrer" className="font-mono text-xs uppercase text-cxl">
              Carl Vincent Kho
            </a>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Hardware-aware AI systems, made inspectable.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-7 text-[#aab1c0] sm:text-lg sm:leading-8">
              Three browser-native proof-of-concepts for instruction execution, protocol verification, and disaggregated-memory performance modeling.
              Built to expose state, assumptions, and failure modes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#cpu" className="command-button command-button-green w-auto px-5">
                Open the lab
                <ArrowDownRight size={16} aria-hidden="true" />
              </a>
              <a href={repositoryUrl} target="_blank" rel="noreferrer" className="command-button w-auto px-5">
                Inspect source
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid border-y border-line sm:grid-cols-3">
            <div className="hero-readout"><Cpu size={16} aria-hidden="true" /><span>8-bit execution</span></div>
            <div className="hero-readout sm:border-x"><GitPullRequestArrow size={16} aria-hidden="true" /><span>AXI assertions</span></div>
            <div className="hero-readout"><ChartNoAxesCombined size={16} aria-hidden="true" /><span>CXL modeling</span></div>
          </div>
        </section>

        <section id="cpu" className="scroll-mt-16 border-t border-line px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          <SectionHeading
            index="01"
            eyebrow="RTL mental model"
            title="The 8-Bit Digital Twin"
            description="A cycle-stepped SAP-1 subset that assembles a short program, encodes the instruction register, and exposes every state transition across the control path."
            aside={<SkillReadout items={['instruction encoding', 'register-transfer logic', 'state-machine reasoning']} />}
          />
          <CpuLab />
        </section>

        <section id="axi" className="scroll-mt-16 border-t border-line px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          <SectionHeading
            index="02"
            eyebrow="SoC verification"
            title="AXI-Lite Handshake Assertions"
            description="A protocol-focused timing lab for valid/ready backpressure, same-address read-write collisions, write-through behavior, and assertion failure localization."
            aside={<SkillReadout items={['AMBA channel semantics', 'Cocotb-style assertions', 'collision policy reasoning']} />}
          />
          <AxiLab />
        </section>

        <section id="cxl" className="scroll-mt-16 border-t border-line px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          <SectionHeading
            index="03"
            eyebrow="Performance characterization"
            title="HoloSim-CXL Interconnect Profiler"
            description="A transparent workload model for exploring how bandwidth, fabric latency, queue pressure, and model scale interact across PCIe Gen 5 and CXL pooled memory."
            accent="cyan"
            aside={<SkillReadout items={['memory-bound analysis', 'latency/resource modeling', 'assumption-driven simulation']} />}
          />
          <CxlLab />
        </section>
      </main>

      <footer className="border-t border-line bg-[#08090c]">
        <div className="mx-auto grid max-w-[1440px] gap-8 border-x border-line px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-14">
          <div>
            <a href="https://somach.vercel.app/" target="_blank" rel="noreferrer" className="font-mono text-xs uppercase text-cxl">
              Carl Vincent Kho
            </a>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              AI systems engineer working across distributed reliability, embedded ML, and hardware-constrained inference.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="group relative">
              <button type="button" className="command-button w-auto px-4" aria-describedby="profile-summary">
                <UserRound size={15} aria-hidden="true" />
                Profile
              </button>
              <a href="https://somach.vercel.app/" target="_blank" rel="noreferrer">
                <div
                  id="profile-summary"
                  role="tooltip"
                  className="pointer-events-none invisible absolute bottom-[calc(100%+0.75rem)] left-0 z-20 w-[min(20rem,calc(100vw-2.5rem))] border border-line bg-surface p-4 opacity-0 shadow-xl transition-all duration-100 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 md:left-auto md:right-0"
                >
                  <div className="font-mono text-[10px] uppercase text-signal">Profile summary</div>
                  <p className="mt-3 text-xs leading-6 text-[#c2c8d3]">
                    Minerva Computational Sciences graduate, former Dell SRE intern in Kubernetes and chaos engineering, and creator of Somach low-cost sEMG interfaces.
                  </p>
                </div>
              </a>
            </div>
            <a href="mailto:kho@uni.minerva.edu" className="icon-button" aria-label="Email Carl" title="Email Carl"><Mail size={16} aria-hidden="true" /></a>
            <a href="https://linkedin.com/in/carlkho" target="_blank" rel="noreferrer" className="icon-button" aria-label="Carl on LinkedIn" title="LinkedIn"><Linkedin size={16} aria-hidden="true" /></a>
            <a href="https://github.com/CarlKho-Minerva" target="_blank" rel="noreferrer" className="icon-button" aria-label="Carl on GitHub" title="GitHub"><Github size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
