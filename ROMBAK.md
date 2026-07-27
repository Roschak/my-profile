Build Prompt: Cinematic AI Creator Landing Page for Frihandhika

Build a single-page landing site for **Frihandhika**, a personal AI, web development, prompt system, and AI agent creator brand. The page has two full-height sections: **Hero + Capabilities**, both using looping background videos with custom JS crossfade, a shared liquid-glass design system, and Framer Motion entrance animations.

The visual direction should feel cinematic, premium, dark, futuristic, technical, creative, and personal. Keep the original cinematic space-travel feeling, but reframe the message around AI workflows, prompt systems, web development, and building faster with AI agents.

Do not remove or simplify the original technical mechanics. Keep the exact tech stack, video behavior, liquid-glass utilities, layout structure, animation style, and video URLs.

---

# Tech stack pinned, CDN-only

Use these exact scripts:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script src="https://unpkg.com/framer-motion@11.11.17/dist/framer-motion.js"></script>
<script>window.Motion = window.FramerMotion;</script>
```

Body background:

```css
body {
  background: #000;
}
```

Page is a React app mounted on `#root`.

All components are inside `<script type="text/babel">` files and should export via `window.X = X`.

---

# Fonts

Use Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Tailwind config adds:

```js
fontFamily: {
  heading: ['Instrument Serif', 'serif'],
  body: ['Barlow', 'sans-serif'],
}
```

Default border radius override:

```js
borderRadius: {
  DEFAULT: "9999px",
}
```

So bare `rounded` becomes pill-shaped.

Font usage:

* Heading/accent font: `Instrument Serif`, always italic in use.
* Body/UI font: `Barlow`.

---

# Liquid-glass utilities

Add this exact CSS inside a `<style>` block.

```css
.liquid-glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass-strong {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}

.liquid-glass-strong::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%,
    rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%,
    rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

---

# FadingVideo component custom JS crossfade, no CSS transitions

Create a reusable `FadingVideo` component.

It wraps:

```html
<video autoPlay muted playsInline preload="auto">
```

Initial opacity:

```js
opacity: 0
```

Constants:

```js
const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;
```

Behavior:

* `fadeTo(target, duration)` uses `requestAnimationFrame`.
* It reads the current opacity from `video.style.opacity` so every new fade resumes from wherever the last one left off.
* Each new `fadeTo` call must call `cancelAnimationFrame` on the previous rAF id before starting a new one.
* On `loadeddata`: set opacity to `0`, call `play()`, then `fadeTo(1)`.
* On `timeupdate`: if `fadingOutRef` is not set and `duration - currentTime <= 0.55` and `> 0`, flip the ref and `fadeTo(0)`.
* On `ended`: set opacity to `0`; after `setTimeout(100ms)`, reset `currentTime = 0`, call `play()`, clear `fadingOutRef`, and `fadeTo(1)`.
* The `loop` attribute is OFF. Looping is implemented manually via `ended`.
* Cleanup on unmount:

  * cancel rAF
  * remove all event listeners

Important:

* Do not use CSS transitions on videos.
* Fades must be rAF-driven.

---

# Shared inline SVG icons

Use inline SVGs, currentColor stroke/fill.

## ArrowUpRight

24×24:

```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M7 17L17 7" />
  <path d="M7 7h10v10" />
</svg>
```

## Play

24×24:

```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <polygon points="6 4 20 12 6 20 6 4" />
</svg>
```

---

# Section 1 — Hero full viewport, black bg

Create a full viewport hero section.

Background video:

* Use 120% width/height.
* Top-aligned.
* Centered horizontally.
* Focal point is the top of the frame.

Video source:

```text
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4
```

Video class:

```html
absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0
```

Video style:

```js
{ width: "120%", height: "120%" }
```

No overlay.

The `z-10` layer holds:

1. Navbar
2. Hero content
3. Partners row

---

## Navbar fixed top

Navbar:

* Fixed at `top-4`
* `px-8`
* `lg:px-16`
* `z-50`

Layout:

* Left logo
* Center desktop nav
* Right invisible spacer

### Left logo

Create a `48×48` liquid-glass circle.

Inside it, place italic serif lowercase:

```text
f
```

Use `Instrument Serif`, italic, white.

This represents **Frihandhika**.

### Center nav desktop only

Create a liquid-glass pill:

```html
liquid-glass px-1.5 py-1.5
```

Inside it, add 5 text links:

1. `Home`
2. `Prompts`
3. `AI Agents`
4. `Web Builds`
5. `Courses`

Each link:

```html
px-3 py-2 text-sm font-medium text-white/90 font-body
```

After the links, add a white pill button:

Text:

```text
Get Prompts
```

Add `ArrowUpRight` icon.

Button style:

* `bg-white`
* `text-black`
* `whitespace-nowrap`
* pill-shaped

### Right spacer

Add a `48×48` invisible spacer to balance the logo.

---

# Hero content centered

Hero content wrapper:

* Centered
* `pt-24`
* `px-4`
* `flex-1`
* Vertically centered

All hero content should animate with Framer Motion.

Base motion initial:

```js
{
  filter: "blur(10px)",
  opacity: 0,
  y: 20
}
```

Use easeOut.

---

## Badge delay 0.4s

Create a liquid-glass rounded-full pill.

Inside it:

* White pill chip:

```text
New
```

Chip class:

* `bg-white`
* `text-black`
* `px-3`
* `py-1`
* `text-xs`
* `font-semibold`

Badge text:

```text
AI Agent Prompt Systems for Modern Builders
```

Text style:

* `text-sm`
* `text-white/90`
* `pr-3`

---

## Headline — BlurText component

Use the `BlurText` component described below.

Headline text:

```text
Build Faster With AI Beyond Ordinary Limits
```

Classes:

```html
text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl justify-center tracking-[-4px]
```

The headline should feel cinematic and aspirational, like the original space-travel prompt, but now about AI-powered creation.

---

## Subheading delay 0.8s

Class:

```html
mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight
```

Text:

```text
Discover practical AI workflows, prompt systems, and web development experiments that help creators, students, and builders turn ideas into real digital products faster.
```

---

## CTAs delay 1.1s

Wrapper:

```html
flex items-center gap-6 mt-6
```

Primary CTA:

* Class:

```html
liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white
```

* Text:

```text
Start Building
```

* Add `ArrowUpRight` icon, `h-5 w-5`

Secondary CTA:

* Bare text link
* Text:

```text
Watch Live Build
```

* Add `Play` icon, `h-4 w-4`, filled

---

## Stats row delay 1.3s

Wrapper:

```html
flex items-stretch gap-4 mt-8
```

Create two liquid-glass cards:

```html
liquid-glass p-5 w-[220px] rounded-[1.25rem]
```

Each card:

* Top: white `28×28` outline SVG icon
* Bottom: large number in Instrument Serif italic white:

```html
text-4xl tracking-[-1px] leading-none
```

* Label below:

```html
text-xs text-white font-body font-light mt-2
```

### Card 1

Number:

```text
100+
```

Label:

```text
AI Workflow Experiments
```

Icon: use a clock or system icon.

### Card 2

Number:

```text
50+
```

Label:

```text
Prompt Systems Built
```

Icon: use a globe, network, or automation icon.

---

# Partners / Featured row bottom of hero delay 1.4s

Place at the bottom of the hero.

Wrapper:

```html
flex flex-col items-center gap-4 pb-8
```

Liquid-glass rounded-full chip:

```html
px-3.5 py-1 text-xs font-medium text-white
```

Text:

```text
Building with modern AI, web, and automation tools
```

Row of 5 names:

```text
React · Tailwind · Vite · Agents · Prompts
```

Style:

* `Instrument Serif`
* italic
* white
* `text-2xl`
* `md:text-3xl`
* `tracking-tight`
* `gap-12`
* `md:gap-16`

---

# BlurText component word-by-word blur-in

Create a `BlurText` component.

Use `IntersectionObserver`.
Trigger when 10% visible.

Split text by spaces.

Each word is a `motion.span`.

Initial:

```js
{
  filter: "blur(10px)",
  opacity: 0,
  y: 50
}
```

Animate with 3-step keyframes:

Step 1:

```js
{
  filter: "blur(10px)",
  opacity: 0,
  y: 50
}
```

Step 2:

```js
{
  filter: "blur(5px)",
  opacity: 0.5,
  y: -5
}
```

Step 3:

```js
{
  filter: "blur(0px)",
  opacity: 1,
  y: 0
}
```

Animation:

* duration: `0.7`
* stepDuration: `0.35 × 2`
* times: `[0, 0.5, 1]`
* ease: `easeOut`
* stagger delay:

```js
delay = (i * 100) / 1000
```

Word style:

* `display: inline-block`
* `marginRight: 0.28em`

Do not use non-breaking space because `letter-spacing: -4px` eats `nbsp`.

Parent `<p>`:

* `display: flex`
* `flexWrap: wrap`
* `justifyContent: center`
* `rowGap: 0.1em`

---

# Section 2 — Capabilities min-h-screen, black bg

Create a second full-height section.

Background video:

* Full-bleed
* No 120% scale

Video source:

```text
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4
```

Video class:

```html
absolute inset-0 w-full h-full object-cover z-0
```

Use the same `FadingVideo` treatment.

No overlay.

---

# Capabilities content

Content wrapper:

```html
relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen
```

Header:

* `mb-auto`

Kicker:

```html
text-sm font-body text-white/80 mb-6
```

Text:

```text
// Capabilities
```

Heading:

```html
font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]
```

Text with line break:

```text
Creation
evolved
```

Use `<br/>` between the two words.

---

# Capabilities cards

Create three cards.

Grid:

```html
grid grid-cols-1 md:grid-cols-3 gap-6 mt-16
```

Each card:

```html
liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col
```

Top row:

```html
flex items-start justify-between gap-4
```

Left icon box:

* `44×44`
* nested liquid-glass square
* `rounded-[0.75rem]`
* white icon
* `h-6 w-6`
* `text-white`

Right tags:

* `flex flex-wrap justify-end gap-1.5 max-w-[70%]`
* Four small liquid-glass pill tags:

```html
rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap
```

Middle:

* `flex-1` spacer

Bottom:

* `mt-6`

Title:

```html
font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none
```

Body:

```html
mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]
```

---

## Card 1 — Prompt Systems

Title:

```text
Prompt Systems
```

Body:

```text
Turn messy ideas into structured, reusable prompts for web development, content creation, learning, research, and AI agent execution.
```

Tags:

* `Reusable`
* `Structured`
* `Creator Ready`
* `AI Workflow`

Icon:
Use the Material image-style icon path exactly:

```svg
<svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
  <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z" />
</svg>
```

---

## Card 2 — AI Agent Execution

Title:

```text
AI Agent Execution
```

Body:

```text
Use AI agents to plan projects, generate code, debug issues, research faster, and move from concept to working prototype with less friction.
```

Tags:

* `Plan Fast`
* `Code Assist`
* `Debug Flow`
* `Ship Faster`

Icon:
Use the Material movie-style icon path exactly:

```svg
<svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
  <path d="M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z" />
</svg>
```

---

## Card 3 — Web Build System

Title:

```text
Web Build System
```

Body:

```text
Transform prompts and workflows into real websites, landing pages, product prototypes, and full-stack experiments using modern frontend tools.
```

Tags:

* `React`
* `Tailwind`
* `Prototype`
* `Production Feel`

Icon:
Use the Material lightbulb-style icon path exactly:

```svg
<svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z" />
</svg>
```

---

# Notes

* All text must be white.
* No green.
* No colorful gradient backgrounds.
* No dark overlay on videos.
* Videos are full-bleed.
* Contrast comes from the liquid-glass chrome.
* No CSS transitions on the videos.
* Video fades must be driven by requestAnimationFrame using the `FadingVideo` spec.
* Keep the cinematic feeling from the original space-travel landing page.
* Reframe the brand from space travel to **Frihandhika**, AI workflows, prompt systems, AI agents, web development, and creator education.
* Framer Motion dev warnings about list keys can be suppressed with a `console.error` filter wrapper because they are benign.
* Make sure the final page works as a single-page CDN-only React app.
* Make sure the result is responsive on mobile and desktop.
* Keep the code clean, organized, and production-ready.
