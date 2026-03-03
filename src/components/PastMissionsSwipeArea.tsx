import { PastUnfinishedMission } from "@/hooks/useMissions";

type Props = {
    pastMissions: PastUnfinishedMission[];
    onComplete: (dateStr: string) => void;
    onHide: (id: number | string) => void;
};

export default function PastMissionsSwipeArea({ pastMissions, onComplete, onHide }: Props) {
    if (pastMissions.length === 0) return null;

    const handlePastComplete = (item: PastUnfinishedMission, withLine: boolean) => {
        onComplete(item.dateStr);

        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([30, 30]);
        }

        if (withLine) {
            const text = `【Papa-Quest: 後出し報告】\n${item.mission.recoveryTemplate}`;
            const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="w-full overflow-hidden mb-2">
            <div className="px-6 mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold pr-4 text-gray-500">過去のやり残し ({pastMissions.length}件)</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">スワイプ &rarr;</span>
            </div>

            <div className="flex overflow-x-auto gap-4 px-6 pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {pastMissions.map((item) => (
                    <div
                        key={item.dateStr}
                        className="snap-center shrink-0 w-72 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-red-100 shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">未完了</span>
                                <div className="flex items-center gap-2 border border-gray-100 rounded-md px-1 pl-2">
                                    <span className="text-xs text-gray-400">{item.daysAgo}日前</span>
                                    <div className="h-3 w-px bg-gray-200"></div>
                                    <button
                                        onClick={() => onHide(item.mission.id)}
                                        className="text-[10px] text-red-400 p-1 active:bg-red-50 rounded"
                                    >
                                        非表示
                                    </button>
                                </div>
                            </div>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug mb-2" title={item.mission.title}>
                                {item.mission.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                                {item.mission.description}
                            </p>
                            {item.mission.safetyCaution && (
                                <div className="text-[10px] text-red-600 font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded inline-flex">
                                    <span>⚠️</span> 安全上の注意あり
                                </div>
                            )}
                        </div>
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => handlePastComplete(item, true)}
                                className="flex-1 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                            >
                                LINE報告
                            </button>
                            <button
                                onClick={() => handlePastComplete(item, false)}
                                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold rounded-xl transition-colors"
                            >
                                完了のみ
                            </button>
                        </div>
                    </div>
                ))}
                <div className="shrink-0 w-2" />
            </div>
        </div>
    );
}
