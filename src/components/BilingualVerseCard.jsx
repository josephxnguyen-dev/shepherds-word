import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Columns, 
  Split, 
  Info, 
  BookmarkCheck, 
  Sparkles 
} from 'lucide-react';
import { UI_STRINGS } from '../data/translations';

export default function BilingualVerseCard({
  mainLanguage,
  passage,
  onSavePassage,
  isSaved
}) {
  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';

  const [viTranslation, setViTranslation] = useState('BTT');
  const [enTranslation, setEnTranslation] = useState('NIV');
  const [viewLayout, setViewLayout] = useState(mainLanguage === 'bilingual' ? 'sideBySide' : 'tabs');
  const [activeTab, setActiveTab] = useState(mainLanguage === 'en' ? 'en' : 'vi');
  const [copied, setCopied] = useState(false);
  const [showContext, setShowContext] = useState(true);

  if (!passage) return null;

  const viText = passage.translations?.vi?.[viTranslation] || 
                 passage.translations?.vi?.BTT || 
                 passage.translations?.vi?.NVB || 
                 'Đang tải bản văn tiếng Việt...';

  const enText = passage.translations?.en?.[enTranslation] || 
                 passage.translations?.en?.NIV || 
                 passage.translations?.en?.ESV || 
                 'Loading English Scripture text...';

  const handleCopyVerse = () => {
    const textToCopy = `[${passage.referenceEn} - ${enTranslation}]\n"${enText}"\n\n[${passage.referenceVi} - ${viTranslation}]\n"${viText}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6">
      
      {/* Top Action Bar */}
      <div className="bg-slate-50/90 px-4 sm:px-6 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        
        {/* Reference Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif font-bold text-lg text-slate-900">
            {isEnglish ? passage.referenceEn : passage.referenceVi}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-sm font-medium text-slate-600">
            {isEnglish ? passage.referenceVi : passage.referenceEn}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
            {isEnglish ? passage.categoryLabelEn : passage.categoryLabelVi}
          </span>
          {passage.isAiGenerated && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isEnglish ? "AI Generated" : "Soạn bởi AI"}
            </span>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Layout */}
          <div className="hidden sm:flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewLayout('sideBySide')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all cursor-pointer ${
                viewLayout === 'sideBySide' 
                  ? 'bg-slate-800 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{t.sideBySide}</span>
            </button>
            <button
              onClick={() => setViewLayout('tabs')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all cursor-pointer ${
                viewLayout === 'tabs' 
                  ? 'bg-slate-800 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{t.tabbed}</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyVerse}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-all active:scale-95 text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="Copy scripture text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline text-emerald-600">{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.copyScripture}</span>
              </>
            )}
          </button>

          {/* Save to Notebook */}
          <button
            onClick={onSavePassage}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Save to sermon notebook"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isSaved ? t.savedToNotebook : t.saveToNotebook}</span>
          </button>
        </div>

      </div>

      {/* Main Scripture Display Area */}
      <div className="p-5 sm:p-6">
        
        {/* If Tabs layout */}
        {viewLayout === 'tabs' && (
          <div className="flex border-b border-slate-200 mb-4">
            <button
              onClick={() => setActiveTab('en')}
              className={`pb-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'en'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              English ({enTranslation})
            </button>
            <button
              onClick={() => setActiveTab('vi')}
              className={`pb-2 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'vi'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tiếng Việt ({viTranslation})
            </button>
          </div>
        )}

        {/* Side by side or tabbed container */}
        <div className={`grid gap-6 ${
          viewLayout === 'sideBySide' ? 'grid-cols-1 md:grid-cols-2 md:divide-x md:divide-slate-200' : 'grid-cols-1'
        }`}>
          
          {/* English Column (rendered first if English mode or side by side) */}
          {(viewLayout === 'sideBySide' || activeTab === 'en') && (
            <div className={`flex flex-col justify-between ${viewLayout === 'sideBySide' && !isEnglish ? 'order-2 md:pl-6' : 'order-1'}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    English Translation
                  </span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'NIV', label: 'NIV' },
                      { id: 'ESV', label: 'ESV' },
                      { id: 'KJV', label: 'KJV' }
                    ].map((trans) => (
                      <button
                        key={trans.id}
                        onClick={() => setEnTranslation(trans.id)}
                        className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                          enTranslation === trans.id
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {trans.label}
                      </button>
                    ))}
                  </div>
                </div>

                <blockquote className="font-serif text-lg sm:text-xl text-slate-900 leading-relaxed tracking-normal italic pl-4 border-l-4 border-slate-700 py-1">
                  "{enText}"
                </blockquote>
              </div>

              <div className="mt-3 text-right">
                <span className="text-xs font-semibold text-slate-600">
                  — {passage.referenceEn} ({enTranslation})
                </span>
              </div>
            </div>
          )}

          {/* Vietnamese Column */}
          {(viewLayout === 'sideBySide' || activeTab === 'vi') && (
            <div className={`flex flex-col justify-between ${viewLayout === 'sideBySide' && isEnglish ? 'order-2 md:pl-6' : 'order-1'}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Bản Dịch Tiếng Việt (Vietnamese)
                  </span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'BTT', label: 'BTT 1925' },
                      { id: 'NVB', label: 'Bản Mới' },
                      { id: 'BD2011', label: 'BD2011' },
                      { id: 'BPT', label: 'Phổ Thông' }
                    ].map((trans) => (
                      <button
                        key={trans.id}
                        onClick={() => setViTranslation(trans.id)}
                        className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                          viTranslation === trans.id
                            ? 'bg-amber-700 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {trans.label}
                      </button>
                    ))}
                  </div>
                </div>

                <blockquote className="font-serif text-lg sm:text-xl text-slate-900 leading-relaxed tracking-normal italic pl-4 border-l-4 border-amber-600 py-1">
                  "{viText}"
                </blockquote>
              </div>

              <div className="mt-3 text-right">
                <span className="text-xs font-semibold text-slate-600">
                  — {passage.referenceVi} ({viTranslation})
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Historical & Theological Context Accordion */}
        {passage.context && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowContext(!showContext)}
              className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 mb-2 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                {t.contextTitle}
              </span>
              <span className="text-xs text-amber-800 font-semibold">
                {showContext ? t.hideContext : t.showContext}
              </span>
            </button>

            {showContext && (
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-700 space-y-2 animate-in fade-in duration-200">
                {isEnglish ? (
                  <>
                    <div className="flex gap-2">
                      <span className="font-bold text-slate-900 shrink-0">Context (EN):</span>
                      <p className="leading-relaxed text-slate-800">{passage.context.en}</p>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                      <span className="font-bold text-amber-900 shrink-0">Bối cảnh (VI):</span>
                      <p className="leading-relaxed text-slate-700 italic">{passage.context.vi}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <span className="font-bold text-amber-900 shrink-0">Bối cảnh (VI):</span>
                      <p className="leading-relaxed text-slate-800">{passage.context.vi}</p>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                      <span className="font-bold text-slate-700 shrink-0">Context (EN):</span>
                      <p className="leading-relaxed text-slate-700 italic">{passage.context.en}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
