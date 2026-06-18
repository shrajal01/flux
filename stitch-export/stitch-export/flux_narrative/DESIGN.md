---
name: Flux Narrative
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#00a74b'
  on-tertiary-container: '#003111'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 20px
  margin-safe: 32px
---

## Brand & Style

This design system embodies a "Hyper-Minimalist Performance" aesthetic, drawing inspiration from the precision of developer tools and the elegance of premium productivity software. The brand personality is confident, silent, and instantaneous—designed for high-velocity communication without the cognitive load of traditional social interfaces.

The visual direction utilizes a **Modified Minimalism** mixed with **Subtle Glassmorphism**. It prioritizes extreme clarity, utilizing negative space not just as a buffer, but as a structural element that directs focus toward real-time presence and content. The atmosphere is "Dark Mode First," evoking a sophisticated, late-night studio environment where focus is paramount. 2026 design cues include ultra-fine borders (0.5px), monochromatic depth, and kinetic feedback that makes the software feel alive.

## Colors

The palette is anchored in a "Rich Charcoal" black, which provides a deeper, more premium foundation than standard grays. 

- **Primary Accent (Violet):** Used for primary actions, focus states, and brand-critical highlights.
- **Realtime Accent (Cyan):** Reserved exclusively for activity indicators, streaming states, and "live" metadata to signal the platform's speed.
- **Success/Online (Green):** A vibrant, high-saturation green for presence indicators.
- **Neutrals:** A scale of high-contrast whites and zinc-tinted grays. 
- **Surface Strategy:** Backgrounds utilize 100% black in certain areas to "disappear" on OLED screens, while elevated surfaces use a subtle 4% luminance shift.

## Typography

The typography system relies on **Inter** for its systematic reliability and **Geist** for technical precision in labels and monospaced data.

- **Scale:** High contrast between display titles and body text creates a clear hierarchy. 
- **Character:** Headlines use tight letter-spacing and medium weights to feel "locked-in" and authoritative.
- **Readability:** Body text uses a generous 1.6 line-height to ensure long-form conversations remain legible against the dark background.
- **Mobile:** For mobile devices, `display-lg` scales down to 32px, while `body-md` remains the standard for chat bubbles to maximize information density.

## Layout & Spacing

This design system uses a **Fluid/Flexible Model** that eschews traditional heavy-border containers in favor of logical grouping through alignment.

- **Grid:** A 12-column layout for desktop, but the "Command Center" (sidebar) remains a fixed 280px width to mimic the utility of Arc or Raycast.
- **Rhythm:** An 8pt spatial system is used for component architecture, but 4pt increments are permitted for fine-grained typography-to-icon alignment.
- **Negative Space:** Use `xl` (40px) spacing between major functional blocks to maintain the "Minimalist" promise. Avoid dividing lines where whitespace can suffice.

## Elevation & Depth

Depth is signaled through **Luminance and Blurs** rather than traditional drop shadows.

- **The Base:** The lowest layer is the `#0A0A0B` canvas.
- **Tonal Layers:** Floating panels or context menus use a slightly lighter fill (`#161618`) with a `1px` inner border (stroke) at 10% white opacity.
- **Glassmorphism:** Overlays and sidebars use a `24px` backdrop blur with a `rgba(10, 10, 11, 0.7)` tint. 
- **Glow Effects:** Critical states (like a new message notification) utilize a subtle, wide-spread outer glow using the Primary or Realtime accent colors (15% opacity, 20px blur) to simulate "light emission" on the dark canvas.

## Shapes

The shape language is "Refined Geometric." 

- **Standard Radius:** 8px (`rounded-md`) for most UI components like inputs and buttons. 
- **Large Radius:** 16px (`rounded-xl`) for main application panels or persistent floating elements.
- **Interactive States:** Buttons may transition from `rounded-md` to slightly more rounded on active press to simulate physical tactility.
- **Icons:** Use a consistent 1.5px stroke weight with rounded caps to match the typography's softness.

## Components

- **Buttons:** Primary buttons are solid Violet with white text. Secondary buttons are "Ghost" style: no fill, 1px subtle border, becoming solid on hover.
- **Messaging Bubbles:** Not traditional bubbles. Use "No-Fill" containers for the user's text with a simple vertical accent line of 2px to the left (Primary color for self, Neutral for others).
- **Presence Indicators:** Small 8px rings. Online is solid Green; "Busy" is a Green ring with a hollow center; "In-Call" uses the Realtime Cyan with a pulse animation.
- **Inputs:** Search and message bars are ultra-minimal—just a bottom border of 1px that illuminates to Primary Violet on focus.
- **Chips/Status:** Low-profile, using `label-md` typography. Backgrounds for chips should be 10% opacity of the accent color (e.g., 10% Violet for a "Private" tag).
- **Command Palette:** A central floating component (Raycast style) with a `40px` backdrop blur and `1px` subtle white border. Use `mono-sm` for keyboard shortcuts (`CMD+K`).