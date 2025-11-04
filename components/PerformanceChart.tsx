import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockDataPoint } from '../types';

interface PerformanceChartProps {
    data: StockDataPoint[];
    ticker: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const date = new Date(label);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return (
            <div className="bg-gray-700 p-3 border border-gray-600 rounded-lg shadow-lg">
                <p className="font-bold text-gray-200">{formattedDate}</p>
                <p style={{ color: payload[0].stroke }}>
                    {`Price: ₹${payload[0].value.toFixed(2)}`}
                </p>
            </div>
        );
    }
    return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, ticker }) => {
    
    const chartData = data.map((dataPoint) => ({
        name: dataPoint.date,
        price: dataPoint.price,
    }));

    const dateRangeDays = data.length;

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem);
        if (dateRangeDays > 365) {
            return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };


    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickFormatter={formatXAxis} minTickGap={60} />
                <YAxis stroke="#38bdf8" label={{ value: 'Stock Price (₹)', angle: -90, position: 'insideLeft', fill: '#38bdf8' }} tick={{ fill: '#9ca3af' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#d1d5db' }}/>
                <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#38bdf8" 
                    strokeWidth={2} 
                    dot={false}
                    name={`${ticker} Price`}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PerformanceChart;
