import { DerivationStep } from '@/utils/math/resistors';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from './Shared/CopyButton';

interface DerivationBlockProps {
  steps: DerivationStep[];
  className?: string;
}

export function DerivationBlock({ steps, className }: DerivationBlockProps) {
  const [expanded, setExpanded] = useState(false);

  if (steps.length === 0) return null;

  const derivationText = steps
    .map((step, i) => `${i + 1}. ${step.description}\n   ${step.formula}`)
    .join('\n\n');

  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'bg-derivation hover:bg-muted/50 transition-colors',
          'focus-ring min-h-[44px]'
        )}
        aria-expanded={expanded}
        aria-controls="derivation-content"
      >
        <span className="text-sm font-medium text-foreground">
          Show Derivation ({steps.length} steps)
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div
          id="derivation-content"
          className="p-4 bg-derivation border-t border-border space-y-4 animate-fade-in"
        >
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <code className="block text-sm font-mono text-foreground bg-muted/50 px-2 py-1 rounded overflow-x-auto">
                    {step.formula}
                  </code>
                </div>
              </li>
            ))}
          </ol>

          <div className="pt-2 border-t border-border">
            <CopyButton
              text={derivationText}
              label="Copy Derivation"
              className="w-full justify-center"
            />
          </div>
        </div>
      )}
    </div>
  );
}
