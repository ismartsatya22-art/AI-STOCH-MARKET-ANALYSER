import React from 'react';
import { Portfolio, SimulationState, Stock } from '../types';
import { INITIAL_CASH } from '../constants';

interface ControlPanelProps {
    simulationState: SimulationState;
    portfolio: Portfolio;
    stopLossPercent: number;
    isLoading: boolean;
    setStopLossPercent: (value: number) => void;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    stocks: Stock[];
    selectedStockTicker: string;
    onStockChange: (ticker: string) => void;
}

const StatCard: React.FC<{ icon: string; title: string; value: string; color: string; }> = ({ icon, title, value, color }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
        <div className={`text-2xl mr-4 ${color}`}>
            <ion-icon name={icon}></ion-icon>
        </div>
        <div>
            <div className="text-sm text-gray-400">{title}</div>
            <div className="text-lg font-bold text-gray-100">{value}</div>
        </div>
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
    simulationState,
    portfolio,
    stopLossPercent,
    isLoading,
    setStopLossPercent,
    onStart,
    onPause,
    onReset,
    stocks,
    selectedStockTicker,
    onStockChange,
}) => {
    const profitLoss = portfolio.currentValue - INITIAL_CASH;
    const profitLossPercent = (profitLoss / INITIAL_CASH) * 100;
    const isProfit = profitLoss >= 0;

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-100">Agent Dashboard</h2>

            <div className="space-y-2">
                <label htmlFor="stockSelector" className="block text-sm font-medium text-gray-300">
                    Select Stock
                </label>
                <select
                    id="stockSelector"
                    value={selectedStockTicker}
                    onChange={(e) => onStockChange(e.target.value)}
                    disabled={simulationState === SimulationState.RUNNING || simulationState === SimulationState.PAUSED}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
                >
                    {stocks.map(stock => (
                        <option key={stock.ticker} value={stock.ticker}>
                            {stock.name} ({stock.ticker})
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <StatCard icon="wallet-outline" title="Portfolio Value" value={`₹${portfolio.currentValue.toFixed(2)}`} color="text-cyan-400" />
                <StatCard 
                    icon={isProfit ? "trending-up-outline" : "trending-down-outline"} 
                    title="P/L" 
                    value={`${isProfit ? '+' : ''}₹${profitLoss.toFixed(2)} (${profitLossPercent.toFixed(2)}%)`} 
                    color={isProfit ? "text-green-400" : "text-red-400"} 
                />
                <StatCard icon="cash-outline" title="Cash" value={`₹${portfolio.cash.toFixed(2)}`} color="text-gray-400" />
                <StatCard icon="server-outline" title="Shares Held" value={portfolio.shares.toString()} color="text-gray-400" />
            </div>

            <div className="space-y-2">
                <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-300">
                    Stop-Loss ({stopLossPercent}%)
                </label>
                <input
                    type="range"
                    id="stopLoss"
                    min="1"
                    max="50"
                    value={stopLossPercent}
                    onChange={(e) => setStopLossPercent(Number(e.target.value))}
                    disabled={simulationState === SimulationState.RUNNING}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                    onClick={simulationState === SimulationState.RUNNING ? onPause : onStart}
                    disabled={simulationState === SimulationState.FINISHED || isLoading}
                    className="flex items-center justify-center p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <ion-icon name={simulationState === SimulationState.RUNNING ? "pause-outline" : "play-outline"} class="text-xl mr-2"></ion-icon>
                            {simulationState === SimulationState.RUNNING ? 'Pause' : simulationState === SimulationState.PAUSED ? 'Resume' : 'Start'}
                        </>
                    )}
                </button>
                <button
                    onClick={onReset}
                    className="col-span-2 flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                    <ion-icon name="refresh-outline" class="text-xl mr-2"></ion-icon>
                    Reset
                </button>
            </div>
             {simulationState === SimulationState.FINISHED && <p className="text-center text-green-400 font-semibold">Simulation Finished!</p>}
        </div>
    );
};

export default ControlPanel;
