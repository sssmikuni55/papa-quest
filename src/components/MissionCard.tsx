import { Mission } from "@/hooks/useMissions";
import React from "react";

import CompleteButton from "./CompleteButton";

type Props = {
    mission: Mission | null;
    isCompleted?: boolean;
    onHide?: () => void;
    onShuffle?: () => void;
    onComplete?: () => void;
};

export default function MissionCard({ mission, isCompleted = false, onHide, onShuffle, onComplete }: Props) {
    if (!mission) return null;

    if (isCompleted) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-5 py-3 mx-4 mt-4 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-gray-400 mb-0.5 block">今日のミッション (完了)</span>
                    <h2 className="text-sm font-bold text-gray-500 line-through decoration-gray-300">{mission.title}</h2>
                </div>
                <div className="w-8 h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center border border-green-200 ml-2">
                    <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-6 py-6 mx-4 mt-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-50 px-3 py-1 rounded-bl-xl">
                <span className="text-xs font-bold text-blue-500">{mission.category}</span>
            </div>
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1 text-center">
                今日のミッション
            </span>
            <h2 className="text-xl font-bold text-center leading-tight text-gray-800 mb-3 whitespace-pre-wrap">
                {mission.title}
            </h2>
            <div className="bg-gray-50 p-3 rounded-xl text-gray-600 text-xs leading-relaxed mb-3">
                {mission.description}
            </div>

            {mission.safetyCaution && (
                <div className="bg-yellow-50 border-l-[6px] border-yellow-400 px-5 py-4 rounded-r-2xl mb-5 flex flex-col shadow-sm border-t border-r border-b border-yellow-100">
                    <div className="flex items-start gap-2.5">
                        <span className="text-xl leading-none mt-0.5">⚠️</span>
                        <p className="text-xs text-red-600 leading-snug flex-1">
                            <span className="font-extrabold text-red-700 text-sm">【安全上の注意】</span><br className="mb-1" />
                            {highlightKeywords(mission.safetyCaution)}
                        </p>
                    </div>
                    <div className="mt-2 text-[9px] text-gray-500 italic text-right">
                        ※あくまで一般的な目安です。実際の環境に合わせて安全を確保してください。
                    </div>
                </div>
            )}

            <div className="pt-2">
                {mission.affiliateItem && (
                    <div className="mb-4">
                        <span className="text-[10px] font-bold text-gray-500 mb-1 block ml-2">💡おすすめの人気アイテム</span>
                        <a href={mission.affiliateItem.url} target="_blank" rel="noopener noreferrer" className="block bg-indigo-50 border border-indigo-100 p-3 rounded-2xl shadow-sm active:bg-indigo-100 transition-colors flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-indigo-50 overflow-hidden">
                                {mission.affiliateItem.imageUrl ? (
                                    <img src={mission.affiliateItem.imageUrl} alt={mission.affiliateItem.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl">🎁</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] font-bold text-indigo-900 leading-tight mb-0.5">{mission.affiliateItem.title}</p>
                                {mission.affiliateItem.sponsorName && (
                                    <p className="text-[9px] text-indigo-500">{mission.affiliateItem.sponsorName} にて確認</p>
                                )}
                            </div>
                            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                )}
                <div className="pt-2">
                    <span className="text-[10px] font-bold text-gray-500 mb-1 block ml-2">奥さんへの声かけヒント:</span>
                    <div className="bg-gray-100 text-indigo-900 border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm relative">
                        <p className="text-[13px] font-bold italic leading-relaxed">「{mission.wifeQuestion}」</p>
                    </div>
                </div>
            </div>

            {(!isCompleted && (onHide || onShuffle)) && (
                <div className="mt-5 pt-4 flex justify-between items-center gap-2">
                    {onHide && (
                        <button
                            onClick={onHide}
                            className="text-[10px] font-medium text-red-400 py-2 px-2 active:bg-red-50 rounded-lg transition-colors border border-transparent"
                        >
                            このミッションを非表示にする
                        </button>
                    )}
                    {onShuffle && (
                        <button
                            onClick={onShuffle}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-bold text-gray-600 shadow-sm border border-gray-200 active:bg-gray-50 transition-all shrink-0"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            別のミッションにする
                        </button>
                    )}
                </div>
            )}

            {onComplete && (
                <div className="mt-4 pt-4 border-t border-gray-100 -mx-6 px-6">
                    <CompleteButton
                        mission={mission}
                        isCompleted={isCompleted}
                        onComplete={onComplete}
                        isPast={false}
                        condensed={true}
                    />
                </div>
            )}
        </div>
    );
}

// Utils
function highlightKeywords(text: string) {
    const keywords = ['隔離', '誤飲', '手の届かない', '換気', '感電', '転倒', '火傷', '窒息', '喉突き', '転落', '致命的'];

    // Create a regex to match any of the keywords
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        keywords.includes(part)
            ? <strong key={i} className="font-extrabold text-red-700 underline decoration-red-300 decoration-2 underline-offset-2">{part}</strong>
            : part
    );
}
