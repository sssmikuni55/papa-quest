'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export default function DataExportButton() {
    const [copied, setCopied] = useState(false);

    const handleExport = async () => {
        try {
            const startDate = localStorage.getItem('papa_quest_start_date') || 'N/A';
            const exp = localStorage.getItem('papa_quest_total_exp') || '0';
            const mapRaw = localStorage.getItem('papa_quest_completed_map') || '{}';

            let completedCount = 0;
            try {
                const mapObj = JSON.parse(mapRaw);
                completedCount = Object.keys(mapObj).length;
            } catch (e) {
                console.error('Failed to parse completed map', e);
            }

            const exportText = `【Papa-Quest セーブデータ】\n開始日: ${startDate}\n累計EXP: ${exp}\nミッション完了数: ${completedCount}\n詳細マップ: ${mapRaw}`;

            await navigator.clipboard.writeText(exportText);
            sendGAEvent({ event: 'data_export' });
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to export data', err);
            alert('コピー操作が拒否されたか、対応していないブラウザです。');
        }
    };

    return (
        <div className="flex justify-center mt-2 px-2">
            <button
                onClick={handleExport}
                className="text-[11px] text-gray-400 font-medium underline px-4 py-2 rounded-full active:bg-gray-100 transition-colors"
            >
                {copied ? 'データをクリップボードにコピーしました！' : 'セーブデータを書き出す'}
            </button>
        </div>
    );
}
