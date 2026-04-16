// ─── Market Indices ────────────────────────────────────────────────────────────
export const marketIndices = [
  { id: 'nasdaq', name: 'NASDAQ', value: 18_247.32, change: +1.42, changeAmt: +255.81 },
  { id: 'sp500',  name: 'S&P 500', value: 5_243.77, change: +0.87, changeAmt: +45.22 },
  { id: 'dow',    name: 'DOW JONES', value: 39_127.14, change: -0.22, changeAmt: -86.50 },
  { id: 'btc',    name: 'BTC/USD',  value: 68_412.00, change: +3.14, changeAmt: +2082.00 },
];

// ─── Stocks ────────────────────────────────────────────────────────────────────
export const stocks = [
  {
    id: 'aapl', ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology',
    price: 189.84, change: 2.34, changeAmt: 4.33,
    volume: '62.4M', marketCap: '2.94T', pe: 28.4, high52: 198.23, low52: 142.10,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sparkline: [182, 185, 183, 187, 186, 188, 190, 187, 189, 191, 190, 189.84],
  },
  {
    id: 'msft', ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology',
    price: 415.32, change: 1.18, changeAmt: 4.84,
    volume: '21.7M', marketCap: '3.08T', pe: 36.2, high52: 430.82, low52: 309.45,
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    sparkline: [408, 411, 409, 413, 412, 414, 416, 414, 415, 417, 416, 415.32],
  },
  {
    id: 'nvda', ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology',
    price: 874.15, change: 4.72, changeAmt: 39.47,
    volume: '48.2M', marketCap: '2.16T', pe: 68.5, high52: 974.00, low52: 373.48,
    description: 'NVIDIA Corporation provides graphics and compute and networking solutions worldwide.',
    sparkline: [835, 840, 838, 848, 845, 855, 860, 858, 865, 870, 874, 874.15],
  },
  {
    id: 'amzn', ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical',
    price: 183.75, change: -0.85, changeAmt: -1.57,
    volume: '35.1M', marketCap: '1.90T', pe: 52.1, high52: 201.20, low52: 101.26,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products, advertising, and subscription services.',
    sparkline: [187, 186, 185, 184, 186, 185, 184, 183, 185, 184, 183, 183.75],
  },
  {
    id: 'googl', ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology',
    price: 163.42, change: 0.63, changeAmt: 1.02,
    volume: '27.5M', marketCap: '2.04T', pe: 25.7, high52: 177.00, low52: 119.77,
    description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, and internationally.',
    sparkline: [161, 162, 161, 163, 162, 164, 163, 164, 163, 164, 163, 163.42],
  },
  {
    id: 'tsla', ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical',
    price: 177.48, change: -2.18, changeAmt: -3.96,
    volume: '88.3M', marketCap: '565.2B', pe: 41.3, high52: 299.29, low52: 138.80,
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems.',
    sparkline: [185, 183, 181, 180, 182, 180, 179, 178, 180, 178, 177, 177.48],
  },
  {
    id: 'meta', ticker: 'META', name: 'Meta Platforms', sector: 'Technology',
    price: 507.62, change: 1.94, changeAmt: 9.68,
    volume: '15.4M', marketCap: '1.29T', pe: 28.9, high52: 531.49, low52: 315.83,
    description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family.',
    sparkline: [497, 500, 498, 503, 502, 505, 504, 506, 505, 507, 506, 507.62],
  },
  {
    id: 'jpm', ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial Services',
    price: 198.37, change: 0.42, changeAmt: 0.83,
    volume: '9.8M', marketCap: '572.4B', pe: 11.8, high52: 210.89, low52: 148.90,
    description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.',
    sparkline: [196, 197, 196, 198, 197, 198, 199, 198, 198, 199, 198, 198.37],
  },
];

// ─── Portfolio Holdings ─────────────────────────────────────────────────────────
export const portfolioHoldings = [
  { ticker: 'AAPL', name: 'Apple Inc.',      shares: 42,  avgCost: 152.30, currentPrice: 189.84, allocation: 28.5 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.',    shares: 12,  avgCost: 620.00, currentPrice: 874.15, allocation: 37.7 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', shares: 18,  avgCost: 380.00, currentPrice: 415.32, allocation: 26.8 },
  { ticker: 'META', name: 'Meta Platforms',  shares: 8,   avgCost: 470.00, currentPrice: 507.62, allocation: 7.0 },
];

// ─── Watchlist ──────────────────────────────────────────────────────────────────
export const watchlistStocks = ['TSLA', 'AMZN', 'GOOGL', 'JPM'];

// ─── Transactions ──────────────────────────────────────────────────────────────
export const transactions = [
  { id: 1, date: '2024-04-10', ticker: 'NVDA', name: 'NVIDIA Corp.',    type: 'BUY',  shares: 5,  price: 860.20, total: 4301.00 },
  { id: 2, date: '2024-04-08', ticker: 'AAPL', name: 'Apple Inc.',      type: 'BUY',  shares: 10, price: 187.42, total: 1874.20 },
  { id: 3, date: '2024-04-05', ticker: 'TSLA', name: 'Tesla Inc.',      type: 'SELL', shares: 15, price: 182.30, total: 2734.50 },
  { id: 4, date: '2024-04-03', ticker: 'META', name: 'Meta Platforms',  type: 'BUY',  shares: 4,  price: 492.10, total: 1968.40 },
  { id: 5, date: '2024-03-28', ticker: 'MSFT', name: 'Microsoft Corp.', type: 'BUY',  shares: 6,  price: 405.60, total: 2433.60 },
  { id: 6, date: '2024-03-22', ticker: 'AMZN', name: 'Amazon.com Inc.', type: 'SELL', shares: 20, price: 186.50, total: 3730.00 },
  { id: 7, date: '2024-03-18', ticker: 'GOOGL', name: 'Alphabet Inc.',  type: 'BUY',  shares: 25, price: 158.30, total: 3957.50 },
  { id: 8, date: '2024-03-14', ticker: 'JPM',  name: 'JPMorgan Chase',  type: 'SELL', shares: 12, price: 194.20, total: 2330.40 },
  { id: 9, date: '2024-03-10', ticker: 'AAPL', name: 'Apple Inc.',      type: 'BUY',  shares: 8,  price: 169.00, total: 1352.00 },
  { id: 10, date: '2024-03-05', ticker: 'NVDA', name: 'NVIDIA Corp.',   type: 'BUY',  shares: 3,  price: 788.40, total: 2365.20 },
];

// ─── Chart Data Generator ───────────────────────────────────────────────────────
const generateChartData = (basePrice, points, volatility = 0.015) => {
  const data = [];
  let price = basePrice * 0.88;
  const labels1D = Array.from({ length: points }, (_, i) => {
    const h = Math.floor((i / points) * 8) + 9;
    const m = Math.round(((i / points) * 8 * 60) % 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  });
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.5);
    data.push({ time: labels1D[i], price: parseFloat(price.toFixed(2)) });
  }
  data[data.length - 1].price = basePrice;
  return data;
};

const generateDailyData = (basePrice, days) => {
  const data = [];
  let price = basePrice * 0.8;
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const change = (Math.random() - 0.47) * 0.02 * price;
    price = Math.max(price + change, basePrice * 0.4);
    data.push({ time: label, price: parseFloat(price.toFixed(2)) });
  }
  data[data.length - 1].price = basePrice;
  return data;
};

export const getChartData = (stockId, range) => {
  const stock = stocks.find(s => s.id === stockId);
  const base = stock?.price || 100;
  switch (range) {
    case '1D': return generateChartData(base, 48, 0.008);
    case '1W': return generateDailyData(base, 7);
    case '1M': return generateDailyData(base, 30);
    case '3M': return generateDailyData(base, 90);
    case '1Y': return generateDailyData(base, 365);
    default:   return generateChartData(base, 48, 0.008);
  }
};

// ─── Portfolio Performance (monthly) ───────────────────────────────────────────
export const portfolioPerformance = Array.from({ length: 12 }, (_, i) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return { month: months[i], value: 32000 + Math.round(Math.random() * 20000 + i * 2400) };
});

// ─── Totals ─────────────────────────────────────────────────────────────────────
export const portfolioTotals = {
  totalValue: 68_421.88,
  dayPnl: +1_243.22,
  dayPnlPct: +1.85,
  totalReturn: +18_421.88,
  totalReturnPct: +36.87,
  cashBalance: 8_250.00,
};
