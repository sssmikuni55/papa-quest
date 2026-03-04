'use client';

type Props = {
    onClose: () => void;
};

export default function NewsModal({ onClose }: Props) {
    const updates = [
        {
            date: '2026.03.04',
            version: 'v2.1',
            title: 'SNSシェア機能・OGP画像の追加',
            items: [
                'パパのミッション完了画面に「X（Twitter）でシェア」ボタンを追加しました。',
                'ママ向け案内ページに「X（Twitter）」シェアボタンを追加しました。',
                'SNSでURLを共有した際に、リッチな画像（OGP）が表示されるようになりました。',
                'パパが使用するおすすめアイテム（Amazonリンク）を全ミッションに100％網羅しました。'
            ]
        },
        {
            date: '2026.03.03',
            version: 'v2.0',
            title: 'ママ専用ページ・表現の改善',
            items: [
                '旦那さんに角を立てずにアプリを勧められる「ママからパパへの招待ページ(/mama)」を開設しました。',
                'アプリ内の表現を、よりパパを応援するポジティブなトーンに改善しました。',
                'やる気のあるパパ向けの「無限クエスト（経験値追加獲得）」機能が実装されました。'
            ]
        },
        {
            date: '2026.02.24',
            version: 'v1.0',
            title: 'Papa-Quest 正式リリース',
            items: [
                '1日1ミッションが出題される基本システムをリリースしました。',
                'お子さんの月齢に合わせたマイルストーン機能を搭載。',
                'ママへのLINE完了報告システムを搭載。'
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">📢</span> お知らせ・アップデート
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {updates.map((update, idx) => (
                        <div key={idx} className="relative pl-4 border-l-2 border-orange-200">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-400"></div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm font-bold text-gray-800">{update.title}</span>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">{update.version}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-2">{update.date}</p>
                            <ul className="text-xs text-gray-600 space-y-1.5">
                                {update.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                        <span className="text-orange-400 mt-0.5">•</span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-md active:bg-gray-800 transition-colors"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
}
