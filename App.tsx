import React, { useState } from 'react';
import { ResearchReport, StockDataPoint } from './types';
import { generateStockData, generateNewsHeadlines } from './utils/mockData';
import { calculateTechnicalAnalysis, TechnicalAnalysis } from './utils/analysis';
import { getResearchReport } from './services/geminiService';
import { STOCKS } from './constants';
import PerformanceChart from './components/PerformanceChart';
import ReportDisplay from './components/ReportDisplay';

const App: React.FC = () => {
    const [ticker, setTicker] = useState<string>('RELIANCE');
    const [report, setReport] = useState<ResearchReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [historicalData, setHistoricalData] = useState<StockDataPoint[]>([]);
    const [timeRange, setTimeRange] = useState<number>(30);

    const timeRangeOptions = [
        { label: '30 Days', value: 30 },
        { label: '90 Days', value: 90 },
        { label: '1 Year', value: 365 },
        { label: '5 Years', value: 1825 },
    ];

    const getTimeRangeLabel = (days: number) => {
        const option = timeRangeOptions.find(o => o.value === days);
        return option ? option.label.replace('s', '') : `${days} Day`;
    };

    const handleGenerateReport = async (stockTicker: string) => {
        if (!stockTicker) {
            setError("Please enter a stock ticker.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);
        setHistoricalData([]);

        try {
            // 1. Simulate recent market data for the selected time range
            const stockInfo = STOCKS.find(s => s.ticker === stockTicker) || { initialPrice: 100 + Math.random() * 4000 };
            const priceData = generateStockData(timeRange, stockInfo.initialPrice, 'stable');
            setHistoricalData(priceData);

            // 2. Simulate recent news headlines
            const news = generateNewsHeadlines(stockTicker);

            // 3. Perform technical analysis
            const technicals = calculateTechnicalAnalysis(priceData);

            // 4. Call AI to generate the report
            const generatedReport = await getResearchReport(stockTicker, priceData, news, technicals, timeRange);
            setReport(generatedReport);

        } catch (err) {
            console.error("Failed to generate report:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred while generating the report.");
            setReport(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTickerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerateReport(ticker.toUpperCase());
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="mb-6 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
                    AI Stock Market Research Agent
                </h1>
                <p className="text-gray-400 mt-1">Enter a stock ticker to receive a comprehensive AI-generated research report.</p>
            </header>

            <main className="flex-grow flex flex-col items-center w-full">
                <div className="w-full max-w-2xl bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl mb-6">
                    <form onSubmit={handleTickerSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                placeholder="e.g., RELIANCE, TCS, HDFCBANK"
                                className="flex-grow bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                aria-label="Stock Ticker Input"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <ion-icon name="search-outline" class="text-xl mr-2"></ion-icon>
                                        <span>Generate Report</span>
                                    </>
                                )}
                            </button>
                        </div>
                         <div className="flex items-center justify-center gap-2 pt-2">
                            <span className="text-sm font-medium text-gray-400">Time Range:</span>
                            {timeRangeOptions.map(option => (
                                <button
                                    type="button"
                                    key={option.value}
                                    onClick={() => setTimeRange(option.value)}
                                    className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                                        timeRange === option.value
                                            ? 'bg-cyan-500 text-white shadow-md'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                    aria-pressed={timeRange === option.value}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </form>
                     <div className="text-center mt-4 text-sm text-gray-500">
                        Try an example:
                        {STOCKS.map(stock => (
                           <button key={stock.ticker} onClick={() => {setTicker(stock.ticker); handleGenerateReport(stock.ticker);}} className="ml-2 text-cyan-400 hover:underline">{stock.name}</button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="w-full max-w-4xl bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {report && historicalData.length > 0 && (
                     <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                        <div className="lg:col-span-3">
                            <ReportDisplay report={report} />
                        </div>
                        <div className="lg:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl flex flex-col">
                            <h2 className="text-xl font-semibold mb-4 text-gray-100">{report.ticker} - {getTimeRangeLabel(timeRange)} Price History</h2>
                            <div className="flex-grow w-full h-96">
                                <PerformanceChart data={historicalData} ticker={report.ticker} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
             <footer className="text-center text-xs text-gray-600 mt-8">
                <p>Disclaimer: This is a research demo and not financial advice. All data is simulated for demonstration purposes.</p>
            </footer>
        </div>
    );
};

export default App;
