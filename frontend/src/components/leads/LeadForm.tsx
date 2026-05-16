import { useState } from 'react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads';

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormErrors { name?: string; email?: string; source?: string; }

export const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const isEdit = !!lead;
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const [form, setForm] = useState<LeadFormData>({
    name: lead?.name ?? '',
    email: lead?.email ?? '',
    status: lead?.status ?? 'New',
    source: lead?.source ?? '' as LeadSource,
    notes: lead?.notes ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const e: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.source) e.source = 'Source is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (isEdit) { await updateLead.mutateAsync({ id: lead._id, data: form }); }
    else { await createLead.mutateAsync(form); }
    onSuccess();
  };

  const isLoading = createLead.isPending || updateLead.isPending;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
          error={errors.name} placeholder="e.g. Rahul Sharma" required />
        <Input label="Email Address" type="email" value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
          error={errors.email} placeholder="rahul@example.com" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={form.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value as LeadStatus })}
          options={[{value:'New',label:'New'},{value:'Contacted',label:'Contacted'},{value:'Qualified',label:'Qualified'},{value:'Lost',label:'Lost'}]} />
        <Select label="Source" value={form.source}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, source: e.target.value as LeadSource })}
          options={[{value:'Website',label:'Website'},{value:'Instagram',label:'Instagram'},{value:'Referral',label:'Referral'}]}
          placeholder="Select source..." error={errors.source} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          Notes <span className="font-normal text-xs" style={{ color: 'var(--text-muted)' }}>(optional)</span>
        </label>
        <textarea
          value={form.notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, notes: e.target.value })}
          placeholder="Add any notes about this lead..."
          rows={3} maxLength={500}
          className="w-full rounded-xl text-sm px-3.5 py-2.5 resize-none focus:outline-none transition-all duration-150"
          style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
          onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none'; }}
        />
        <p className="mt-1 text-xs text-right" style={{ color: 'var(--text-muted)' }}>{(form.notes ?? '').length}/500</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>Cancel</Button>
        <Button onClick={handleSubmit} isLoading={isLoading} className="flex-1">
          {isEdit ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </div>
  );
};
