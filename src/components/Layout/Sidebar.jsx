import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Briefcase, Star, ClipboardList,
  ChevronLeft, ChevronRight, Zap, LogOut, Settings
} from 'lucide-react';
import { logoutUser } from '../../services/authService';

const NAV_ITEMS = [
  { path: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/stocks',       label: 'Markets',      icon: TrendingUp },
  { path: '/portfolio',    label: 'Portfolio',    icon: Briefcase },
  { path: '/watchlist',    label: 'Watchlist',    icon: Star },
  { path: '/transactions', label: 'Transactions', icon: ClipboardList },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen shrink-0 border-r border-white/5 z-50"
      style={{ background: 'rgba(10, 16, 32, 0.95)', backdropFilter: 'blur(20px)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 min-h-[72px]">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shrink-0 glow-green">
          <Zap size={18} className="text-navy-900" fill="currentColor" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold text-gradient whitespace-nowrap"
            >
              Tradewise
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path || (path === '/stocks' && location.pathname.startsWith('/stock'));
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full ${active ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <button onClick={() => navigate('/settings')} className={`w-full ${location.pathname === '/settings' ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-0' : ''}`} title={collapsed ? 'Settings' : undefined}>
          <Settings size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={async () => {
             await logoutUser();
             navigate('/');
          }}
          className={`sidebar-link w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/5 ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-navy-500 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-navy-400 transition-all z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
