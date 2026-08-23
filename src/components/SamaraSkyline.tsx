export interface SamaraSkylineProps {
  className?: string
}

export function SamaraSkyline({ className }: SamaraSkylineProps) {
  return (
    <svg
      className={['samara-skyline', className].filter(Boolean).join(' ')}
      viewBox="0 0 720 170"
      aria-hidden="true"
      focusable="false"
      data-doodle
    >
      <path className="samara-skyline__ground" d="M15 142c121-4 205 2 323-1 137-4 247 3 367-2" />
      <path className="samara-skyline__line" d="M28 141V96h37v45M78 141V73h28v68M112 141V106h46v35M171 141V87h28v54M212 141V61h36v80M261 141v-31h47v31M326 141V77h31v64M369 141V99h50v42M434 141V82h29v59M476 141V101h44v40M535 141V68h37v73M586 141V91h27v50M627 141V54h37v87M679 141V102h26v39" />
      <path className="samara-skyline__detail" d="m208 61 22-17 22 17M622 54l23-20 23 20M535 68l18-15 19 15M333 77l10-13 10 13M82 73l10-15 10 15" />
      <path className="samara-skyline__river" d="M8 154c98-7 178 10 275 0s184-4 262 1 115 2 168-2" />
    </svg>
  )
}
