# Theming

GridPlus is built with [shadcn/ui](https://ui.shadcn.dev), which is styled using [Tailwind CSS](https://tailwindcss.com/) and CSS variables. This makes it easy to match your app’s look and feel or define your own theme.

**To use GridPlus's built-in theme, you must import the stylesheet manually:**

```ts
import '@muradley/grid-plus/styles.css';
```

If you're already using Tailwind and shadcn/ui in your app, GridPlus components will visually integrate, and you can override the theme tokens to match your design system.

## How It Works

shadcn/ui defines design tokens as CSS variables, such as:

* `--background`
* `--foreground`
* `--primary`
* `--primary-foreground`
* `--muted`
* `--muted-foreground`
* `--border`
* `--ring`

These variables are declared on the `:root` element and are used throughout the components' styles. You can override them to implement custom themes or brand styles.

Refer to the [shadcn/ui theming documentation](https://ui.shadcn.com/docs/theming) for a complete list of tokens and default values.

## Global Theming

You can override the theme globally by redefining the variables in your `index.css` or any global stylesheet:

```css
:root {
  --background: white;
  --foreground: black;
  --primary: #0070f3;
  --primary-foreground: white;
}
```

This will apply your custom colors across all GridPlus and other shadcn-styled components.

## Local Theming

To apply a different theme to a specific part of your app (e.g. a section or component), you can scope overrides using a wrapper element:

```tsx
<div style={{
  '--background': '#1a1a1a',
  '--foreground': '#f0f0f0',
  '--primary': '#38bdf8',
  '--primary-foreground': '#1a1a1a'
} as React.CSSProperties}>
  <Datagrid columns={columns} datasource={yourDataSource} />
</div>
```

This allows for nested or conditional theming, like creating a dark mode panel inside a light-themed page.

## Summary

* GridPlus uses Tailwind via shadcn/ui for styling
* Theming is powered by CSS custom properties
* You can override tokens globally or locally
* See the [shadcn theming guide](https://ui.shadcn.com/docs/theming) for full customization options
