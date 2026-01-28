import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { DerivationBlock } from './DerivationBlock';
import { parseValue, isParseError } from '@/utils/units/parseUnit';
import { formatNumber, formatRaw } from '@/utils/format';
import { rcTimeConstant } from '@/utils/math/rcCircuit';

export function RCTimeConstantPanel() {
  const navigate = useNavigate();
  
  const [resistance, setResistance] = useState('10k');
  const [capacitance, setCapacitance] = useState('100n');

  const result = useMemo(() => {
    const rParsed = parseValue(resistance);
    if (isParseError(rParsed)) {
      return { error: `Resistance: ${rParsed.message}` };
    }

    const cParsed = parseValue(capacitance);
    if (isParseError(cParsed)) {
      return { error: `Capacitance: ${cParsed.message}` };
    }

    try {
      const calc = rcTimeConstant(rParsed.value, cParsed.value);
      return { data: calc, error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Calculation error',
        data: null
      };
    }
  }, [resistance, capacitance]);

  const resultText = result.data
    ? `RC Circuit: τ = ${formatNumber(result.data.timeConstant, { sigfigs: 3, unit: 's' })}, fc = ${formatNumber(result.data.cutoffFrequency, { sigfigs: 3, unit: 'Hz' })}`
    : '';

  return (
    <ToolPanel
      title="RC Time Constant"
      description="Calculate τ (R×C), cutoff frequency, and charging response timing for RC filters and transient analysis"
      onBack={() => navigate('/')}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          <UnitInput
            label="Resistance (R)"
            value={resistance}
            onChange={setResistance}
            placeholder="e.g. 10k, 47k, 1M"
            unit="Ω"
          />

          <UnitInput
            label="Capacitance (C)"
            value={capacitance}
            onChange={setCapacitance}
            placeholder="e.g. 100n, 1µ, 10p"
            unit="F"
            hint="Supports nF, µF, pF notation"
          />

          {/* Info box */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">What this calculates:</strong>{' '}
              Time constant (τ) and cutoff frequency for RC low-pass/high-pass filters.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Key insight:</strong>{' '}
              After 1τ, capacitor charges to ~63.2%. After 5τ, it's ~99.3% charged.
            </p>
          </div>

          {/* Step response visualization */}
          {result.data && (
            <div className="p-4 rounded-xl bg-card border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Step Response</h4>
              <div className="space-y-2">
                {result.data.riseTimes.map(({ percent, time }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-muted-foreground font-mono">
                      {i + 1}τ
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="w-16 text-xs text-muted-foreground text-right">
                      {percent.toFixed(1)}%
                    </div>
                    <div className="w-20 text-xs font-mono text-muted-foreground text-right">
                      {formatNumber(time, { sigfigs: 2, unit: 's' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    label="Time Constant (τ)"
                    value={formatNumber(result.data.timeConstant, { sigfigs: 4 })}
                    unit="s"
                    highlight
                  />

                  <ResultValue
                    label="Cutoff Frequency (fc)"
                    value={formatNumber(result.data.cutoffFrequency, { sigfigs: 4 })}
                    unit="Hz"
                  />

                  <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      τ = R × C = {formatRaw(result.data.timeConstant)} s
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      fc = 1/(2πτ) = {formatNumber(result.data.cutoffFrequency, { sigfigs: 4, unit: 'Hz' })}
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
