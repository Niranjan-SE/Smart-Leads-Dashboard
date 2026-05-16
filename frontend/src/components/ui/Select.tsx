import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            {label}{props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref} id={selectId}
            className={cn('w-full rounded-xl text-sm appearance-none pl-3.5 pr-10 py-2.5 cursor-pointer focus:outline-none transition-all duration-150', className)}
            style={{ background: 'var(--bg-surface-3)', border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, color: 'var(--text-primary)' }}
            onFocus={e => { (e.target as HTMLSelectElement).style.borderColor = 'var(--accent)'; (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
            onBlur={e => { (e.target as HTMLSelectElement).style.borderColor = 'var(--border)'; (e.target as HTMLSelectElement).style.boxShadow = 'none'; }}
            {...props}
          >
            {placeholder && <option value="" style={{ background: 'var(--bg-surface-2)' }}>{placeholder}</option>}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-surface-2)' }}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">⚠ {error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
