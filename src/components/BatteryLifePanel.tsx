import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { ToolPanel } from './ToolPanel';
import { CopyButton } from './Shared/CopyButton';
import { Toast } from './Shared/Toast';
import {
  calculateBatteryLife,
  calculateRequiredCapacity,
  calculateMaxLoadCurrent,
  COMMON_BATTERIES
} from '@/utils/math/batteryLife';

export function BatteryLifePanel() {
  // Runtime calculation
  const [capacityMah, setCapacityMah] = useState('2000');
  const [currentMa, setCurrentMa] = useState('100');
  const [efficiency, setEfficiency] = useState('100');
  const [runtimeResult, setRuntimeResult] = useState<any>(null);
  const [runtimeError, setRuntimeError] = useState('');

  // Capacity calculation
  const [desiredHours, setDesiredHours] = useState('8');
  const [loadCurrent, setLoadCurrent] = useState('100');
  const [efficiencyCapacity, setEfficiencyCapacity] = useState('100');
  const [capacityResult, setCapacityResult] = useState<number | null>(null);
  const [capacityError, setCapacityError] = useState('');

  // Max current calculation
  const [batteryCapacity, setBatteryCapacity] = useState('2000');
  const [desiredRuntime, setDesiredRuntime] = useState('8');
  const [efficiencyCurrent, setEfficiencyCurrent] = useState('100');
  const [maxCurrentResult, setMaxCurrentResult] = useState<number | null>(null);
  const [maxCurrentError, setMaxCurrentError] = useState('');

  const [selectedBattery, setSelectedBattery] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Runtime calculator
  const calculateRuntime = () => {
    setRuntimeError('');
    try {
      const capacity = parseFloat(capacityMah);
      const current = parseFloat(currentMa);
      const eff = parseFloat(efficiency);

      if (isNaN(capacity) || capacity <= 0) throw new Error('Battery capacity must be positive');
      if (isNaN(current) || current <= 0) throw new Error('Load current must be positive');
      if (isNaN(eff) || eff <= 0 || eff > 100) throw new Error('Efficiency must be 0-100%');

      const result = calculateBatteryLife(capacity, current, eff);
      setRuntimeResult(result);
    } catch (e: any) {
      setRuntimeError(e.message);
      setRuntimeResult(null);
    }
  };

  // Capacity calculator
  const calculateCapacity = () => {
    setCapacityError('');
    try {
      const hours = parseFloat(desiredHours);
      const current = parseFloat(loadCurrent);
      const eff = parseFloat(efficiencyCapacity);

      if (isNaN(hours) || hours <= 0) throw new Error('Runtime must be positive');
      if (isNaN(current) || current <= 0) throw new Error('Load current must be positive');
      if (isNaN(eff) || eff <= 0 || eff > 100) throw new Error('Efficiency must be 0-100%');

      const result = calculateRequiredCapacity(current, hours, eff);
      setCapacityResult(result);
    } catch (e: any) {
      setCapacityError(e.message);
      setCapacityResult(null);
    }
  };

  // Max current calculator
  const calculateMaxCurrent = () => {
    setMaxCurrentError('');
    try {
      const capacity = parseFloat(batteryCapacity);
      const runtime = parseFloat(desiredRuntime);
      const eff = parseFloat(efficiencyCurrent);

      if (isNaN(capacity) || capacity <= 0) throw new Error('Battery capacity must be positive');
      if (isNaN(runtime) || runtime <= 0) throw new Error('Runtime must be positive');
      if (isNaN(eff) || eff <= 0 || eff > 100) throw new Error('Efficiency must be 0-100%');

      const result = calculateMaxLoadCurrent(capacity, runtime, eff);
      setMaxCurrentResult(result);
    } catch (e: any) {
      setMaxCurrentError(e.message);
      setMaxCurrentResult(null);
    }
  };

  const useBattery = (batteryName: string) => {
    const battery = COMMON_BATTERIES[batteryName as keyof typeof COMMON_BATTERIES];
    if (battery) {
      setSelectedBattery(batteryName);
      setCapacityMah(battery.capacity.toString());
      setCurrentMa('100');
      setRuntimeResult(null);
    }
  };

  return (
    <ToolPanel title="Battery Life Estimator">
      <Tabs defaultValue="runtime" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="current">Max Current</TabsTrigger>
        </TabsList>

        {/* RUNTIME TAB */}
        <TabsContent value="runtime" className="space-y-4">
          <div className="space-y-4">
            {/* Quick battery selector */}
            <div>
              <Label className="mb-2 block">Quick Select Battery</Label>
              <Select value={selectedBattery} onValueChange={useBattery}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a common battery..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMMON_BATTERIES).map(([name, info]) => (
                    <SelectItem key={name} value={name}>
                      {name} ({info.capacity} mAh @ {info.voltage}V)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capacity input */}
            <div>
              <Label htmlFor="runtime-capacity">Battery Capacity (mAh)</Label>
              <Input
                id="runtime-capacity"
                type="number"
                placeholder="e.g., 2000"
                value={capacityMah}
                onChange={(e) => {
                  setCapacityMah(e.target.value);
                  setRuntimeResult(null);
                }}
                step="any"
                className="mt-2"
              />
            </div>

            {/* Current input */}
            <div>
              <Label htmlFor="runtime-current">Load Current (mA)</Label>
              <Input
                id="runtime-current"
                type="number"
                placeholder="e.g., 100"
                value={currentMa}
                onChange={(e) => {
                  setCurrentMa(e.target.value);
                  setRuntimeResult(null);
                }}
                step="any"
                className="mt-2"
              />
            </div>

            {/* Efficiency input */}
            <div>
              <Label htmlFor="runtime-efficiency">Efficiency (%) - Optional</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="runtime-efficiency"
                  type="number"
                  placeholder="100"
                  value={efficiency}
                  onChange={(e) => {
                    setEfficiency(e.target.value);
                    setRuntimeResult(null);
                  }}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="text-sm text-muted-foreground pt-2">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Account for converter losses, BMS overhead, etc.
              </p>
            </div>

            {/* Calculate button */}
            <Button onClick={calculateRuntime} className="w-full" size="lg">
              Calculate Runtime
            </Button>

            {/* Error */}
            {runtimeError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{runtimeError}</span>
              </div>
            )}

            {/* Result */}
            {runtimeResult && (
              <div className="space-y-4">
                <Card className="p-6 bg-result/10 border-result/50">
                  <div className="space-y-4">
                    <span className="text-sm text-muted-foreground">Estimated Runtime</span>
                    <div className="text-4xl font-bold text-result">
                      {runtimeResult.formatted}
                    </div>
                    {parseFloat(efficiency) < 100 && (
                      <div className="text-sm text-muted-foreground">
                        ({runtimeResult.hours}h {runtimeResult.minutes}m with {efficiency}% efficiency)
                      </div>
                    )}
                    <CopyButton
                      value={runtimeResult.formatted}
                      label="Copy result"
                    />
                  </div>
                </Card>

                <Card className="p-4 bg-derivation border-border">
                  <h4 className="font-semibold text-sm mb-3">Calculation Steps</h4>
                  <div className="space-y-2 text-sm">
                    {runtimeResult.steps.map((step: string, idx: number) => (
                      <div key={idx} className="text-muted-foreground">{step}</div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* CAPACITY TAB */}
        <TabsContent value="capacity" className="space-y-4">
          <div className="space-y-4">
            {/* Runtime input */}
            <div>
              <Label htmlFor="capacity-hours">Desired Runtime (hours)</Label>
              <Input
                id="capacity-hours"
                type="number"
                placeholder="e.g., 8"
                value={desiredHours}
                onChange={(e) => {
                  setDesiredHours(e.target.value);
                  setCapacityResult(null);
                }}
                step="any"
                className="mt-2"
              />
            </div>

            {/* Load current input */}
            <div>
              <Label htmlFor="capacity-current">Load Current (mA)</Label>
              <Input
                id="capacity-current"
                type="number"
                placeholder="e.g., 100"
                value={loadCurrent}
                onChange={(e) => {
                  setLoadCurrent(e.target.value);
                  setCapacityResult(null);
                }}
                step="any"
                className="mt-2"
              />
            </div>

            {/* Efficiency input */}
            <div>
              <Label htmlFor="capacity-efficiency">Efficiency (%) - Optional</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="capacity-efficiency"
                  type="number"
                  placeholder="100"
                  value={efficiencyCapacity}
                  onChange={(e) => {
                    setEfficiencyCapacity(e.target.value);
                    setCapacityResult(null);
                  }}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="text-sm text-muted-foreground pt-2">%</span>
              </div>
            </div>

            {/* Calculate button */}
            <Button onClick={calculateCapacity} className="w-full" size="lg">
              Calculate Required Capacity
            </Button>

            {/* Error */}
            {capacityError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{capacityError}</span>
              </div>
            )}

            {/* Result */}
            {capacityResult !== null && (
              <Card className="p-6 bg-result/10 border-result/50">
                <div className="space-y-3">
                  <span className="text-sm text-muted-foreground">Required Capacity</span>
                  <div className="text-4xl font-bold text-result font-mono">
                    {capacityResult.toFixed(1)} mAh
                  </div>
                  <CopyButton
                    value={`${capacityResult.toFixed(1)} mAh`}
                    label="Copy result"
                  />
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* MAX CURRENT TAB */}
        <TabsContent value="current" className="space-y-4">
          <div className="space-y-4">
            {/* Capacity input */}
            <div>
              <Label htmlFor="current-capacity">Battery Capacity (mAh)</Label>
              <Input
                id="current-capacity"
                type="number"
                placeholder="e.g., 2000"
                value={batteryCapacity}
                onChange={(e) => {
                  setBatteryCapacity(e.target.value);
                  setMaxCurrentResult(null);
                }}
                step="any"
                className="mt-2"
              />
            </div>

            {/* Runtime input */}
            <div>
              <Label htmlFor="current-runtime">Desired Runtime (hours)</Label>
              <Input
                id="current-runtime"
                type="number"
                placeholder="e.g., 8"
                value={desiredRuntime}
                onChange={(e) => {
                  setDesiredRuntime(e.target.value);
                  setMaxCurrentResult(null);
                }}
                step="any"
                className="mt-2"
              />
            </div>

            {/* Efficiency input */}
            <div>
              <Label htmlFor="current-efficiency">Efficiency (%) - Optional</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="current-efficiency"
                  type="number"
                  placeholder="100"
                  value={efficiencyCurrent}
                  onChange={(e) => {
                    setEfficiencyCurrent(e.target.value);
                    setMaxCurrentResult(null);
                  }}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="text-sm text-muted-foreground pt-2">%</span>
              </div>
            </div>

            {/* Calculate button */}
            <Button onClick={calculateMaxCurrent} className="w-full" size="lg">
              Calculate Max Load Current
            </Button>

            {/* Error */}
            {maxCurrentError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{maxCurrentError}</span>
              </div>
            )}

            {/* Result */}
            {maxCurrentResult !== null && (
              <Card className="p-6 bg-result/10 border-result/50">
                <div className="space-y-3">
                  <span className="text-sm text-muted-foreground">Max Load Current</span>
                  <div className="text-4xl font-bold text-result font-mono">
                    {maxCurrentResult.toFixed(2)} mA
                  </div>
                  <CopyButton
                    value={`${maxCurrentResult.toFixed(2)} mA`}
                    label="Copy result"
                  />
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {showToast && <Toast message={toastMessage} />}
    </ToolPanel>
  );
}
