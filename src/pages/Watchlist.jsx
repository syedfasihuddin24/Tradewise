import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, X, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { stocks, watchlistStocks } from '../data/mockData';
import { fmt } from '../utils/format';
import Sparkline from '../components/Charts/Sparkline';

export default function Watchlist() {
  const navigate = useNavigate();
  const [list, setList] = useState(watchlistStocks);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState('');

  const watched = stocks.filter(s => list.includes(s.ticker));
  const available = stocks.filter(s =>
    !list.includes(s.ticker) &&
    (s.ticker.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase()))
  );

  const remove = (ticker) => setList(l => l.filter(t => t !== ticker));
  const add    = (ticker) => { setList(l => [...l, ticker]); setShowAdd(false); setQuery(''); };

  return (
    <div className="space-y-5 pb-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Watchlist</h2>
          <p className="text-sm text-white/40 mt-0.5">{list.length} stocks being tracked</p>
        </div>
        <button id="add-to-watchlist" onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={15} /> Add Stock
        </button>
      </motion.div>

      {/* Watchlist grid */}
      {watched.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-16 text-center">
          <Star size={40} className="mx-auto mb-3 text-white/20" />
          <p className="text-white/40">Your watchlist is empty.</p>
          <button onClick={() => setShowAdd(true)} className="btn-secondary mt-4 mx-auto">Add your first stock</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {watched.map((stock, i) => (
              <motion.div key={stock.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-5 relative group cursor-pointer"
                onClick={() => navigate(`/stock/${stock.id}`)}>

                {/* Remove */}
                <button id={`remove-${stock.ticker}`}
                  onClick={e => { e.stopPropagation(); remove(stock.ticker); }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-red-500/20">
                  <X size={11} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center text-sm font-bold text-white border border-white/10">
                    {stock.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{stock.ticker}</p>
                    <p className="text-xs text-white/40 truncate max-w-[120px]">{stock.name}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <Sparkline data={stock.sparkline} positive={stock.change >= 0} width="100%" height={48} />
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold font-mono text-white">{fmt.currency(stock.price)}</p>
                  <span className={stock.change >= 0 ? 'badge-positive' : 'badge-negative'}>
                    {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {fmt.pct(stock.change)}
                  </span>
                </div>
                <p className={`text-xs mt-1 font-medium ${stock.change >= 0 ? 'text-brand-500' : 'text-red-400'}`}>
                  {fmt.signed(stock.changeAmt)} today
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Stock Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
            <motion.div className="relative glass-card p-6 w-full max-w-md z-10"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">Add to Watchlist</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40">
                  <X size={16} />
                </button>
              </div>
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input id="watchlist-search" type="text" placeholder="Search ticker or company…" value={query}
                  onChange={e => setQuery(e.target.value)} className="input-field pl-9" autoFocus />
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {available.length === 0 && (
                  <p className="text-center py-8 text-white/30 text-sm">No stocks found.</p>
                )}
                {available.map(stock => (
                  <button key={stock.id} id={`add-${stock.ticker}`} onClick={() => add(stock.ticker)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                    <div className="w-9 h-9 rounded-lg bg-navy-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {stock.ticker.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{stock.ticker}</p>
                      <p className="text-xs text-white/40 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold text-white">{fmt.currency(stock.price)}</p>
                      <span className={stock.change >= 0 ? 'badge-positive' : 'badge-negative'}>
                        {fmt.pct(stock.change)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
