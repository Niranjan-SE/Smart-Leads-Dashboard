import { LeadStatus, LeadSource } from '../../types';

const statusConfig: Record<LeadStatus, { dot: string; text: string; bg: string; border: string }> = {
  New:       { dot: '#38bdf8', text: '#38bdf8', bg: 'rgba(56,189,248,0.1)',   border: 'rgba(56,189,248,0.2)' },
  Contacted: { dot: '#f59e0b', text: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)' },
  Qualified: { dot: '#10b981', text: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.2)' },
  Lost:      { dot: '#ef4444', text: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.2)' },
};

const sourceConfig: Record<LeadSource, { text: string; bg: string; border: string }> = {
  Website:   { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.2)' },
  Instagram: { text: '#f472b6', bg: 'rgba(244,114,182,0.1)',  border: 'rgba(244,114,182,0.2)' },
  Referral:  { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.2)' },
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const c = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  );
};

export const SourceBadge = ({ source }: { source: LeadSource }) => {
  const c = sourceConfig[source];
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {source}
    </span>
  );
};
