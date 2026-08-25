import { render, screen, within } from '@testing-library/react'

import App from '../App'
import globalCss from '../styles/global.css?raw'

describe('About scene reference geometry', () => {
  it('locks the measured brand line, reference underline, and desktop paragraph rhythm', () => {
    render(<App />)

    const about = screen.getByRole('region', {
      name: /о White Cup — место, в которое хочется возвращаться/i,
    })
    const heading = within(about).getByRole('heading', { level: 2 })

    expect(heading.querySelector('.about-scene__title-line--brand')).toBeInTheDocument()
    expect(heading.querySelector('.about-scene__return')).toHaveTextContent('возвращаться')

    expect(globalCss).toMatch(
      /\.about-scene__title-line--brand\s*\{[^}]*transform:\s*translateY\(1\.29dvh\) rotate\(-0\.7deg\) scale\(1\.07,\s*1\.38\);/,
    )
    expect(globalCss).toMatch(
      /\.about-scene__return::after\s*\{[^}]*left:\s*40%;[^}]*bottom:\s*-0\.1em;[^}]*height:\s*0\.105em;[^}]*transform:\s*rotate\(-0\.9deg\) scaleX\(1\.01\);/,
    )
    expect(globalCss).toMatch(
      /\.about-scene__intro p\s*\{[^}]*letter-spacing:\s*-0\.01em;[^}]*transform-origin:\s*left top;/,
    )
    expect(globalCss).toMatch(
      /\.about-scene__intro p:first-child\s*\{[^}]*transform:\s*scaleX\(0\.94\);/,
    )
    expect(globalCss).toMatch(
      /\.about-scene__intro p:last-child\s*\{[^}]*transform:\s*scaleX\(0\.99\);/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width:\s*1023px\)[\s\S]*?\.about-scene__intro p\s*\{[^}]*letter-spacing:\s*normal;[^}]*transform:\s*none;/,
    )
  })

  it('uses the full-plate foreground edit rather than the former pastry-only cutout', () => {
    render(<App />)

    const about = screen.getByRole('region', {
      name: /о White Cup — место, в которое хочется возвращаться/i,
    })
    const pastry = about.querySelector<HTMLImageElement>('.about-scene__pastry')

    expect(pastry).toHaveAttribute(
      'src',
      '/media/about-pastry-plate-reference-edit-v2-1200.webp',
    )
    expect(pastry).toHaveAttribute('data-layer', 'foreground')
    expect(pastry).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
  })
})
