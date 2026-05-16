import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const login = useLogin();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Valid email required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="rounded-2xl p-8 shadow-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-lg)' }}>

          {/* Logo */}
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

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Email" type="email" value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              error={errors.email} placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />} autoComplete="email" required />
            <Input label="Password" type={showPw ? 'text' : 'password'} value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              error={errors.password} placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="cursor-pointer transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password" required />
            <Button type="submit" className="w-full mt-2" size="lg" isLoading={login.isPending}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 p-4 rounded-xl" style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--text-muted)' }}>Demo Credentials</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@smartleads.com', pass: 'admin123' },
                { role: 'Sales', email: 'sales@smartleads.com', pass: 'sales123' },
              ].map(({ role, email: e, pass }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setEmail(e); setPassword(pass); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface-4)'; (ev.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                >
                  <span className="font-medium" style={{ color: 'var(--accent)' }}>{role}</span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{e}</span>
                </button>
              ))}
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>Click a role above to auto-fill</p>
          </div>
        </div>
      </div>
    </div>
  );
};
