import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { DerivationBlock } from './DerivationBlock';
import { parseValue, isParseError, formatSI } from '@/utils/units/parseUnit';
import { ohmsLaw } from '@/utils/math/ohmsLaw';
import { cn } from '@/lib/utils';

type KnownPair = 'V+I' | 'V+R' | 'I+R' | 'V+P' | 'I+P' | 'R+P';

const PAIR_OPTIONS: { value: KnownPair; label: string; fields: string[] }[] = [
  { value: 'V+R', label: 'Voltage & Resistance', fields: ['voltage', 'resistance'] },
  { value: 'V+I', label: 'Voltage & Current', fields: ['voltage', 'current'] },
  { value: 'I+R', label: 'Current & Resistance', fields: ['current', 'resistance'] },
  { value: 'V+P', label: 'Voltage & Power', fields: ['voltage', 'power'] },
  { value: 'I+P', label: 'Current & Power', fields: ['current', 'power'] },
  { value: 'R+P', label: 'Resistance & Power', fields: ['resistance', 'power'] },
];

export function OhmsLawPanel() {
  const navigate = useNavigate();
  
  const [knownPair, setKnownPair] = useState<KnownPair>('V+R');
  const [voltage, setVoltage] = useState('12');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('1k');
  const [power, setPower] = useState('');

  const currentOption = PAIR_OPTIONS.find(p => p.value === knownPair)!;

  const result = useMemo(() => {
    try {
      let known: Parameters<typeof ohmsLaw>[0];

      switch (knownPair) {
        case 'V+I': {
          const v = parseValue(voltage);
          const i = parseValue(current);
          if (isParseError(v)) return { error: `Voltage: ${v.message}` };
          if (isParseError(i)) return { error: `Current: ${i.message}` };
          known = { voltage: v.value, current: i.value };
          break;
        }
        case 'V+R': {
          const v = parseValue(voltage);
          const r = parseValue(resistance);
          if (isParseError(v)) return { error: `Voltage: ${v.message}` };
          if (isParseError(r)) return { error: `Resistance: ${r.message}` };
          known = { voltage: v.value, resistance: r.value };
          break;
        }
        case 'I+R': {
          const i = parseValue(current);
          const r = parseValue(resistance);
          if (isParseError(i)) return { error: `Current: ${i.message}` };
          if (isParseError(r)) return { error: `Resistance: ${r.message}` };
          known = { current: i.value, resistance: r.value };
          break;
        }
        case 'V+P': {
          const v = parseValue(voltage);
          const p = parseValue(power);
          if (isParseError(v)) return { error: `Voltage: ${v.message}` };
          if (isParseError(p)) return { error: `Power: ${p.message}` };
          known = { voltage: v.value, power: p.value };
          break;
        }
        case 'I+P': {
          const i = parseValue(current);
          const p = parseValue(power);
          if (isParseError(i)) return { error: `Current: ${i.message}` };
          if (isParseError(p)) return { error: `Power: ${p.message}` };
          known = { current: i.value, power: p.value };
          break;
        }
        case 'R+P': {
          const r = parseValue(resistance);
          const p = parseValue(power);
          if (isParseError(r)) return { error: `Resistance: ${r.message}` };
          if (isParseError(p)) return { error: `Power: ${p.message}` };
          known = { resistance: r.value, power: p.value };
          break;
        }
      }

      const calc = ohmsLaw(known);
      return { data: calc, error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Calculation error',
        data: null
      };
    }
  }, [knownPair, voltage, current, resistance, power]);

  const resultText = result.data
    ? `V=${formatSI(result.data.voltage, 3, 'V')}, I=${formatSI(result.data.current, 3, 'A')}, R=${formatSI(result.data.resistance, 3, 'Ω')}, P=${formatSI(result.data.power, 3, 'W')}`
    : '';

  return (
    <ToolPanel
      title="Ohm's Law & Power"
      description="Calculate V, I, R, P from any two known values"
      onBack={() => navigate('/')}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          {/* Pair selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Known Values
            </label>
            <select
              value={knownPair}
              onChange={(e) => setKnownPair(e.target.value as KnownPair)}
              className={cn(
                'w-full px-3 py-2.5 rounded-lg',
                'bg-input border border-border',
                'text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'min-h-[44px]'
              )}
            >
              {PAIR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic inputs based on selected pair */}
          {currentOption.fields.includes('voltage') && (
            <UnitInput
              label="Voltage (V)"
              value={voltage}
              onChange={setVoltage}
              placeholder="e.g. 12, 5, 3.3"
              unit="V"
            />
          )}

          {currentOption.fields.includes('current') && (
            <UnitInput
              label="Current (I)"
              value={current}
              onChange={setCurrent}
              placeholder="e.g. 100m, 1, 500µ"
              unit="A"
            />
          )}

          {currentOption.fields.includes('resistance') && (
            <UnitInput
              label="Resistance (R)"
              value={resistance}
              onChange={setResistance}
              placeholder="e.g. 1k, 470, 10M"
              unit="Ω"
            />
          )}

          {currentOption.fields.includes('power') && (
            <UnitInput
              label="Power (P)"
              value={power}
              onChange={setPower}
              placeholder="e.g. 1, 500m, 0.25"
              unit="W"
            />
          )}

          {/* Info box */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Formulas used:</strong>
            </p>
            <ul className="text-sm text-muted-foreground font-mono space-y-1">
              <li>V = I × R</li>
              <li>P = V × I = V²/R = I²R</li>
            </ul>
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
                <div className="grid grid-cols-2 gap-4">
                  <ResultValue
                    label="Voltage"
                    value={formatSI(result.data.voltage, 4, '')}
                    unit="V"
                    highlight={!currentOption.fields.includes('voltage')}
                  />
                  <ResultValue
                    label="Current"
                    value={formatSI(result.data.current, 4, '')}
                    unit="A"
                    highlight={!currentOption.fields.includes('current')}
                  />
                  <ResultValue
                    label="Resistance"
                    value={formatSI(result.data.resistance, 4, '')}
                    unit="Ω"
                    highlight={!currentOption.fields.includes('resistance')}
                  />
                  <ResultValue
                    label="Power"
                    value={formatSI(result.data.power, 4, '')}
                    unit="W"
                    highlight={!currentOption.fields.includes('power')}
                  />
                </div>

                <div className="flex gap-2">
                  <CopyButton 
                    text={resultText} 
                    label="Copy All"
                    className="flex-1 justify-center"
                  />
                </div>

                <DerivationBlock steps={result.data.steps} />
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Enter values to see results
              </p>
            )}
          </div>
        </PanelResults>
      </div>
    </ToolPanel>
  );
}
