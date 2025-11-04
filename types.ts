// Fix: Defining all necessary types for the application.
export interface StockDataPoint {
    date: string;
    price: number;
}

export type StockProfile = 'stable' | 'growth' | 'cyclical';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface NewsHeadline {
    headline: string;
    sentiment: Sentiment;
}

export interface ResearchReport {
    ticker: string;
    companyProfile: string;
    marketAnalysis: string;
    technicalOutlook: string;
    newsSentiment: string;
    recommendation: 'Buy' | 'Hold' | 'Sell';
    confidenceScore: number;
    riskAssessment: string;
    keyTakeaways: string[];
}

export interface Stock {
    ticker: string;
    name: string;
    initialPrice: number;
    profile: StockProfile;
}

export interface Portfolio {
    cash: number;
    shares: number;
    currentValue: number;
}

export enum SimulationState {
    IDLE = 'IDLE',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    FINISHED = 'FINISHED',
}

export enum TradingDecision {
    BUY = 'BUY',
    SELL = 'SELL',
    HOLD = 'HOLD',
}

export interface Transaction {
    type: TradingDecision;
    date: string;
    price: number;
    shares: number;
    reasoning: string;
}
