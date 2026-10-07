import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  Target, 
  BookOpen, 
  Search 
} from 'lucide-react';
import { UI_STRINGS } from '../data/translations';

export default function TeachingPlanSection({ 
  mainLanguage, 
  studyPackage, 
  lessonLength = 'medium' 
}) {
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  if (!studyPackage?.teachingPlan) return null;

  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';

  const { hook, book, look, took, discussionQuestions } = studyPackage.teachingPlan;

  const toggleStepCompleted = (key) => {
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCopyQuestions = () => {
    if (!discussionQuestions) return;
    const text = isEnglish
      ? "DISCUSSION QUESTIONS:\n\n" + discussionQuestions.map((q, idx) => `${idx + 1}. ${q.qEn || q.qVi}\n   (Tiếng Việt: ${q.qVi})`).join('\n\n')
      : "CÂU HỎI THẢO LUẬN (DISCUSSION QUESTIONS):\n\n" + discussionQuestions.map((q, idx) => `${idx + 1}. ${q.qVi}\n   (${q.qEn})`).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  // Generate dynamic timelines depending on lesson length
  const timelinesByLength = {
    short: [
      { 
        time: '00 - 02m', 
        actionEn: 'Quick Hook: 1 relatable question or wake-up prop', 
        actionVi: 'Mở đề siêu ngắn: 1 câu hỏi đánh thức hoặc câu chuyện 30 giây' 
      },
      { 
        time: '02 - 10m', 
        actionEn: 'Core Scripture reading & 1 punchy theological truth', 
        actionVi: 'Đọc câu gốc & giải thích 1 điểm then chốt cô đọng nhất' 
      },
      { 
        time: '10 - 13m', 
        actionEn: '1 Memorable parable illustration', 
        actionVi: '1 Câu chuyện minh họa ngụ ngôn ngắn chạm lòng' 
      },
      { 
        time: '13 - 15m', 
        actionEn: '1 Action takeaway & 60-second closing prayer', 
        actionVi: '1 Hành động cụ thể hôm nay & cầu nguyện ngắn' 
      }
    ],
    medium: studyPackage.teachingPlan.timeline || [
      { time: '00 - 05m', actionEn: 'Welcome & opening hook illustration', actionVi: 'Lời chào, mở đề thu hút hội chúng' },
      { time: '05 - 20m', actionEn: '3 Exegetical points & scripture context', actionVi: 'Giải kinh 3 điểm then chốt & bối cảnh bản văn' },
      { time: '20 - 30m', actionEn: 'Contemporary parables & pastoral applications', actionVi: 'Kể chuyện ngụ ngôn & liên hệ thực tế đời sống' },
      { time: '30 - 35m', actionVi: 'Kêu gọi dâng phó và cầu nguyện bồi linh', actionEn: 'Altar call, guided prayer, and commitment' }
    ],
    long: [
      { 
        time: '00 - 10m', 
        actionEn: 'Comprehensive Historical, Cultural & Geographic Background', 
        actionVi: 'Khảo cứu bối cảnh lịch sử, địa lý, chính trị và tác giả' 
      },
      { 
        time: '10 - 40m', 
        actionEn: 'Verse-by-verse Exegesis with Greek/Hebrew word study & cross-references', 
        actionVi: 'Giải kinh câu-theo-câu, tra cứu từ gốc Hy Lạp/Hê-bơ-rơ và mạch văn Cựu/Tân Ước' 
      },
      { 
        time: '40 - 55m', 
        actionEn: 'Dual In-depth Parables & theological synthesis', 
        actionVi: 'Trình bày 2 câu chuyện minh họa sâu sắc & đúc kết thần học' 
      },
      { 
        time: '55 - 75m', 
        actionEn: 'Small group breakout questions, personal sharing & extended intercession', 
        actionVi: 'Thảo luận nhóm bàn tròn theo câu hỏi, giải đáp thắc mắc & cầu thay sâu sắc' 
      }
    ]
  };

  const activeTimeline = timelinesByLength[lessonLength] || timelinesByLength.medium;

  const pedagogicalSteps = [
    {
      key: 'hook',
      letter: 'H',
      name: isEnglish ? 'HOOK / Attention Grabber' : 'HOOK / Mở Đề Thu Hút',
      durationTag: lessonLength === 'short' ? '2 min' : lessonLength === 'long' ? '10 min' : '5 min',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Target,
      data: hook
    },
    {
      key: 'book',
      letter: 'B',
      name: isEnglish ? 'BOOK / Scripture Discovery' : 'BOOK / Khám Phá Lời Chúa',
      durationTag: lessonLength === 'short' ? '8 min' : lessonLength === 'long' ? '30 min' : '15 min',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: BookOpen,
      data: book
    },
    {
      key: 'look',
      letter: 'L',
      name: isEnglish ? 'LOOK / Heart Diagnostic' : 'LOOK / Soi Chiếu Nội Tâm',
      durationTag: lessonLength === 'short' ? '3 min' : lessonLength === 'long' ? '15 min' : '10 min',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Search,
      data: look
    },
    {
      key: 'took',
      letter: 'T',
      name: isEnglish ? 'TOOK / Life Application' : 'TOOK / Hành Động Tuần Này',
      durationTag: lessonLength === 'short' ? '2 min' : lessonLength === 'long' ? '15 min' : '5 min',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      data: took
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="bg-slate-50/90 px-4 sm:px-6 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              {t.teachingPlanTitle}
            </h2>
            <p className="text-xs text-slate-700">
              {t.teachingPlanSubtitle}
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-bold border border-slate-300">
          ⏱️ {lessonLength === 'short' ? '15 Mins' : lessonLength === 'long' ? '60+ Mins' : '30-45 Mins'}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        
        {/* 4-Step Pedagogical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pedagogicalSteps.map((step) => {
            const isDone = completedSteps[step.key];
            const primaryTitle = isEnglish ? (step.data?.stepEn || step.data?.stepVi) : step.data?.stepVi;
            const secondaryTitle = isEnglish ? step.data?.stepVi : step.data?.stepEn;
            const primaryDesc = isEnglish ? (step.data?.descriptionEn || step.data?.descriptionVi) : step.data?.descriptionVi;
            const secondaryDesc = isEnglish ? step.data?.descriptionVi : step.data?.descriptionEn;

            return (
              <div
                key={step.key}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isDone 
                    ? 'bg-slate-50 border-slate-300 opacity-80' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md font-black text-xs flex items-center justify-center border ${step.badgeColor}`}>
                      {step.letter}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {step.name}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {step.durationTag}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleStepCompleted(step.key)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Mark step completed"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-700 fill-emerald-100' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div className="text-xs font-serif font-bold text-slate-900 mb-1.5">
                  {primaryTitle}
                </div>
                {secondaryTitle && (
                  <div className="text-[11px] text-slate-700 italic mb-2">
                    {secondaryTitle}
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  {primaryDesc}
                </p>
                {secondaryDesc && (
                  <p className="text-[11px] text-slate-700 leading-relaxed mt-1.5 italic pl-2 border-l border-slate-200">
                    {isEnglish ? `Tiếng Việt: ${secondaryDesc}` : secondaryDesc}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Timeline & Pacing Guide */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.pacingGuideTitle} ({lessonLength === 'short' ? '15 Min Fast Flow' : lessonLength === 'long' ? '60+ Min Deep Session' : '30-45 Min Standard'})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {activeTimeline.map((slot, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 mb-1">
                  {slot.time}
                </span>
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {isEnglish ? (slot.actionEn || slot.actionVi) : slot.actionVi}
                </div>
                {slot.actionEn && !isEnglish && (
                  <div className="text-[11px] text-slate-700 italic mt-0.5">
                    {slot.actionEn}
                  </div>
                )}
                {slot.actionVi && isEnglish && (
                  <div className="text-[11px] text-slate-700 italic mt-0.5">
                    Tiếng Việt: {slot.actionVi}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Discussion Questions Section */}
        {discussionQuestions && discussionQuestions.length > 0 && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  {t.questionsTitle}
                </h3>
              </div>
              <button
                onClick={handleCopyQuestions}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50 transition-all cursor-pointer shadow-xs"
              >
                {copiedQuestions ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyQuestions}</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2.5">
              {discussionQuestions.map((q, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-2xs flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">
                      {isEnglish ? (q.qEn || q.qVi) : q.qVi}
                    </div>
                    {isEnglish && q.qVi && (
                      <div className="text-xs text-slate-700 italic mt-0.5">
                        Tiếng Việt: {q.qVi}
                      </div>
                    )}
                    {!isEnglish && q.qEn && (
                      <div className="text-xs text-slate-700 italic mt-0.5">
                        {q.qEn}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
