// Fix: Implemented the geminiService to generate research reports.
import { GoogleGenAI, Type } from "@google/genai";
import { StockDataPoint, NewsHeadline, ResearchReport } from '../types';
import { TechnicalAnalysis } from '../utils/analysis';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getTimeRangeLabelForPrompt = (days: number) => {
    if (days >= 365) {
        const years = Math.round(days / 365);
        return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${days} days`;
};

export const getResearchReport = async (
    ticker: string,
    priceData: StockDataPoint[],
    news: NewsHeadline[],
    technicals: TechnicalAnalysis,
    timeRange: number
): Promise<ResearchReport> => {
    
    // Sample key price points for longer time ranges to keep the prompt concise
    const keyPrices = priceData.length > 100
        ? priceData.filter((_, i) => i % Math.floor(priceData.length / 100) === 0).map(p => p.price.toFixed(2))
        : priceData.map(p => p.price.toFixed(2));

    const prompt = `
        **Objective:** Generate a comprehensive stock research report for ${ticker}.

        **Context:** You are an expert financial analyst AI. Analyze the provided data to generate a detailed, balanced, and insightful report. The target audience is a retail investor who is familiar with basic financial concepts.

        **Input Data:**

        1.  **Ticker:** ${ticker}
        2.  **Recent Price Data (last ${getTimeRangeLabelForPrompt(timeRange)}):**
            *   Start Price: ${priceData[0].price.toFixed(2)}
            *   End Price: ${priceData[priceData.length - 1].price.toFixed(2)}
            *   Key Price Points: ${keyPrices.join(', ')}
        3.  **Technical Analysis:**
            *   10-Day SMA Trend: ${technicals.sma10Trend} (Current SMA: ${technicals.sma10?.toFixed(2) || 'N/A'})
            *   30-Day SMA Trend: ${technicals.sma30Trend} (Current SMA: ${technicals.sma30?.toFixed(2) || 'N/A'})
            *   RSI Trend: ${technicals.rsiTrend}
            *   Volatility: ${technicals.volatility}
        4.  **Recent News Headlines & Sentiments:**
            ${news.map(n => `*   [${n.sentiment}] ${n.headline}`).join('\n')}

        **Instructions:**
        Based on all the provided data, generate a JSON object that strictly adheres to the following schema.
        Provide a concise analysis for each field.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ticker: { type: Type.STRING },
                        companyProfile: { type: Type.STRING },
                        marketAnalysis: { type: Type.STRING },
                        technicalOutlook: { type: Type.STRING },
                        newsSentiment: { type: Type.STRING },
                        recommendation: { type: Type.STRING, enum: ['Buy', 'Hold', 'Sell'] },
                        confidenceScore: { type: Type.NUMBER },
                        riskAssessment: { type: Type.STRING },
                        keyTakeaways: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["ticker", "companyProfile", "marketAnalysis", "technicalOutlook", "newsSentiment", "recommendation", "confidenceScore", "riskAssessment", "keyTakeaways"]
                }
            }
        });

        const jsonText = response.text.trim();
        const reportData = JSON.parse(jsonText);
        
        if (!reportData.ticker || !reportData.recommendation) {
            throw new Error("AI response is missing required fields.");
        }

        return reportData as ResearchReport;

    } catch (error) {
        console.error("Error generating AI report:", error);
        throw new Error("Failed to get a valid research report from the AI. The model may have returned an invalid format or an error occurred.");
    }
};
