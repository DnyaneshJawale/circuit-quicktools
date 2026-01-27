import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface UnitInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  hint?: string;
  error?: string;
  unit?: string;
  onChange?: (value: string) => void;
}

export const UnitInput = forwardRef<HTMLInputElement, UnitInputProps>(
  ({ label, hint, error, unit, className, onChange, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const id = propId ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full px-3 py-2.5 rounded-lg',
              'bg-input border border-border',
              'text-foreground placeholder:text-muted-foreground',
              'font-mono text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'transition-all duration-200',
              'min-h-[44px]',
              unit && 'pr-12',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            onChange={(e) => onChange?.(e.target.value)}
            aria-describedby={cn(hint && hintId, error && errorId)}
            aria-invalid={!!error}
            {...props}
          />
          
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              {unit}
            </span>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

UnitInput.displayName = 'UnitInput';
