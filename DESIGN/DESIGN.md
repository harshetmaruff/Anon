---
name: Anon Dark Minimalist
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#88929b'
  outline-variant: '#3e4850'
  surface-tint: '#89ceff'
  primary: '#89ceff'
  on-primary: '#00344d'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#006591'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb86e'
  on-tertiary: '#492900'
  tertiary-container: '#de8712'
  on-tertiary-container: '#4d2b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
  canvas-bg: '#020617'
  surface-card: '#0f172a'
  border-subtle: '#1e293b'
  text-primary: '#f8fafc'
  text-secondary: '#94a3b8'
  text-muted: '#64748b'
  accent-sky: '#0ea5e9'
  accent-sky-hover: '#38bdf8'
  status-secure: '#34d399'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.015em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.025em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 1.75rem
---

## Brand & Style

Anon is an ephemeral, end-to-end encrypted messaging interface designed around privacy, trust, and frictionless utility. The visual personality blends technical minimalism with modern translucent dark mode aesthetics—combining the clean focus of developer-first tooling with the refined polish of contemporary privacy-focused communication platforms.

### Design Movement & Mood
- **Technical Minimalist Glassmorphism:** Deep slate surfaces (`#020617` to `#0f172a`), subtle hairline borders (`border-slate-800`), and soft backdrop blurs create a secure, focused sanctuary.
- **Accented Precision:** Sky blue (`#0ea5e9` / `#38bdf8`) provides high-visibility primary focus without excessive visual noise, complemented by emerald verification indicators that communicate cryptographic security.
- **Tone:** Unobtrusive, secure, calm, and effortlessly modern.

## Colors

The palette revolves around deep neutral slate foundations with deliberate accent highlights:

- **Background & Canvas:** Extremely deep slate (`#020617` / `slate-950`), grounding the interface with high contrast against content.
- **Card & Elevated Surfaces:** Deep blue-slate (`#0f172a` / `slate-900`) layered with 90% opacity and subtle backdrop filtration.
- **Borders & Dividers:** Subtle slate (`#1e293b` / `slate-800`) applied at 80% opacity to maintain crisp boundaries without harsh lines.
- **Primary Interaction:** Electric Sky Blue (`#0ea5e9` / `sky-500`) with hover shift to `#38bdf8` (`sky-400`). Primary action text resolves to deep dark slate (`#020617`) for peak legibility.
- **Status & Trust:** Emerald (`#34d399` / `emerald-400`) signals active end-to-end encryption.
- **Typography hierarchy:** Bright slate (`#f8fafc`) for headers, neutral slate (`#94a3b8`) for secondary copy, and subdued slate (`#64748b`) for hints and footnotes.

## Typography

The type system is powered entirely by **Inter**, leveraging its dense legibility, geometric optical metrics, and neutrality.

- **Headlines:** Set with negative letter-spacing (`tracking-tight`) to ensure compact, confident framing.
- **Form Labels & Badges:** Set at `0.75rem` (12px) with `font-weight: 500` and slight positive tracking (`tracking-wide`) to enhance scannability in technical environments.
- **Body & Inputs:** Grounded at `0.875rem` (14px) for optimized form entry and high information density.
- **Scale:** Restrained scale ceiling (max `1.25rem` / 20px) keeping the modal dialogue focused and compact on both mobile and desktop viewports.

## Layout & Spacing

Anon employs a centralized modal workflow built on a fixed single-column container (`max-width: 440px`) centered within an expansive viewport canvas.

### Rhythm & Alignment
- **Canvas Margins:** Minimum `1rem` on mobile, scaling to `1.5rem` on desktop.
- **Card Padding:** Internal card padding is strictly `1.75rem` (`px-7 pt-7 pb-5` / `p-7`) to create breathable structural grouping.
- **Input Gaps:** Form fields maintain an inner vertical label-to-control rhythm of `0.375rem` (`space-y-1.5`) and a group gap of `1rem` (`space-y-4`).
- **Header & Chrome:** Header bars use `px-6 py-4` with sticky viewport pinning and frosted glass backdrop blur.

## Elevation & Depth

Visual depth is achieved through translucent planar layering, hairline borders, and targeted directional ambient shadows:

1. **Base Layer (Canvas):** `#020617` solid.
2. **Elevated Header:** `bg-slate-950/60` with `backdrop-blur-md` and a 1px border `border-slate-800/80`.
3. **Interactive Modal Card:** `bg-slate-900/90` with `backdrop-blur-sm`, hairline stroke `border border-slate-800/80`, and a dual shadow effect (`shadow-xl shadow-black/40`).
4. **Recessed Wells & Input Fields:** Inputs and segmented pill containers use recessed wells (`bg-slate-950/70` with `border border-slate-800`) to create tactile inset contrast against the card surface.
5. **Interactive Glows:** Primary action elements project a subtle colored ambient radiance (`shadow-md shadow-sky-500/10`), indicating energy and readiness.

## Shapes

The interface embraces a modern rounded aesthetic (`roundedness: 2`) with consistent geometry:

- **Primary Cards & Containers:** `1rem` (`rounded-2xl`, 16px) for major card enclosures.
- **Inputs & Action Buttons:** `0.75rem` (`rounded-xl`, 12px) balancing compactness with soft touch targets.
- **Segmented Controls & Badges:** `0.5rem` (`rounded-lg`, 8px) for inner switch segments; pills (`rounded-full`) reserved strictly for status pills and encryption indicators.
- **Icons & Emblems:** Nested inside `rounded-lg` square badges.

## Components

### Buttons
- **Primary Action Button:** High-saturation sky blue fill (`bg-sky-500 hover:bg-sky-400`), dark contrasting text (`text-slate-950 font-medium`), `rounded-xl`, `py-2.5 px-4`, enhanced with `shadow-md shadow-sky-500/10`.
- **Segmented Switch Tabs:** Contained inside an inset track (`bg-slate-950/70 rounded-xl p-1 border border-slate-800/80`). Active tab has elevated surface (`bg-slate-800 text-white shadow-sm`), inactive tab is muted (`text-slate-400 hover:text-slate-200`).

### Input Fields
- **Text Inputs:** Recessed dark fill (`bg-slate-950/70`), 1px border (`border-slate-800`), `rounded-xl`, `px-3.5 py-2.5`, placeholder color `text-slate-500`.
- **Focus State:** Transitions smoothly with `focus:border-sky-500` and an illuminated outer ring `focus:ring-2 focus:ring-sky-500/20`.

### Status Badges & Chips
- **Verification Chip:** Enclosed in `rounded-full bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 text-xs`. Includes a glowing green status dot (`w-2 h-2 rounded-full bg-emerald-400`).

### Informational Callouts
- **Notice Banners:** Subdued inset background (`bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5`), featuring an aligned sky blue micro-icon paired with `text-xs text-slate-400`.

### Cards
- **Dialog Container:** Max width `440px`, backdrop blurred, bound with low-contrast borders and deep drop-shadows to float over the dark canvas.