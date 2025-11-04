
export const STOCKS = [
    { ticker: 'RELIANCE', name: 'Reliance', initialPrice: 2850, profile: 'stable' as const },
    { ticker: 'TCS', name: 'TCS', initialPrice: 3800, profile: 'growth' as const },
    { ticker: 'HDFCBANK', name: 'HDFC Bank', initialPrice: 1500, profile: 'cyclical' as const },
];

// Fix: Add missing INITIAL_CASH constant
export const INITIAL_CASH = 100000;
