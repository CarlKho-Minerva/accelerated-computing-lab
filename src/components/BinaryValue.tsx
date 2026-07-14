interface BinaryValueProps {
  value: string
  accent?: 'green' | 'cyan' | 'neutral'
}

const accentClasses = {
  green: 'text-signal',
  cyan: 'text-cxl',
  neutral: 'text-ink',
}

export function BinaryValue({ value, accent = 'neutral' }: BinaryValueProps) {
  const midpoint = Math.ceil(value.length / 2)

  return (
    <span className={`font-mono text-[15px] font-medium ${accentClasses[accent]}`}>
      {value.slice(0, midpoint)}
      {value.length > 4 && <span className="mx-1 text-[#4e566b]">:</span>}
      {value.slice(midpoint)}
    </span>
  )
}
