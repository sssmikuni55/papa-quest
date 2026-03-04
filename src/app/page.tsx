'use client';

import { useMissions } from "@/hooks/useMissions";
import MissionCard from "@/components/MissionCard";
import CompleteButton from "@/components/CompleteButton";
import PastMissionsSwipeArea from "@/components/PastMissionsSwipeArea";
import LevelStatus from "@/components/LevelStatus";
import LevelUpCelebration from "@/components/LevelUpCelebration";
import SetupScreen from "@/components/SetupScreen";
import MonthChangeModal from "@/components/MonthChangeModal";
import SettingsModal from "@/components/SettingsModal";
import InitialBonusCelebration from "@/components/InitialBonusCelebration";
import CompletedDashboard from '@/components/CompletedDashboard';
import NewsModal from "@/components/NewsModal";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    isLoaded,
    isSetupComplete,
    activeMonth,
    isMonthChangeReady,
    todayStr,
    todayMission,
    isTodayCompleted,
    pastUnfinishedMissions,
    recentCompletedMissions,
    totalExp,
    levelInfo,
    userMilestones,
    completeSetup,
    updateMilestones,
    advanceToNextMonth,
    postponeMonthChange,
    markAsCompleted,
    shuffleMission,
    hideMission,
    hiddenMissions,
    unhideMission,
    completeInfiniteQuest,
    completedInfiniteQuestsToday,
  } = useMissions();

  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [initialBonus, setInitialBonus] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && isSetupComplete) {
      const storedBonus = localStorage.getItem('papa_quest_initial_bonus');
      if (storedBonus) {
        setInitialBonus(parseInt(storedBonus, 10));
      }
    }
  }, [isLoaded, isSetupComplete]);

  useEffect(() => {
    if (isLoaded) {
      if (prevLevel !== null && levelInfo.level > prevLevel) {
        // Level up!
        setTimeout(() => setShowCelebration(true), 0);
        setTimeout(() => setShowCelebration(false), 4000);
      }
      setTimeout(() => setPrevLevel(levelInfo.level), 0);
    }
  }, [levelInfo.level, isLoaded, prevLevel]);

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  if (!isSetupComplete) {
    return <SetupScreen onComplete={completeSetup} />;
  }

  return (
    <main className="min-h-screen flex flex-col max-w-md mx-auto relative bg-gray-50 pb-safe">
      <header className="pt-8 px-6 pb-2 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Papa-Quest
        </h1>
        <button
          onClick={() => setShowNews(true)}
          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors relative"
          aria-label="お知らせ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
        </button>
      </header>

      <LevelStatus levelInfo={levelInfo} />

      <div className={`${isTodayCompleted ? 'shrink-0 mb-4' : 'flex-1'} flex flex-col pt-2 transition-all duration-500`}>
        <MissionCard
          mission={todayMission}
          isCompleted={isTodayCompleted}
          onHide={() => todayMission && hideMission(todayMission.id)}
          onShuffle={shuffleMission}
          onComplete={() => markAsCompleted(todayStr)}
        />
      </div>

      <div className="flex flex-col mt-auto bg-white border-t border-gray-200 pb-6 pt-2 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex-1 overflow-hidden">
        {isTodayCompleted ? (
          <CompletedDashboard
            totalExp={totalExp}
            levelInfo={levelInfo}
            recentMissions={recentCompletedMissions}
            onCompleteInfiniteQuest={completeInfiniteQuest}
            completedInfiniteQuestsToday={completedInfiniteQuestsToday}
            activeMonth={activeMonth}
          />
        ) : (
          <PastMissionsSwipeArea
            pastMissions={pastUnfinishedMissions}
            onComplete={(dateStr) => markAsCompleted(dateStr, true)}
            onHide={hideMission}
          />
        )}

        {/* Bottom Action Bar */}
        <div className="flex justify-end items-center px-8 mt-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 active:bg-gray-100 transition-colors"
            aria-label="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {showCelebration && (
        <LevelUpCelebration level={levelInfo.level} title={levelInfo.title} />
      )}

      {isMonthChangeReady && (
        <MonthChangeModal
          currentMonth={activeMonth}
          onAdvance={advanceToNextMonth}
          onPostpone={postponeMonthChange}
        />
      )}

      {showSettings && (
        <SettingsModal
          initialMilestones={userMilestones}
          hiddenMissions={hiddenMissions}
          onUnhide={unhideMission}
          onSave={updateMilestones}
          onClose={() => setShowSettings(false)}
        />
      )}

      {initialBonus !== null && (
        <InitialBonusCelebration
          bonusExp={initialBonus}
          initialLevel={levelInfo.level}
          initialTitle={levelInfo.title}
          onClose={() => {
            setInitialBonus(null);
            localStorage.removeItem('papa_quest_initial_bonus');
          }}
        />
      )}

      {showNews && (
        <NewsModal onClose={() => setShowNews(false)} />
      )}
    </main>
  );
}
