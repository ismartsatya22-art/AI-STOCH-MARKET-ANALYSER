import { StockDataPoint } from '../types';

export interface TechnicalAnalysis {
    sma10: number | null;
    sma30: number | null;
    sma10Trend: string;
    sma30Trend: string;
    rsiTrend: string;
    volatility: string;
}

const calculateSMA = (prices: number[], period: number): number | null => {
    if (prices.length < period) return null;
    const sum = prices.slice(-period).reduce((acc, val) => acc + val, 0);
    return sum / period;
};

const calculateTrend = (currentPrice: number, ma: number | null): string => {
    if (ma === null) return "N/A";
    const diff = ((currentPrice - ma) / ma) * 100;
    if (diff > 1) return "Upward";
    if (diff < -1) return "Downward";
    return "Flat";
};

// Simplified RSI calculation to determine trend
const calculateRSITrend = (prices: number[]): string => {
    if (prices.length < 14) return "Neutral";
    const gains: number[] = [];
    const losses: number[] = [];
    for (let i = 1; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff > 0) {
            gains.push(diff);
        } else {
            losses.push(Math.abs(diff));
        }
    }

    if (losses.length === 0 && gains.length > 0) return "Overbought";
    if (gains.length === 0 && losses.length > 0) return "Oversold";
    if (gains.length === 0 || losses.length === 0) return "Neutral";
    
    const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    if (rsi > 70) return "Overbought";
    if (rsi < 30) return "Oversold";
    return "Neutral";
};

const calculateVolatility = (prices: number[]): string => {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const stdDev = Math.sqrt(returns.map(x => Math.pow(x - (returns.reduce((a, b) => a + b) / returns.length), 2)).reduce((a, b) => a + b) / returns.length);
    const annualizedStdDev = stdDev * Math.sqrt(prices.length);

    if (annualizedStdDev < 0.1) return "Low";
    if (annualizedStdDev < 0.25) return "Medium";
    return "High";
};


export const calculateTechnicalAnalysis = (data: StockDataPoint[]): TechnicalAnalysis => {
    const prices = data.map(d => d.price);
    const currentPrice = prices[prices.length - 1];

    const sma10 = calculateSMA(prices, 10);
    const sma30 = calculateSMA(prices, 30);
    
    return {
        sma10,
        sma30,
        sma10Trend: calculateTrend(currentPrice, sma10),
        sma30Trend: calculateTrend(currentPrice, sma30),
        rsiTrend: calculateRSITrend(prices),
        volatility: calculateVolatility(prices),
    };
};
