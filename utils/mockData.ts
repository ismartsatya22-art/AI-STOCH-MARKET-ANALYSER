import { StockDataPoint, StockProfile, NewsHeadline, Sentiment } from '../types';

export const generateStockData = (days: number, initialPrice: number, profile: StockProfile): StockDataPoint[] => {
    const data: StockDataPoint[] = [];
    let currentPrice = initialPrice;
    let trend = (Math.random() - 0.4) * (initialPrice / 100);

    const today = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (days - 1 - i));
        data.push({
            date: date.toISOString().split('T')[0],
            price: parseFloat(currentPrice.toFixed(2)),
        });
        const volatility = initialPrice / 50;
        const randomFactor = (Math.random() - 0.5) * volatility;
        currentPrice += randomFactor + trend;
        if (currentPrice < 10) currentPrice = 10;
    }
    return data;
};

export const generateNewsHeadlines = (ticker: string): NewsHeadline[] => {
    const headlines: { [key in Sentiment]: string[] } = {
        'Positive': [
            `${ticker} announces record quarterly profits, exceeding analyst expectations.`,
            `New product launch from ${ticker} receives overwhelmingly positive customer reviews.`,
            `${ticker} expands into international markets, stock seen as a major growth opportunity.`,
            `Upgrade in credit rating for ${ticker} boosts investor confidence.`,
            `${ticker} signs major partnership deal with industry leader.`
        ],
        'Neutral': [
            `${ticker} CEO to speak at upcoming industry conference.`,
            `Market awaits ${ticker}'s annual shareholder meeting next week.`,
            `Analysts maintain 'Hold' rating on ${ticker} amidst market stability.`,
            `${ticker} releases statement on corporate governance policies.`,
            `Sector-wide report shows moderate growth, with ${ticker} performing as expected.`
        ],
        'Negative': [
            `${ticker} faces regulatory scrutiny over recent business practices.`,
            `Supply chain disruptions expected to impact ${ticker}'s next quarter earnings.`,
            `Key executive at ${ticker} announces unexpected departure.`,
            `Competitor's new technology poses significant threat to ${ticker}'s market share.`,
            `${ticker} lowers its forward guidance citing macroeconomic headwinds.`
        ]
    };

    const generated: NewsHeadline[] = [];
    for (let i = 0; i < 5; i++) {
        const rand = Math.random();
        let sentiment: Sentiment;
        if (rand < 0.4) sentiment = 'Positive';
        else if (rand < 0.7) sentiment = 'Neutral';
        else sentiment = 'Negative';

        const headlinePool = headlines[sentiment];
        const headline = headlinePool[Math.floor(Math.random() * headlinePool.length)];
        
        if (!generated.some(h => h.headline === headline)) {
             generated.push({ headline, sentiment });
        }
    }
    return generated;
};
