// Reusable helper utilities
export const fmt = {
  currency: (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v),
  compact:  (v) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(v),
  pct:      (v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`,
  signed:   (v) => `${v > 0 ? '+' : ''}${fmt.currency(v)}`,
  date:     (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
};
