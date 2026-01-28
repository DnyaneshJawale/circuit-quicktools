import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { DerivationBlock } from './DerivationBlock';
import { parseValue, isParseError } from '@/utils/units/parseUnit';
import { formatNumber, formatRaw } from '@/utils/format';
import { sumSeries as resistorSeries, parallel as resistorParallel } from '@/utils/math/resistors';
import { seriesCapacitance, parallelCapacitance } from '@/utils/math/capacitors';
import { seriesInductance, parallelInductance } from '@/utils/math/inductors';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ComponentType = 'resistor' | 'capacitor' | 'inductor';
type Configuration = 'series' | 'parallel';

interface ComponentEntry {
  id: string;
  value: string;
}

export function EquivalentComponentsPanel() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [componentType, setComponentType] = useState<ComponentType>(() =>
    (searchParams.get('type') as ComponentType) || 'resistor'
  );

  const [configuration, setConfiguration] = useState<Configuration>(() =>
    (searchParams.get('config') as Configuration) || 'series'
  );

  const [components, setComponents] = useState<ComponentEntry[]>(() => {
    const saved = searchParams.get('values');
    if (saved) {
      try {
        const values = JSON.parse(decodeURIComponent(saved)) as string[];
        return values.map((v, i) => ({ id: `c-${i}`, value: v }));
      } catch {
        return getDefaultValues(componentType);
      }
    }
    return getDefaultValues(componentType);
  });

  function getDefaultValues(type: ComponentType): ComponentEntry[] {
    const defaults: Record<ComponentType, string[]> = {
      resistor: ['4.7k', '10k', '2.2k'],
      capacitor: ['100n', '100n', '100n'],
      inductor: ['1m', '1m', '1m']
    };
    return defaults[type].map((v, i) => ({ id: `c-${i}`, value: v }));
  }

  const unitMap: Record<ComponentType, string> = {
    resistor: 'Ω',
    capacitor: 'F',
    inductor: 'H'
  };

  const nameMap: Record<ComponentType, string> = {
    resistor: 'Resistance',
    capacitor: 'Capacitance',
    inductor: 'Inductance'
  };

  const shortNameMap: Record<ComponentType, string> = {
    resistor: 'Resistor',
    capacitor: 'Capacitor',
    inductor: 'Inductor'
  };

  // Update URL when state changes
  useEffect(() => {
    const values = components.map(c => c.value);
    const params = new URLSearchParams();
    params.set('type', componentType);
    params.set('config', configuration);
    params.set('values', encodeURIComponent(JSON.stringify(values)));
    setSearchParams(params, { replace: true });
  }, [componentType, configuration, components, setSearchParams]);

  const result = useMemo(() => {
    const parsedValues: number[] = [];
    const errors: string[] = [];

    for (const c of components) {
      if (!c.value.trim()) continue;
      const parsed = parseValue(c.value);
      if (isParseError(parsed)) {
        errors.push(parsed.message);
      } else if (parsed.value <= 0) {
        errors.push(`Value "${c.value}" must be positive`);
      } else {
        parsedValues.push(parsed.value);
      }
    }

    if (errors.length > 0) {
      return { error: errors[0], value: null, steps: [] };
    }

    if (parsedValues.length === 0) {
      return { error: `Enter at least one ${shortNameMap[componentType].toLowerCase()} value`, value: null, steps: [] };
    }

    try {
      let calc;
      if (componentType === 'resistor') {
        calc = configuration === 'series'
          ? resistorSeries(parsedValues)
          : resistorParallel(parsedValues);
      } else if (componentType === 'capacitor') {
        calc = configuration === 'series'
          ? seriesCapacitance(parsedValues)
          : parallelCapacitance(parsedValues);
      } else {
        calc = configuration === 'series'
          ? seriesInductance(parsedValues)
          : parallelInductance(parsedValues);
      }
      return { error: null, value: calc.value, steps: calc.steps };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Calculation error',
        value: null,
        steps: []
      };
    }
  }, [components, componentType, configuration]);

  const addComponent = () => {
    setComponents(prev => [
      ...prev,
      { id: `c-${Date.now()}`, value: '' }
    ]);
  };

  const removeComponent = (id: string) => {
    if (components.length > 1) {
      setComponents(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateComponent = (id: string, value: string) => {
    setComponents(prev =>
      prev.map(c => c.id === id ? { ...c, value } : c)
    );
  };

  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : '';

  const resultText = result.value !== null
    ? `Equivalent ${nameMap[componentType]} (${configuration}): ${formatNumber(result.value, { sigfigs: 3, unit: unitMap[componentType] })}`
    : '';

  const handleTypeChange = (type: ComponentType) => {
    setComponentType(type);
    // Reset configuration to series (most common)
    setConfiguration('series');
    // Use default values for this component type
    setComponents(getDefaultValues(type));
  };

  const getFormula = () => {
    if (componentType === 'resistor') {
      return configuration === 'series'
        ? 'R_eq = R₁ + R₂ + ... + Rₙ'
        : '1/R_eq = 1/R₁ + 1/R₂ + ... + 1/Rₙ';
    } else if (componentType === 'capacitor') {
      return configuration === 'series'
        ? '1/C_eq = 1/C₁ + 1/C₂ + ... + 1/Cₙ'
        : 'C_eq = C₁ + C₂ + ... + Cₙ';
    } else {
      return configuration === 'series'
        ? 'L_eq = L₁ + L₂ + ... + Lₙ'
        : '1/L_eq = 1/L₁ + 1/L₂ + ... + 1/Lₙ';
    }
  };

  const getConfigNote = () => {
    if (componentType === 'resistor') {
      return configuration === 'series'
        ? 'Current flows through each resistor sequentially.'
        : 'Current splits between resistors sharing the same nodes.';
    } else if (componentType === 'capacitor') {
      return configuration === 'series'
        ? 'Voltage divides across each capacitor; total capacitance decreases.'
        : 'Voltage is the same across all capacitors; capacitances add directly.';
    } else {
      return configuration === 'series'
        ? 'Voltage drops across each inductor; inductances add directly.'
        : 'Voltage is the same across all inductors; total inductance decreases.';
    }
  };

  return (
    <ToolPanel
      title="Equivalent Components"
      description="Calculate series/parallel equivalent R, C, or L combinations with step-by-step derivation"
      onBack={() => navigate('/')}
      shareUrl={shareUrl}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          {/* Component type tabs */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Component Type
            </label>
            <Tabs value={componentType} onValueChange={(val) => handleTypeChange(val as ComponentType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="resistor">Resistors</TabsTrigger>
                <TabsTrigger value="capacitor">Capacitors</TabsTrigger>
                <TabsTrigger value="inductor">Inductors</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Configuration selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Connection Type
            </label>
            <div className="flex gap-2">
              {(['series', 'parallel'] as Configuration[]).map((conf) => (
                <button
                  key={conf}
                  onClick={() => setConfiguration(conf)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-lg font-medium text-sm',
                    'transition-all duration-200 min-h-[44px]',
                    'focus-ring',
                    configuration === conf
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {conf.charAt(0).toUpperCase() + conf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Component values */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {nameMap[componentType]} Values
            </label>

            {components.map((c, index) => (
              <div key={c.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <UnitInput
                    label=""
                    value={c.value}
                    onChange={(v) => updateComponent(c.id, v)}
                    placeholder={`e.g. 10${unitMap[componentType] === 'Ω' ? 'k' : 'n'}`}
                    hint={index === 0 ? 'Supports SI prefixes: k, M, m, µ, n, p' : undefined}
                    aria-label={`${shortNameMap[componentType]} ${index + 1} value`}
                  />
                </div>
                <button
                  onClick={() => removeComponent(c.id)}
                  disabled={components.length <= 1}
                  className={cn(
                    'p-2.5 rounded-lg min-h-[44px] min-w-[44px]',
                    'flex items-center justify-center',
                    'transition-colors focus-ring',
                    components.length <= 1
                      ? 'text-muted-foreground/30 cursor-not-allowed'
                      : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                  )}
                  aria-label={`Remove ${shortNameMap[componentType].toLowerCase()} ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addComponent}
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
              <span className="text-sm font-medium">Add {shortNameMap[componentType]}</span>
            </button>
          </div>

          {/* Info box */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Configuration:</strong> {getConfigNote()}
            </p>
          </div>

          {/* Formula reference */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground font-mono">
              <strong className="text-foreground block mb-1">Formula:</strong>
              {getFormula()}
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
                  label={`Equivalent ${nameMap[componentType]}`}
                  value={formatNumber(result.value, { sigfigs: 3 })}
                  unit={unitMap[componentType]}
                  highlight
                />

                <div className="pt-2 text-xs text-muted-foreground font-mono">
                  Raw: {formatRaw(result.value)} {unitMap[componentType]}
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
                Enter {shortNameMap[componentType].toLowerCase()} values to see results
              </p>
            )}
          </div>
        </PanelResults>
      </div>
    </ToolPanel>
  );
}
