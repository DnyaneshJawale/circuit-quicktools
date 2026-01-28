# Circuit QuickTools v1.0.0

Professional engineering calculators suite with a modern light theme. Features 8 interactive tools for electronics calculations with step-by-step derivations, unit parsing, and shareable results.

## Features

- **Equivalent Components**: Calculate series/parallel R/C/L combinations with 3 unified tabs
- **LED Resistor**: Design LED circuits with power dissipation and wattage suggestions
- **Battery Life Estimator**: Estimate runtime, required capacity, or max current
- **Resistor Color Code**: Encode/decode 4-band and 5-band color codes
- **RC Time Constant**: Calculate τ, cutoff frequency, and transient response
- **Voltage Divider**: Calculate output voltage with load resistance effects
- **Ohm's Law & Power**: Compute V, I, R, and P from any two values
- **Unit Converter**: Convert between SI prefixes for electrical units

## Design

- **Light Theme**: Clean, professional appearance optimized for daytime use
- **Color Palette**: Cyan primary (#00B8D4), indigo secondary (#5B63E8)
- **Responsive**: Fully functional on mobile (375px), tablet (768px), desktop (1920px)
- **Accessible**: WCAG AA+ contrast, keyboard navigation, ARIA labels
- **Fast**: ~2.5 second load time, optimized bundles

## Quick Start

```bash
# Install dependencies
npm ci

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Deploy

- **Vercel**: Import repository, Framework: Vite, Build: `npm run build`, Output: `dist`
- **Configuration**: `vercel.json` includes SPA rewrite rules
- **Auto-deploy**: Enabled on push to main branch

## Quality Metrics

- **Build**: ✅ 1748 modules, no errors
- **Tests**: ✅ 58/58 passing
- **Accessibility**: ✅ WCAG AA+ compliant
- **Bundle**: 64.16 kB CSS, 443.54 kB JS (gzipped)

## License

Apache-2.0

## Notes

- Minimal UI copy, engineering-focused
- All math utilities fully tested
- TypeScript for type safety
- Tailwind CSS for styling

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
