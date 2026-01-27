# Circuit QuickTools

Professional engineering calculator suite for electronics engineers with step-by-step derivations, unit parsing, and shareable results.

## Features

### Core Calculators
- **Equivalent Resistance**: Series/parallel resistor combinations with derivations
- **LED Resistor Calculator**: Find current-limiting resistors for LED circuits
- **Voltage Divider**: Calculate output voltage with optional load resistance effects
- **RC Time Constant**: Calculate τ, cutoff frequency, and timing analysis
- **Ohm's Law & Power**: Compute V, I, R, and P from any two known values
- **Unit Converter**: Convert between SI prefixes (k, M, m, µ, n, p, etc.)

### Advanced Tools
- **Resistor Color Code**: Encode/decode 4-band and 5-band resistor color codes
- **RLC Equivalent**: Calculate series/parallel equivalent R, C, and L combinations
- **Battery Life Estimator**: Estimate runtime from capacity, current, and efficiency

## Technology Stack

- **Vite** - Lightning-fast build tool and dev server
- **React** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/DnyaneshJawale/circuit-quicktools.git
cd circuit-quicktools

# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Shared/         # Shared utilities (Copy, Toast, etc.)
│   └── *Panel.tsx      # Calculator components
├── pages/              # Page components
├── utils/
│   ├── math/          # Mathematical functions
│   └── units/         # Unit parsing utilities
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
└── test/              # Test files
```

## Build & Deployment

### Production Build
```bash
npm run build
# Output: dist/
```

### Deploy to Vercel
```bash
# Connect GitHub repo to Vercel
# Build command: npm run build
# Output directory: dist
```

## Key Implementation Details

### Unit Parsing
Supports SI prefixes: k (kilo), M (mega), m (milli), µ (micro), n (nano), p (pico), etc.

### Mathematical Accuracy
All calculations include:
- Input validation
- Error handling
- Step-by-step derivations
- Result formatting with appropriate units

### UI/UX
- Dark theme with cyan/indigo accents
- Consistent component styling
- Copy-to-clipboard functionality
- Toast notifications
- Responsive mobile design
- Professional result cards

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contact & Support

For issues, suggestions, or contributions, please open an issue on [GitHub](https://github.com/DnyaneshJawale/circuit-quicktools).
