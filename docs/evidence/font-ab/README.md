# White Cup display-font A/B

Проверка выполнена через Codex In-app Browser на локальном сервере с
одинаковым `1920×1080` viewport и одинаковой heading-геометрией. Вариант
`neucha-1920x1080.png` использует локальный `White Cup Display` (subset
Neucha); `pangolin-1920x1080.png` — локальный Pangolin.

| Метрика | Neucha / White Cup Display | Pangolin |
| --- | ---: | ---: |
| Hero `h1` width | 791.1 px | 773.8 px |
| Hero line 1 width | 533.6 px | 451.8 px |
| Hero line 2 width | 640.4 px | 552.5 px |
| Menu `h2` width | 1159.7 px | 1063.0 px |
| Menu mobile height at 390 px | 129.1 px / 3 lines | 172.2 px / 4 lines |

Выбран `White Cup Display` / Neucha: он сохраняет пропорции строк из
референсов, имеет гладкий marker-штрих и удерживает меню в трёхстрочной
мобильной композиции. Pangolin оставлен локальным comparison asset, но не
подключается в runtime: его зернистая фактура и дополнительный перенос Menu
хуже соответствуют приложенным кадрам.

Короткие рукописные фразы (`White Cup`, `О White Cup —`, `возвращаться`)
используют отдельный локальный `White Cup Hand` (Marck Script), а body и
навигация — `White Cup Body` (Golos Text). Все заголовки остаются живым
HTML-текстом; PNG title-extract в runtime не используются.
