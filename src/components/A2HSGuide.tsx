'use client';

import { useEffect, useState } from 'react';

export default function A2HSGuide() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(true); // Default true to prevent flicker
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Run only on client
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Check if running as PWA
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        setIsStandalone(isStandaloneMode);
    }, []);

    if (isStandalone || isDismissed) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 shadow-sm mb-4 relative">
            <button
                onClick={() => setIsDismissed(true)}
                className="absolute top-2 right-2 p-1 text-orange-400 hover:text-orange-600"
                aria-label="閉じる"
            >
                ✕
            </button>

            <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2 mb-2">
                <span className="text-xl">📱</span> アプリとして追加
            </h3>

            <p className="text-xs text-orange-700 leading-relaxed mb-3">
                Papa-Questは「ホーム画面」に追加することで、フルスクリーンでサクサク動くアプリとして利用できます！毎日の習慣にするためにぜひ追加してください。
            </p>

            <div className="bg-white/60 p-3 rounded-lg border border-orange-100/50">
                <p className="text-xs font-bold text-orange-800 mb-2">追加手順</p>
                {isIOS ? (
                    <ol className="text-xs text-orange-700 space-y-2 list-decimal list-inside">
                        <li>画面下部のメニューから「<span className="font-bold">共有アイコン</span>（四角から矢印が上に出ているマーク）」をタップ</li>
                        <li>メニューを少し下にスクロール</li>
                        <li>「<span className="font-bold">ホーム画面に追加</span>」をタップ</li>
                        <li>右上の「追加」をタップ</li>
                    </ol>
                ) : (
                    <ol className="text-xs text-orange-700 space-y-2 list-decimal list-inside">
                        <li>ブラウザ右上の「<span className="font-bold">メニュー（点3つ）</span>」をタップ</li>
                        <li>「<span className="font-bold">ホーム画面に追加</span>」または「<span className="font-bold">アプリをインストール</span>」をタップ</li>
                        <li>画面の指示に従って追加</li>
                    </ol>
                )}
            </div>
        </div>
    );
}
