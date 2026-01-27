import { ReactNode } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CopyButton } from './Shared/CopyButton';

interface ToolPanelProps {
  title: string;
  description: string;
  onBack: () => void;
  children: ReactNode;
  shareUrl?: string;
}

export function ToolPanel({ title, description, onBack, children, shareUrl }: ToolPanelProps) {
  const handleShare = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (err) {
        console.error('Failed to copy share URL:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={cn(
                  'p-2 rounded-lg',
                  'hover:bg-muted transition-colors',
                  'focus-ring min-h-[44px] min-w-[44px]',
                  'flex items-center justify-center'
                )}
                aria-label="Back to tools"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            {shareUrl && (
              <CopyButton
                text={shareUrl}
                label="Share"
                onCopy={() => {}}
              />
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

interface PanelSectionProps {
  children: ReactNode;
  className?: string;
}

export function PanelInputs({ children, className }: PanelSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

export function PanelResults({ children, className }: PanelSectionProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-card border border-border',
        'lg:sticky lg:top-24',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}

export function ResultValue({
  label,
  value,
  unit,
  highlight = false,
  className
}: {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          'font-mono-result text-2xl font-bold transition-all duration-300',
          highlight ? 'text-result animate-scale-in' : 'text-foreground'
        )}
      >
        {value}
        {unit && <span className="text-lg ml-1 text-muted-foreground">{unit}</span>}
      </p>
    </div>
  );
}
