'use client';

import { useState } from "react";
import { MILESTONES, Mission } from "@/hooks/useMissions";
import DataExportButton from "@/components/DataExportButton";
import missionsData from '@/data/missions.json';

type Props = {
    initialMilestones: string[];
    hiddenMissions: (number | string)[];
    onUnhide: (id: number | string) => void;
    onSave: (milestones: string[]) => void;
    onClose: () => void;
};

export default function SettingsModal({ initialMilestones, hiddenMissions, onUnhide, onSave, onClose }: Props) {
    const [milestones, setMilestones] = useState<string[]>(initialMilestones);

    const handleToggle = (id: string) => {
        setMilestones(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        onSave(milestones);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">お子さんの成長設定</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 active:bg-gray-200">
                        ✕
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    いまできることを選択してください。<br />成長に合わせてミッションが最適化されます。
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {MILESTONES.map(m => (
                        <label
                            key={m.id}
                            className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-colors ${milestones.includes(m.id)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={milestones.includes(m.id)}
                                onChange={() => handleToggle(m.id)}
                            />
                            <span className="text-xs font-bold">{m.label}</span>
                        </label>
                    ))}
                </div>

                {hiddenMissions.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">非表示にしたミッション</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                            {hiddenMissions.map((id) => {
                                const allMs = Object.values(missionsData).flat() as Mission[];
                                const m = allMs.find(x => x.id === id);
                                if (!m) return null;
                                return (
                                    <div key={id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <span className="text-xs text-gray-600 truncate flex-1 pr-2" title={m.title}>{m.title}</span>
                                        <button
                                            onClick={() => onUnhide(id)}
                                            className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded active:bg-blue-200 whitespace-nowrap"
                                        >
                                            元に戻す
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-md active:scale-95 transition-transform"
                >
                    設定を更新する
                </button>

                <div className="mt-6 border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">バックアップ（推奨）</h3>
                    <p className="text-[10px] text-gray-500 leading-snug mb-3">
                        機種変更やデータ破損に備え、月に1回程度セーブデータをバックアップ（保存）することをお勧めします。
                    </p>
                    <DataExportButton />
                </div>
            </div>
        </div>
    );
}
