import { useLeadStats } from '../hooks/useLeads';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { Users2, TrendingUp, CheckCircle2, XCircle, Phone, Globe, Instagram, Voicemail, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  delay?: number;
}

const StatCard = ({ label, value, icon, iconBg, iconColor, delay = 0 }: StatCardProps) => (
  <div
    className="rounded-2xl p-5 flex items-center gap-4 animate-fade-in transition-all duration-200 hover:scale-[1.02] cursor-default"
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      animationDelay: `${delay}ms`,
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'; }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
      <span style={{ color: iconColor }}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  </div>
);

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useLeadStats();

  const qualifiedRate = stats && stats.totalLeads > 0
    ? Math.round((stats.byStatus.Qualified / stats.totalLeads) * 100) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening with your leads today.
          </p>
        </div>
        <Link to="/leads">
          <Button leftIcon={<Plus className="w-4 h-4" />}>New Lead</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="skeleton h-32 rounded-2xl" />
            <div className="skeleton h-32 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({length:4}).map((_,i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        </div>
      ) : stats ? (
        <>
          {/* Hero cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 stagger-children">
            <div
              className="rounded-2xl p-6 animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 4px 24px rgba(99,102,241,0.1)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Leads</p>
                  <p className="text-5xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats.totalLeads}</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--accent)' }}>
                    All time · {user?.role === 'admin' ? 'all users' : 'your account'}
                  </p>
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center animate-float"
                  style={{ background: 'rgba(99,102,241,0.15)' }}
                >
                  <Users2 className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 animate-fade-in"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 100%)',
                border: '1px solid rgba(16,185,129,0.2)',
                boxShadow: '0 4px 24px rgba(16,185,129,0.08)',
                animationDelay: '60ms',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Qualification Rate</p>
                  <p className="text-5xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{qualifiedRate}%</p>
                  <p className="text-xs mt-2" style={{ color: '#10b981' }}>
                    {stats.byStatus.Qualified} of {stats.totalLeads} qualified
                  </p>
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center animate-float"
                  style={{ background: 'rgba(16,185,129,0.12)', animationDelay: '1s' }}
                >
                  <TrendingUp className="w-8 h-8" style={{ color: '#10b981' }} />
                </div>
              </div>
            </div>
          </div>

          {/* By Status */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>By Status</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
            <StatCard label="New Leads"  value={stats.byStatus.New}       icon={<Users2 className="w-5 h-5"/>}       iconBg="rgba(56,189,248,0.12)"  iconColor="#38bdf8"  delay={0} />
            <StatCard label="Contacted"  value={stats.byStatus.Contacted}  icon={<Phone className="w-5 h-5"/>}        iconBg="rgba(245,158,11,0.12)"  iconColor="#f59e0b"  delay={60} />
            <StatCard label="Qualified"  value={stats.byStatus.Qualified}  icon={<CheckCircle2 className="w-5 h-5"/>} iconBg="rgba(16,185,129,0.12)"  iconColor="#10b981"  delay={120} />
            <StatCard label="Lost"       value={stats.byStatus.Lost}       icon={<XCircle className="w-5 h-5"/>}      iconBg="rgba(239,68,68,0.12)"   iconColor="#ef4444"  delay={180} />
          </div>

          {/* By Source */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>By Source</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
            <StatCard label="From Website"   value={stats.bySource.Website}   icon={<Globe className="w-5 h-5"/>}    iconBg="rgba(139,92,246,0.12)"  iconColor="#8b5cf6" delay={0} />
            <StatCard label="From Instagram" value={stats.bySource.Instagram} icon={<Instagram className="w-5 h-5"/>} iconBg="rgba(236,72,153,0.12)" iconColor="#ec4899" delay={60} />
            <StatCard label="From Referral"  value={stats.bySource.Referral}  icon={<Voicemail className="w-5 h-5"/>} iconBg="rgba(249,115,22,0.12)" iconColor="#f97316" delay={120} />
          </div>
        </>
      ) : null}

      {/* CTA */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between animate-fade-in"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', animationDelay: '400ms' }}
      >
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Manage your leads</h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>View, filter, search, and export all your leads.</p>
        </div>
        <Link to="/leads">
          <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>Go to Leads</Button>
        </Link>
      </div>
    </div>
  );
};
