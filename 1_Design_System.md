# Design System Documentation

## 1. Overview & Creative North Star: "The Energetic Explorer"

This design system moves away from the static, blocky layouts of traditional educational apps to embrace **The Energetic Explorer**. Our North Star is a digital environment that feels like a premium, tactile adventure kit—sophisticated enough for modern parents, yet vibrant and kinetic enough for children.

We break the "template" aesthetic by employing **intentional asymmetry** and **tonal layering**. Elements should never feel "pasted" on a flat background; they should feel nested, like a series of physical discoveries within a lush, forest-clearing environment. By replacing rigid grids with overlapping surfaces and generous, organic roundedness, we create a signature experience that is both premium and whimsical.

---

## 2. Colors & Visual Soul

The palette shifts from primary "toy" colors to a high-contrast, editorial mix of deep Navy, electric Pink, and organic Forest Green.

### Core Palette
*   **Primary (Navy Blue - #001f3f):** Used as our anchor. It provides the "Sophisticated" weight, appearing in `primary_container` for deep navigational elements.
*   **Secondary (Vibrant Pink - #FF69B4):** Our spark of energy. Used for high-action CTAs and interactive "discoveries."
*   **Tertiary (Forest Green - #2E8B57):** The grounding element. Connects the UI to the forest theme without being literal.

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are strictly prohibited for sectioning.** We define boundaries through background color shifts. 
*   Place a `surface_container_low` section on a `surface` background to create a zone.
*   Use `outline_variant` at **10% opacity** only when a visual guide is mission-critical for accessibility.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack.
1.  **Base:** `surface` (#faf9fc).
2.  **Sectioning:** `surface_container_low` (#f4f3f6).
3.  **Interactive Cards:** `surface_container_lowest` (#ffffff) to provide "pop."

### Signature Textures
Avoid flat fills on large Hero areas. Use a subtle linear gradient from `primary` to `primary_container` (at a 135-degree angle) to provide a "velvet" depth that feels expensive and intentional.

---

## 3. Typography: The Playful Authority

We use **Plus Jakarta Sans** across all scales. Its geometric but warm terminals strike the perfect balance between "Modern Tech" and "Kid-Friendly."

*   **Display Scale (Lg: 3.5rem):** Reserved for "Eureka" moments. Use tight letter-spacing (-0.02em) to make the large type feel like a custom logo.
*   **Headline Scale (Lg: 2rem):** Used for chapter titles. These should often be placed with intentional asymmetry (e.g., left-aligned with a significant top-margin offset).
*   **Body Scale (Md: 0.875rem):** Set with generous line-height (1.6) to ensure readability for early readers.
*   **Label Scale (Md: 0.75rem):** Always uppercase with +0.05em tracking when used in `secondary` or `tertiary` colors to denote "Pro-tips" or "Explorer Stats."

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "standard." We use **Ambient Depth**.

*   **The Layering Principle:** Instead of a shadow, place a `surface_container_highest` card inside a `surface_container` area. The difference in tonal value creates a natural lift.
*   **Ambient Shadows:** For floating elements (like a Capy-avatar), use a shadow tinted with the `on_surface` color at **6% opacity**, with a blur radius of at least `32px`. 
*   **Glassmorphism:** For top navigation or floating "Adventure HUDs," use a `surface` color at 70% opacity with a `20px` backdrop-blur. This allows the vibrant Forest Green and Pink elements to bleed through the UI, softening the experience.

---

## 5. Components

### Buttons (The "Pill" Standard)
All buttons use the `full` (9999px) roundedness token.
*   **Primary:** `secondary_container` background with `on_secondary_container` text. This ensures the Vibrant Pink drives the action.
*   **Tertiary:** `tertiary_fixed` background. Used for "Nature" or "Collection" based actions.
*   **State Change:** On hover/tap, do not just darken; shift the scale to 0.98 for a tactile "click" feel.

### Cards & Discovery Modules
*   **Forbid Dividers:** Use `3.5rem` (Spacing-10) of vertical whitespace to separate content.
*   **Shape:** Use `xl` (3rem) rounded corners for top-level containers and `md` (1.5rem) for nested items. This "nesting of curves" reinforces the whimsical theme.

### Input Fields
*   **Styling:** No bottom-line only inputs. Use a `surface_variant` fill with an `lg` (2rem) corner radius. 
*   **Focus:** Transition the background to `primary_fixed` with a soft `primary` glow.

### Signature Component: The "Adventure Path" List
Instead of a standard vertical list, use an interleaved layout. Item 1 is left-aligned, Item 2 is right-aligned with a 15% indent. This mimics a winding forest path, breaking the rigid "app" feel.

---

## 6. Do's and Don'ts

### Do
*   **Do** use overlapping elements. A character illustration should "break the box" of a container to create 3D depth.
*   **Do** lean into the `secondary` (Pink) for energy. It should feel like a neon sign in a deep navy forest.
*   **Do** use the `1.4rem` (Spacing-4) token as your "universal breathing room."

### Don't
*   **Don't** use Yellow. If an "Alert" or "Warning" is needed, use the `error` (#ba1a1a) token softened within an `error_container`.
*   **Don't** use 100% black text. Always use `on_background` (#1a1c1e) for a softer, more premium contrast.
*   **Don't** align everything to a center axis. High-end editorial design lives in the balance of asymmetrical weights.
