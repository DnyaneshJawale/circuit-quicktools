import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolPanel, PanelInputs, PanelResults, ResultValue } from './ToolPanel';
import { UnitInput } from './Shared/UnitInput';
import { CopyButton } from './Shared/CopyButton';
import { DerivationBlock } from './DerivationBlock';
import { parseValue, isParseError } from '@/utils/units/parseUnit';
import { formatNumber } from '@/utils/format';
import { ledResistor } from '@/utils/math/led';
import { AlertTriangle } from 'lucide-react';

export function LEDResistorPanel() {
  const navigate = useNavigate();
  
  const [vSource, setVSource] = useState('5');
  const [vForward, setVForward] = useState('2.0');
  const [targetCurrent, setTargetCurrent] = useState('20m');

  const result = useMemo(() => {
    // Parse voltage source
    const vSourceParsed = parseValue(vSource);
    if (isParseError(vSourceParsed)) {
      return { error: `Source voltage: ${vSourceParsed.message}` };
    }

    // Parse forward voltage
    const vFwdParsed = parseValue(vForward);
    if (isParseError(vFwdParsed)) {
      return { error: `Forward voltage: ${vFwdParsed.message}` };
    }

    // Parse current (assume Amps, allow mA notation)
    const currentParsed = parseValue(targetCurrent);
    if (isParseError(currentParsed)) {
      return { error: `Target current: ${currentParsed.message}` };
    }

    try {
      const calc = ledResistor(
        vSourceParsed.value,
        vFwdParsed.value,
        currentParsed.value
      );
      return { data: calc, error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Calculation error',
        data: null
      };
    }
  }, [vSource, vForward, targetCurrent]);

  const resultText = result.data
    ? `LED Resistor: ${formatNumber(result.data.nearestE24, { sigfigs: 3, unit: 'Ω' })} (E24), Power: ${formatNumber(result.data.powerDissipation, { sigfigs: 3, unit: 'W' })}, Use ${result.data.suggestedWattage}W rated`
    : '';

  return (
    <ToolPanel
      title="LED Resistor Calculator"
      description="Calculate current-limiting resistor for LEDs"
      onBack={() => navigate('/')}
    >
      <div className="grid lg:grid-cols-[1fr,380px] gap-8">
        {/* Inputs */}
        <PanelInputs>
          <UnitInput
            label="Source Voltage (Vsource)"
            value={vSource}
            onChange={setVSource}
            placeholder="e.g. 5, 12, 3.3"
            unit="V"
            hint="Power supply voltage"
          />

          <UnitInput
            label="LED Forward Voltage (Vf)"
            value={vForward}
            onChange={setVForward}
            placeholder="e.g. 2.0, 3.2"
            unit="V"
            hint="Check LED datasheet (typically 1.8-3.5V)"
          />

          <UnitInput
            label="Target LED Current"
            value={targetCurrent}
            onChange={setTargetCurrent}
            placeholder="e.g. 20m, 10mA, 0.02"
            unit="A"
            hint="Standard LEDs: 10-20mA, High-power: check datasheet"
          />

          {/* Info box */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">What this calculates:</strong>{' '}
              The resistor value needed to limit current through an LED to prevent damage.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Why it matters:</strong>{' '}
              LEDs have very low resistance and will draw excessive current without limiting.
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
                    label="Calculated Resistance"
                    value={formatNumber(result.data.resistorValue, { sigfigs: 4 })}
                    unit="Ω"
                  />
                  
                  <ResultValue
                    label="Nearest E24 Standard Value"
                    value={formatNumber(result.data.nearestE24, { sigfigs: 3 })}
                    unit="Ω"
                    highlight
                  />

                  <ResultValue
                    label="Actual Current (with E24)"
                    value={formatNumber(result.data.actualCurrent, { sigfigs: 3 })}
                    unit="A"
                  />

                  <ResultValue
                    label="Power Dissipation"
                    value={formatNumber(result.data.powerDissipation, { sigfigs: 3 })}
                    unit="W"
                  />

                  <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                    <p className="text-sm font-medium text-success flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Recommended: {result.data.suggestedWattage}W rated resistor
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on 2× safety margin over calculated dissipation
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
