import React from 'react';
import { Zap, BookOpen, GraduationCap, Clock } from 'lucide-react';
import { UI_STRINGS } from '../data/translations';

export default function LessonLengthSelector({
  mainLanguage,
  lessonLength, // 'short' | 'medium' | 'long'
  onSelectLessonLength
}) {
  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';

  const lengths = [
    {
      id: 'short',
      icon: Zap,
      minutes: '15m',
      title: t.lengthShort,
      desc: t.lengthShortDesc,
      pacingSummary: isEnglish 
        ? '2m Hook • 8m Core Point • 3m Parable • 2m Action' 
        : '2p Mở đề • 8p Trọng tâm • 3p Minh họa • 2p Cam kết',
      color: 'amber'
    },
    {
      id: 'medium',
      icon: BookOpen,
      minutes: '30-45m',
      title: t.lengthMed,
      desc: t.lengthMedDesc,
      pacingSummary: isEnglish 
        ? '5m Hook • 20m 3 Key Points • 10m Parables • 5m Response' 
        : '5p Mở đề • 20p 3 Điểm then chốt • 10p Minh họa • 5p Kêu gọi',
      color: 'indigo'
    },
    {
      id: 'long',
      icon: GraduationCap,
      minutes: '60+m',
      title: t.lengthLong,
      desc: t.lengthLongDesc,
      pacingSummary: isEnglish 
        ? '10m Context • 30m Verse Exegesis • 15m Parables & Life • 15m Breakout Q&A' 
        : '10p Bối cảnh • 30p Giải kinh câu-theo-câu • 15p Minh họa sâu • 15p Thảo luận & Cầu thay',
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            {t.lessonLengthTitle}
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            {t.lessonLengthSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {lengths.map((len) => {
          const Icon = len.icon;
          const isSelected = lessonLength === len.id;

          return (
            <button
              key={len.id}
              onClick={() => onSelectLessonLength(len.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-700 bg-amber-50/70 shadow-sm ring-1 ring-amber-700/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-amber-200/90 text-amber-950'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    ⏱️ {len.minutes}
                  </span>
                </div>

                <div className="font-serif font-bold text-slate-900 text-base">
                  {len.title}
                </div>
                <p className="text-xs text-slate-700 mt-0.5 mb-2 leading-relaxed">
                  {len.desc}
                </p>

                <div className="text-[11px] font-medium text-amber-900/90 bg-amber-100/60 p-2 rounded-lg border border-amber-200/50">
                  {len.pacingSummary}
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse"></span>
                  {t.audienceActive}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
