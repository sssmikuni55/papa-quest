import { useEffect, useState } from "react";

export default function LevelUpCelebration({ level, title }: { level: number, title: string }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => setShow(true), 0);
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100, 50, 200]);
        }
    }, []);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className={`relative bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-2xl text-white text-center w-64 transform transition-all duration-700 ${show ? 'scale-100 rotate-0 translate-y-0' : 'scale-50 -rotate-12 translate-y-12'}`}>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl">🎉</div>
                <h2 className="text-2xl font-black mb-2 tracking-widest text-yellow-100 shadow-sm">LEVEL UP!</h2>
                <div className="bg-white/20 rounded-xl p-4 mt-4 backdrop-blur-sm border border-white/30">
                    <p className="text-xs uppercase tracking-widest font-semibold text-yellow-100 mb-1">現在の称号</p>
                    <p className="text-xl font-bold">{title}</p>
                    <div className="mt-2 text-4xl font-black">
                        <span className="text-lg mr-1">Lv</span>{level}
                    </div>
                </div>
            </div>
        </div>
    );
}
