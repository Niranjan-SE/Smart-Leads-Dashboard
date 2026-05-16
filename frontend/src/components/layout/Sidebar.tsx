import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users2, LogOut, ChevronRight, Zap, Shield, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users2, label: 'Leads' },
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const isAdmin = user?.role === 'admin';

  return (
    <aside
      className="w-64 flex flex-col h-screen sticky top-0 animate-fade-in-left"
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center animate-float"
            style={{ background: 'var(--accent)', boxShadow: '0 4px 14px var(--accent-glow)' }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Smart Leads</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive ? 'active-nav' : 'inactive-nav'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(99,102,241,0.12)',
              color: 'var(--accent)',
              border: '1px solid rgba(99,102,241,0.2)',
            } : {
              color: 'var(--text-secondary)',
              border: '1px solid transparent',
            }}
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle + User */}
      <div className="px-3 py-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>

        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group"
          style={{
            background: 'var(--bg-surface-3)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="relative w-4 h-4">
            <Sun
              className={`w-4 h-4 absolute transition-all duration-300 ${
                theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
              }`}
              style={{ color: '#f59e0b' }}
            />
            <Moon
              className={`w-4 h-4 absolute transition-all duration-300 ${
                theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}
              style={{ color: '#818cf8' }}
            />
          </div>
          <span className="flex-1 text-left">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          {/* Toggle pill */}
          <div
            className="w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0"
            style={{ background: theme === 'dark' ? 'var(--accent)' : 'var(--bg-surface-4)' }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
              style={{ left: theme === 'dark' ? '22px' : '2px' }}
            />
          </div>
        </button>

        {/* User card */}
        <div
          className="px-3 py-3 rounded-xl"
          style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{
                background: isAdmin
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'linear-gradient(135deg, #6366f1, #06b6d4)',
                boxShadow: '0 2px 8px var(--accent-glow)',
              }}
            >
              {user?.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                <p className="text-xs capitalize" style={{ color: 'var(--accent)' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer group"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
            (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
};
