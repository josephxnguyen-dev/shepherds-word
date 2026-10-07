import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Quote, 
  BookHeart, 
  Globe 
} from 'lucide-react';
import { UI_STRINGS } from '../data/translations';

export default function ParablesSection({ mainLanguage, studyPackage }) {
  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';
  const isBilingual = mainLanguage === 'bilingual';

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [langView, setLangView] = useState(mainLanguage === 'en' ? 'en' : mainLanguage === 'vi' ? 'vi' : 'bilingual');

  if (!studyPackage?.parables || studyPackage.parables.length === 0) return null;

  const parables = studyPackage.parables;

  const handleCopyStory = (parable, idx) => {
    let text = '';
    if (langView === 'en' || (langView === 'bilingual' && isEnglish)) {
      text = `[ILLUSTRATION]: ${parable.titleEn || parable.titleVi}\n\n${parable.storyEn || parable.storyVi}\n\n[PASTORAL BRIDGE]:\n${parable.pastoralBridgeEn || parable.pastoralBridgeVi || ''}`;
    } else {
      text = `[MINH HỌA]: ${parable.titleVi} (${parable.titleEn})\n\n${parable.storyVi}\n\n[LỜI KẾT NỐI MỤC VỤ]:\n${parable.pastoralBridgeVi || ''}`;
    }
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
              {t.parablesTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-sans font-medium">
                {isEnglish ? "Heart-Touching Illustrations" : "Văn Phong Thuần Việt Tự Nhiên"}
              </span>
            </h2>
            <p className="text-xs text-slate-700">
              {t.parablesSubtitle}
            </p>
          </div>
        </div>

        {/* Story View Selector */}
        <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setLangView('en')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              langView === 'en' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLangView('bilingual')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              langView === 'bilingual' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Song Ngữ
          </button>
          <button
            onClick={() => setLangView('vi')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              langView === 'vi' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Tiếng Việt
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
                      {isEnglish ? (parable.titleEn || parable.titleVi) : parable.titleVi}
                    </h3>
                    <p className="text-xs text-slate-700 italic">
                      {isEnglish ? parable.titleVi : parable.titleEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyStory(parable, idx)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer"
                  title="Copy illustration story"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline text-emerald-600">{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.copyStory}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Story Content */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* English Story (if English or Bilingual selected) */}
                {(langView === 'en' || langView === 'bilingual') && parable.storyEn && (
                  <div>
                    {langView === 'bilingual' && (
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md mb-2">
                        English Story Adaptation
                      </span>
                    )}
                    <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif whitespace-pre-line space-y-3 pl-3 border-l-2 border-indigo-400">
                      {parable.storyEn}
                    </div>
                  </div>
                )}

                {/* Vietnamese Story (if Vietnamese or Bilingual selected) */}
                {(langView === 'vi' || langView === 'bilingual') && (
                  <div className={langView === 'bilingual' ? 'pt-4 border-t border-slate-100' : ''}>
                    {langView === 'bilingual' && (
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md mb-2">
                        Bản Tiếng Việt Cho Mục Sư / Phụ Thân Giảng (Natural Vietnamese)
                      </span>
                    )}
                    <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif whitespace-pre-line space-y-3 pl-3 border-l-2 border-emerald-400">
                      {parable.storyVi}
                    </div>
                  </div>
                )}

                {/* Pastoral Bridge */}
                {(parable.pastoralBridgeEn || parable.pastoralBridgeVi) && (
                  <div className="bg-amber-50/70 rounded-xl p-3.5 sm:p-4 border border-amber-200/80 flex items-start gap-3 mt-4">
                    <Quote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                        {t.pastoralBridgeLabel}
                      </span>
                      {isEnglish && parable.pastoralBridgeEn ? (
                        <>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                            {parable.pastoralBridgeEn}
                          </p>
                          {parable.pastoralBridgeVi && (
                            <p className="text-xs text-slate-700 italic mt-1">
                              Tiếng Việt: "{parable.pastoralBridgeVi}"
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                            {parable.pastoralBridgeVi}
                          </p>
                          {parable.pastoralBridgeEn && (
                            <p className="text-xs text-slate-700 italic mt-1">
                              English: "{parable.pastoralBridgeEn}"
                            </p>
                          )}
                        </>
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
