import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { DerivationBlock } from './DerivationBlock';
import { parseValue, isParseError, formatSI } from '@/utils/units/parseUnit';
import { sumSeries, parallel } from '@/utils/math/resistors';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'series' | 'parallel';

interface ResistorEntry {
  id: string;
  value: string;
}

export function EquivalentResistancePanel() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [mode, setMode] = useState<Mode>(() => 
    (searchParams.get('mode') as Mode) || 'series'
  );
  
  const [resistors, setResistors] = useState<ResistorEntry[]>(() => {
    const saved = searchParams.get('r');
    if (saved) {
      try {
        const values = JSON.parse(decodeURIComponent(saved)) as string[];
        return values.map((v, i) => ({ id: `r-${i}`, value: v }));
      } catch {
        return [
          { id: 'r-0', value: '4.7k' },
          { id: 'r-1', value: '10k' },
          { id: 'r-2', value: '2.2k' }
        ];
      }
    }
    return [
      { id: 'r-0', value: '4.7k' },
      { id: 'r-1', value: '10k' },
      { id: 'r-2', value: '2.2k' }
    ];
  });

  const [sigFigs, setSigFigs] = useState(3);

  // Update URL when state changes
  useEffect(() => {
    const values = resistors.map(r => r.value);
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('r', encodeURIComponent(JSON.stringify(values)));
    setSearchParams(params, { replace: true });
  }, [mode, resistors, setSearchParams]);

  const result = useMemo(() => {
    const parsedValues: number[] = [];
    const errors: string[] = [];

    for (const r of resistors) {
      if (!r.value.trim()) continue;
      const parsed = parseValue(r.value);
      if (isParseError(parsed)) {
        errors.push(parsed.message);
      } else if (parsed.value <= 0) {
        errors.push(`Value "${r.value}" must be positive`);
      } else {
        parsedValues.push(parsed.value);
      }
    }

    if (errors.length > 0) {
      return { error: errors[0], value: null, steps: [] };
    }

    if (parsedValues.length === 0) {
      return { error: 'Enter at least one resistor value', value: null, steps: [] };
    }

    try {
      const calc = mode === 'series' 
        ? sumSeries(parsedValues)
        : parallel(parsedValues);
      return { error: null, value: calc.value, steps: calc.steps };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Calculation error', 
        value: null, 
        steps: [] 
      };
    }
  }, [resistors, mode]);

  const addResistor = () => {
    setResistors(prev => [
      ...prev,
      { id: `r-${Date.now()}`, value: '' }
    ]);
  };

  const removeResistor = (id: string) => {
    if (resistors.length > 1) {
      setResistors(prev => prev.filter(r => r.id !== id));
    }
  };

  const updateResistor = (id: string, value: string) => {
    setResistors(prev => 
      prev.map(r => r.id === id ? { ...r, value } : r)
    );
  };

  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : '';

  const resultText = result.value !== null
    ? `Equivalent Resistance (${mode}): ${formatSI(result.value, sigFigs, 'Ω')}`
    : '';

  return (
    <ToolPanel
      title="Equivalent Resistance"
      description="Calculate series or parallel resistance combinations"
      onBack={() => navigate('/')}
      shareUrl={shareUrl}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          {/* Mode selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Connection Type
            </label>
            <div className="flex gap-2">
              {(['series', 'parallel'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm',
                    'transition-all duration-200 min-h-[44px]',
                    'focus-ring',
                    mode === m
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Resistor inputs */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Resistor Values
            </label>
            
            {resistors.map((r, index) => (
              <div key={r.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <UnitInput
                    label=""
                    value={r.value}
                    onChange={(v) => updateResistor(r.id, v)}
                    placeholder="e.g. 4.7k, 10kΩ, 2200"
                    hint={index === 0 ? 'Supports SI prefixes: k, M, m, µ, n' : undefined}
                    aria-label={`Resistor ${index + 1} value`}
                  />
                </div>
                <button
                  onClick={() => removeResistor(r.id)}
                  disabled={resistors.length <= 1}
                  className={cn(
                    'p-2.5 rounded-lg min-h-[44px] min-w-[44px]',
                    'flex items-center justify-center',
                    'transition-colors focus-ring',
                    resistors.length <= 1
                      ? 'text-muted-foreground/30 cursor-not-allowed'
                      : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                  )}
                  aria-label={`Remove resistor ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addResistor}
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'py-2.5 px-4 rounded-lg',
                'border border-dashed border-border',
                'text-muted-foreground hover:text-foreground',
                'hover:border-primary/50 hover:bg-primary/5',
                'transition-all duration-200',
                'focus-ring min-h-[44px]'
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add Resistor</span>
            </button>
          </div>

          {/* Sig figs control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Significant Figures
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((sf) => (
                <button
                  key={sf}
                  onClick={() => setSigFigs(sf)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-all duration-200 min-h-[44px]',
                    'focus-ring',
                    sigFigs === sf
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {sf}
                </button>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">What this calculates:</strong>{' '}
              {mode === 'series' 
                ? 'Total resistance when resistors are connected end-to-end (current flows through each).'
                : 'Total resistance when resistors share the same two nodes (current splits between them).'}
            </p>
          </div>
        </PanelInputs>

        {/* Results */}
        <PanelResults>
          <div className="space-y-6">
            {result.error ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive">{result.error}</p>
              </div>
            ) : result.value !== null ? (
              <>
                <ResultValue
                  label={`Equivalent Resistance (${mode})`}
                  value={formatSI(result.value, sigFigs, '')}
                  unit="Ω"
                  highlight
                />
                
                <div className="pt-2 text-xs text-muted-foreground font-mono">
                  Raw: {result.value.toPrecision(10)} Ω
                </div>

                <div className="flex gap-2">
                  <CopyButton 
                    text={resultText} 
                    label="Copy Result"
                    className="flex-1 justify-center"
                  />
                </div>

                <DerivationBlock steps={result.steps} />
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Enter resistor values to see results
              </p>
            )}
          </div>
        </PanelResults>
      </div>
    </ToolPanel>
  );
}
