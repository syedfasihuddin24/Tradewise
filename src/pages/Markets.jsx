import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, ChevronRight, Filter } from 'lucide-react';
import { stocks } from '../data/mockData';
import { fmt } from '../utils/format';
import Sparkline from '../components/Charts/Sparkline';

const SECTORS = ['All', 'Technology', 'Financial Services', 'Consumer Cyclical'];

export default function Markets() {
  const navigate = useNavigate();
  const [query, setQuery]   = useState('');
  const [sector, setSector] = useState('All');
  const [sort, setSort]     = useState({ field: 'marketCap', dir: 'desc' });

  const filtered = stocks
    .filter(s =>
      (sector === 'All' || s.sector === sector) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
       s.ticker.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => {
      const valA = sort.field === 'price' ? a.price : sort.field === 'change' ? a.change : parseFloat(a.marketCap);
      const valB = sort.field === 'price' ? b.price : sort.field === 'change' ? b.change : parseFloat(b.marketCap);
      return sort.dir === 'asc' ? valA - valB : valB - valA;
    });

  const toggleSort = (field) => setSort(s => ({ field, dir: s.field === field && s.dir === 'desc' ? 'asc' : 'desc' }));
  const SortIcon = ({ field }) => sort.field === field
    ? <span className="text-brand-400">{sort.dir === 'asc' ? '↑' : '↓'}</span>
    : <span className="text-white/20">↕</span>;

  return (
    <div className="space-y-5 pb-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Markets</h2>
          <p className="text-sm text-white/40 mt-0.5">Browse and explore all tracked stocks</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input id="markets-search" type="text" placeholder="Search ticker or company…" value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field pl-9 h-10 text-xs" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                sector === s
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                  : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/20'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/5">
                <th className="text-left px-5 py-4 font-medium">#</th>
                <th className="text-left px-4 py-4 font-medium">Stock</th>
                <th className="text-right px-4 py-4 font-medium cursor-pointer hover:text-white/60 select-none"
                  onClick={() => toggleSort('price')}>
                  Price <SortIcon field="price" />
                </th>
                <th className="text-right px-4 py-4 font-medium cursor-pointer hover:text-white/60 select-none hidden sm:table-cell"
                  onClick={() => toggleSort('change')}>
                  24h % <SortIcon field="change" />
                </th>
                <th className="text-right px-4 py-4 font-medium hidden md:table-cell">Volume</th>
                <th className="text-right px-4 py-4 font-medium cursor-pointer hover:text-white/60 select-none hidden lg:table-cell"
                  onClick={() => toggleSort('marketCap')}>
                  Mkt Cap <SortIcon field="marketCap" />
                </th>
                <th className="text-right px-4 py-4 font-medium hidden md:table-cell">P/E</th>
                <th className="text-center px-4 py-4 font-medium hidden sm:table-cell">7D</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock, i) => (
                <tr key={stock.id} className="table-row group" onClick={() => navigate(`/stock/${stock.id}`)}>
                  <td className="px-5 py-4 text-white/30 text-xs">{i + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shrink-0">
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{stock.ticker}</p>
                        <p className="text-xs text-white/40 hidden sm:block max-w-[160px] truncate">{stock.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-white">${stock.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right hidden sm:table-cell">
                    <span className={stock.change >= 0 ? 'badge-positive' : 'badge-negative'}>
                      {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {fmt.pct(stock.change)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-white/40 text-xs hidden md:table-cell">{stock.volume}</td>
                  <td className="px-4 py-4 text-right text-white/60 hidden lg:table-cell">{stock.marketCap}</td>
                  <td className="px-4 py-4 text-right text-white/40 text-xs hidden md:table-cell">{stock.pe}</td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <div className="flex justify-center">
                      <Sparkline data={stock.sparkline} positive={stock.change >= 0} width={80} height={30} />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 ml-auto transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Search size={32} className="mx-auto mb-3 opacity-50" />
              <p>No stocks match your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
