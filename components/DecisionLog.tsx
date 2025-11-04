import React, { useRef, useEffect } from 'react';
import { Transaction, TradingDecision } from '../types';

const getDecisionClasses = (type: TradingDecision) => {
    switch (type) {
        case TradingDecision.BUY:
            return {
                bg: 'bg-green-500/10',
                text: 'text-green-400',
                icon: 'trending-up-outline',
            };
        case TradingDecision.SELL:
            return {
                bg: 'bg-red-500/10',
                text: 'text-red-400',
                icon: 'trending-down-outline',
            };
        default:
            return {
                bg: 'bg-gray-500/10',
                text: 'text-gray-400',
                icon: 'remove-outline',
            };
    }
};

const DecisionLog: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [transactions]);

    const reversedTransactions = [...transactions].reverse();

    return (
        <div className="flex flex-col flex-grow min-h-0">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">Decision Log</h2>
            <div ref={logContainerRef} className="flex-grow bg-gray-900/50 rounded-lg p-3 overflow-y-auto space-y-3">
                {reversedTransactions.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Waiting for simulation to start...</p>
                    </div>
                )}
                {reversedTransactions.map((tx, index) => {
                    const classes = getDecisionClasses(tx.type);
                    return (
                        <div key={index} className={`p-3 rounded-lg ${classes.bg}`}>
                            <div className="flex justify-between items-center mb-1">
                                <div className={`font-bold text-sm flex items-center ${classes.text}`}>
                                    <ion-icon name={classes.icon} class="mr-2 text-lg"></ion-icon>
                                    <span>{tx.type}</span>
                                    {tx.shares > 0 && <span className="ml-2">({tx.shares} @ ₹{tx.price.toFixed(2)})</span>}
                                </div>
                                <span className="text-xs text-gray-500">{tx.date}</span>
                            </div>
                            <p className="text-xs text-gray-400 italic">"{tx.reasoning}"</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DecisionLog;
