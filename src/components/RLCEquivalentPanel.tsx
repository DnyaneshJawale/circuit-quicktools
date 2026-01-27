import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { ToolPanel } from './ToolPanel';
import { CopyButton } from './Shared/CopyButton';
import { Toast } from './Shared/Toast';
import {
  equivalentResistanceSeries,
  equivalentResistanceParallel,
  equivalentCapacitanceSeries,
  equivalentCapacitanceParallel,
  equivalentInductanceSeries,
  equivalentInductanceParallel
} from '@/utils/math/rlcEquivalent';

export function RLCEquivalentPanel() {
  const navigate = useNavigate();
  const [componentType, setComponentType] = useState<'R' | 'C' | 'L'>('R');
  const [configuration, setConfiguration] = useState<'series' | 'parallel'>('series');
  const [values, setValues] = useState<string[]>(['100', '100']);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const unitMap = {
    R: 'Ω',
    C: 'F',
    L: 'H'
  };

  const nameMap = {
    R: 'Resistance',
    C: 'Capacitance',
    L: 'Inductance'
  };

  const calculateEquivalent = () => {
    setError('');
    try {
      const numValues = values
        .map((v) => {
          const num = parseFloat(v);
          if (isNaN(num) || num <= 0) {
            throw new Error(`Invalid value: ${v}. All values must be positive numbers.`);
          }
          return num;
        });

      if (numValues.length === 0) {
        throw new Error('At least one value is required');
      }

      let calculatedResult;

      if (componentType === 'R') {
        if (configuration === 'series') {
          calculatedResult = equivalentResistanceSeries(numValues);
        } else {
          calculatedResult = equivalentResistanceParallel(numValues);
        }
      } else if (componentType === 'C') {
        if (configuration === 'series') {
          calculatedResult = equivalentCapacitanceSeries(numValues);
        } else {
          calculatedResult = equivalentCapacitanceParallel(numValues);
        }
      } else if (componentType === 'L') {
        if (configuration === 'series') {
          calculatedResult = equivalentInductanceSeries(numValues);
        } else {
          calculatedResult = equivalentInductanceParallel(numValues);
        }
      }

      setResult(calculatedResult);
    } catch (e: any) {
      setError(e.message);
      setResult(null);
    }
  };

  const addValue = () => {
    setValues([...values, '']);
    setResult(null);
  };

  const removeValue = (index: number) => {
    if (values.length > 1) {
      setValues(values.filter((_, i) => i !== index));
      setResult(null);
    }
  };

  const updateValue = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    setResult(null);
  };

  const handleTypeChange = (type: 'R' | 'C' | 'L') => {
    setComponentType(type);
    setConfiguration('series');
    setResult(null);
    setError('');
  };

  return (
    <ToolPanel 
      title="Series/Parallel R-C-L Equivalent"
      description="Calculate equivalent resistance, capacitance, or inductance for series and parallel combinations."
      onBack={() => navigate('/')}
    >
      <div className="space-y-6">
        {/* Component Type Selection */}
        <div>
          <Label className="mb-3 block">Component Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['R', 'C', 'L'] as const).map((type) => (
              <Button
                key={type}
                variant={componentType === type ? 'default' : 'outline'}
                onClick={() => handleTypeChange(type)}
              >
                {type === 'R' && 'Resistors'}
                {type === 'C' && 'Capacitors'}
                {type === 'L' && 'Inductors'}
              </Button>
            ))}
          </div>
        </div>

        {/* Configuration Selection */}
        <div>
          <Label className="mb-3 block">Configuration</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={configuration === 'series' ? 'default' : 'outline'}
              onClick={() => {
                setConfiguration('series');
                setResult(null);
              }}
            >
              Series
            </Button>
            <Button
              variant={configuration === 'parallel' ? 'default' : 'outline'}
              onClick={() => {
                setConfiguration('parallel');
                setResult(null);
              }}
            >
              Parallel
            </Button>
          </div>
        </div>

        {/* Value Inputs */}
        <div>
          <Label className="mb-3 block">
            {nameMap[componentType]} Values ({unitMap[componentType]})
          </Label>
          <div className="space-y-3">
            {values.map((value, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-sm font-mono min-w-[50px] text-muted-foreground">
                  {componentType}{idx + 1}:
                </span>
                <Input
                  type="number"
                  placeholder="Enter value"
                  value={value}
                  onChange={(e) => updateValue(idx, e.target.value)}
                  step="any"
                />
                <span className="text-sm text-muted-foreground min-w-[20px]">
                  {unitMap[componentType]}
                </span>
                {values.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeValue(idx)}
                    className="h-10 w-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addValue}
            className="mt-3 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another {nameMap[componentType]}
          </Button>
        </div>

        {/* Calculate Button */}
        <Button onClick={calculateEquivalent} className="w-full" size="lg">
          Calculate Equivalent
        </Button>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Main Result Card */}
            <Card className="p-6 bg-result/10 border-result/50">
              <div className="space-y-3">
                <span className="text-sm text-muted-foreground">
                  Equivalent {nameMap[componentType]}
                </span>
                <div className="text-4xl font-bold text-result font-mono">
                  {result.value.toFixed(4)} {result.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Configuration: {configuration === 'series' ? 'Series' : 'Parallel'}
                </div>
                <CopyButton
                  value={`${result.value.toFixed(4)} ${result.unit}`}
                  label="Copy result"
                />
              </div>
            </Card>

            {/* Derivation */}
            <Card className="p-4 bg-derivation border-border">
              <h4 className="font-semibold text-sm mb-3">Calculation Steps</h4>
              <div className="space-y-2 text-sm font-mono">
                {result.steps.map((step: string, idx: number) => (
                  <div key={idx} className="text-muted-foreground">
                    {step}
                  </div>
                ))}
              </div>
            </Card>

            {/* Formula Reference */}
            <Card className="p-4 bg-muted/30 border-border">
              <h4 className="font-semibold text-sm mb-2">Formula</h4>
              <div className="text-sm text-muted-foreground font-mono">
                {configuration === 'series' ? (
                  <>
                    {componentType === 'R' && '∑R = R₁ + R₂ + ... + Rₙ'}
                    {componentType === 'C' && '1/∑C = 1/C₁ + 1/C₂ + ... + 1/Cₙ'}
                    {componentType === 'L' && '∑L = L₁ + L₂ + ... + Lₙ'}
                  </>
                ) : (
                  <>
                    {componentType === 'R' && '1/∑R = 1/R₁ + 1/R₂ + ... + 1/Rₙ'}
                    {componentType === 'C' && '∑C = C₁ + C₂ + ... + Cₙ'}
                    {componentType === 'L' && '1/∑L = 1/L₁ + 1/L₂ + ... + 1/Lₙ'}
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {showToast && <Toast message={toastMessage} />}
    </ToolPanel>
  );
}
