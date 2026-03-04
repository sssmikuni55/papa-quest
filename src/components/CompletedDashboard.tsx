import React, { useState } from 'react';
import { Mission } from "@/hooks/useMissions";
import { sendGAEvent } from '@next/third-parties/google';

type Props = {
    totalExp: number;
    levelInfo: { level: number; title: string };
    recentMissions: { dateStr: string; mission: Mission }[];
    onCompleteInfiniteQuest: (label: string) => void;
    completedInfiniteQuestsToday: string[];
    activeMonth: number;
};

export default function CompletedDashboard({
    totalExp,
    levelInfo,
    recentMissions,
    onCompleteInfiniteQuest,
    completedInfiniteQuestsToday,
    activeMonth
}: Props) {
    const [showExpFloating, setShowExpFloating] = useState(false);
    const messages = [
        "今日も一日お疲れ様でした！",
        "奥様への心遣い、素晴らしいです！",
        "毎日の積み重ねが、家族の絆を深めます。",
        "ゆっくり休んで、明日も頑張りましょう！",
        "あなたがいてくれて、家族も安心です。"
    ];

    // Choose a stable random message based on today's date so it doesn't flicker on re-renders completely randomly
    const today = new Date().toISOString().split('T')[0];
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const message = messages[hash % messages.length];

    const getQuestsForMonth = (month: number) => {
        const baseQuests = [
            { icon: '💆‍♀️', label: '妻の肩を揉む', sub: '労いの言葉も添えて' },
            { icon: '🍽️', label: '家事のリカバリー', sub: '名もなき家事を減らす' },
            { icon: '💌', label: '「ありがとう」と言う', sub: '感謝は何度伝えてもOK' }
        ];

        let ageSpecificQuest = { icon: '🍼', label: 'ミルク・おむつ替え', sub: 'すばやく清潔に！' };

        if (month >= 5 && month <= 8) {
            ageSpecificQuest = { icon: '🥣', label: '離乳食の準備・片付け', sub: '服の汚れ落としも' };
        } else if (month >= 9 && month <= 11) {
            ageSpecificQuest = { icon: '🏃‍♂️', label: 'ハイハイ追いかけっこ', sub: '安全確保しながら' };
        } else if (month >= 12) {
            ageSpecificQuest = { icon: '👟', label: '公園でとことん遊ぶ', sub: 'ママの1人時間作り' };
        }

        return [ageSpecificQuest, ...baseQuests];
    };

    const currentQuests = getQuestsForMonth(activeMonth);

    const handleInfiniteQuestClick = (label: string) => {
        onCompleteInfiniteQuest(label);
        sendGAEvent({ event: 'infinite_quest_complete', value: label });
        setShowExpFloating(true);
        setTimeout(() => setShowExpFloating(false), 1000);
        if (typeof window !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20);
        }
    };

    return (
        <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pt-6 pb-20 px-6 mt-4 flex-1 animate-fade-in-up">
            <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">🎉</span>
                <h2 className="text-xl font-bold text-gray-800 mb-1">本日のミッション完了</h2>
                <p className="text-sm font-semibold text-gray-500 mb-4">{message}</p>

                <div className="inline-block bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 w-full sm:w-auto">
                    <div className="text-xs text-gray-500 font-bold flex flex-col items-center gap-1.5 justify-center leading-relaxed">
                        <span>🗓️ ミッションは1日1つまでです。</span>
                        <span className="text-gray-400 font-medium">次のミッションは<span className="font-bold text-gray-500">明日0時</span>に追加されます。</span>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-4 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-blue-400 block mb-1">現在のパパランク</span>
                    <span className="text-lg font-bold text-blue-900">{levelInfo.title}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-blue-400 block mb-1">累計EXP</span>
                    <span className="text-2xl font-black text-blue-600 font-mono">{totalExp}</span>
                </div>
            </div>

            <div className="mb-8">
                <button
                    onClick={() => {
                        sendGAEvent({ event: 'papa_share_x' });
                        const text = `今日パパとしてのレベルが「${levelInfo.title}」になりました！💪\n産後クライシスを防ぐため、1日1ミッションの育児RPG「Papa-Quest」プレイ中！\n#PapaQuest #パパ育児\n`;
                        const url = `https://papa-quest.vercel.app/`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="w-full bg-black text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-md active:scale-[0.98] transition-transform"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></svg>
                    X (Twitter) で成果をシェア
                </button>
            </div>

            {recentMissions.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-4 pb-2 border-b border-gray-100">これまでの軌跡</h3>
                    <div className="space-y-4">
                        {recentMissions.map((item, index) => {
                            // Extract just the month and day (MM/DD)
                            const [yyyy, mm, dd] = item.dateStr.split('-');
                            const formattedDate = mm && dd ? `${Number(mm)}/${Number(dd)}` : item.dateStr;

                            return (
                                <div key={item.dateStr + index} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center mt-1">
                                        <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm border-2 border-white ring-2 ring-green-100" />
                                        {index !== recentMissions.length - 1 && (
                                            <div className="w-0.5 h-10 bg-gray-100 mt-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-1">
                                        <p className="text-[10px] font-bold text-gray-400 mb-0.5">{formattedDate} 完了</p>
                                        <p className="text-sm font-semibold text-gray-700 leading-tight">
                                            {item.mission.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div >
                </div >
            )}

            {/* Infinite Quests Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span>🔥</span> もっと頑張るパパへ
                    </h3>
                    {completedInfiniteQuestsToday.length > 0 && (
                        <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                            本日 {completedInfiniteQuestsToday.length} 回達成
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    今日のミッションは完了しましたが、日常のちょっとしたサポートでも経験値（+2 EXP）を獲得できます。気が向いたらタップしてください！
                </p>

                <div className="relative">
                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        {currentQuests.map((quest, i) => {
                            const isCompleted = completedInfiniteQuestsToday.includes(quest.label);
                            return (
                                <button
                                    key={i}
                                    onClick={() => !isCompleted && handleInfiniteQuestClick(quest.label)}
                                    disabled={isCompleted}
                                    className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 shadow-sm transition-colors relative overflow-hidden group ${isCompleted
                                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-70'
                                        : 'bg-white border-gray-200 active:bg-orange-50 active:border-orange-200'
                                        }`}
                                >
                                    <span className={`text-2xl transition-transform ${!isCompleted ? 'group-active:scale-110' : ''} mb-1`}>{quest.icon}</span>
                                    <span className={`text-xs font-bold text-center leading-tight ${isCompleted ? 'text-gray-400' : 'text-gray-700'}`}>{quest.label}</span>
                                    {isCompleted ? (
                                        <span className="text-[9px] font-bold text-gray-400 mt-0.5">今日完了済</span>
                                    ) : (
                                        <span className="text-[9px] font-bold text-orange-500 mt-0.5 bg-orange-50 px-1.5 rounded">{quest.sub} <span className="text-orange-400 ml-0.5">+2</span></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {showExpFloating && (
                        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                            <div className="animate-fade-out-up bg-orange-500 text-white font-black text-xl px-4 py-2 rounded-full shadow-lg transform -translate-y-4">
                                +2 EXP!
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div >
    );
}
