import type { ReactNode } from 'react'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: string
  description: string
  accent?: 'green' | 'cyan'
  aside?: ReactNode
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  accent = 'green',
  aside,
}: SectionHeadingProps) {
  const accentClass = accent === 'cyan' ? 'text-cxl' : 'text-signal'

  return (
    <header className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <div className={`mb-5 font-mono text-xs font-medium uppercase ${accentClass}`}>
          {index} / {eyebrow}
        </div>
        <h2 className="max-w-4xl text-3xl font-semibold text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.08]">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[#aab1c0]">{description}</p>
      </div>
      {aside && <div className="self-end lg:border-l lg:border-line lg:pl-6">{aside}</div>}
    </header>
  )
}
