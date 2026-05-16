import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Lead, LeadFormData, LeadsFilters, ApiResponse, PaginationMeta, LeadStats } from '../types';
import toast from 'react-hot-toast';

// --- Leads Queries ---

export const useLeads = (filters: LeadsFilters) => {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.source) params.set('source', filters.source);
  if (filters.search) params.set('search', filters.search);
  params.set('sort', filters.sort);
  params.set('page', String(filters.page));
  params.set('limit', '10');

  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
      return { leads: data.data ?? [], pagination: data.pagination as PaginationMeta };
    },
    placeholderData: (prev) => prev,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
      return data.data as Lead;
    },
    enabled: !!id,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ['leadStats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<LeadStats>>('/leads/stats');
      return data.data as LeadStats;
    },
  });
};

// --- Lead Mutations ---

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: LeadFormData) => {
      const { data } = await api.post<ApiResponse<Lead>>('/leads', formData);
      return data.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['leadStats'] });
      toast.success('Lead created successfully!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeadFormData> }) => {
      const { data: res } = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
      return res.data as Lead;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', id] });
      qc.invalidateQueries({ queryKey: ['leadStats'] });
      toast.success('Lead updated successfully!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['leadStats'] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to delete lead');
    },
  });
};

export const useExportLeads = () => {
  return useMutation({
    mutationFn: async (filters: Partial<LeadsFilters>) => {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.source) params.set('source', filters.source);
      if (filters.search) params.set('search', filters.search);

      const response = await api.get(`/leads/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => toast.success('CSV exported successfully!'),
    onError: () => toast.error('Failed to export CSV'),
  });
};
