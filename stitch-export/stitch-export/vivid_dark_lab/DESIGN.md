---
name: Vivid Dark Lab
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#948ea1'
  outline-variant: '#494455'
  surface-tint: '#cfbdff'
  primary: '#cfbdff'
  on-primary: '#3a0093'
  primary-container: '#9e79ff'
  on-primary-container: '#320081'
  inverse-primary: '#6c38de'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbdff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#530dc6'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

This design system targets high-growth tech startups and creative developer tools, evoking an atmosphere of high-energy precision. The aesthetic is a hybrid of **Modern Minimalism** and **Neon-Infused Dark Mode**, optimized for 2026's digital landscape where high-refresh-rate displays demand vibrant, legible contrast.

The personality is innovative, fast-moving, and technically superior. It utilizes "deep-space" charcoal surfaces to make neon accents pop, ensuring that real-time data and primary actions command immediate user attention without overwhelming the visual field.

## Colors

The palette is built on a "Rich Charcoal" foundation, utilizing deep navy-blacks for background surfaces to provide more depth than pure black. 

- **Primary (Vibrant Violet):** Used for main CTA buttons, active navigation states, and brand-defining flourishes.
- **Secondary (Electric Cyan):** Reserved for live status indicators, progress bars, and "real-time" data signals.
- **Tertiary (Emerald Green):** Dedicated to success states, positive growth metrics, and secondary confirmation actions.
- **Neutrals:** A scale of blue-toned greys ensures that even low-priority text maintains a cohesive "cool" temperature.

## Typography

The design system relies on **Inter** for its utilitarian precision and exceptional legibility on high-density screens. 

Headlines utilize tighter letter-spacing and heavier weights to feel impactful and "engineered." Body text maintains generous line-height for readability against dark backgrounds. Small labels and metadata should use the `label-caps` style with increased letter-spacing to ensure clarity at small scales.

## Layout & Spacing

This design system uses a **Fluid Grid** with a strict 4px baseline rhythm. 

- **Desktop:** 12-column grid with 24px gutters and wide 64px margins to create a focused, premium feel.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px margins.

Spacing should be applied in multiples of 4 (4, 8, 12, 16, 24, 32, 48, 64) to maintain mathematical harmony across all layouts. Heavy use of white space (or "dark space") is encouraged to separate functional groups.

## Elevation & Depth

Depth is established through **Tonal Layering** and **Soft Luminescence** rather than traditional heavy shadows.

- **Level 0 (Background):** Deepest charcoal (`#020617`).
- **Level 1 (Cards/Containers):** Slightly lighter navy-grey (`#0F172A`).
- **Level 2 (Modals/Popovers):** Surface container (`#1E293B`) with a very subtle, 1px semi-transparent border (`rgba(255,255,255,0.1)`).
- **Accents:** Use outer glows (shadows with the primary or secondary color, high blur, low opacity) to indicate active "glowing" states or critical focus areas.

## Shapes

The shape language is **Rounded**, providing a sophisticated balance between technical and approachable. 

Main UI components like buttons and cards use a `0.5rem` (8px) radius. Larger layout containers use `1rem` (16px). For icons and small tags, a full pill-shape is used to create organic contrast against the structured grid.

## Components

- **Buttons:** Primary buttons use a solid Violet fill with white text. Secondary buttons use a Cyan outline with a subtle background tint on hover.
- **Input Fields:** Darker than the container surface, using a 1px border that glows Cyan when focused.
- **Chips/Tags:** Used for status. Real-time tags should use a Cyan pulse animation next to the text.
- **Cards:** No shadows; use subtle 1px borders to define edges. On hover, the border color should shift to the Primary Violet.
- **Progress Indicators:** Use high-contrast Cyan against a dark track for maximum visibility.
- **Navigation:** Vertical sidebars with "ghost" icons that illuminate in Violet when active.