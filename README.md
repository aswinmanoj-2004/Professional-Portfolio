# Aswin Manoj — Portfolio

A 2D, type-led personal portfolio site. Editorial layout with a **light and a dark
room** (pull the cord), one warm accent, a cursor-following glow, a pinned
horizontal "doors" wall, and a scroll-driven story timeline. No WebGL, no 3D, no
heavy image assets — the arched brass doors, the spiral-bound role pad and the
hanging pull-cord are all plain CSS gradients, radii and 2D transforms, and
everything animates with `transform` and `opacity` only.

**Stack:** React 18 + Vite 5 · React Router 6 · Tailwind CSS 3 · Framer Motion 11 · GSAP (ScrollTrigger + Draggable) · Lenis smooth scroll

---

## 1. Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Command           | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Vite dev server with hot reload                 |
| `npm run build`   | Production build into `dist/`                   |
| `npm run preview` | Serves the built `dist/` locally so you can check it before deploying |

Requires Node 18 or newer.

> **Changed `tailwind.config.js` and see no effect?** Restart `npm run dev`. The
> Tailwind plugin resolves the config once per process, so a running dev server
> keeps serving the palette it started with. `npm run build` always reads it fresh.

---

## 2. Editing your content

**You should only ever need to touch one file: [`src/data/portfolio.js`](src/data/portfolio.js).**
Components read from it and render; none of them hold copy of their own.

| Export                 | Drives                                                          |
| ---------------------- | --------------------------------------------------------------- |
| `profile`              | Name, tag, headline lines, summary, location, phone, email, links, and `photo` / `photoFallback` |
| `tickerWords`          | The rotating role words stamped on the hero notepad ("I work as …") |
| `statusBar`            | The three cells of the strip pinned to the bottom of the hero    |
| `topNav`               | The desktop nav links shown beside the brand (the Menu button takes over below `lg`) |
| `doorsIntro`           | The eyebrow / heading / subtext above the doors wall              |
| `doors`                | The 5 door cards: title, blurb, tags, route, `tone[]` (the room behind the door), `paint` / `shade` (the two colours of the door itself) and `plate[]` (the lines etched on the brass nameplate) |
| `storySection`         | Eyebrow + heading of the timeline section                         |
| `timeline`             | The 5 story steps: `year`, `range`, `title`, `org`, `kind`, `points[]` |
| `certificationsSection`| Heading block of the certifications grid                          |
| `certifications`       | The 7 certificate cards (`issuer`, `title`, `url`)                |
| `skillGroups`          | The toolkit strip (Frontend / Backend / Databases / Tools)        |
| `projects`             | Every project block, and which skill pages it appears on          |
| `skillPages`           | Title + one-line description + skills for each of the 5 sub-pages |
| `navLinks` / `workLinks` | The overlay menu and footer link columns                       |
| `contactSection`       | Heading block of the contact page                                 |
| `ctaSection`           | The "Available for new work" band above the footer                |

### Filling in the placeholder links

Anything you have not hosted yet is written as a `[PASTE …]` marker:

```js
live: '[PASTE HOSTED LINK]',
repo: '[PASTE GITHUB REPO LINK]',
url: '[PASTE CERTIFICATE LINK]',
```

`resolveUrl()` at the top of the file turns any `[PASTE …]` or empty string into
`https://github.com/aswinmanoj-2004`, so **no button on the site is ever dead**.
Replace the markers with real URLs as you get them — nothing else needs to change.

### Adding a project

Append to the `projects` array and list the pages it belongs to:

```js
{
  id: 'my-app',
  category: '03 · SELF-INITIALED',
  title: 'My App',
  subtitle: 'One line that sells it.',
  description: 'Two or three sentences of detail.',
  bullets: ['What it does.', 'What is interesting about it.'],
  tags: ['React', 'Node'],
  live: 'https://my-app.vercel.app',
  repo: 'https://github.com/aswinmanoj-2004/my-app',
  screenshot: '/projects/my-app.jpg',
  pages: ['/full-stack', '/frontend'],   // <- which skill pages show it
}
```

Then drop the image at `public/projects/my-app.jpg`. Portrait-ish crops around
1200×800 look best in the hover preview.

### Your photo

`public/aswin.png` is the portrait — a 408×612 cut-out on a transparent background
(2:3, head in the upper half). It appears in the hero. Replace it with another file
of the same name and it updates everywhere.

If you swap in a different ratio, change the `width`/`height` the `<img>` tags use
to reserve their box (408 / 612).

`profile.photoFallback` points at `public/aswin.svg`, a colour stand-in the `<img>`
switches to on its own if the PNG is ever missing, so nothing breaks. In the hero the
bottom of the image is masked away with `mask-image`, so a plain torso crop blends
into the page instead of ending in a hard edge. A second, greyscale copy is stacked
on top of it — that is what the cursor-driven spotlight reveals (§4), so a portrait
with real colour in it gives the effect something to develop.

### Adding a door or a timeline step

Push a new object onto `doors` or `timeline`. Counts, the `01 / 05` step meter,
the door numbering, the horizontal scroll distance, and the footer "Work" column
are all derived, so they update themselves.

---

## 3. Light and dark

The cord in the top-right corner **is** the light switch: drag it down (or tap it,
or Tab to it and press Enter) and the room re-lights. Below the `sm` breakpoint,
where the cord would tangle with the Menu button, the header carries a sun/moon
button that does the same thing.

- **Where it lives:** `useTheme` in `src/lib/hooks.js` sets `data-theme` on `<html>`
  and remembers the choice in `localStorage` under `am-theme`. With nothing stored
  it follows the OS `prefers-color-scheme`, and a small inline script in
  [`index.html`](index.html) applies it before the first paint so light-mode
  visitors never see a dark flash. The `theme-color` meta follows the theme too.
- **How a colour becomes themeable:** every palette entry exists twice in
  `src/index.css` — a plain value for the hand-written rules, and an `--c-*` RGB
  triplet (`--c-bg: 26 24 24`) that `tailwind.config.js` consumes as
  `rgb(var(--c-bg) / <alpha-value>)`. The `[data-theme='light']` block re-declares
  both sets, so utilities *with opacity modifiers* repaint as well. Adding a colour
  means adding all three: the value, the triplet, and the light override.
- **The flash:** custom properties cannot transition, so the swap is a hard cut.
  `ThemeFlash.jsx` washes light in from the cord's corner and hides the cut while
  the tokens change underneath. Reduced-motion visitors just get the cut.
- **Surfaces that ignore the theme:** the paper of the notepad and the room behind
  each door are drawn with their own literal colours, so the pad stays pale and the
  room stays dark in either theme.

---

## 4. How the motion works

| Piece                  | Where                    | How                                                                 |
| ---------------------- | ------------------------ | ------------------------------------------------------------------- |
| Preloader              | `Preloader.jsx`          | Minimal gate: the name over a hairline that fills 0→100, then a plain "Enter →". Counted off `performance.now()` on an interval, not `requestAnimationFrame`, so a tab opened in the background still finishes. Stored in `sessionStorage`, so it shows once per tab session. |
| Doors wall             | `DoorsWall.jsx`          | GSAP `ScrollTrigger` pins the section and scrubs the track sideways; `Draggable` lets you grab the wall and it re-syncs to the vertical scroll. Hovering (or focusing) a door swings its leaf open on a `rotateY` hinge to reveal the dark room inside. Clicking one walks you in: the leaf goes to 104°, the whole wall scales up around that doorway — `transform-origin` is set from the clicked door's rect, so the neighbours rush past the edges — and a veil drops to black before the route changes. |
| Role notepad           | `Notepad.jsx`            | The roles turn **page by page**: the next role is printed on the pad and the one you are reading sits on a loose sheet hinged along the top edge, which `rotateX`es up over the rings. Only the ink has `backface-visibility: hidden`, so you see the blank reverse as the page rolls past vertical. All roles share one grid cell, so the card is as wide as the longest word and never jumps. |
| Portrait develop       | `Hero.jsx` + `.portrait__bw` | A second, greyscale copy of the photo sits on top, masked by a `radial-gradient` whose position and radius come from `--spot-x/y/r`. Pointer moves write those three properties, so black-and-white spreads in a spotlight that trails the cursor and fades out when it leaves. |
| Pull-cord              | `PullCord.jsx`           | A CSS cord with a `rotate` keyframe sway, fixed to the top edge and faded out (and de-tabbed) by an `IntersectionObserver` once the hero leaves the viewport. Dragging it stretches the cord through `--pull` and, past 40 px, flips the theme; the sway pauses while you hold it. |
| Theme change           | `ThemeFlash.jsx`         | A pointer-events-transparent wash that ramps to full over ~260 ms, drops the theme tokens mid-peak, then lifts — the bulb flash that covers a swap CSS cannot tween. |
| Local time pill        | `Header.jsx` + `useLocalClock` | `Intl.DateTimeFormat` in `Asia/Kolkata`, re-read every minute. |
| Story timeline         | `Timeline.jsx`           | The year panel is held with `position: sticky` while the steps scroll past it. The active step is whichever row's centre is nearest the viewport centre; the digit strip and the ember glow follow it. Sticky is used deliberately instead of a second fixed pin so the last steps are never clipped on short laptop screens. |
| Rolling year           | `DigitRoller.jsx`        | A 0–9 column per digit, moved with `translateY(-{n}em)`.             |
| Route changes          | `Curtain.jsx`            | Panels wipe up over the screen, the route swaps while covered, then they drop away. |
| Cursor glow            | `CursorGlow.jsx`         | rAF lerp toward the pointer; disabled on touch and reduced-motion.   |
| Magnetic buttons       | `Magnetic.jsx`           | Framer Motion `useSpring` on pointer position.                       |
| Hover project previews | `ProjectCard.jsx`        | `gsap.quickTo` follows the cursor inside the hovered row.            |
| Smooth scroll          | `lib/smoothScroll.js`    | Lenis, driven off `gsap.ticker` so it stays in step with ScrollTrigger. |

**Accessibility and fallbacks**

- `prefers-reduced-motion` skips the preloader animation, disables pinning, and turns
  transitions into instant state changes (see the `.no-motion` and reduced-motion
  blocks in `src/index.css`). The notepad still rotates its roles, the theme still
  switches, and the portrait spotlight still develops — they just cut instead of moving.
  Doors still stand ajar and still open on click, but the camera push is skipped.
- Below 900 px or on coarse pointers the doors wall becomes a native
  `scroll-snap` row you flick, and the timeline is a plain stacked list.
- "Skip to content" link, focus trapping in the menu and the contact modal, ESC to
  close either, and a live `Asia/Kolkata` clock that updates every minute.
- Everything that moves uses `transform` or `opacity`; no layout-thrashing
  `width`/`top` animation.

---

## 5. Deploying

Both configs are already in the repo. The one thing a single-page app needs is a
**rewrite**: a deep link like `/full-stack` is not a real file, so the host must
serve `index.html` for it instead of returning 404.

### Vercel

[`vercel.json`](vercel.json) is committed, so you can just push and import:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

The relevant part, if you ever need it by hand:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

[`netlify.toml`](netlify.toml) is committed:

```bash
npm i -g netlify-cli
netlify deploy --build            # preview URL
netlify deploy --build --prod     # production
```

Or connect the Git repository in the Netlify dashboard — it picks up the TOML
automatically. The rewrite rule:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

`status = 200` is the important bit — it rewrites rather than redirects, so the
address bar keeps the real route.

### Any other static host

Run `npm run build` and upload `dist/`. If the host has no config file, add its
equivalent of "serve `/index.html` for requests that don't match a file"
(Cloudflare Pages handles SPA routing automatically; GitHub Pages needs a `404.html`
fallback or a routing-aware setup).

---

## 6. Before you publish

- [ ] Replace every `[PASTE …]` in `src/data/portfolio.js` with a real URL.
- [ ] Swap `public/resume.pdf` for your actual résumé (keep the same filename).
- [ ] Your portrait is in at `public/aswin.png`. A different photo or ratio? See §2 —
      the filename, the `width`/`height` on the `<img>` tags, and the card crop all
      have to agree.
- [ ] Put real screenshots in `public/projects/` and update each project's
      `screenshot` path.
- [ ] Replace `https://aswinmanoj.dev/` with your real domain in
      [`index.html`](index.html) — it appears in the canonical, `og:url`, `og:image`
      and `twitter:image` tags — and swap `public/og-cover.svg` for a real 1200×630 image.
- [ ] Edit the `<url>` entries in [`public/sitemap.xml`](public/sitemap.xml) if you
      change any route.
- [ ] Check the two things you cannot test locally: the contact modal hands off to a
      real mail client, and the certificate links open in a new tab.
- [ ] Walk both rooms: pull the cord in light and dark, and check any colour you
      added has a `[data-theme='light']` override (§3) so nothing disappears
      against the lit wall.

## 7. File map

```
public/
  aswin.png          your portrait — 408×612 transparent cut-out (hero)
  aswin.svg          colour stand-in, used only if the PNG is missing
  projects/          project screenshots (SVG placeholders included)
  resume.pdf         linked from the menu and footer
  og-cover.svg       social card
  robots.txt, sitemap.xml
src/
  data/portfolio.js  ← all editable content lives here
  lib/               hooks (incl. useLocalClock, useTheme), Lenis setup, the
                     navigate event bus
  components/        Preloader, Header, MenuOverlay, Hero, Notepad, PullCord,
                     ThemeFlash, DoorsWall, Timeline, DigitRoller, ProjectList,
                     ProjectCard, CertCard, CertGrid, ContactModal,
                     Footer, CursorGlow, PageTransition, Curtain, Magnetic,
                     BackToTop, TechStack, CtaBlock
  pages/             Home, SkillPage, StoryPage, CertificationsPage, ContactPage, NotFound
  index.css          design tokens (both themes' `--c-*` triplets) + component
                     layer, and the "skeuomorphic kit" (.brass,
                     .door-frame/.door-leaf/.door-interior, .wall-base,
                      .notepad*, .pullcord*, .portrait__bw, .theme-flash)
                     that draws the props in pure CSS
vercel.json, netlify.toml
```
