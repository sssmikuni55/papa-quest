import { Mission } from "@/hooks/useMissions";
import { useEffect, useState } from "react";
import { sendGAEvent } from '@next/third-parties/google';

type Props = {
    mission: Mission | null;
    isCompleted: boolean;
    onComplete: () => void;
    isPast?: boolean;
    condensed?: boolean;
};

export default function CompleteButton({ mission, isCompleted, onComplete, isPast = false, condensed = false }: Props) {
    const [isSafetyChecked, setIsSafetyChecked] = useState(false);

    useEffect(() => {
        if (isCompleted) {
        }
    }, [isCompleted]);

    const handleComplete = (withLine: boolean) => {
        if (!mission || isCompleted) return;

        onComplete();
        sendGAEvent({ event: 'mission_complete', value: isPast ? 'past' : 'today', mission_id: mission.id });

        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([50, 50, 50]);
        }

        if (withLine) {
            const template = isPast ? mission.recoveryTemplate : mission.shareTemplate;
            const text = `【Papa-Quest: ミッション完了】\n${template}`;
            const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;

            window.open(url, '_blank');
        }
    };

    if (!mission) return null;

    return (
        <div className={`flex flex-col items-center gap-2 ${condensed ? 'px-0 py-1' : 'px-6 py-2'}`}>
            {!isCompleted && (
                <div className="w-full flex flex-col items-center mb-2">
                    <p className="text-[10px] text-gray-400 font-medium mb-1.5 text-center">
                        【保護者の方へ】ご報告の前に、安全上の配慮が済んでいるか確認してください。
                    </p>
                    <label className={`w-full flex items-center justify-center gap-2 font-bold text-[15px] px-4 py-3.5 rounded-xl border-2 shadow-sm cursor-pointer transition-colors ${isSafetyChecked ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'}`}>
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-indigo-600 flex-shrink-0 rounded"
                            checked={isSafetyChecked}
                            onChange={(e) => setIsSafetyChecked(e.target.checked)}
                        />
                        <span className="flex items-center leading-none">⚠️ 周囲の安全を確保しました</span>
                    </label>
                </div>
            )}
            <button
                onClick={() => handleComplete(true)}
                disabled={isCompleted || !isSafetyChecked}
                className={`w-full py-5 rounded-2xl text-xl font-bold border transition-all duration-300 active:scale-95 ${isCompleted || !isSafetyChecked
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-800 shadow-sm active:shadow-inner'
                    }`}
            >
                {isCompleted ? '今日のミッション 完了済み' : '安全を確認してLINEで報告'}
            </button>

            {!isCompleted && (
                <div className="mt-4 pb-2 w-full flex flex-col items-center gap-2">
                    <button
                        onClick={() => handleComplete(false)}
                        disabled={!isSafetyChecked}
                        className={`text-sm font-medium underline py-2 rounded-2xl px-8 transition-colors ${!isSafetyChecked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 active:bg-gray-100'}`}
                    >
                        安全を確認して完了（EXP獲得）
                    </button>
                </div>
            )}
        </div>
    );
}
