import { useCallback, useRef } from 'react';
import { LeadsFilters, LeadStatus, LeadSource } from '../../types';
import { Search, X } from 'lucide-react';

interface LeadsFiltersBarProps {
  filters: LeadsFilters;
  onChange: (filters: Partial<LeadsFilters>) => void;
}

const SelectFilter = ({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm cursor-pointer focus:outline-none transition-all duration-150"
      style={{
        background: 'var(--bg-surface-3)',
        border: '1px solid var(--border)',
        color: value ? 'var(--text-primary)' : 'var(--text-muted)',
        minWidth: '140px',
      }}
      onFocus={e => { (e.target as HTMLSelectElement).style.borderColor = 'var(--accent)'; (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
      onBlur={e => { (e.target as HTMLSelectElement).style.borderColor = 'var(--border)'; (e.target as HTMLSelectElement).style.boxShadow = 'none'; }}
    >
      <option value="" style={{ background: 'var(--bg-surface-2)' }}>{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: 'var(--bg-surface-2)' }}>{o.label}</option>
      ))}
    </select>
    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

export const LeadsFiltersBar = ({ filters, onChange }: LeadsFiltersBarProps) => {
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((val: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => onChange({ search: val, page: 1 }), 400);
  }, [onChange]);

  const hasActive = filters.status || filters.source || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="flex-1 min-w-52 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        <input
          defaultValue={filters.search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all duration-150"
          style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--accent)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
          onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)'; (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
        />
      </div>

      <SelectFilter
        value={filters.status ?? ''}
        onChange={v => onChange({ status: v as LeadStatus | '', page: 1 })}
        options={[
          { value: 'New', label: 'New' },
          { value: 'Contacted', label: 'Contacted' },
          { value: 'Qualified', label: 'Qualified' },
          { value: 'Lost', label: 'Lost' },
        ]}
        placeholder="All statuses"
      />

      <SelectFilter
        value={filters.source ?? ''}
        onChange={v => onChange({ source: v as LeadSource | '', page: 1 })}
        options={[
          { value: 'Website', label: 'Website' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'Referral', label: 'Referral' },
        ]}
        placeholder="All sources"
      />

      <SelectFilter
        value={filters.sort}
        onChange={v => onChange({ sort: v as 'latest' | 'oldest', page: 1 })}
        options={[
          { value: 'latest', label: 'Latest First' },
          { value: 'oldest', label: 'Oldest First' },
        ]}
        placeholder="Sort by"
      />

      {hasActive && (
        <button
          onClick={() => onChange({ status: '', source: '', search: '', page: 1 })}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
        >
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      )}
    </div>
  );
};
