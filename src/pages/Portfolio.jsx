import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';
import { portfolioPerformance } from '../data/mockData';
import { usePortfolio } from '../context/PortfolioContext';
import { fmt } from '../utils/format';
import DonutChart from '../components/Charts/DonutChart';
import PortfolioChart from '../components/Charts/PortfolioChart';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function Portfolio() {
  const navigate = useNavigate();
  const { holdings, totals } = usePortfolio();

  const formattedHoldings = holdings.map(h => {
    const pnl     = h.value - (h.shares * h.avgCost);
    const pnlPct  = h.avgCost > 0 ? ((h.currentPrice - h.avgCost) / h.avgCost) * 100 : 0;
    return { ...h, pnl, pnlPct };
  });

  const donutData = formattedHoldings.map(h => ({ name: h.ticker, value: h.allocation }));

  const summaryCards = [
    { label: 'Total Value',   value: fmt.currency(totals.totalValue),   sub: null, positive: null },
    { label: 'Day P&L',       value: fmt.signed(totals.dayPnl),          sub: fmt.pct(totals.dayPnlPct),   positive: totals.dayPnl > 0 },
    { label: 'Total Return',  value: fmt.signed(totals.totalReturn),     sub: fmt.pct(totals.totalReturnPct), positive: totals.totalReturn >= 0 },
    { label: 'Cash Balance',  value: fmt.currency(totals.cashBalance),   sub: 'Available', positive: null },
  ];

  return (
    <div className="space-y-5 pb-4">
      <motion.div {...fade(0)}>
        <h2 className="text-2xl font-bold text-white">Portfolio</h2>
        <p className="text-sm text-white/40 mt-0.5">Track your holdings and performance</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => (
          <motion.div key={c.label} {...fade(0.05 * i)} className="glass-card p-5">
            <p className="stat-label mb-2">{c.label}</p>
            <p className={`text-xl font-bold ${
              c.positive === true ? 'text-brand-400' :
              c.positive === false ? 'text-red-400' : 'text-white'
            }`}>{c.value}</p>
            {c.sub && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${c.positive ? 'text-brand-500' : 'text-white/40'}`}>
                {c.positive && <ArrowUpRight size={11} />}{c.sub}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fade(0.15)} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Portfolio Growth</h3>
            <span className="badge-positive">+36.87% YTD</span>
          </div>
          <div className="h-52">
            <PortfolioChart data={portfolioPerformance} />
          </div>
        </motion.div>

        <motion.div {...fade(0.2)} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Allocation</h3>
          <div className="h-52">
            <DonutChart data={donutData} />
          </div>
        </motion.div>
      </div>

      {/* Holdings table */}
      <motion.div {...fade(0.25)} className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <Briefcase size={16} className="text-brand-400" />
          <h3 className="text-sm font-semibold text-white">Holdings</h3>
          <span className="ml-auto text-xs text-white/30">{holdings.length} positions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-right px-4 py-3 font-medium">Shares</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Avg Cost</th>
                <th className="text-right px-4 py-3 font-medium">Current</th>
                <th className="text-right px-4 py-3 font-medium">Value</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">P&L</th>
                <th className="text-right px-4 py-3 font-medium hidden lg:table-cell">Alloc</th>
              </tr>
            </thead>
            <tbody>
              {formattedHoldings.map(h => (
                <tr key={h.ticker} className="table-row" onClick={() => navigate(`/stock/${h.ticker.toLowerCase()}`)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shrink-0">
                        {h.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{h.ticker}</p>
                        <p className="text-xs text-white/40 hidden sm:block truncate max-w-[140px]">{h.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-white">{h.shares.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-mono text-white/50 hidden sm:table-cell">
                    {fmt.currency(h.avgCost)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-semibold text-white">
                    {fmt.currency(h.currentPrice)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-white">
                    {fmt.currency(h.value)}
                  </td>
                  <td className="px-4 py-4 text-right hidden md:table-cell">
                    <div>
                      <p className={`font-mono text-sm font-semibold ${h.pnl >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
                        {fmt.signed(h.pnl)}
                      </p>
                      <span className={h.pnl >= 0 ? 'badge-positive' : 'badge-negative'}>
                        {h.pnl >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                        {fmt.pct(h.pnlPct)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right hidden lg:table-cell">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.max(0, h.allocation)}%` }} />
                      </div>
                      <span className="text-xs text-white/50 font-mono w-10 text-right">{h.allocation.toFixed(1)}%</span>
                    </div>
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
