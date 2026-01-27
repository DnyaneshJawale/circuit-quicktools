import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { parseValue, isParseError, formatSI } from '@/utils/units/parseUnit';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

type UnitType = 'resistance' | 'capacitance' | 'inductance' | 'voltage' | 'current' | 'power' | 'frequency';

const UNIT_INFO: Record<UnitType, { symbol: string; name: string }> = {
  resistance: { symbol: 'Ω', name: 'Ohms' },
  capacitance: { symbol: 'F', name: 'Farads' },
  inductance: { symbol: 'H', name: 'Henries' },
  voltage: { symbol: 'V', name: 'Volts' },
  current: { symbol: 'A', name: 'Amperes' },
  power: { symbol: 'W', name: 'Watts' },
  frequency: { symbol: 'Hz', name: 'Hertz' },
};

const PREFIXES = [
  { prefix: 'T', multiplier: 1e12, name: 'Tera' },
  { prefix: 'G', multiplier: 1e9, name: 'Giga' },
  { prefix: 'M', multiplier: 1e6, name: 'Mega' },
  { prefix: 'k', multiplier: 1e3, name: 'Kilo' },
  { prefix: '', multiplier: 1, name: 'Base' },
  { prefix: 'm', multiplier: 1e-3, name: 'Milli' },
  { prefix: 'µ', multiplier: 1e-6, name: 'Micro' },
  { prefix: 'n', multiplier: 1e-9, name: 'Nano' },
  { prefix: 'p', multiplier: 1e-12, name: 'Pico' },
];

export function UnitConverterPanel() {
  const navigate = useNavigate();
  
  const [unitType, setUnitType] = useState<UnitType>('resistance');
  const [inputValue, setInputValue] = useState('4.7k');

  const unitInfo = UNIT_INFO[unitType];

  const result = useMemo(() => {
    const parsed = parseValue(inputValue);
    if (isParseError(parsed)) {
      return { error: parsed.message };
    }

    const baseValue = parsed.value;
    
    const conversions = PREFIXES.map(({ prefix, multiplier, name }) => ({
      prefix,
      name,
      value: baseValue / multiplier,
      formatted: formatSI(baseValue, 4, unitInfo.symbol),
      display: `${(baseValue / multiplier).toPrecision(6)} ${prefix}${unitInfo.symbol}`
    })).filter(c => c.value >= 0.001 && c.value < 10000);

    return { 
      data: { baseValue, conversions }, 
      error: null 
    };
  }, [inputValue, unitInfo]);

  const resultText = result.data
    ? `${formatSI(result.data.baseValue, 4, unitInfo.symbol)} = ${result.data.baseValue.toExponential(6)} ${unitInfo.symbol}`
    : '';

  return (
    <ToolPanel
      title="Unit Converter"
      description="Convert between SI prefixes for electrical units"
      onBack={() => navigate('/')}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          {/* Unit type selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Unit Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(UNIT_INFO) as UnitType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setUnitType(type)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium',
                    'transition-all duration-200 min-h-[44px]',
                    'focus-ring',
                    unitType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {UNIT_INFO[type].name}
                </button>
              ))}
            </div>
          </div>

          <UnitInput
            label="Value to Convert"
            value={inputValue}
            onChange={setInputValue}
            placeholder={`e.g. 4.7k, 100n, 1M`}
            unit={unitInfo.symbol}
            hint="Enter value with SI prefix (k, M, m, µ, n, p)"
          />

          {/* Prefix reference */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">SI Prefixes</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {PREFIXES.map(({ prefix, multiplier, name }) => (
                <div key={prefix || 'base'} className="flex justify-between">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-mono text-foreground">
                    {prefix || '1'}{prefix ? ` (10^${Math.log10(multiplier)})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </PanelInputs>

        {/* Results */}
        <PanelResults>
          <div className="space-y-6">
            {result.error ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive">{result.error}</p>
              </div>
            ) : result.data ? (
              <>
                <ResultValue
                  label="Base Value"
                  value={result.data.baseValue.toExponential(6)}
                  unit={unitInfo.symbol}
                  highlight
                />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Equivalent Values</h4>
                  <div className="space-y-2">
                    {result.data.conversions.map(({ prefix, name, value }) => (
                      <div 
                        key={prefix || 'base'}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm text-muted-foreground">{name}</span>
                        <span className="font-mono text-sm text-foreground">
                          {value.toPrecision(6)} {prefix}{unitInfo.symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <CopyButton 
                    text={resultText} 
                    label="Copy"
                    className="flex-1 justify-center"
                  />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Enter a value to convert
              </p>
            )}
          </div>
        </PanelResults>
      </div>
    </ToolPanel>
  );
}
