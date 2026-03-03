'use client';

type Props = {
    currentMonth: number;
    onAdvance: () => void;
    onPostpone: () => void;
};

export default function MonthChangeModal({ currentMonth, onAdvance, onPostpone }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center transform transition-all">
                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    👶
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">1ヶ月が経過しました！</h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    前回の設定から30日が経過しました。お子さんは次の月齢（{currentMonth + 1}ヶ月）に成長しています！<br />次の月齢のミッションに進みますか？
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onAdvance}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform"
                    >
                        {currentMonth + 1}ヶ月目のミッションへ進む
                    </button>
                    <button
                        onClick={onPostpone}
                        className="w-full py-3 bg-gray-100 text-gray-500 font-bold rounded-xl active:bg-gray-200 transition-colors"
                    >
                        まだいまのミッションを続ける
                    </button>
                </div>
            </div>
        </div>
    );
}
