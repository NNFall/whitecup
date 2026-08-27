# Local webfonts and licenses

The files in `public/fonts/` are local WOFF2 subsets prepared for the White Cup
landing. They were generated with FontTools 4.61.1 and Brotli 1.1.0; no font
package was installed for this repository and no Segoe file was copied.

The source fonts identify their license in OpenType name records 13 and 14 as
the SIL Open Font License, Version 1.1. The complete OFL text below was copied
from the local FontTools distribution at
`C:\Users\User\AppData\Local\Programs\Python\Python312\Lib\site-packages\fonttools-4.61.1.dist-info\licenses\LICENSE.external`.

## Included families

### Neucha / White Cup Display

- Webfont: `public/fonts/white-cup-display-cyrillic.woff2`
- Official Google Fonts GitHub source commit: [`6a003b5eb672dc8bf5bff5937cf5863f8b175445`](https://github.com/google/fonts/commit/6a003b5eb672dc8bf5bff5937cf5863f8b175445).
- Immutable source blobs: [`Neucha.ttf`](https://github.com/google/fonts/blob/6a003b5eb672dc8bf5bff5937cf5863f8b175445/ofl/neucha/Neucha.ttf)
  and [`OFL.txt`](https://github.com/google/fonts/blob/6a003b5eb672dc8bf5bff5937cf5863f8b175445/ofl/neucha/OFL.txt).
- Source metadata: Neucha Regular, weight 400; Google Fonts metadata lists
  Cyrillic and Latin coverage.
- Copyright: Copyright (c) 2008-2010 by Jovanny Lemonad
  (`http://www.jovanny.ru`).
- License: SIL Open Font License 1.1; the upstream license text and URL are
  preserved in the source repository.
- CSS family: the local subset is exposed as `White Cup Display`; the original
  Neucha family is used only as the upstream attribution/source name.
- Coverage: Basic Latin, Latin-1, combining marks, basic Cyrillic including
  Russian `Ё/ё`, common punctuation, euro, numero, four navigation arrows,
  minus, and filled dot; unsupported symbols such as the ruble sign and heart
  suit use the browser fallback face.
- Packaging command (FontTools 4.61.1 + Brotli 1.1.0; run from the downloaded
  source directory):

  ```sh
  curl -L --fail --retry 3 -o Neucha.ttf \
    https://raw.githubusercontent.com/google/fonts/6a003b5eb672dc8bf5bff5937cf5863f8b175445/ofl/neucha/Neucha.ttf
  pyftsubset Neucha.ttf --output-file=white-cup-display-cyrillic.woff2 \
    --flavor=woff2 \
    --unicodes='U+0020-00FF,U+0300-036F,U+0400-045F,U+2000-206F,U+20BD,U+20AC,U+2116,U+2190-2193,U+2212,U+25CF'
  ```

  The subset name table is then exposed as `White Cup Display` with FontTools
  before copying it to `public/fonts/`. SHA-256 of the delivered WOFF2,
  independently checked with `Get-FileHash -Algorithm SHA256`, is
  `16634F2A5A397867ABD3E9A30A8F54A7F37CEC44D1808FE108065CF8044DEB6C`.

### Pangolin

- Webfont: `public/fonts/pangolin-cyrillic.woff2`
- Local source: `D:\papka for all\work\MaxSlidesbot\fonts\custom\ofl\pangolin\Pangolin-Regular.ttf`
- Source metadata: Pangolin Regular, Version 1.101.
- Copyright: Copyright 2016 The Pangolin Project Authors
  (`https://github.com/googlefonts/pangolin`).
- License: SIL Open Font License 1.1; embedded license URL
  `http://scripts.sil.org/OFL` is preserved.
- Coverage: Basic Latin, Latin-1, combining marks, basic Cyrillic including
  Russian `Ё/ё`, common punctuation, euro, ruble, numero, four navigation
  arrows, minus, and a filled dot.
- Packaging: static regular face; display-font hinting was removed from the web
  subset to reduce transfer size.

### Marck Script source / White Cup Hand subset

- Webfont: `public/fonts/white-cup-hand-cyrillic.woff2`
- Local source: `D:\papka for all\work\MaxSlidesbot\fonts\custom\ofl\marckscript\MarckScript-Regular.ttf`
- Source metadata: Marck Script, Version 1.002.
- Copyright: Copyright (c) 2011, Denis Masharov
  (`denis.masharov@gmail.com`), Marck Fogel, with Reserved Font Names
  "Marck Script".
- License: SIL Open Font License 1.1; embedded license URL
  `http://scripts.sil.org/OFL` is preserved.
- OFL reserved-name handling: because this WOFF2 file is a format-converted,
  subsetted version, its primary internal family name is `White Cup Hand` and
  its PostScript name is `WhiteCupHand-Regular`. Attribution to the original
  authors and the original Reserved Font Name remains intact in the copyright
  metadata and this document.
- Coverage: Basic Latin, Latin-1, combining marks, basic Cyrillic including
  Russian `Ё/ё`, common punctuation, euro, numero, four navigation arrows,
  minus, and a filled dot. The source font does **not** contain U+20BD RUBLE
  SIGN; price strings must therefore fall back to Golos Text (or another face
  that contains the ruble glyph).
- Packaging: static regular face; display-font hinting was removed from the web
  subset to reduce transfer size.

### Golos Text

- Webfont: `public/fonts/golos-text-cyrillic-variable.woff2`
- Local source: `D:\papka for all\work\MaxSlidesbot\fonts\custom\ofl\golostext\GolosText[wght].ttf`
- Source metadata: Golos Text Regular, Version 2.004.
- Copyright: Copyright 2019 The Golos Text Project Authors
  (`https://github.com/googlefonts/golos-text`).
- License: SIL Open Font License 1.1; embedded license URL
  `https://scripts.sil.org/OFL` is preserved.
- Coverage: Basic Latin, Latin-1, combining marks, basic Cyrillic including
  Russian `Ё/ё`, common punctuation, euro, ruble, numero, four navigation
  arrows, minus, and a filled dot.
- Packaging: the variable `wght` axis is preserved from 400 through 900, with
  400 as its default. Hinting is retained for small body and navigation text.

## Subset ranges

The deterministic Unicode selection used for the local subsets is:

`U+0020-00FF,U+0300-036F,U+0400-045F,U+2000-206F,U+20BD,U+20AC,U+2116,U+2190-2193,U+2212,U+25CF`

FontTools silently omits requested code points absent from a source font. That
is why the White Cup Hand subset has no ruble glyph even though U+20BD appears
in the shared selection.

## SIL Open Font License 1.1

```text
-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font
creation efforts of academic and linguistic communities, and to
provide a free and open framework in which fonts may be shared and
improved in partnership with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply to
any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software
components as distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to,
deleting, or substituting -- in part or in whole -- any of the
components of the Original Version, by changing formats or by porting
the Font Software to a new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed,
modify, redistribute, and sell modified and unmodified copies of the
Font Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components, in
Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the
corresponding Copyright Holder. This restriction only applies to the
primary font name as presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created using
the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```
