# UI/UX Pro Max - Design Intelligence

This comprehensive skill provides design guidance for web and mobile applications with 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## When to Use

Apply this skill for tasks involving UI structure, visual design decisions, interaction patterns, or user experience quality control. It's essential when changes affect how features look, feel, move, or are interacted with.

## Ten Priority Categories

The skill organizes guidance into priority-ranked rule categories:

1. **Accessibility** (CRITICAL) — Contrast ratios, focus states, alt text, keyboard navigation
2. **Touch & Interaction** (CRITICAL) — Target sizes (44×44pt minimum), feedback timing, gesture handling
3. **Performance** (HIGH) — Image optimization, lazy loading, layout stability
4. **Style Selection** (HIGH) — Design system consistency, icon usage, platform adaptation
5. **Layout & Responsive** (HIGH) — Mobile-first design, breakpoints, safe area compliance
6. **Typography & Color** (MEDIUM) — Font systems, contrast pairs, semantic tokens
7. **Animation** (MEDIUM) — Timing (150-300ms), easing, reduced-motion support
8. **Forms & Feedback** (MEDIUM) — Labels, error placement, validation strategy
9. **Navigation Patterns** (HIGH) — Bottom nav limits, deep linking, back behavior
10. **Charts & Data** (LOW) — Type selection, accessibility, responsive scaling

## Workflow Steps

**Step 1:** Analyze product type, audience, and style keywords

**Step 2:** Generate design system using `--design-system` flag for comprehensive recommendations

**Step 2b:** Optionally persist system with `--persist` for hierarchical retrieval across sessions

**Step 3:** Supplement with domain-specific searches (`--domain <domain>`) as needed

**Step 4:** Apply stack-specific guidelines (`--stack react-native`)

## Key Rules

Critical rules include: no emoji icons (use SVG), touch targets minimum 44×44pt, animation durations 150-300ms, color contrast 4.5:1 for normal text, bottom navigation limited to 5 items, and keyboard accessibility throughout.

## Pre-Delivery Verification

Before implementation, verify: visual polish (consistent icons, no layout shift on interaction), interaction quality (clear feedback, proper timing), contrast in both themes, layout safety (respects safe areas), and accessibility compliance (labels, focus order, reduced motion support).
