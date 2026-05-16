import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, style, ...props }, ref) => {

    const sizeClass = { sm: 'px-3 py-1.5 text-xs gap-1.5', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-2.5 text-sm gap-2' }[size];

    const baseStyle: React.CSSProperties = {
      transition: 'all 0.15s ease',
    };

    const variantStyle: React.CSSProperties = (() => {
      switch (variant) {
        case 'primary':   return { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)', boxShadow: '0 2px 10px var(--accent-glow)' };
        case 'secondary': return { background: 'var(--bg-surface-3)', color: 'var(--text-primary)', border: '1px solid var(--border)' };
        case 'ghost':     return { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' };
        case 'danger':    return { background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' };
        case 'outline':   return { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
      }
    })();

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:opacity-90 active:scale-95',
          sizeClass,
          className
        )}
        style={{ ...baseStyle, ...variantStyle, ...style }}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';
