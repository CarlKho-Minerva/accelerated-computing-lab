# Accelerated Computing Lab

An interactive systems portfolio by [Carl Vincent Kho](https://linkedin.com/in/carlkho). It turns three hardware/software co-design concepts into browser-executed models whose state, assumptions, and failure modes can be inspected directly.

This is not a gallery of screenshots. The CPU executes instructions, the AXI-Lite panel changes signal traces and assertions, and the CXL profiler recalculates its curves from a documented model.

## What is inside

| Lab | What happens in the browser | What it demonstrates |
| --- | --- | --- |
| **8-Bit Digital Twin** | Parses a SAP-1-style assembly subset and steps `PC`, `IR`, `A`, `B`, ALU, and output registers one clock at a time | Instruction encoding, register-transfer logic, state-machine reasoning |
| **AXI-Lite Assertions** | Renders valid/ready waveforms for a valid transaction, a same-address collision, and an intentional protocol violation | AMBA channel semantics, backpressure, collision policy, Cocotb-style verification |
| **HoloSim-CXL** | Models latency, bandwidth draw, GPU queue supply, and FP16 footprint from 7B to 70B parameters | Memory-bound analysis, performance characterization, transparent simulation |

## Why I built it

My professional evidence already spans distributed reliability at Dell, measured on-device inference on Snapdragon hardware, and embedded ML research on constrained biosignal systems. This lab explores the next layer I want to work in: processor behavior, interface verification, memory hierarchy, and data movement for accelerated computing.

It is intentionally honest about scope. These are educational proof-of-concepts implemented in TypeScript, not claims of production RTL ownership or measurements from CXL hardware. The profiler exposes its assumptions in the interface and source so the model can be challenged instead of trusted blindly.

## Architecture

```text
React interface
├── CPU lab ─────── parser + deterministic state transition engine
├── AXI lab ─────── scenario definitions + generated timing paths
└── CXL profiler ── architecture specs + first-order workload model

TypeScript domain logic
└── Vitest tests for execution, assertions, and model relationships
```

The logic lives in `src/lib`; visual components consume it from `src/components`. This separation keeps the models testable without a browser and makes assumptions easy to audit.

## Model details

### 8-Bit CPU

Supported instructions are `LDA`, `ADD`, `SUB`, `OUT`, and `HLT`. The upper IR nibble stores the opcode and the lower nibble stores the immediate operand. Arithmetic wraps to an 8-bit unsigned value. The editor rejects invalid opcodes, extra operands, values outside `0..15`, and programs beyond the 4-bit address space.

### AXI-Lite validator

The waveform panel focuses on independent address and write-data handshakes. The collision case models a same-edge read/write to `0x0F` with write-through bypass. The violation case withdraws `WVALID` while the receiver is applying backpressure, then emits the corresponding assertion failure.

### CXL profiler

The model compares the PRD's two architecture envelopes:

- PCIe Gen 5 x16: `64 GB/s`, `600 ns`
- CXL 3.0 pooled memory: `250 GB/s`, `250 ns`

For a selected parameter count, it estimates FP16 footprint, an active transfer window, fabric transaction overhead, bandwidth pressure, and a nonlinear queue penalty after saturation. It is a relative architecture model, not a benchmark result.

## Recruiter walkthrough

1. Step the ADD preset four clocks and watch the accumulator reach `15`, latch to `OUT`, then halt.
2. Force the AXI write-read collision and inspect the highlighted cycle plus write-through scoreboard result.
3. Inject the protocol violation and compare the dropped `WVALID` edge against `WREADY`.
4. Move the profiler to `70B`, switch from PCIe to CXL, and inspect the changed queue status and utilization estimate.
5. Open the assumptions disclosure or the tested source to see exactly where each result comes from.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verify

```bash
npm test
npm run build
```

The test suite covers both CPU presets, assembler constraints, AXI collision/violation state, FP16 footprint, and the expected CXL-versus-PCIe latency/utilization relationship.

## Stack

React 19, TypeScript, Tailwind CSS, custom SVG timing/latency visualizations, Lucide icons, Vitest, and Vite. Inter and IBM Plex Mono are bundled locally, so typography does not depend on a third-party font request.

## License

[MIT](LICENSE)
