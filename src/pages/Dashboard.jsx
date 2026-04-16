import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Wallet, BarChart2, Activity, ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { stocks, portfolioPerformance } from '../data/mockData';
import { fmt } from '../utils/format';
import Sparkline from '../components/Charts/Sparkline';
import PortfolioChart from '../components/Charts/PortfolioChart';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { totals }      = usePortfolio();
  const gainers = [...stocks].sort((a, b) => b.change - a.change).slice(0, 4);
  const losers  = [...stocks].sort((a, b) => a.change - b.change).slice(0, 3);

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Trader';

  return (
    <div className="space-y-6 pb-4">
      {/* ── Welcome Header ── */}
      <motion.div {...fade(0)} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">Good evening, {displayName} 👋</h2>
          <p className="text-sm text-white/40 mt-0.5">Here's what's happening in the market today.</p>
        </div>
        <button onClick={() => navigate('/stocks')} className="btn-primary hidden sm:flex">
          <Zap size={15} /> Quick Trade
        </button>
      </motion.div>

      {/* ── Portfolio Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Portfolio Value', value: fmt.currency(totals.totalValue),
            sub: `${fmt.signed(totals.dayPnl)} today`,
            positive: totals.dayPnl > 0, icon: Wallet, color: 'brand',
          },
          {
            label: 'Day P&L', value: fmt.signed(totals.dayPnl),
            sub: `${fmt.pct(totals.dayPnlPct)} change`,
            positive: totals.dayPnl > 0, icon: Activity, color: 'brand',
          },
          {
            label: 'Total Return', value: fmt.signed(totals.totalReturn),
            sub: `${fmt.pct(totals.totalReturnPct)} all time`,
            positive: totals.totalReturn >= 0, icon: TrendingUp, color: 'brand',
          },
          {
            label: 'Cash Balance', value: fmt.currency(totals.cashBalance),
            sub: 'Available to invest', positive: null, icon: BarChart2, color: 'blue',
          },
        ].map((card, i) => (
          <motion.div key={card.label} {...fade(0.05 * i)} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${card.color === 'brand' ? 'bg-brand-500/10 text-brand-400' : 'bg-blue-500/10 text-blue-400'}`}>
                <card.icon size={15} />
              </div>
            </div>
            <p className={`text-xl font-bold ${
              card.positive === true ? 'text-brand-400' :
              card.positive === false ? 'text-red-400' : 'text-white'
            }`}>{card.value}</p>
            {card.positive !== null ? (
              <p className={`text-xs mt-1 flex items-center gap-1 ${card.positive ? 'text-brand-500' : 'text-red-400'}`}>
                {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.sub}
              </p>
            ) : (
              <p className="text-xs mt-1 text-white/30">{card.sub}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Portfolio Chart + Movers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <motion.div {...fade(0.15)} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Portfolio Performance</h3>
              <p className="text-xs text-white/40">YTD growth</p>
            </div>
            <span className="badge-positive">+36.87% YTD</span>
          </div>
          <div className="h-52">
            <PortfolioChart data={portfolioPerformance} />
          </div>
        </motion.div>

        {/* Top Movers */}
        <motion.div {...fade(0.2)} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Today's Movers</h3>
          <div className="space-y-3">
            {[...gainers.slice(0, 2), ...losers.slice(0, 2)].map(stock => (
              <button key={stock.id} onClick={() => navigate(`/stock/${stock.id}`)}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-navy-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {stock.ticker.slice(0, 2)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{stock.ticker}</p>
                  <p className="text-xs text-white/40 truncate">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-semibold text-white">${stock.price.toFixed(2)}</p>
                  <span className={stock.change >= 0 ? 'badge-positive' : 'badge-negative'}>
                    {stock.change >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {fmt.pct(stock.change)}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/stocks')} className="w-full mt-4 text-xs text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 transition-colors">
            View all markets <ChevronRight size={12} />
          </button>
        </motion.div>
      </div>

      {/* ── Trending Stocks Table ── */}
      <motion.div {...fade(0.25)} className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Trending Stocks</h3>
          <button onClick={() => navigate('/stocks')} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            See all <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-right px-4 py-3 font-medium">Price</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Change</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Volume</th>
                <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Market Cap</th>
                <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">7D Chart</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {stocks.slice(0, 6).map(stock => (
                <tr key={stock.id} className="table-row" onClick={() => navigate(`/stock/${stock.id}`)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center text-xs font-bold text-white border border-white/5 shrink-0">
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{stock.ticker}</p>
                        <p className="text-xs text-white/40 hidden sm:block truncate max-w-[140px]">{stock.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-semibold text-white">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                    <span className={stock.change >= 0 ? 'badge-positive' : 'badge-negative'}>
                      {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {fmt.pct(stock.change)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-white/50 hidden md:table-cell">{stock.volume}</td>
                  <td className="px-4 py-3.5 text-right text-white/50 hidden lg:table-cell">{stock.marketCap}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <div className="flex justify-center">
                      <Sparkline data={stock.sparkline} positive={stock.change >= 0} width={80} height={30} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
