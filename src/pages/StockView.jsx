import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, TrendingUp, TrendingDown, Star, StarOff,
  BarChart2, Globe, DollarSign, X
} from 'lucide-react';
import { stocks, getChartData } from '../data/mockData';
import { usePortfolio } from '../context/PortfolioContext';
import { fmt } from '../utils/format';
import StockAreaChart from '../components/Charts/StockAreaChart';

const RANGES = ['1D', '1W', '1M', '3M', '1Y'];

function TradeModal({ stock, mode, onClose }) {
  const { executeTrade, cashBalance, holdings } = usePortfolio();
  const [shares, setShares] = useState('');
  const [error, setError] = useState('');
  const total = shares ? (parseFloat(shares) * stock.price) : 0.00;

  const currentHoldings = holdings.find(h => h.ticker === stock.ticker)?.shares || 0;

  const handleTrade = () => {
    setError('');
    if (!shares || isNaN(shares) || shares <= 0) {
      setError('Enter a valid share amount');
      return;
    }
    
    try {
      executeTrade(mode, stock, parseFloat(shares));
      onClose(); // Trade executed successfully
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative glass-card p-6 w-full max-w-sm z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">{mode === 'buy' ? 'Buy' : 'Sell'} {stock.ticker}</h3>
            <p className="text-xs text-white/40">{stock.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="mb-4 space-y-2">
          <div className="p-3 rounded-xl bg-white/5 flex justify-between">
            <span className="text-xs text-white/40">Current Price</span>
            <span className="font-mono font-bold text-white">{fmt.currency(stock.price)}</span>
          </div>
          {mode === 'buy' ? (
            <div className="flex justify-between px-1">
              <span className="text-xs text-white/40">Available Cash</span>
              <span className="text-xs font-mono font-medium text-brand-400">{fmt.currency(cashBalance)}</span>
            </div>
          ) : (
             <div className="flex justify-between px-1">
              <span className="text-xs text-white/40">Shares Owned</span>
              <span className="text-xs font-mono font-medium text-brand-400">{currentHoldings}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Number of Shares</label>
            <input id="trade-shares" type="number" min="1" value={shares}
              onChange={e => setShares(e.target.value)}
              placeholder="0"
              className="input-field font-mono" />
          </div>
          <div className="p-3 rounded-xl bg-white/5 flex justify-between">
            <span className="text-xs text-white/40">{mode === 'buy' ? 'Estimated Total' : 'Estimated Credit'}</span>
            <span className="font-mono font-bold text-white">{fmt.currency(total)}</span>
          </div>
          {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
          <button id={`trade-${mode}-confirm`}
            className={mode === 'buy' ? 'btn-primary w-full justify-center py-3' : 'btn-danger w-full justify-center py-3'}
            onClick={handleTrade}>
            Confirm {mode === 'buy' ? 'Purchase' : 'Sale'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StockView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stock = stocks.find(s => s.id === id);

  const [range, setRange]         = useState('1M');
  const [chartData, setChartData] = useState([]);
  const [tradeMode, setTradeMode] = useState(null);
  const [watched, setWatched]     = useState(false);

  useEffect(() => {
    if (stock) setChartData(getChartData(stock.id, range));
  }, [stock, range]);

  if (!stock) return (
    <div className="flex flex-col items-center justify-center h-64 text-white/40">
      <BarChart2 size={40} className="mb-3 opacity-40" />
      <p>Stock not found.</p>
      <button onClick={() => navigate('/stocks')} className="btn-secondary mt-4">Back to Markets</button>
    </div>
  );

  const positive = stock.change >= 0;

  return (
    <div className="space-y-5 pb-4">
      {/* Back + header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white mb-4 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center text-lg font-bold text-white border border-white/10">
              {stock.ticker.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">{stock.ticker}</h2>
                <span className="text-xs bg-navy-500 text-white/50 px-2 py-0.5 rounded-full">{stock.sector}</span>
              </div>
              <p className="text-sm text-white/40">{stock.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setWatched(w => !w)}
              className={`p-2 rounded-xl border transition-all ${watched ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'border-white/10 text-white/30 hover:text-white hover:border-white/30'}`}>
              {watched ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
            </button>
            <button id="sell-btn" onClick={() => setTradeMode('sell')} className="btn-danger">Sell</button>
            <button id="buy-btn" onClick={() => setTradeMode('buy')} className="btn-primary">Buy</button>
          </div>
        </div>
      </motion.div>

      {/* Price + chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-4xl font-bold font-mono text-white">{fmt.currency(stock.price)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={positive ? 'badge-positive' : 'badge-negative'}>
                {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {fmt.pct(stock.change)}
              </span>
              <span className={`text-sm font-medium ${positive ? 'text-brand-400' : 'text-red-400'}`}>
                {fmt.signed(stock.changeAmt)} today
              </span>
            </div>
          </div>

          {/* Range tabs */}
          <div className="flex gap-1 bg-navy-800/80 p-1 rounded-xl">
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  range === r ? 'bg-brand-500 text-navy-900' : 'text-white/40 hover:text-white'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <StockAreaChart data={chartData} positive={positive} />
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Volume',    value: stock.volume },
          { label: 'Mkt Cap',  value: stock.marketCap },
          { label: 'P/E Ratio', value: stock.pe },
          { label: '52W High', value: `$${stock.high52}` },
          { label: '52W Low',  value: `$${stock.low52}` },
          { label: 'Sector',   value: stock.sector, small: true },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-4">
            <p className="stat-label mb-1.5">{stat.label}</p>
            <p className={`font-semibold text-white ${stat.small ? 'text-xs' : 'text-base'}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={16} className="text-brand-400" />
          <h3 className="font-semibold text-white">About {stock.name}</h3>
        </div>
        <p className="text-sm text-white/50 leading-relaxed">{stock.description}</p>
      </motion.div>

      {/* Trade modal */}
      <AnimatePresence>
        {tradeMode && <TradeModal stock={stock} mode={tradeMode} onClose={() => setTradeMode(null)} />}
      </AnimatePresence>
    </div>
  );
}
