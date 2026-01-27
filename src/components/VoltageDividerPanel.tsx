import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { DerivationBlock } from './DerivationBlock';
import { parseValue, isParseError, formatSI } from '@/utils/units/parseUnit';
import { voltageDivider, voltageDividerWithLoad } from '@/utils/math/voltageDivider';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VoltageDividerPanel() {
  const navigate = useNavigate();
  
  const [vIn, setVIn] = useState('12');
  const [r1, setR1] = useState('10k');
  const [r2, setR2] = useState('10k');
  const [rLoad, setRLoad] = useState('');
  const [includeLoad, setIncludeLoad] = useState(false);

  const result = useMemo(() => {
    const vInParsed = parseValue(vIn);
    if (isParseError(vInParsed)) {
      return { error: `Input voltage: ${vInParsed.message}` };
    }

    const r1Parsed = parseValue(r1);
    if (isParseError(r1Parsed)) {
      return { error: `R1: ${r1Parsed.message}` };
    }

    const r2Parsed = parseValue(r2);
    if (isParseError(r2Parsed)) {
      return { error: `R2: ${r2Parsed.message}` };
    }

    try {
      if (includeLoad && rLoad.trim()) {
        const rLoadParsed = parseValue(rLoad);
        if (isParseError(rLoadParsed)) {
          return { error: `Load resistance: ${rLoadParsed.message}` };
        }
        
        const calc = voltageDividerWithLoad(
          vInParsed.value,
          r1Parsed.value,
          r2Parsed.value,
          rLoadParsed.value
        );
        return { data: calc, error: null, hasLoad: true };
      } else {
        const calc = voltageDivider(
          vInParsed.value,
          r1Parsed.value,
          r2Parsed.value
        );
        return { data: calc, error: null, hasLoad: false };
      }
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Calculation error',
        data: null
      };
    }
  }, [vIn, r1, r2, rLoad, includeLoad]);

  const resultText = result.data
    ? `Voltage Divider: Vout = ${result.data.vOut.toFixed(4)}V${result.data.vOutLoaded !== undefined ? ` (loaded: ${result.data.vOutLoaded.toFixed(4)}V)` : ''}`
    : '';

  return (
    <ToolPanel
      title="Voltage Divider"
      description="Calculate output voltage with optional load resistance"
      onBack={() => navigate('/')}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          <UnitInput
            label="Input Voltage (Vin)"
            value={vIn}
            onChange={setVIn}
            placeholder="e.g. 12, 5, 3.3"
            unit="V"
          />

          <UnitInput
            label="R1 (Top Resistor)"
            value={r1}
            onChange={setR1}
            placeholder="e.g. 10k, 4.7k"
            unit="Ω"
            hint="Connected between Vin and Vout"
          />

          <UnitInput
            label="R2 (Bottom Resistor)"
            value={r2}
            onChange={setR2}
            placeholder="e.g. 10k, 4.7k"
            unit="Ω"
            hint="Connected between Vout and ground"
          />

          {/* Load toggle */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLoad}
                onChange={(e) => setIncludeLoad(e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                Include load resistance
              </span>
            </label>

            {includeLoad && (
              <UnitInput
                label="Load Resistance (Rload)"
                value={rLoad}
                onChange={setRLoad}
                placeholder="e.g. 100k, 1M"
                unit="Ω"
                hint="Resistance connected at Vout"
              />
            )}
          </div>

          {/* Info box */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">What this calculates:</strong>{' '}
              Output voltage from a resistor divider, with optional load effects.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Rule of thumb:</strong>{' '}
              Load should be &gt;10× R2 for minimal voltage drop.
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
            ) : result.data ? (
              <>
                <div className="space-y-4">
                  <ResultValue
                    label="Output Voltage (unloaded)"
                    value={result.data.vOut.toFixed(4)}
                    unit="V"
                    highlight={!result.hasLoad}
                  />

                  {result.data.vOutLoaded !== undefined && (
                    <>
                      <ResultValue
                        label="Output Voltage (loaded)"
                        value={result.data.vOutLoaded.toFixed(4)}
                        unit="V"
                        highlight
                      />

                      <div className="text-sm text-muted-foreground">
                        Load effect: -{result.data.loadEffect?.toFixed(2)}%
                      </div>

                      {result.data.loadWarning && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                          <p className="text-sm text-destructive flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {result.data.loadWarning}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground">
                      Divider ratio: {(result.data.vOut / parseFloat(vIn || '1')).toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <CopyButton 
                    text={resultText} 
                    label="Copy Result"
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
