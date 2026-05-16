import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const register = useRegister();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) register.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="rounded-2xl p-8 shadow-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-lg)' }}>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center animate-float"
                style={{ background: 'var(--accent)', boxShadow: '0 4px 20px var(--accent-glow)' }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Smart Leads</h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Lead Management Dashboard</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create account</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Start managing your leads today</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full Name" value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
              error={errors.name} placeholder="Your name"
              leftIcon={<User className="w-4 h-4" />} required />
            <Input label="Email" type="email" value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
              error={errors.email} placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />} required />
            <Input label="Password" type={showPw ? 'text' : 'password'} value={form.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
              error={errors.password} placeholder="Min 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              } required />
            <Select label="Role" value={form.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: e.target.value })}
              options={[{ value: 'sales', label: 'Sales User' }, { value: 'admin', label: 'Admin' }]} />
            <Button type="submit" className="w-full mt-2" size="lg" isLoading={register.isPending}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
