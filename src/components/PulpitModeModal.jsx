import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Type, 
  Sun, 
  Moon, 
  ChevronRight, 
  Clock, 
  Maximize, 
  Minimize 
} from 'lucide-react';

export default function PulpitModeModal({
  isOpen,
  onClose,
  passage,
  audienceMode,
  studyPackage
}) {
  const [fontSize, setFontSize] = useState('large'); // 'normal' | 'large' | 'xlarge'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light' | 'sepia'
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedLang, setSelectedLang] = useState('vi'); // 'vi' | 'en' | 'bilingual'

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

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSeconds(0);
  };

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
        
        {/* Left: Reference & Title */}
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-lg sm:text-xl">
            {passage.referenceVi}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold">
            BỤC GIẢNG
          </span>
        </div>

        {/* Center: Preaching Stopwatch / Timer */}
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="font-mono font-bold text-lg text-amber-400">
            {formatTime(seconds)}
          </span>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
            title={timerRunning ? "Tạm dừng" : "Bắt đầu"}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            title="Đặt lại đồng hồ"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Controls & Close */}
        <div className="flex items-center gap-2">
          
          {/* Font Size Toggle */}
          <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded font-bold ${fontSize === 'normal' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded font-bold text-sm ${fontSize === 'large' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded font-bold text-base ${fontSize === 'xlarge' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              A++
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded ${theme === 'dark' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              title="Chế độ Tối"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-1 rounded font-serif ${theme === 'sepia' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              title="Chế độ Giấy Da Ấm Áp"
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded ${theme === 'light' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              title="Chế độ Sáng"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close Pulpit Mode */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer ml-1"
            title="Thoát chế độ bục giảng"
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
            DÀN Ý BÀI GIẢNG / SOẠN THẢO BỤC GIẢNG
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-amber-400">
            {studyPackage.titleVi}
          </h1>
          <p className="text-sm sm:text-base opacity-75 italic">
            "{studyPackage.titleEn}"
          </p>
          <div className="mt-2 text-sm sm:text-base font-medium opacity-90 max-w-2xl mx-auto">
            {studyPackage.themeVi}
          </div>
        </div>

        {/* Primary Scripture */}
        <div className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-3`}>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Bản Văn Kinh Thánh: {passage.referenceVi}
          </div>
          <blockquote className={`font-serif ${fontSizeClasses[fontSize]} italic leading-relaxed pl-4 border-l-4 border-amber-500`}>
            "{passage.translations?.vi?.BTT || passage.translations?.vi?.NVB}"
          </blockquote>
          <div className="text-xs opacity-60 italic pt-2">
            "{passage.translations?.en?.NIV || passage.translations?.en?.ESV}"
          </div>
        </div>

        {/* Hook / Introduction */}
        {studyPackage.teachingPlan?.hook && (
          <div className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-2`}>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              MỞ ĐỀ (HOOK)
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-rose-300">
              {studyPackage.teachingPlan.hook.stepVi}
            </h3>
            <p className={`${fontSizeClasses[fontSize]} leading-relaxed opacity-90`}>
              {studyPackage.teachingPlan.hook.descriptionVi}
            </p>
          </div>
        )}

        {/* 3 Key Points */}
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            CÁC ĐIỂM THEN CHỐT (KEY POINTS)
          </div>

          {studyPackage.keyPoints?.map((p, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-4`}>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center shrink-0 text-sm">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-amber-400">
                    {p.pointVi}
                  </h3>
                  <div className="text-xs opacity-60 italic">
                    {p.pointEn}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pl-2 sm:pl-11">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-500/80 block mb-1">
                    Giải nghĩa bản văn:
                  </span>
                  <p className={`${fontSizeClasses[fontSize]} leading-relaxed opacity-90`}>
                    {p.exegesisVi}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">
                    Áp dụng mục vụ:
                  </span>
                  <p className={`${fontSizeClasses[fontSize]} font-medium text-emerald-300 leading-relaxed`}>
                    👉 {p.applicationVi}
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
              TRUYỆN NGỤ NGÔN & MINH HỌA ĐỜI SỐNG
            </div>

            {studyPackage.parables.map((story, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-4`}>
                <h3 className="font-serif font-bold text-xl text-emerald-400">
                  {story.titleVi}
                </h3>
                <div className={`font-serif ${fontSizeClasses[fontSize]} leading-relaxed opacity-90 whitespace-pre-line`}>
                  {story.storyVi}
                </div>
                {story.pastoralBridgeVi && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span className="text-xs font-bold uppercase block mb-1">Lời nối trên bục giảng:</span>
                    <p className={`${fontSizeClasses[fontSize]} font-medium`}>
                      {story.pastoralBridgeVi}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Took / Weekly Call & Benediction */}
        {studyPackage.teachingPlan?.took && (
          <div className={`p-6 rounded-2xl border ${cardClasses[theme]} space-y-3`}>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              HÀNH ĐỘNG & KÊU GỌI (TOOK)
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-indigo-300">
              {studyPackage.teachingPlan.took.stepVi}
            </h3>
            <p className={`${fontSizeClasses[fontSize]} leading-relaxed opacity-90`}>
              {studyPackage.teachingPlan.took.descriptionVi}
            </p>
          </div>
        )}

        <div className="text-center pt-8 pb-12 opacity-50 text-xs">
          Hết dàn bài — Nhấn phím Esc hoặc nút X ở góc trên để đóng chế độ bục giảng
        </div>

      </div>

    </div>
  );
}
