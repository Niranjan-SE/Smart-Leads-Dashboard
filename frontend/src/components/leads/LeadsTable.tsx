import { useState } from 'react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { LeadForm } from './LeadForm';
import { useDeleteLead } from '../../hooks/useLeads';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';
import { Pencil, Trash2, Mail, Calendar, User, Crown, UserCheck } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
}

const OwnerChip = ({ lead, isAdmin }: {
  lead: Lead;
  isAdmin: boolean;
}) => {
  const createdBy = lead.createdBy as { name?: string; email?: string } | null;
  const ownerName = createdBy?.name ?? 'Unknown';

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{
          background: ownerName.toLowerCase().includes('admin')
            ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
            : 'linear-gradient(135deg,#6366f1,#06b6d4)',
          fontSize: '9px',
        }}
      >
        {ownerName.slice(0,1).toUpperCase()}
      </div>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {ownerName}
      </span>
      {ownerName.toLowerCase().includes('admin') ? (
        <Crown className="w-3 h-3" style={{ color: '#8b5cf6' }} />
      ) : (
        <UserCheck className="w-3 h-3" style={{ color: '#06b6d4' }} />
      )}
    </div>
  );
};

export const LeadsTable = ({ leads, isLoading }: LeadsTableProps) => {
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const deleteMutation = useDeleteLead();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    setDeletingId(id);
    try { await deleteMutation.mutateAsync(id); }
    finally { setDeletingId(null); }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-scale-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
          style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}
        >
          <User className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No leads found</h3>
        <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
          Try adjusting your filters or create a new lead to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th className="text-left text-xs font-semibold uppercase tracking-wider pb-3 pl-4" style={{ color: 'var(--text-muted)' }}>Lead</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: 'var(--text-muted)' }}>Source</th>
              {isAdmin && (
                <th className="text-left text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: 'var(--text-muted)' }}>
                  Created By
                </th>
              )}
              <th className="text-left text-xs font-semibold uppercase tracking-wider pb-3" style={{ color: 'var(--text-muted)' }}>Created</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider pb-3 pr-4" style={{ color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr
                key={lead._id}
                className="group cursor-pointer animate-fade-in"
                style={{
                  borderBottom: '1px solid var(--border)',
                  animationDelay: `${i * 40}ms`,
                }}
                onClick={() => setViewLead(lead)}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(99,102,241,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
              >
                {/* Lead name + email */}
                <td className="py-3.5 pl-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, var(--accent), #8b5cf6)`,
                        boxShadow: '0 2px 8px var(--accent-glow)',
                      }}
                    >
                      {lead.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium transition-colors duration-150" style={{ color: 'var(--text-primary)' }}>
                        {lead.name}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <Mail className="w-3 h-3" />{lead.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5"><StatusBadge status={lead.status} /></td>
                <td className="py-3.5"><SourceBadge source={lead.source} /></td>

                {/* Created By — admin only */}
                {isAdmin && (
                  <td className="py-3.5">
                    <OwnerChip lead={lead} isAdmin={isAdmin} />
                  </td>
                )}

                <td className="py-3.5">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Calendar className="w-3 h-3" />{formatDate(lead.createdAt)}
                  </div>
                </td>

                <td className="py-3.5 pr-4">
                  <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setEditLead(lead)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                      style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = 'rgba(99,102,241,0.1)';
                        el.style.color = 'var(--accent)';
                        el.style.borderColor = 'rgba(99,102,241,0.3)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = 'transparent';
                        el.style.color = 'var(--text-secondary)';
                        el.style.borderColor = 'var(--border)';
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      disabled={deletingId === lead._id}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer disabled:opacity-50"
                      style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = 'rgba(239,68,68,0.1)';
                        el.style.borderColor = 'rgba(239,68,68,0.4)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = 'transparent';
                        el.style.borderColor = 'rgba(239,68,68,0.2)';
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deletingId === lead._id ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="md">
        {editLead && (
          <LeadForm lead={editLead} onSuccess={() => setEditLead(null)} onCancel={() => setEditLead(null)} />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!viewLead} onClose={() => setViewLead(null)} title="Lead Details" size="sm">
        {viewLead && (
          <div className="space-y-4 animate-scale-in">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                  boxShadow: '0 4px 16px var(--accent-glow)',
                }}
              >
                {viewLead.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{viewLead.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{viewLead.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</p>
                <StatusBadge status={viewLead.status} />
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Source</p>
                <SourceBadge source={viewLead.source} />
              </div>
            </div>

            {isAdmin && (
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Created By</p>
                <OwnerChip lead={viewLead} isAdmin={isAdmin} />
              </div>
            )}

            {viewLead.notes && (
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Notes</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{viewLead.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar className="w-3.5 h-3.5" />Created {formatDate(viewLead.createdAt)}
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={() => setViewLead(null)} className="flex-1">Close</Button>
              <Button leftIcon={<Pencil className="w-4 h-4" />} onClick={() => { setEditLead(viewLead); setViewLead(null); }} className="flex-1">
                Edit Lead
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
