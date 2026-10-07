import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Copy, 
  Check, 
  Sparkles, 
  Quote, 
  BookHeart, 
  Volume2, 
  Languages 
} from 'lucide-react';

export default function ParablesSection({ studyPackage }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [langView, setLangView] = useState('bilingual'); // 'vi' | 'en' | 'bilingual'

  if (!studyPackage?.parables || studyPackage.parables.length === 0) return null;

  const parables = studyPackage.parables;

  const handleCopyStory = (parable, idx) => {
    const text = `[MINH HỌA]: ${parable.titleVi} (${parable.titleEn})\n\n${parable.storyVi}\n\n[LỜI KẾT NỐI MỤC VỤ]:\n${parable.pastoralBridgeVi || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      
      {/* Header */}
      <div className="bg-slate-50/90 px-4 sm:px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
            <BookHeart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              Truyện Ngụ Ngôn & Minh Họa Đời Sống (Contemporary Parables)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-sans font-medium">
                Văn Phong Thuần Việt Tự Nhiên
              </span>
            </h2>
            <p className="text-xs text-slate-700">
              Những câu chuyện chạm đến trái tim người nghe, không dịch máy, gắn kết trực tiếp với câu Kinh Thánh
            </p>
          </div>
        </div>

        {/* Language View Switcher */}
        <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setLangView('vi')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              langView === 'vi' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setLangView('bilingual')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              langView === 'bilingual' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Song Ngữ
          </button>
          <button
            onClick={() => setLangView('en')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              langView === 'en' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {parables.map((parable, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div 
              key={idx}
              className="rounded-xl border border-slate-200 bg-white hover:border-amber-300/80 transition-all duration-200 overflow-hidden shadow-xs"
            >
              {/* Parable Title Bar */}
              <div className="bg-gradient-to-r from-emerald-50/60 to-slate-50/60 p-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                      {parable.titleVi}
                    </h3>
                    {parable.titleEn && (
                      <p className="text-xs text-slate-700 italic">
                        {parable.titleEn}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyStory(parable, idx)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer"
                  title="Sao chép câu chuyện này"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline text-emerald-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Chép Câu Chuyện</span>
                    </>
                  )}
                </button>
              </div>

              {/* Story Content */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Vietnamese Story */}
                {(langView === 'vi' || langView === 'bilingual') && (
                  <div>
                    {langView === 'bilingual' && (
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md mb-2">
                        Bản Tiếng Việt (Văn Phong Gần Gũi Đời Thường)
                      </span>
                    )}
                    <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif whitespace-pre-line space-y-3 pl-3 border-l-2 border-emerald-400">
                      {parable.storyVi}
                    </div>
                  </div>
                )}

                {/* English Story */}
                {(langView === 'en' || langView === 'bilingual') && parable.storyEn && (
                  <div className={langView === 'bilingual' ? 'pt-4 border-t border-slate-100' : ''}>
                    {langView === 'bilingual' && (
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md mb-2">
                        English Story Adaptation
                      </span>
                    )}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line space-y-2 italic pl-3 border-l-2 border-slate-300">
                      {parable.storyEn}
                    </div>
                  </div>
                )}

                {/* Pastoral Bridge (Lời chuyển ý của mục sư trên bục giảng) */}
                {parable.pastoralBridgeVi && (
                  <div className="bg-amber-50/70 rounded-xl p-3.5 sm:p-4 border border-amber-200/80 flex items-start gap-3 mt-4">
                    <Quote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                        Lời Nối Mục Vụ Trên Bục Giảng (Pastoral Pulpit Bridge)
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                        {parable.pastoralBridgeVi}
                      </p>
                      {parable.pastoralBridgeEn && (
                        <p className="text-xs text-slate-700 italic mt-1">
                          {parable.pastoralBridgeEn}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
