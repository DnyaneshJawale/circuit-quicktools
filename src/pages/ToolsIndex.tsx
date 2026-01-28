import { useNavigate } from 'react-router-dom';
import { ToolCard } from '@/components/ToolCard';
import { 
  Zap, 
  Lightbulb, 
  SplitSquareVertical, 
  Timer, 
  Calculator, 
  ArrowRightLeft,
  Palette,
  Layers,
  Battery,
  Github,
  ExternalLink
} from 'lucide-react';

const TOOLS = [
  {
    id: 'equivalent-components',
    title: 'Equivalent Components',
    description: 'Calculate series/parallel equivalent resistances, capacitances, or inductances with step-by-step derivation.',
    icon: Layers,
    path: '/components-equivalent'
  },
  {
    id: 'led-resistor',
    title: 'LED Resistor',
    description: 'Find the right current-limiting resistor for your LED circuit with power dissipation.',
    icon: Lightbulb,
    path: '/led'
  },
  {
    id: 'voltage-divider',
    title: 'Voltage Divider',
    description: 'Calculate output voltage with optional load resistance effects.',
    icon: SplitSquareVertical,
    path: '/divider'
  },
  {
    id: 'rc-time-constant',
    title: 'RC Time Constant',
    description: 'Compute τ (time constant), cutoff frequency (fc), and transient response timing.',
    icon: Timer,
    path: '/rc'
  },
  {
    id: 'ohms-law',
    title: "Ohm's Law & Power",
    description: 'Compute V, I, R, and P from any two known values.',
    icon: Calculator,
    path: '/ohms'
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between SI prefixes for electrical units.',
    icon: ArrowRightLeft,
    path: '/units'
  },
  {
    id: 'resistor-color-code',
    title: 'Resistor Color Code',
    description: 'Decode/encode 4-band and 5-band resistor color codes.',
    icon: Palette,
    path: '/color-code'
  },
  {
    id: 'battery-life',
    title: 'Battery Life Estimator',
    description: 'Estimate runtime from capacity, current, and efficiency.',
    icon: Battery,
    path: '/battery-life'
  }
];

export default function ToolsIndex() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <header className="relative overflow-hidden border-b border-border">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        {/* Enhanced Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] pattern-grid"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative container max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-6">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-4 border border-primary/30">
              <Zap className="w-8 h-8" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Circuit{' '}
              <span className="text-primary">QuickTools</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Professional engineering calculators with step-by-step derivations, 
              unit parsing, and shareable results.
            </p>

            {/* Disclaimer */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-primary/20 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              For design/sizing only — validate calculations for production use.
            </div>
          </div>
        </div>
      </header>

      {/* Tools grid */}
      <main className="container max-w-5xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={() => navigate(tool.path)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Built with React, TypeScript & Tailwind CSS
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Math utilities are fully unit-tested
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
