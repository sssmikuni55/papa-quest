import { useEffect, useState } from "react";

type Props = {
    bonusExp: number;
    initialLevel: number;
    initialTitle: string;
    onClose: () => void;
};

export default function InitialBonusCelebration({ bonusExp, initialLevel, initialTitle, onClose }: Props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => setShow(true), 100);
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 500); // Wait for transition
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

            <div className={`relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-[2rem] shadow-2xl text-white text-center w-full max-w-sm transform transition-all duration-700 ${show ? 'scale-100 translate-y-0' : 'scale-90 translate-y-12'}`}>

                <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[5rem] animate-bounce">
                    🎁
                </div>

                <h2 className="text-2xl font-black mt-4 mb-2 tracking-widest text-yellow-200 drop-shadow-md">
                    WELCOME BONUS!
                </h2>

                <p className="text-sm font-medium text-white/90 leading-relaxed mb-6">
                    これまでのパパの<br />育児の頑張りを讃え、初期経験値を<br />プレゼントします！
                </p>

                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-md border border-white/30 shadow-inner">
                    <p className="text-xl font-black text-yellow-300 drop-shadow-sm mb-1">
                        + {bonusExp.toLocaleString()} EXP
                    </p>

                    <div className="w-full h-px bg-white/20 my-4" />

                    <p className="text-xs uppercase tracking-widest font-semibold text-white/70 mb-1">開始時の称号</p>
                    <p className="text-2xl font-bold mb-1">{initialTitle}</p>
                    <div className="text-3xl font-black">
                        <span className="text-lg mr-1 font-bold text-white/80">Lv.</span>{initialLevel}
                    </div>
                </div>

                <button
                    onClick={handleClose}
                    className="mt-8 w-full py-4 bg-white text-purple-700 font-black rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    冒険をはじめる
                </button>
            </div>

            {/* Confetti effect placeholder */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-50">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-[80px]" />
                <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-pink-500 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
