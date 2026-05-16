import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => (
  <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);
