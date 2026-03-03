import { useState, useEffect } from 'react';
import missionsInfo from '@/data/missions.json';

export type Mission = {
    id: number | string;
    category: string;
    title: string;
    description: string;
    wifeQuestion: string;
    shareTemplate: string;
    recoveryTemplate: string;
    requiredMilestone?: string;
    safetyCaution?: string;
    affiliateItem?: {
        url: string;
        title: string;
        imageUrl?: string;
        sponsorName?: string;
    };
};

export type PastUnfinishedMission = {
    dateStr: string;
    daysAgo: number;
    mission: Mission;
};

export type CompletedMap = Record<string, boolean>;

export const MILESTONES = [
    { id: 'smiling', label: 'あやすと笑う' },
    { id: 'rolling_over', label: '寝返り' },
    { id: 'sitting_up', label: 'お座り' },
    { id: 'crawling', label: 'はいはい' },
    { id: 'standing_with_support', label: 'つかまり立ち' },
    { id: 'eating_solid', label: '離乳食（手づかみ等）' },
    { id: 'talking', label: '発語（意味のある言葉）' },
    { id: 'walking', label: '一人歩き' }
];

export type LevelInfo = {
    level: number;
    title: string;
    currentExp: number;
    nextLevelExp: number;
    progressPercent: number;
};

// EXP Table constants
const EXP_PER_TODAY = 20;
const EXP_PER_PAST = 10;
const EXP_PER_INFINITE_QUEST = 2;

// Scope constants
export const MAX_MONTH = 18;



const getLocalDateString = (d: Date = new Date()) => {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const getHashFromStr = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export function useMissions() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [activeMonth, setActiveMonth] = useState<number>(9);
    const [startDateStr, setStartDateStr] = useState<string>('');
    const [installedDateStr, setInstalledDateStr] = useState<string>('');
    const [completedMap, setCompletedMap] = useState<CompletedMap>({});
    const [hiddenMissions, setHiddenMissions] = useState<(number | string)[]>([]);
    const [userMilestones, setUserMilestones] = useState<string[]>([]);
    const [totalExp, setTotalExp] = useState<number>(0);
    const [todayStr, setTodayStr] = useState<string>('');
    const [shuffleOffset, setShuffleOffset] = useState<number>(0);
    const [isMonthChangeReady, setIsMonthChangeReady] = useState(false);
    const [completedInfiniteQuestsToday, setCompletedInfiniteQuestsToday] = useState<string[]>([]);

    useEffect(() => {
        // Determine today
        const today = getLocalDateString();
        setTimeout(() => setTodayStr(today), 0);

        const storedMonth = localStorage.getItem('papa_quest_active_month');
        const storedStart = localStorage.getItem('papa_quest_month_start_date');
        const storedInstalled = localStorage.getItem('papa_quest_installed_date');
        const storedCompleted = localStorage.getItem('papa_quest_completed_map');
        const storedHidden = localStorage.getItem('papa_quest_hidden_missions');
        const storedMilestones = localStorage.getItem('papa_quest_user_milestones');
        const storedExp = localStorage.getItem('papa_quest_total_exp');
        const storedShuffleDate = localStorage.getItem('papa_quest_shuffle_date');
        const storedShuffleOffset = localStorage.getItem('papa_quest_shuffle_offset');
        const storedInfiniteDate = localStorage.getItem('papa_quest_infinite_date');
        const storedInfiniteStr = localStorage.getItem('papa_quest_infinite_quests');

        if (storedShuffleDate === today && storedShuffleOffset) {
            setTimeout(() => setShuffleOffset(parseInt(storedShuffleOffset, 10)), 0);
        } else {
            // New day, reset shuffle
            localStorage.setItem('papa_quest_shuffle_date', today);
            localStorage.setItem('papa_quest_shuffle_offset', '0');
            setTimeout(() => setShuffleOffset(0), 0);
        }

        if (storedInfiniteDate === today && storedInfiniteStr) {
            try {
                const parsed = JSON.parse(storedInfiniteStr);
                setTimeout(() => setCompletedInfiniteQuestsToday(parsed), 0);
            } catch (e) { }
        } else {
            localStorage.setItem('papa_quest_infinite_date', today);
            localStorage.setItem('papa_quest_infinite_quests', JSON.stringify([]));
            setTimeout(() => setCompletedInfiniteQuestsToday([]), 0);
        }

        if (storedMonth && storedStart) {
            setTimeout(() => {
                setActiveMonth(parseInt(storedMonth, 10));
                setStartDateStr(storedStart);
                setInstalledDateStr(storedInstalled || storedStart);
                setIsSetupComplete(true);
            }, 0);

            // Check if 30 days passed
            const dDate = new Date(today);
            const sDate = new Date(storedStart);
            const diffTime = dDate.getTime() - sDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            const postponedStr = localStorage.getItem('papa_quest_postponed_date');
            const currentActiveMonth = parseInt(storedMonth, 10);
            if (diffDays >= 30 && postponedStr !== today && currentActiveMonth < MAX_MONTH) {
                setTimeout(() => setIsMonthChangeReady(true), 0);
            }
        } else {
            setTimeout(() => setIsSetupComplete(false), 0);
        }

        if (storedCompleted) {
            try {
                const parsed = JSON.parse(storedCompleted);
                setTimeout(() => setCompletedMap(parsed), 0);
            } catch (e) {
                console.error('Failed to parse completed map', e);
            }
        }

        if (storedHidden) {
            try {
                const parsed = JSON.parse(storedHidden);
                setTimeout(() => setHiddenMissions(parsed), 0);
            } catch (e) {
                console.error('Failed to parse hidden missions', e);
            }
        }

        if (storedMilestones) {
            try {
                const parsed = JSON.parse(storedMilestones);
                setTimeout(() => setUserMilestones(parsed), 0);
            } catch (e) {
                console.error('Failed to parse milestones', e);
            }
        }

        if (storedExp) {
            setTimeout(() => setTotalExp(parseInt(storedExp, 10) || 0), 0);
        }

        setTimeout(() => setIsLoaded(true), 0);
    }, []);

    const completeSetup = (month: number, day: number, milestones: string[], participation: number) => {
        const today = getLocalDateString();
        const startD = new Date(today);
        startD.setUTCDate(startD.getUTCDate() - day);
        const startStr = startD.toISOString().split('T')[0];

        localStorage.setItem('papa_quest_active_month', month.toString());
        localStorage.setItem('papa_quest_month_start_date', startStr);
        localStorage.setItem('papa_quest_installed_date', today);
        localStorage.setItem('papa_quest_user_milestones', JSON.stringify(milestones));

        // Calculate initial EXP bonus
        // Base bonus is month * 200, modified by participation (0-2)
        // participation 2: full bonus. participation 1: half bonus. participation 0: no bonus.
        const bonusExp = Math.floor(month * 200 * (participation / 2));
        if (bonusExp > 0) {
            localStorage.setItem('papa_quest_total_exp', bonusExp.toString());
            localStorage.setItem('papa_quest_initial_bonus', bonusExp.toString());
            setTotalExp(bonusExp);
        }

        setActiveMonth(month);
        setStartDateStr(startStr);
        setInstalledDateStr(today);
        setUserMilestones(milestones);
        setIsSetupComplete(true);
    };

    const updateMilestones = (milestones: string[]) => {
        localStorage.setItem('papa_quest_user_milestones', JSON.stringify(milestones));
        setUserMilestones(milestones);
    };

    const advanceToNextMonth = () => {
        if (activeMonth >= MAX_MONTH) return;
        const nextMonth = activeMonth + 1;
        const today = getLocalDateString();

        localStorage.setItem('papa_quest_active_month', nextMonth.toString());
        localStorage.setItem('papa_quest_month_start_date', today);
        setActiveMonth(nextMonth);
        setStartDateStr(today);
        setIsMonthChangeReady(false);
    };

    const postponeMonthChange = () => {
        localStorage.setItem('papa_quest_postponed_date', todayStr);
        setIsMonthChangeReady(false);
    };

    const markAsCompleted = (dateStr: string, isPast: boolean = false) => {
        // Prevent double reward
        if (completedMap[dateStr]) return;

        setCompletedMap((prev) => {
            const nextMap = { ...prev, [dateStr]: true };
            localStorage.setItem('papa_quest_completed_map', JSON.stringify(nextMap));
            return nextMap;
        });

        setTotalExp((prev) => {
            const addedExp = isPast ? EXP_PER_PAST : EXP_PER_TODAY;
            const nextExp = prev + addedExp;
            localStorage.setItem('papa_quest_total_exp', nextExp.toString());
            return nextExp;
        });
    };

    const completeInfiniteQuest = (questLabel: string) => {
        setCompletedInfiniteQuestsToday(prev => {
            if (prev.includes(questLabel)) return prev;
            const next = [...prev, questLabel];
            localStorage.setItem('papa_quest_infinite_quests', JSON.stringify(next));
            return next;
        });
        setTotalExp(prev => {
            const next = prev + EXP_PER_INFINITE_QUEST;
            localStorage.setItem('papa_quest_total_exp', next.toString());
            return next;
        });
    };

    const shuffleMission = () => {
        setShuffleOffset(prev => {
            const nextOffset = prev + 1;
            localStorage.setItem('papa_quest_shuffle_offset', nextOffset.toString());
            // Need to make sure date is today in localStorage
            localStorage.setItem('papa_quest_shuffle_date', getLocalDateString());
            return nextOffset;
        });
    };
    const hideMission = (id: number | string) => {
        setHiddenMissions(prev => {
            if (prev.includes(id)) return prev;
            const next = [...prev, id];
            localStorage.setItem('papa_quest_hidden_missions', JSON.stringify(next));
            return next;
        });
    };

    const unhideMission = (id: number | string) => {
        setHiddenMissions(prev => {
            const next = prev.filter(mId => mId !== id);
            localStorage.setItem('papa_quest_hidden_missions', JSON.stringify(next));
            return next;
        });
    };

    const getMissionForDateStr = (dateStr: string, startStr: string, targetMonth: number, currentMilestones: string[], hiddenList: (number | string)[], offset: number = 0): Mission | null => {
        const missionsData = missionsInfo as Record<string, Mission[]>;
        const rawMonthMissions = missionsData[targetMonth.toString()];

        if (!rawMonthMissions || rawMonthMissions.length === 0) {
            return null;
        }

        // Filter missions based on milestones
        const maxMilestoneIndex = Math.max(-1, ...currentMilestones.map(id => MILESTONES.findIndex(m => m.id === id)));

        const monthMissions = rawMonthMissions.filter(mission => {
            if (hiddenList.includes(mission.id)) return false;
            if (!mission.requiredMilestone) return true; // No requirement
            const reqIndex = MILESTONES.findIndex(m => m.id === mission.requiredMilestone);
            // Include if they already reached it, or it is the very next milestone (N + 1)
            return reqIndex <= maxMilestoneIndex + 1;
        });

        // Fallback if filtering removes everything 
        const usableMissions = monthMissions.length > 0 ? monthMissions : rawMonthMissions;

        const dDate = new Date(dateStr);
        const sDate = new Date(startStr);
        const diffTime = dDate.getTime() - sDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const safeDiffDays = Math.max(0, diffDays);
        const totalMissions = usableMissions.length;

        let missionIndex;
        if (safeDiffDays < totalMissions) {
            missionIndex = (safeDiffDays + offset) % totalMissions;
        } else {
            // Infinite loop mode
            missionIndex = (getHashFromStr(dateStr) + offset) % totalMissions;
        }

        return usableMissions[missionIndex] as Mission;
    };

    const todayMission = startDateStr ? getMissionForDateStr(todayStr, startDateStr, activeMonth, userMilestones, hiddenMissions, shuffleOffset) : null;
    const isTodayCompleted = !!completedMap[todayStr];

    // Calculate past 3 days unfinished
    const pastUnfinishedMissions: PastUnfinishedMission[] = [];
    if (startDateStr && todayStr && installedDateStr) {
        for (let i = 1; i <= 3; i++) {
            const pastDate = new Date(todayStr); // Parse today's midnight UTC basically
            pastDate.setUTCDate(pastDate.getUTCDate() - i);
            const pastStr = pastDate.toISOString().split('T')[0];

            // Do not list past missions for dates before the app installation date
            if (pastStr >= installedDateStr && !completedMap[pastStr]) {
                const pMission = getMissionForDateStr(pastStr, startDateStr, activeMonth, userMilestones, hiddenMissions);
                if (pMission) {
                    pastUnfinishedMissions.push({
                        dateStr: pastStr,
                        daysAgo: i,
                        mission: pMission,
                    });
                }
            }
        }
    }

    // Calculate recent completed missions
    const getRecentCompletedMissions = (limit: number = 5): { dateStr: string; mission: Mission }[] => {
        if (!startDateStr) return [];
        const completedDates = Object.keys(completedMap).filter(key => completedMap[key]);
        // Sort descending by date string
        completedDates.sort((a, b) => b.localeCompare(a));

        const recent: { dateStr: string; mission: Mission }[] = [];
        for (const dateStr of completedDates) {
            if (recent.length >= limit) break;
            const mission = getMissionForDateStr(dateStr, startDateStr, activeMonth, userMilestones, hiddenMissions);
            if (mission) {
                recent.push({ dateStr, mission });
            }
        }
        return recent;
    };

    const getLevelInfo = (exp: number): LevelInfo => {
        let level = 1;
        let title = "新米パパ";
        let nextLevelExp = 100;
        let prevThreshold = 0;

        if (exp >= 18000) {
            level = 100 + Math.floor((exp - 18000) / 500);
            title = "レジェンド（殿堂入り）";
            prevThreshold = 18000 + (level - 100) * 500;
            nextLevelExp = prevThreshold + 500;
        } else if (exp >= 7200) {
            level = 50 + Math.floor((exp - 7200) / 216);
            title = "ゴッド・ファーザー";
            prevThreshold = 7200 + (level - 50) * 216;
            nextLevelExp = prevThreshold + 216;
        } else if (exp >= 3600) {
            level = 30 + Math.floor((exp - 3600) / 180);
            title = "育児マスター";
            prevThreshold = 3600 + (level - 30) * 180;
            nextLevelExp = prevThreshold + 180;
        } else if (exp >= 1800) {
            level = 20 + Math.floor((exp - 1800) / 180);
            title = "家事の鉄人";
            prevThreshold = 1800 + (level - 20) * 180;
            nextLevelExp = prevThreshold + 180;
        } else if (exp >= 600) {
            level = 10 + Math.floor((exp - 600) / 120);
            title = "見習い軍師";
            prevThreshold = 600 + (level - 10) * 120;
            nextLevelExp = prevThreshold + 120;
        } else {
            // Level 1 to 9 (0 to 599 EXP) -> 66 EXP per level
            level = 1 + Math.floor(exp / 66);
            title = "新米パパ";
            prevThreshold = (level - 1) * 66;
            // Cap level 9 at 600
            nextLevelExp = level === 9 ? 600 : prevThreshold + 66;
        }

        const expInCurrentLevel = exp - prevThreshold;
        const expNeededForNext = nextLevelExp - prevThreshold;
        const progressPercent = Math.min(100, Math.max(0, (expInCurrentLevel / expNeededForNext) * 100));

        return {
            level,
            title,
            currentExp: exp,
            nextLevelExp,
            progressPercent
        };
    };

    return {
        isLoaded,
        isSetupComplete,
        activeMonth,
        isMonthChangeReady,
        todayStr,
        todayMission,
        isTodayCompleted,
        pastUnfinishedMissions,
        totalExp,
        userMilestones,
        hiddenMissions,
        levelInfo: getLevelInfo(totalExp),
        completeSetup,
        updateMilestones,
        advanceToNextMonth,
        postponeMonthChange,
        markAsCompleted,
        shuffleMission,
        hideMission,
        unhideMission,
        completeInfiniteQuest,
        completedInfiniteQuestsToday,
        recentCompletedMissions: getRecentCompletedMissions(5),
        completedMap,
        installedDateStr,
    };
}
