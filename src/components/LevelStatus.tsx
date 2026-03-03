import { LevelInfo } from "@/hooks/useMissions";
import { useEffect, useState } from "react";

type Props = {
    levelInfo: LevelInfo;
};

export default function LevelStatus({ levelInfo }: Props) {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        // Delay animation slightly for smooth initial load
        const timer = setTimeout(() => {
            setAnimatedProgress(levelInfo.progressPercent);
        }, 100);
        return () => clearTimeout(timer);
    }, [levelInfo.progressPercent]);

    return (
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 shadow-sm border-b border-gray-100 z-10 sticky top-0 flex flex-col justify-center">
            <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none">
                        Lv.{levelInfo.level}
                    </span>
                    <span className="text-sm font-bold text-gray-700 leading-none">
                        {levelInfo.title}
                    </span>
                </div>

                <div className="flex flex-col items-end w-32">
                    {/* Progress Bar Container */}
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000 ease-out"
                            style={{ width: `${animatedProgress}%` }}
                        />
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium mt-1">
                        EXP: {levelInfo.currentExp}/{levelInfo.nextLevelExp}
                    </span>
                </div>
            </div>
        </div>
    );
}
