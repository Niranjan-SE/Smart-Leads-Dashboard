import { PaginationMeta } from '../../types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  const { page, totalPages, total, limit } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);

  if (totalPages <= 1) return null;

  const PageBtn = ({ p }: { p: number }) => (
    <button
      onClick={() => onPageChange(p)}
      className="w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
      style={p === page ? {
        background: 'var(--accent)',
        color: '#fff',
        boxShadow: '0 2px 8px var(--accent-glow)',
      } : {
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={e => { if (p !== page) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface-3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; } }}
      onMouseLeave={e => { if (p !== page) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; } }}
    >
      {p}
    </button>
  );

  const NavBtn = ({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
      onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface-3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; } }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Showing <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{start}–{end}</span> of{' '}
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{total}</span> leads
      </p>
      <div className="flex items-center gap-1.5">
        <NavBtn onClick={() => onPageChange(page - 1)} disabled={!meta.hasPrevPage}>← Prev</NavBtn>
        {pages[0] > 1 && <>
          <PageBtn p={1} />
          {pages[0] > 2 && <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>…</span>}
        </>}
        {pages.map(p => <PageBtn key={p} p={p} />)}
        {pages[pages.length - 1] < totalPages && <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>…</span>}
          <PageBtn p={totalPages} />
        </>}
        <NavBtn onClick={() => onPageChange(page + 1)} disabled={!meta.hasNextPage}>Next →</NavBtn>
      </div>
    </div>
  );
};
