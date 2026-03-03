'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

import { MILESTONES } from '@/hooks/useMissions';

type Props = {
    onComplete: (month: number, day: number, milestones: string[], participation: number) => void;
};

export default function SetupScreen({ onComplete }: Props) {
    const [step, setStep] = useState<number>(1);
    const [birthDate, setBirthDate] = useState<string>('');
    const [month, setMonth] = useState<number>(0);
    const [day, setDay] = useState<number>(0);
    const [milestones, setMilestones] = useState<string[]>([]);
    const [participation, setParticipation] = useState<number>(1);

    const handleMilestoneToggle = (id: string) => {
        setMilestones(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setBirthDate(selectedDate);

        if (selectedDate) {
            const birth = new Date(selectedDate);
            const today = new Date();

            // Calculate total days elapsed
            const diffTime = today.getTime() - birth.getTime();
            const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (elapsedDays < 0) {
                setMonth(0);
                setDay(0);
                return;
            }

            // In Papa-Quest, 1 month = 30 days essentially
            const calcMonth = Math.floor(elapsedDays / 30);
            const calcDay = elapsedDays % 30;

            // Cap at 18 months + 0 days
            if (calcMonth > 18) {
                setMonth(18);
                setDay(0);
            } else {
                setMonth(calcMonth);
                setDay(calcDay);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendGAEvent({ event: 'setup_complete' });
        onComplete(month, day, milestones, participation);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center mb-2">
                    Papa-Quest
                </h1>

                {step === 1 ? (
                    <div className="flex flex-col gap-6 mt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-800 mb-2">パパとママのための育児支援アプリ</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                はじめまして！Papa-Questは、産後の大変な時期を夫婦で乗り切るために作られたアプリです。
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
                                    <span className="text-xl">🎯</span> このアプリの目的
                                </h3>
                                <p className="text-xs text-blue-700 leading-relaxed pl-7">
                                    パパが「主体的に」育児と家事に参加し、ママの心と体をケアすること。「産褥期〜1歳半」の間に起こりがちな夫婦間のすれ違い（産後クライシス）を防ぎます。
                                </p>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-indigo-800 flex items-center gap-2 mb-2">
                                    <span className="text-xl">👨‍👦</span> どう使うの？
                                </h3>
                                <p className="text-xs text-indigo-700 leading-relaxed pl-7">
                                    お子さんの月齢に合わせた「1日1つのミッション」が毎日出題されます。<br />
                                    安全を確認して実行し、アプリからママのLINEへ完了報告！<br />
                                    経験値（EXP）を貯めて、パパ自身の称号をレベルアップさせていきましょう。
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <h3 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-2">
                                    <span className="text-xl">🌱</span> パパへ：安心してください
                                </h3>
                                <p className="text-xs text-green-700 leading-relaxed pl-7">
                                    このアプリはパパを責めたり、監視したりするものではありません。<br />
                                    すでに頑張っているあなたを、もっと楽しくサポートするためのアプリです。<br />
                                    ミッションはやれなくても3日で自動的に消えます。自分のペースでOKです。
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/40 active:scale-95 transition-transform"
                        >
                            次へ進む
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-sm text-gray-500 mb-8 mt-2">お子さんの生年月日を教えてください</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700">生年月日</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={handleBirthDateChange}
                                    max={new Date().toISOString().split('T')[0]} // Cannot be in the future
                                    required
                                    className="text-lg font-bold bg-gray-100 rounded-xl px-4 py-3 border-none outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                />
                                {birthDate && (
                                    <div className="mt-1">
                                        <p className="text-xs text-right text-blue-600 font-semibold">
                                            現在：生後 {month} ヶ月と {day} 日
                                        </p>
                                        <p className="text-[10px] text-right text-gray-400 mt-0.5">
                                            ※当アプリでは目安として1ヶ月を30日計算で表示しています
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-bold text-gray-700 mb-3 text-center">いま、お子さんができること</p>
                                <div className="grid grid-cols-2 gap-3">
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
                                                onChange={() => handleMilestoneToggle(m.id)}
                                            />
                                            <span className="text-xs font-bold">{m.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-bold text-gray-700 mb-3 text-center">これまでの育児参加度は？</p>
                                <div className="flex flex-col gap-2">
                                    <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${participation === 2 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                                        <input type="radio" className="hidden" checked={participation === 2} onChange={() => setParticipation(2)} />
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${participation === 2 ? 'border-indigo-500' : 'border-gray-300'}`}>
                                            {participation === 2 && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${participation === 2 ? 'text-indigo-800' : 'text-gray-700'}`}>かなり積極的に参加してきた</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">おむつ替えから寝かしつけまで広くカバー</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${participation === 1 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                                        <input type="radio" className="hidden" checked={participation === 1} onChange={() => setParticipation(1)} />
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${participation === 1 ? 'border-indigo-500' : 'border-gray-300'}`}>
                                            {participation === 1 && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${participation === 1 ? 'text-indigo-800' : 'text-gray-700'}`}>そこそこ・部分的に参加してきた</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">できる範囲で手伝っている</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${participation === 0 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                                        <input type="radio" className="hidden" checked={participation === 0} onChange={() => setParticipation(0)} />
                                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${participation === 0 ? 'border-indigo-500' : 'border-gray-300'}`}>
                                            {participation === 0 && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${participation === 0 ? 'text-indigo-800' : 'text-gray-700'}`}>あまり参加できていなかった</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">仕事が中心で育児の時間を取れなかった</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-800 flex items-start gap-2 mb-2">
                                    <span className="text-base leading-none">💡</span>
                                    <span>継続のコツ：毎日のアラーム設定</span>
                                </p>
                                <p className="text-xs text-blue-600 leading-relaxed ml-6">
                                    パパクエを習慣化するために、毎日決まった時間（例：21:00）にスマホのアラームやカレンダー通知をセットすることをおすすめします！
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-5 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl active:bg-gray-200 transition-colors"
                                >
                                    戻る
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/40 active:scale-95 transition-transform"
                                >
                                    クエストを開始する
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
