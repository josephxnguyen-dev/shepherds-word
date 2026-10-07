import React, { useState } from 'react';
import { 
  Compass, 
  Copy, 
  Check, 
  Lightbulb, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function KeyPointsSection({ studyPackage, audienceMode }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null); // all expanded by default if null

  if (!studyPackage) return null;

  const keyPoints = studyPackage.keyPoints || [];

  const handleCopySinglePoint = (point, idx) => {
    const text = `${point.pointVi} (${point.pointEn})\n\n[Giải Nghĩa / Exegesis]:\n${point.exegesisVi}\n\n[Áp Dụng / Application]:\n${point.applicationVi}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllPoints = () => {
    const text = `CHỦ ĐỀ: ${studyPackage.titleVi} (${studyPackage.titleEn})\n\nTRỌNG TÂM: ${studyPackage.themeVi}\n\n` +
      keyPoints.map((p, i) => 
        `ĐIỂM ${i + 1}: ${p.pointVi} / ${p.pointEn}\n- Giải nghĩa: ${p.exegesisVi}\n- Áp dụng: ${p.applicationVi}\n`
      ).join('\n');
    
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="bg-slate-50/90 px-4 sm:px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900">
              Điểm Then Chốt & Dàn Bài Giải Kinh (Key Points & Exegesis)
            </h2>
            <p className="text-xs text-slate-700">
              Phân tích ngữ nghĩa nguyên bản, giải thích thần học và áp dụng mục vụ
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAllPoints}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          {allCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Đã chép toàn bộ</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Chép Toàn Bộ Dàn Bài</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 sm:p-6">
        
        {/* Sermon Title & Overarching Theme Banner */}
        <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 rounded-xl p-4 sm:p-5 border border-amber-200/60 mb-6">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
            Đề Mục Gợi Ý (Sermon Title)
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-950 mb-1">
            {studyPackage.titleVi}
          </h3>
          <div className="text-xs sm:text-sm font-medium text-amber-900/90 mb-3 italic">
            "{studyPackage.titleEn}"
          </div>

          <div className="pt-3 border-t border-amber-200/60 flex items-start gap-2 text-xs sm:text-sm text-slate-800">
            <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950">Trọng tâm sứ điệp: </strong>
              <span className="leading-relaxed">{studyPackage.themeVi}</span>
              {studyPackage.themeEn && (
                <p className="text-xs text-slate-700 mt-0.5 italic">{studyPackage.themeEn}</p>
              )}
            </div>
          </div>
        </div>

        {/* 3 Key Points Accordion/Cards */}
        <div className="space-y-4">
          {keyPoints.map((point, index) => {
            const isCopied = copiedIndex === index;

            return (
              <div 
                key={index}
                className="rounded-xl border border-slate-200 bg-white hover:border-amber-300/80 transition-all duration-200 overflow-hidden shadow-xs"
              >
                {/* Point Header Bar */}
                <div className="bg-slate-50/70 p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug">
                        {point.pointVi}
                      </h4>
                      <p className="text-xs font-medium text-slate-700 italic mt-0.5">
                        {point.pointEn}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopySinglePoint(point, index)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-all text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Sao chép điểm này"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Exegesis & Application Content */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* Exegesis (Giải nghĩa) */}
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md mb-2">
                      Giải Nghĩa Thần Học & Bản Văn (Exegesis)
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed pl-3 border-l-2 border-amber-300">
                      {point.exegesisVi}
                    </p>
                    {point.exegesisEn && (
                      <p className="text-xs text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200 mt-2 italic">
                        {point.exegesisEn}
                      </p>
                    )}
                  </div>

                  {/* Real-world Pastoral Application (Áp dụng) */}
                  <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md mb-1.5">
                      Áp Dụng Thực Tiễn Vào Đời Sống (Life Application)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                      👉 {point.applicationVi}
                    </p>
                    {point.applicationEn && (
                      <p className="text-xs text-slate-700 leading-relaxed mt-1 italic pl-4">
                        {point.applicationEn}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
