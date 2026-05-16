import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            {label}{props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref} id={inputId}
            className={cn(
              'w-full rounded-xl text-sm transition-all duration-150',
              'focus:outline-none focus:ring-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              'py-2.5',
              className
            )}
            style={{
              background: 'var(--bg-surface-3)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
            } as React.CSSProperties}
            placeholder={props.placeholder}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3" style={{ color: 'var(--text-muted)' }}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">⚠ {error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
