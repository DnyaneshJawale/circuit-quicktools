# Circuit QuickTools v1.0.0
circuittool-s4pg1c160-dnyanesh-jawales-projects.vercel.app
Professional engineering calculators suite with a modern light theme and glassmorphism design. Features 8 interactive tools for electronics calculations with step-by-step derivations, SI unit formatting, and shareable results.

## Features

- **8 Professional Calculators**
  - Equivalent Components (R/C/L series/parallel with 3 unified tabs)
  - LED Resistor (design circuits with power dissipation)
  - Battery Life Estimator (runtime, capacity, max current)
  - Resistor Color Code (4-band and 5-band encode/decode with SI input)
  - RC Time Constant (τ, cutoff frequency, transient response)
  - Voltage Divider (with load resistance effects)
  - Ohm's Law & Power (V, I, R, P calculations)
  - Unit Converter (SI prefix conversions)

- **Modern UI**
  - Light theme optimized for readability
  - Glassmorphism effects on cards and panels
  - Circuit grid pattern background
  - Cyan/indigo color accent system
  - Smooth animations and transitions

- **Engineering-Focused**
  - SI unit formatting (10M, 8k, 2.2µ, etc.)
  - Step-by-step derivations for all calculations
  - Full precision display options
  - Copy-to-clipboard for all results
  - Shareable URLs with calculation state

## Technical Details

### Stack
- **Frontend**: React 18.3 + TypeScript + React Router
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **Build**: Vite 5.4 with SWC transpiler
- **Testing**: Vitest 3.2 (58 unit tests)
- **Deployment**: Vercel with auto-deploy

### Quality Metrics
- **Build**: 1748 modules, zero errors
- **Tests**: 58/58 passing (100%)
- **Bundle**: 443.86 kB JS (135.70 kB gzip), 66.36 kB CSS (11.72 kB gzip)
- **Accessibility**: WCAG AA+ compliant
- **Performance**: ~2.5 second load time

## Installation & Setup

### Prerequisites
- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager

### Development

```bash
# Clone repository
git clone <your-repo-url>
cd circuit-quicktools

# Install dependencies
npm ci

# Start development server (http://localhost:8081)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Vercel auto-detects Vite configuration
3. Build command: `npm run build`
4. Output directory: `dist`
5. Auto-deploy on push to main branch

### Docker / Self-Hosted
```bash
npm run build
# Serve dist/ directory as static site
```

## Usage

### Input Formats
All input fields support SI unit notation:
- Plain numbers: `4700`, `0.0047`
- SI prefixed: `4.7k`, `10M`, `2.2µ`, `100n`, `1.5p`
- Scientific: `4.7e3`, `1.5e-6`

### Output Display
All calculated values display with automatic SI formatting:
- Large values: `10M`, `8k`, `220`
- Small values: `2.2µ`, `100n`, `1.5p`
- Full precision available via copy function

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── Shared/          # Shared utilities (CopyButton, Toast)
│   ├── [Tool]Panel.tsx  # Individual calculator components
│   └── ToolPanel.tsx    # Common tool wrapper
├── pages/               # Page components (Index, ToolsIndex, NotFound)
├── utils/
│   ├── math/            # Math utilities with tests
│   │   ├── resistors.ts      # Resistor calculations
│   │   ├── batteryLife.ts    # Battery life estimation
│   │   ├── led.ts            # LED resistor design
│   │   ├── ohmsLaw.ts        # Ohm's law & power
│   │   ├── rcCircuit.ts      # RC time constant
│   │   ├── resistorColorCode.ts  # Color code encode/decode
│   │   ├── capacitors.ts     # Capacitor calculations
│   │   ├── inductors.ts      # Inductor calculations
│   │   ├── voltageDivider.ts # Voltage divider
│   │   └── rlcEquivalent.ts  # RLC equivalent
│   ├── units/           # Unit parsing & conversion
│   │   ├── parseUnit.ts      # SI unit parser
│   │   └── parseUnit.test.ts
│   ├── format.ts        # Value formatting with SI units
│   └── lib/utils.ts     # Helper utilities
├── hooks/               # React hooks (useQueryState, useMobile, useToast)
├── App.tsx              # Router configuration
├── index.css            # Global styles & CSS variables
└── main.tsx             # Entry point
```

## Key Features Explained

### SI Unit Formatting
Automatic conversion of raw numbers to SI notation:
```typescript
formatNumber(10000000, { unit: 'Ω', sigfigs: 3 })  // Returns "10MΩ"
formatNumber(0.0000047, { unit: 'F', sigfigs: 3 }) // Returns "4.7µF"
```

### Unit Parsing
Flexible input parsing accepts multiple formats:
```typescript
parseValue('4.7k')   // 4700
parseValue('10M')    // 10000000
parseValue('2.2µ')   // 0.0000022
parseValue('100')    // 100
```

### Step-by-Step Derivations
All tools include collapsible derivation blocks showing:
- Calculation steps
- Formulas used
- Copy functionality for documentation

## Testing

```bash
# Run tests once
npm test -- --run

# Watch mode
npm test

# Coverage (if needed)
npm test -- --coverage
```

Test files use Vitest with precision tolerance for floating-point comparisons:
- Math utilities: 20 tests
- Unit parsing: 18 tests
- LED design: 11 tests
- Voltage divider: 8 tests
- General: 1 test

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Configuration Files

- **vite.config.ts**: Build configuration with React SWC plugin
- **tailwind.config.ts**: Color variables and theme configuration
- **tsconfig.json**: TypeScript strict mode enabled
- **vitest.config.ts**: Test runner configuration
- **vercel.json**: Deployment configuration with SPA rewrite rules

## License

Apache License 2.0 - See LICENSE file for details

## Contributing

This project follows professional coding standards:
- TypeScript strict mode
- Tailwind CSS for styling
- Component-based architecture
- Comprehensive unit tests
- WCAG AA+ accessibility

## Support

For issues, calculations, or feature requests:
1. Check existing tools and their capabilities
2. Verify input format (SI units supported)
3. Ensure browser compatibility
4. Report issues with reproduction steps

---

**Version**: 1.0.0  
**Last Updated**: January 29, 2026  
**Built with**: React, TypeScript, Tailwind CSS, Vite  
**Hosted**: Vercel
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
