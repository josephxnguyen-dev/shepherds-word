import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Moon, 
  Clock, 
  Hourglass 
} from 'lucide-react';

export default function PulpitModeModal({
  isOpen,
  onClose,
  mainLanguage = 'en',
  lessonLength = 'medium',
  passage,
  studyPackage
}) {
  const [fontSize, setFontSize] = useState('large'); // 'normal' | 'large' | 'xlarge'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light' | 'sepia'
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pulpitLang, setPulpitLang] = useState(mainLanguage === 'vi' ? 'vi' : 'en'); // 'en' | 'vi' | 'bilingual'
  const [targetMinutes, setTargetMinutes] = useState(
    lessonLength === 'short' ? 15 : lessonLength === 'long' ? 60 : 35
  );

  useEffect(() => {
    setTargetMinutes(lessonLength === 'short' ? 15 : lessonLength === 'long' ? 60 : 35);
  }, [lessonLength]);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!isOpen || !passage || !studyPackage) return null;

  const isEn = pulpitLang === 'en';

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSeconds(0);
  };

  const currentMins = Math.floor(seconds / 60);
  const isOvertime = currentMins >= targetMinutes;

  const fontSizeClasses = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-2xl',
    xlarge: 'text-xl sm:text-3xl'
  };

  const themeClasses = {
    dark: 'bg-slate-950 text-slate-100',
    light: 'bg-white text-slate-900',
    sepia: 'bg-[#faf6ee] text-[#2c2621]'
  };

  const cardClasses = {
    dark: 'bg-slate-900/90 border-slate-800 text-slate-200',
    light: 'bg-slate-50 border-slate-200 text-slate-800',
    sepia: 'bg-[#f4efe4] border-[#e2d8c6] text-[#3d342c]'
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${themeClasses[theme]} transition-colors duration-200`}>
      
      {/* Top Floating Teleprompter Bar */}
      <div className={`sticky top-0 z-20 px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-md ${
        theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 
        theme === 'sepia' ? 'bg-[#faf6ee]/90 border-[#e2d8c6]' : 
        'bg-white/90 border-slate-200'
      }`}>
        
        {/* Left: Reference & Target Duration */}
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-lg sm:text-xl">
            {isEn ? passage.referenceEn : passage.referenceVi}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold">
            {isEn ? `TARGET: ${targetMinutes}M` : `MỤC TIÊU: ${targetMinutes}P`}
          </span>
        </div>

        {/* Center: Preaching Stopwatch with Target Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
          isOvertime 
            ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' 
            : 'bg-black/20 border-white/10'
        }`}>
          <Clock className={`w-4 h-4 ${isOvertime ? 'text-rose-400' : 'text-amber-500'}`} />
          <span className={`font-mono font-bold text-lg ${isOvertime ? 'text-rose-300' : 'text-amber-400'}`}>
            {formatTime(seconds)} / {targetMinutes}:00
          </span>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
            title={timerRunning ? "Pause timer" : "Start timer"}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick Target Duration Switchers */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-white/10 text-[11px]">
            <button
              onClick={() => setTargetMinutes(15)}
              className={`px-1.5 py-0.5 rounded ${targetMinutes === 15 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
            >
              15m
            </button>
            <button
              onClick={() => setTargetMinutes(35)}
              className={`px-1.5 py-0.5 rounded ${targetMinutes === 35 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
            >
              35m
            </button>
            <button
              onClick={() => setTargetMinutes(60)}
              className={`px-1.5 py-0.5 rounded ${targetMinutes === 60 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
            >
              60m
            </button>
          </div>
        </div>

        {/* Right: Controls & Close */}
        <div className="flex items-center gap-2">
          
          {/* Language Switcher in Pulpit */}
          <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setPulpitLang('en')}
              className={`px-2 py-1 rounded font-bold cursor-pointer ${pulpitLang === 'en' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setPulpitLang('bilingual')}
              className={`px-2 py-1 rounded font-bold cursor-pointer ${pulpitLang === 'bilingual' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              Both
            </button>
            <button
              onClick={() => setPulpitLang('vi')}
              className={`px-2 py-1 rounded font-bold cursor-pointer ${pulpitLang === 'vi' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              VI
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded font-bold cursor-pointer ${fontSize === 'normal' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded font-bold text-sm cursor-pointer ${fontSize === 'large' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded font-bold text-base cursor-pointer ${fontSize === 'xlarge' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              A++
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded cursor-pointer ${theme === 'dark' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              title="Dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-1 rounded font-serif cursor-pointer ${theme === 'sepia' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              title="Warm parchment sepia"
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded cursor-pointer ${theme === 'light' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              title="Light theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close Pulpit Mode */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer ml-1"
            title="Exit pulpit mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main Reading Flow for the Pulpit */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        
        {/* Title Header */}
        <div className="text-center space-y-2 border-b pb-6 border-white/10">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">
            {isEn ? `SERMON OUTLINE • ${targetMinutes} MINUTE PLAN` : `DÀN Ý BÀI GIẢNG • KẾ HOẠCH ${targetMinutes} PHÚT`}
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-amber-400">
            {isEn ? studyPackage.titleEn : studyPackage.titleVi}
          </h1>
          <p className="text-sm sm:text-base opacity-75 italic">
            "{isEn ? studyPackage.titleVi : studyPackage.titleEn}"
          </p>
          <div className="mt-2 text-sm sm:text-base font-medium opacity-90 max-w-2xl mx-auto">
            {isEn ? (studyPackage.themeEn || studyPackage.themeVi) : studyPackage.themeVi}
          </div>
        </div>

        {/* Primary Scripture */}
        <div className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-3`}>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            {isEn ? `Scripture Passage: ${passage.referenceEn}` : `Bản Văn Kinh Thánh: ${passage.referenceVi}`}
          </div>
          {isEn ? (
            <>
              <blockquote className={`font-serif ${fontSizeClasses[fontSize]} italic leading-relaxed pl-4 border-l-4 border-amber-500`}>
                "{passage.translations?.en?.NIV || passage.translations?.en?.ESV}"
              </blockquote>
              <div className="text-xs opacity-60 italic pt-2">
                "{passage.translations?.vi?.BTT || passage.translations?.vi?.NVB}"
              </div>
            </>
          ) : (
            <>
              <blockquote className={`font-serif ${fontSizeClasses[fontSize]} italic leading-relaxed pl-4 border-l-4 border-amber-500`}>
                "{passage.translations?.vi?.BTT || passage.translations?.vi?.NVB}"
              </blockquote>
              <div className="text-xs opacity-60 italic pt-2">
                "{passage.translations?.en?.NIV || passage.translations?.en?.ESV}"
              </div>
            </>
          )}
        </div>

        {/* Hook / Introduction */}
        {studyPackage.teachingPlan?.hook && (
          <div className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-2`}>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              {isEn ? "HOOK (ATTENTION GRABBER)" : "MỞ ĐỀ (HOOK)"}
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-rose-300">
              {isEn ? (studyPackage.teachingPlan.hook.stepEn || studyPackage.teachingPlan.hook.stepVi) : studyPackage.teachingPlan.hook.stepVi}
            </h3>
            <p className={`${fontSizeClasses[fontSize]} leading-relaxed opacity-90`}>
              {isEn ? (studyPackage.teachingPlan.hook.descriptionEn || studyPackage.teachingPlan.hook.descriptionVi) : studyPackage.teachingPlan.hook.descriptionVi}
            </p>
          </div>
        )}

        {/* 3 Key Points */}
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            {isEn ? "KEY POINTS & EXEGESIS" : "CÁC ĐIỂM THEN CHỐT"}
          </div>

          {studyPackage.keyPoints?.map((p, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-4`}>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center shrink-0 text-sm">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-amber-400">
                    {isEn ? p.pointEn : p.pointVi}
                  </h3>
                  <div className="text-xs opacity-60 italic">
                    {isEn ? p.pointVi : p.pointEn}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pl-2 sm:pl-11">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-500/80 block mb-1">
                    {isEn ? "Theological Exegesis:" : "Giải nghĩa bản văn:"}
                  </span>
                  <p className={`${fontSizeClasses[fontSize]} leading-relaxed opacity-90`}>
                    {isEn ? (p.exegesisEn || p.exegesisVi) : p.exegesisVi}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">
                    {isEn ? "Life Application:" : "Áp dụng mục vụ:"}
                  </span>
                  <p className={`${fontSizeClasses[fontSize]} font-medium text-emerald-300 leading-relaxed`}>
                    👉 {isEn ? (p.applicationEn || p.applicationVi) : p.applicationVi}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Parables / Life Illustrations */}
        {studyPackage.parables && studyPackage.parables.length > 0 && (
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isEn ? "CONTEMPORARY PARABLES & STORIES" : "TRUYỆN NGỤ NGÔN & MINH HỌA"}
            </div>

            {studyPackage.parables.map((story, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-4`}>
                <h3 className="font-serif font-bold text-xl text-emerald-400">
                  {isEn ? (story.titleEn || story.titleVi) : story.titleVi}
                </h3>
                <div className={`font-serif ${fontSizeClasses[fontSize]} leading-relaxed opacity-90 whitespace-pre-line`}>
                  {isEn ? (story.storyEn || story.storyVi) : story.storyVi}
                </div>
                {(story.pastoralBridgeEn || story.pastoralBridgeVi) && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span className="text-xs font-bold uppercase block mb-1">
                      {isEn ? "Pulpit pastoral bridge:" : "Lời nối trên bục giảng:"}
                    </span>
                    <p className={`${fontSizeClasses[fontSize]} font-medium`}>
                      {isEn ? (story.pastoralBridgeEn || story.pastoralBridgeVi) : story.pastoralBridgeVi}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Took / Weekly Call */}
        {studyPackage.teachingPlan?.took && (
          <div className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-3`}>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {isEn ? "ACTION COMMITMENT (TOOK)" : "HÀNH ĐỘNG & KÊU GỌI (TOOK)"}
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-indigo-300">
              {isEn ? (studyPackage.teachingPlan.took.stepEn || studyPackage.teachingPlan.took.stepVi) : studyPackage.teachingPlan.took.stepVi}
            </h3>
            <p className={`${fontSizeClasses[fontSize]} leading-relaxed opacity-90`}>
              {isEn ? (studyPackage.teachingPlan.took.descriptionEn || studyPackage.teachingPlan.took.descriptionVi) : studyPackage.teachingPlan.took.descriptionVi}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
