import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Copy } from 'lucide-react';
import { ToolPanel } from './ToolPanel';
import { CopyButton } from './Shared/CopyButton';
import { Toast } from './Shared/Toast';
import { formatNumber } from '@/utils/format';
import {
  decode4Band,
  decode5Band,
  encode4Band,
  encode5Band,
  getColorList,
  getTolerantColorList
} from '@/utils/math/resistorColorCode';

export function ResistorColorCodePanel() {
  const navigate = useNavigate();
  const [decodeMode, setDecodeMode] = useState<'4band' | '5band'>('4band');
  const [decodedColors, setDecodedColors] = useState<string[]>(['brown', 'red', 'red', 'gold']);
  const [decodedResult, setDecodedResult] = useState<any>(null);
  const [decodedError, setDecodedError] = useState('');

  const [encodeMode, setEncodeMode] = useState<'4band' | '5band'>('4band');
  const [encodeResistance, setEncodeResistance] = useState('1000');
  const [encodeTolerance, setEncodeTolerance] = useState('±5%');
  const [encodedResult, setEncodedResult] = useState<any>(null);
  const [encodedError, setEncodedError] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const colorList = getColorList();
  const toleranceColorList = getTolerantColorList();

  // Decode handler
  const handleDecode = () => {
    setDecodedError('');
    try {
      const result = decodeMode === '4band'
        ? decode4Band(decodedColors)
        : decode5Band(decodedColors);
      setDecodedResult(result);
    } catch (e: any) {
      setDecodedError(e.message);
      setDecodedResult(null);
    }
  };

  // Encode handler
  const handleEncode = () => {
    setEncodedError('');
    try {
      const resistance = parseFloat(encodeResistance);
      if (isNaN(resistance) || resistance <= 0) {
        throw new Error('Resistance must be a positive number');
      }

      const result = encodeMode === '4band'
        ? encode4Band(resistance, encodeTolerance)
        : encode5Band(resistance, encodeTolerance);
      setEncodedResult(result);
    } catch (e: any) {
      setEncodedError(e.message);
      setEncodedResult(null);
    }
  };

  // Update color in decode
  const updateColor = (index: number, value: string) => {
    const newColors = [...decodedColors];
    newColors[index] = value;
    setDecodedColors(newColors);
    setDecodedResult(null);
  };

  const showResultToast = (text: string) => {
    setToastMessage(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <ToolPanel 
      title="Resistor Color Code"
      description="Encode and decode 4-band and 5-band resistor color codes with tolerance information."
      onBack={() => navigate('/')}
    >
      <Tabs defaultValue="decode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decode">Decode</TabsTrigger>
          <TabsTrigger value="encode">Encode</TabsTrigger>
        </TabsList>

        {/* DECODE TAB */}
        <TabsContent value="decode" className="space-y-4">
          <div className="space-y-4">
            {/* Band count selector */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Resistor Type</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={decodeMode === '4band' ? 'default' : 'outline'}
                  onClick={() => {
                    setDecodeMode('4band');
                    setDecodedColors(['brown', 'red', 'red', 'gold']);
                    setDecodedResult(null);
                  }}
                >
                  4-Band
                </Button>
                <Button
                  variant={decodeMode === '5band' ? 'default' : 'outline'}
                  onClick={() => {
                    setDecodeMode('5band');
                    setDecodedColors(['brown', 'red', 'red', 'black', 'gold']);
                    setDecodedResult(null);
                  }}
                >
                  5-Band
                </Button>
              </div>
            </div>

            {/* Color selectors */}
            <div>
              <Label className="mb-4 block text-sm font-semibold text-foreground">Select Band Colors</Label>
              <div className="grid gap-3">
                {decodedColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm font-mono min-w-[40px]">Band {idx + 1}:</span>
                    <Select value={color} onValueChange={(v) => updateColor(idx, v)}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{
                              backgroundColor: getColorHex(color)
                            }}
                          />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {(idx < (decodeMode === '4band' ? 3 : 4)
                          ? colorList
                          : toleranceColorList
                        ).map((c) => (
                          <SelectItem key={c} value={c}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded border border-border"
                                style={{ backgroundColor: getColorHex(c) }}
                              />
                              {c.charAt(0).toUpperCase() + c.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Decode button */}
            <Button onClick={handleDecode} className="w-full">
              Decode Colors
            </Button>

            {/* Error message */}
            {decodedError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{decodedError}</span>
              </div>
            )}

            {/* Result */}
            {decodedResult && (
              <div className="space-y-4">
                <Card className="p-6 bg-result/10 border-result/50">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Resistance Value</span>
                      <div className="text-3xl font-bold text-result font-mono mt-2">
                        {formatNumber(decodedResult.value, { unit: 'Ω', sigfigs: 4 })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Tolerance</span>
                        <div className="text-lg font-semibold mt-1">{decodedResult.tolerance}</div>
                      </div>
                      {decodedResult.tempCoeff && (
                        <div>
                          <span className="text-sm text-muted-foreground">Temp Coeff</span>
                          <div className="text-lg font-semibold mt-1">{decodedResult.tempCoeff}</div>
                        </div>
                      )}
                    </div>

                    <CopyButton
                      value={decodedResult.value.toString()}
                      label="Copy value"
                    />
                  </div>
                </Card>

                {/* Derivation */}
                <Card className="p-4 bg-derivation border-border">
                  <h4 className="font-semibold text-sm mb-3">Band Interpretation</h4>
                  <div className="space-y-2 text-sm">
                    {decodeMode === '4band' ? (
                      <>
                        <div>Bands 1-2: Significant digits = {decodedResult.bands[0]}, {decodedResult.bands[1]}</div>
                        <div>Band 3: Multiplier = 10^{getColorValue(decodedResult.bands[2])}</div>
                        <div>Band 4: Tolerance = {decodedResult.tolerance}</div>
                      </>
                    ) : (
                      <>
                        <div>Bands 1-3: Significant digits = {decodedResult.bands[0]}, {decodedResult.bands[1]}, {decodedResult.bands[2]}</div>
                        <div>Band 4: Multiplier = 10^{getColorValue(decodedResult.bands[3])}</div>
                        <div>Band 5: Tolerance = {decodedResult.tolerance}</div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ENCODE TAB */}
        <TabsContent value="encode" className="space-y-4">
          <div className="space-y-4">
            {/* Mode selector */}
            <div>
              <Label className="text-sm font-semibold text-foreground">Resistor Type</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={encodeMode === '4band' ? 'default' : 'outline'}
                  onClick={() => {
                    setEncodeMode('4band');
                    setEncodedResult(null);
                  }}
                >
                  4-Band
                </Button>
                <Button
                  variant={encodeMode === '5band' ? 'default' : 'outline'}
                  onClick={() => {
                    setEncodeMode('5band');
                    setEncodedResult(null);
                  }}
                >
                  5-Band
                </Button>
              </div>
            </div>

            {/* Resistance input */}
            <div>
              <Label htmlFor="encode-resistance" className="text-sm font-semibold text-foreground">Resistance Value (Ω)</Label>
              <Input
                id="encode-resistance"
                type="number"
                placeholder="e.g., 4700 or 4.7k or 10M"
                value={encodeResistance}
                onChange={(e) => {
                  setEncodeResistance(e.target.value);
                  setEncodedResult(null);
                }}
                className="mt-2"
              />
            </div>

            {/* Tolerance selector */}
            <div>
              <Label htmlFor="encode-tolerance" className="text-sm font-semibold text-foreground">Tolerance</Label>
              <Select value={encodeTolerance} onValueChange={(v) => {
                setEncodeTolerance(v);
                setEncodedResult(null);
              }}>
                <SelectTrigger id="encode-tolerance" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="±1%">±1% (Brown)</SelectItem>
                  <SelectItem value="±2%">±2% (Red)</SelectItem>
                  <SelectItem value="±5%">±5% (Gold)</SelectItem>
                  <SelectItem value="±10%">±10% (Silver)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Encode button */}
            <Button onClick={handleEncode} className="w-full">
              Encode to Colors
            </Button>

            {/* Error message */}
            {encodedError && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-sm text-destructive">{encodedError}</span>
              </div>
            )}

            {/* Result */}
            {encodedResult && (
              <div className="space-y-4">
                <Card className="p-6 bg-result/10 border-result/50">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Color Code</span>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {encodedResult.colors.map((color: string, idx: number) => (
                          <div key={idx} className="flex flex-col items-center gap-2">
                            <div
                              className="w-12 h-20 rounded border-2 border-border"
                              style={{ backgroundColor: getColorHex(color) }}
                            />
                            <span className="text-xs font-mono">
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-sm text-muted-foreground">Format</span>
                      <div className="text-lg font-mono mt-2">{encodedResult.formatted}</div>
                    </div>

                    <CopyButton
                      value={encodedResult.formatted}
                      label="Copy color sequence"
                    />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {showToast && <Toast message={toastMessage} />}
    </ToolPanel>
  );
}

function getColorHex(colorName: string): string {
  const colors: Record<string, string> = {
    black: '#000000',
    brown: '#8B4513',
    red: '#FF0000',
    orange: '#FFA500',
    yellow: '#FFFF00',
    green: '#00A000',
    blue: '#0000FF',
    violet: '#8B00FF',
    grey: '#808080',
    gray: '#808080',
    white: '#FFFFFF',
    gold: '#FFD700',
    silver: '#C0C0C0'
  };
  return colors[colorName.toLowerCase()] || '#000000';
}

function getColorValue(colorName: string): number {
  const values: Record<string, number> = {
    black: 0,
    brown: 1,
    red: 2,
    orange: 3,
    yellow: 4,
    green: 5,
    blue: 6,
    violet: 7,
    grey: 8,
    gray: 8,
    white: 9
  };
  return values[colorName.toLowerCase()] || 0;
}
