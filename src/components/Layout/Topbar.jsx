import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, TrendingUp, TrendingDown, LogOut, Settings, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { marketIndices } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/stocks':       'Markets',
  '/portfolio':    'Portfolio',
  '/watchlist':    'Watchlist',
  '/transactions': 'Transactions',
};

export default function Topbar({ onMenuClick }) {
  const [query, setQuery] = useState('');
  const [showNotifWindow, setShowNotifWindow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { currentUser } = useAuth();

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Trader';
  const initial = displayName.substring(0, 2).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNotifWindow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const title = PAGE_TITLES[location.pathname] ||
    (location.pathname === '/settings' ? 'Settings' :
    (location.pathname.startsWith('/stock/') ? 'Stock Detail' : 'Tradewise'));

  return (
    <header className="h-16 border-b border-white/5 flex items-center px-6 gap-4 shrink-0 relative z-50"
      style={{ background: 'rgba(10, 16, 32, 0.8)', backdropFilter: 'blur(20px)' }}>

      {/* Mobile Menu Toggle */}
      <button onClick={onMenuClick} className="lg:hidden p-2 text-white/70 hover:text-white">
        <Menu size={20} />
      </button>

      {/* Page Title */}
      <h1 className="text-lg font-semibold text-white/90 mr-4 shrink-0">{title}</h1>

      {/* Market ticker strip */}
      <div className="hidden lg:flex items-center gap-5 flex-1 overflow-hidden">
        {marketIndices.map(idx => (
          <div key={idx.id} className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-white/40 font-medium">{idx.name}</span>
            <span className="font-mono font-semibold text-white">
              {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center gap-0.5 font-medium ${idx.change >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
              {idx.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          id="topbar-search"
          type="text"
          placeholder="Search stocks…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 rounded-xl pl-9 pr-4 py-2 w-44 focus:outline-none focus:border-brand-500/40 focus:w-56 transition-all duration-300"
        />
      </div>

      {/* Notification bell & User avatar container */}
      <div className="flex items-center gap-2 relative" ref={menuRef}>
        
        {/* Notification bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifWindow(!showNotifWindow)}
            className="relative p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full" />
          </button>
          
          <AnimatePresence>
            {showNotifWindow && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-72 bg-navy-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  <span className="text-xs text-brand-400 cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start border-b border-white/5 pb-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                      <TrendingUp size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-white">AAPL hit your target price of <span className="font-bold text-brand-400">$185.00</span></p>
                      <p className="text-[10px] text-white/40 mt-1">10 min ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-white">Your weekly portfolio report is ready. You're up 2.4%.</p>
                      <p className="text-[10px] text-white/40 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="relative">
          <div className="flex items-center gap-2 p-1 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand-500 text-navy-900 flex items-center justify-center font-bold text-xs glow-green">
              {initial}
            </div>
            <div className="hidden sm:block text-left mr-1">
              <p className="text-sm font-semibold text-white capitalize">{displayName}</p>
              <p className="text-[10px] text-white/40 -mt-0.5">Pro Trader</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
