'use client';

import { useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export default function MamaPage() {
    const [copied, setCopied] = useState(false);
    const appUrl = 'https://papa-quest.vercel.app';

    const shareMessages = [
        {
            label: 'さりげなく紹介',
            emoji: '💬',
            text: `育児アプリで面白いの見つけたんだけど、見てみて！１日１つミッションが出てくるゲームみたいなやつ👶✨\n${appUrl}`,
        },
        {
            label: '感謝を込めて',
            emoji: '💌',
            text: `いつも育児ありがとう！このアプリ、パパ向けの育児サポートアプリなんだって。一緒にやってみない？😊\n${appUrl}`,
        },
        {
            label: 'ユーモアたっぷり',
            emoji: '😂',
            text: `パパのレベルが上がるアプリ見つけたｗ 今のレベルいくつか見てみてよ💪\n${appUrl}`,
        },
    ];

    const handleLineShare = (text: string, label: string) => {
        sendGAEvent({ event: 'mama_share', value: label });
        const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(appUrl).then(() => {
            setCopied(true);
            sendGAEvent({ event: 'mama_copy_link' });
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50 flex flex-col items-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center pt-8 pb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                        Papa-Quest
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">ママからパパへ贈る、育児サポートアプリ</p>
                </div>

                {/* Hero message */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6">
                    <div className="text-center mb-6">
                        <span className="text-5xl mb-4 block">👨‍👶</span>
                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                            パパに、もっと楽しく<br />育児に参加してほしい。
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Papa-Questは、お子さんの月齢に合わせた<br />
                            「1日1つの育児ミッション」を出題する<br />
                            ゲーム感覚の育児支援アプリです。
                        </p>
                    </div>

                    {/* Key points */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
                            <span className="text-lg mt-0.5">🎯</span>
                            <div>
                                <p className="text-xs font-bold text-blue-800">毎日1つだけ</p>
                                <p className="text-[11px] text-blue-600">負担にならない「1日1ミッション」形式</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-green-50 rounded-xl p-3">
                            <span className="text-lg mt-0.5">🌱</span>
                            <div>
                                <p className="text-xs font-bold text-green-800">プレッシャーゼロ</p>
                                <p className="text-[11px] text-green-600">やれなくても3日で自動消滅。責めません</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-3">
                            <span className="text-lg mt-0.5">📈</span>
                            <div>
                                <p className="text-xs font-bold text-purple-800">ゲーム感覚で成長</p>
                                <p className="text-[11px] text-purple-600">経験値が貯まってレベルアップ！称号もゲット</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-3">
                            <span className="text-lg mt-0.5">💌</span>
                            <div>
                                <p className="text-xs font-bold text-orange-800">LINEで完了報告</p>
                                <p className="text-[11px] text-orange-600">ミッション達成後、ママのLINEに報告できます</p>
                            </div>
                        </div>
                    </div>

                    {/* Reassurance for mama */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-2">
                        <p className="text-xs text-amber-800 leading-relaxed text-center">
                            <span className="font-bold">ママへ 💛</span><br />
                            このアプリは「もっとやって」と責めるものではなく、<br />
                            パパが<span className="font-bold">自分から楽しんで</span>育児に参加できるよう<br />
                            設計されています。さりげなくシェアしてみてください。
                        </p>
                    </div>
                </div>

                {/* Share section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6">
                    <h3 className="text-sm font-bold text-gray-800 text-center mb-2">
                        パパのLINEに送ってみよう
                    </h3>
                    <p className="text-[11px] text-gray-400 text-center mb-5">
                        タップするとLINEが開き、選んだメッセージが入力されます
                    </p>

                    <div className="space-y-3">
                        {shareMessages.map((msg, i) => (
                            <button
                                key={i}
                                onClick={() => handleLineShare(msg.text, msg.label)}
                                className="w-full bg-[#06C755] text-white rounded-2xl p-4 flex items-center gap-3 active:scale-[0.97] transition-transform shadow-md shadow-green-500/20"
                            >
                                <span className="text-2xl">{msg.emoji}</span>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold">{msg.label}</p>
                                    <p className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{msg.text.split('\n')[0]}</p>
                                </div>
                                <span className="text-xs opacity-60">LINE →</span>
                            </button>
                        ))}
                    </div>

                    {/* Copy link */}
                    <div className="mt-4 text-center pb-6 border-b border-gray-100">
                        <button
                            onClick={handleCopyLink}
                            className="text-xs text-gray-400 underline active:text-gray-600 transition-colors"
                        >
                            {copied ? '✅ リンクをコピーしました！' : 'URLをコピーして別アプリで送る'}
                        </button>
                    </div>

                    {/* X (Twitter) Share */}
                    <div className="mt-6">
                        <h3 className="text-[11px] font-bold text-gray-400 text-center mb-3">
                            SNSで他のママにも教える
                        </h3>
                        <button
                            onClick={() => {
                                sendGAEvent({ event: 'mama_share_x' });
                                const text = `産後クライシスを防ぐため、うちの旦那を「育児の神」に育てるRPGアプリ使い始めました！プレッシャーゼロで1日1ミッション届くらしい😂 全国のお疲れママたち、これ旦那にやらせよ🫶\n#PapaQuest #産後クライシス\n`;
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`, '_blank');
                            }}
                            className="w-full bg-black text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-md active:scale-[0.98] transition-transform"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></svg>
                            X (Twitter) でシェア
                        </button>
                    </div>
                </div>

                {/* Direct link */}
                <div className="text-center pb-8">
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-white rounded-full shadow-md text-sm font-bold text-gray-600 active:bg-gray-50 transition-colors"
                    >
                        パパ本人はこちら →
                    </a>
                    <p className="text-[10px] text-gray-300 mt-3">
                        Papa-Quest — 産後クライシス予防・パパ向け育児支援アプリ
                    </p>
                </div>
            </div>
        </main>
    );
}
