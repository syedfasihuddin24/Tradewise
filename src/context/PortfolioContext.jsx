import { createContext, useContext, useState, useMemo } from 'react';
import { portfolioHoldings, transactions as mockTransactions, portfolioTotals, stocks } from '../data/mockData';

const PortfolioContext = createContext();

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [cashBalance, setCashBalance] = useState(portfolioTotals.cashBalance);
  const [holdings, setHoldings] = useState(portfolioHoldings);
  const [transactions, setTransactions] = useState(mockTransactions);

  const executeTrade = (type, stock, sharesNum) => {
    const totalCost = stock.price * sharesNum;

    if (type === 'buy') {
      if (totalCost > cashBalance) throw new Error("Insufficient funds to complete this purchase.");
      
      setCashBalance(prev => prev - totalCost);
      setHoldings(prev => {
        const exist = prev.find(h => h.ticker === stock.ticker);
        if (exist) {
          const newShares = exist.shares + sharesNum;
          const newAvgCost = ((exist.shares * exist.avgCost) + totalCost) / newShares;
          return prev.map(h => h.ticker === stock.ticker ? { ...h, shares: newShares, avgCost: newAvgCost } : h);
        } else {
          return [...prev, { ticker: stock.ticker, name: stock.name, shares: sharesNum, avgCost: stock.price }];
        }
      });
    } else if (type === 'sell') {
      const exist = holdings.find(h => h.ticker === stock.ticker);
      if (!exist || exist.shares < sharesNum) throw new Error("Not enough shares to complete this sale.");
      
      setCashBalance(prev => prev + totalCost);
      setHoldings(prev => {
        const newShares = exist.shares - sharesNum;
        if (newShares === 0) return prev.filter(h => h.ticker !== stock.ticker);
        return prev.map(h => h.ticker === stock.ticker ? { ...h, shares: newShares } : h);
      });
    }

    setTransactions(prev => [{
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ticker: stock.ticker,
      name: stock.name,
      type: type.toUpperCase(),
      shares: sharesNum,
      price: stock.price,
      total: totalCost
    }, ...prev]);
  };

  const currentPortfolioTotals = useMemo(() => {
    let holdingsTotal = 0;
    let initialCost = 0;
    
    // First pass to get total holdings value
    const baseHoldings = holdings.map(h => {
      const liveStock = stocks.find(s => s.ticker === h.ticker);
      const currentPrice = liveStock ? liveStock.price : 100;
      const value = h.shares * currentPrice;
      holdingsTotal += value;
      initialCost += (h.shares * h.avgCost);
      return { ...h, currentPrice, value };
    });

    // Second pass to assign allocation percentage
    const parsedHoldings = baseHoldings.map(h => ({
      ...h,
      allocation: holdingsTotal > 0 ? (h.value / holdingsTotal) * 100 : 0
    }));

    const totalValue = holdingsTotal + cashBalance;
    const totalReturn = totalValue - (initialCost + portfolioTotals.cashBalance); // Gross approximation of total lifetime profit based on current static injects
    const totalReturnPct = initialCost > 0 ? (totalReturn / initialCost) * 100 : 0;
    
    return { 
      totalValue, 
      cashBalance, 
      dayPnl: portfolioTotals.dayPnl, 
      dayPnlPct: portfolioTotals.dayPnlPct, 
      totalReturn, 
      totalReturnPct, 
      parsedHoldings 
    };
  }, [holdings, cashBalance]);

  return (
    <PortfolioContext.Provider value={{
      cashBalance,
      holdings: currentPortfolioTotals.parsedHoldings,
      transactions,
      totals: currentPortfolioTotals,
      executeTrade
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}
