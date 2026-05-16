import { useState } from 'react';
import { useLeads, useExportLeads } from '../hooks/useLeads';
import { LeadsFilters } from '../types';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadsFiltersBar } from '../components/leads/LeadsFiltersBar';
import { Pagination } from '../components/leads/Pagination';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { Button } from '../components/ui/Button';
import { Plus, Download, RefreshCw } from 'lucide-react';

const defaultFilters: LeadsFilters = {
  status: '', source: '', search: '', sort: 'latest', page: 1,
};

export const LeadsPage = () => {
  const [filters, setFilters] = useState<LeadsFilters>(defaultFilters);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useLeads(filters);
  const exportMutation = useExportLeads();

  const handleFilterChange = (partial: Partial<LeadsFilters>) =>
    setFilters(prev => ({ ...prev, ...partial }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Leads</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {data?.pagination
              ? `${data.pagination.total} total lead${data.pagination.total !== 1 ? 's' : ''}`
              : 'Manage and track your leads'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost" size="md"
            leftIcon={<RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            variant="secondary" size="md"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => exportMutation.mutate(filters)}
            isLoading={exportMutation.isPending}
          >
            Export CSV
          </Button>
          <Button size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            New Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 mb-4 animate-fade-in"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', animationDelay: '60ms' }}
      >
        <LeadsFiltersBar filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', animationDelay: '120ms' }}
      >
        <div className="px-6 pt-5 pb-4">
          <LeadsTable leads={data?.leads ?? []} isLoading={isLoading} />
        </div>
        {data?.pagination && (
          <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
            <Pagination meta={data.pagination} onPageChange={(page: number) => handleFilterChange({ page })} />
          </div>
        )}
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Lead" size="md">
        <LeadForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
      </Modal>
    </div>
  );
};
