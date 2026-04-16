import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { fmt } from '../utils/format';

const FILTERS = ['All', 'Buy', 'Sell'];

export default function Transactions() {
  const navigate = useNavigate();
  const { transactions } = usePortfolio();
  const [filter, setFilter] = useState('All');
  const [query, setQuery]   = useState('');

  const filtered = transactions.filter(t => {
    const matchType   = filter === 'All' || t.type === filter.toUpperCase();
    const matchSearch = t.ticker.toLowerCase().includes(query.toLowerCase()) ||
                        t.name.toLowerCase().includes(query.toLowerCase());
    return matchType && matchSearch;
  });

  const totalBought = transactions.filter(t => t.type === 'BUY').reduce((a, t) => a + t.total, 0);
  const totalSold   = transactions.filter(t => t.type === 'SELL').reduce((a, t) => a + t.total, 0);

  return (
    <div className="space-y-5 pb-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <p className="text-sm text-white/40 mt-0.5">A complete log of your trades</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Transactions', value: transactions.length, sub: 'All time', icon: ClipboardList, color: 'blue' },
          { label: 'Total Bought',  value: fmt.currency(totalBought),  sub: `${transactions.filter(t=>t.type==='BUY').length} orders`, icon: ArrowUpRight, color: 'green' },
          { label: 'Total Sold',    value: fmt.currency(totalSold),    sub: `${transactions.filter(t=>t.type==='SELL').length} orders`, icon: ArrowDownRight, color: 'red' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            className="glass-card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              c.color === 'green' ? 'bg-brand-500/10 text-brand-400' :
              c.color === 'red'   ? 'bg-red-500/10 text-red-400' :
                                    'bg-blue-500/10 text-blue-400'
            }`}>
              <c.icon size={18} />
            </div>
            <div>
              <p className="stat-label">{c.label}</p>
              <p className="text-lg font-bold text-white mt-0.5">{c.value}</p>
              <p className="text-xs text-white/30">{c.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input id="tx-search" type="text" placeholder="Search transactions…" value={query}
            onChange={e => setQuery(e.target.value)} className="input-field pl-9 h-10 text-xs" />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                filter === f
                  ? f === 'Buy' ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                    : f === 'Sell' ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-white/10 text-white border-white/20'
                  : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/20'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/5">
                <th className="text-left px-5 py-4 font-medium">Date</th>
                <th className="text-left px-4 py-4 font-medium">Stock</th>
                <th className="text-center px-4 py-4 font-medium">Type</th>
                <th className="text-right px-4 py-4 font-medium hidden sm:table-cell">Shares</th>
                <th className="text-right px-4 py-4 font-medium hidden md:table-cell">Price</th>
                <th className="text-right px-5 py-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="table-row group" onClick={() => navigate(`/stock/${tx.ticker.toLowerCase()}`)}>
                  <td className="px-5 py-4 text-white/50 text-xs whitespace-nowrap">{fmt.date(tx.date)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {tx.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{tx.ticker}</p>
                        <p className="text-xs text-white/40 hidden sm:block truncate max-w-[140px]">{tx.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={tx.type === 'BUY' ? 'badge-buy' : 'badge-sell'}>
                      {tx.type === 'BUY' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-white/70 hidden sm:table-cell">{tx.shares}</td>
                  <td className="px-4 py-4 text-right font-mono text-white/50 hidden md:table-cell">{fmt.currency(tx.price)}</td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-white">{fmt.currency(tx.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <ClipboardList size={32} className="mx-auto mb-3 opacity-40" />
              <p>No transactions found.</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/30">{filtered.length} of {transactions.length} transactions</p>
        </div>
      </motion.div>
    </div>
  );
}
