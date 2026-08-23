export interface SketchUnderlineProps {
  className?: string
  width?: number
}

export function SketchUnderline({ className, width = 180 }: SketchUnderlineProps) {
  return (
    <svg
      className={['sketch-underline', className].filter(Boolean).join(' ')}
      width={width}
      height="18"
      viewBox="0 0 180 18"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-doodle
      focusable="false"
    >
      <path d="M3 10.6c28-4.3 48 2.6 78-1.1 24-3 46 2.8 96-2.7" />
      <path d="M5 14.2c30-2.2 56 1.9 78-1.1 29-3.9 53 1.9 91-2.1" />
    </svg>
  )
}
