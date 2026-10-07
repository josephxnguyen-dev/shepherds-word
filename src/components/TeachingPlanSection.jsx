import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Target, 
  BookOpen, 
  Search, 
  Compass 
} from 'lucide-react';

export default function TeachingPlanSection({ studyPackage }) {
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  if (!studyPackage?.teachingPlan) return null;

  const { hook, book, look, took, timeline, discussionQuestions } = studyPackage.teachingPlan;

  const toggleStepCompleted = (key) => {
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCopyQuestions = () => {
    if (!discussionQuestions) return;
    const text = "CÂU HỎI THẢO LUẬN & ĐÀO SÂU (DISCUSSION QUESTIONS):\n\n" +
      discussionQuestions.map((q, idx) => `${idx + 1}. ${q.qVi}\n   (${q.qEn})`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  const pedagogicalSteps = [
    {
      key: 'hook',
      letter: 'H',
      nameVi: 'HOOK / Mở Đề Thu Hút',
      nameEn: 'Attention Grabber',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Target,
      data: hook
    },
    {
      key: 'book',
      letter: 'B',
      nameVi: 'BOOK / Khám Phá Lời Chúa',
      nameEn: 'Scripture Discovery',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: BookOpen,
      data: book
    },
    {
      key: 'look',
      letter: 'L',
      nameVi: 'LOOK / Soi Chiếu Nội Tâm',
      nameEn: 'Heart Diagnostic',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Search,
      data: look
    },
    {
      key: 'took',
      letter: 'T',
      nameVi: 'TOOK / Hành Động Tuần Này',
      nameEn: 'Life Application',
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
              Kế Hoạch Giảng Dạy & Học Tập (Teaching & Learning Plan)
            </h2>
            <p className="text-xs text-slate-700">
              Mô hình sư phạm 4 bước (Hook - Book - Look - Took) và biểu đồ thời gian
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        
        {/* 4-Step Pedagogical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pedagogicalSteps.map((step) => {
            const Icon = step.icon;
            const isDone = completedSteps[step.key];

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
                      {step.nameVi}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleStepCompleted(step.key)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Đánh dấu đã hoàn thành bước này"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-700 fill-emerald-100' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div className="text-xs font-serif font-bold text-slate-900 mb-1.5">
                  {step.data?.stepVi}
                </div>
                {step.data?.stepEn && (
                  <div className="text-[11px] text-slate-700 italic mb-2">
                    {step.data.stepEn}
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  {step.data?.descriptionVi}
                </p>
                {step.data?.descriptionEn && (
                  <p className="text-[11px] text-slate-700 leading-relaxed mt-1.5 italic pl-2 border-l border-slate-200">
                    {step.data.descriptionEn}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline & Pacing Guide */}
        {timeline && timeline.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Phân Bổ Thời Gian Buổi Giảng / Học Kinh Thánh (Pacing Guide)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {timeline.map((slot, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 mb-1">
                    {slot.time}
                  </span>
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {slot.actionVi}
                  </div>
                  {slot.actionEn && (
                    <div className="text-[11px] text-slate-700 italic mt-0.5">
                      {slot.actionEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussion Questions Section */}
        {discussionQuestions && discussionQuestions.length > 0 && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Câu Hỏi Thảo Luận & Khơi Mở Tương Tác (Discussion Questions)
                </h3>
              </div>
              <button
                onClick={handleCopyQuestions}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50 transition-all cursor-pointer shadow-xs"
              >
                {copiedQuestions ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Đã chép câu hỏi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao Chép Câu Hỏi</span>
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
                      {q.qVi}
                    </div>
                    {q.qEn && (
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
