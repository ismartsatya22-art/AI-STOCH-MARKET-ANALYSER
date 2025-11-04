// Fix: Created the ReportDisplay component to render the AI-generated research report.
import React from 'react';
import { ResearchReport } from '../types';

interface ReportDisplayProps {
    report: ResearchReport;
}

const SectionCard: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-100">
            <ion-icon name={icon} class="text-2xl mr-3 text-cyan-400"></ion-icon>
            {title}
        </h2>
        <div className="text-gray-300 space-y-2 prose prose-invert prose-sm max-w-none">
            {children}
        </div>
    </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {

    const getRecommendationClasses = (rec: string) => {
        switch (rec) {
            case 'Buy':
                return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Sell':
                return 'bg-red-500/20 text-red-300 border-red-500';
            default:
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
        }
    };
    
    const getConfidenceColor = (score: number) => {
        if (score > 75) return 'text-green-400';
        if (score > 50) return 'text-yellow-400';
        return 'text-red-400';
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className={`p-6 rounded-xl border-2 flex flex-col justify-center items-center ${getRecommendationClasses(report.recommendation)}`}>
                    <p className="text-lg font-semibold uppercase tracking-wider">Recommendation</p>
                    <p className="text-5xl font-bold my-2">{report.recommendation}</p>
                 </div>
                 <div className="bg-gray-800 p-6 rounded-xl flex flex-col justify-center items-center">
                    <p className="text-lg font-semibold uppercase tracking-wider text-gray-400">Confidence Score</p>
                    <p className={`text-5xl font-bold my-2 ${getConfidenceColor(report.confidenceScore)}`}>{report.confidenceScore}<span className="text-2xl">%</span></p>
                 </div>
            </div>

            <SectionCard title="Key Takeaways" icon="list-outline">
                <ul className="list-disc pl-5 space-y-1">
                    {report.keyTakeaways.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </SectionCard>
            
            <SectionCard title="Company Profile" icon="business-outline">
                <p>{report.companyProfile}</p>
            </SectionCard>

            <SectionCard title="Market Analysis" icon="analytics-outline">
                <p>{report.marketAnalysis}</p>
            </SectionCard>

            <SectionCard title="Technical Outlook" icon="pulse-outline">
                <p>{report.technicalOutlook}</p>
            </SectionCard>

            <SectionCard title="News Sentiment Analysis" icon="newspaper-outline">
                <p>{report.newsSentiment}</p>
            </SectionCard>

            <SectionCard title="Risk Assessment" icon="shield-half-outline">
                 <p>{report.riskAssessment}</p>
            </SectionCard>
        </div>
    );
};

export default ReportDisplay;
