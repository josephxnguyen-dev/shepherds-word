import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, SlidersHorizontal, Loader2 } from 'lucide-react';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { CURATED_PASSAGES } from '../data/curatedPassages';
import { UI_STRINGS } from '../data/translations';

export default function VerseSelector({
  mainLanguage,
  selectedPassageId,
  onSelectPassage,
  onGenerateCustomVerse,
  isGenerating,
  hasApiKey,
  onOpenApiKeyModal
}) {
  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [testamentFilter, setTestamentFilter] = useState('ALL'); // 'ALL' | 'OT' | 'NT'
  const [selectedBookId, setSelectedBookId] = useState('PHP');
  const [chapter, setChapter] = useState('4');
  const [verseRange, setVerseRange] = useState('6-7');
  const [customPromptNote, setCustomPromptNote] = useState('');
  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);

  // Filter curated passages
  const filteredCurated = CURATED_PASSAGES.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      p.referenceVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.modes.sermon?.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.modes.sermon?.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    if (testamentFilter === 'ALL') return true;
    return b.testament === testamentFilter;
  });

  const selectedBookObj = BIBLE_BOOKS.find((b) => b.id === selectedBookId) || BIBLE_BOOKS[0];

  const handleQuickBookSelect = (bookId) => {
    setSelectedBookId(bookId);
    setChapter('1');
    setVerseRange('1');
  };

  const handleCustomGenerateSubmit = (e) => {
    e.preventDefault();
    const defaultRef = isEnglish 
      ? `${selectedBookObj.nameEn} ${chapter}:${verseRange}`
      : `${selectedBookObj.nameVi} ${chapter}:${verseRange}`;
    
    const query = searchQuery.trim() || defaultRef;
    if (!query) return;

    // Check if it matches an existing curated passage
    const matchedCurated = CURATED_PASSAGES.find((p) => 
      p.referenceVi.toLowerCase() === query.toLowerCase() ||
      p.referenceEn.toLowerCase() === query.toLowerCase() ||
      p.id.toLowerCase() === query.toLowerCase()
    );

    if (matchedCurated) {
      onSelectPassage(matchedCurated.id);
      return;
    }

    // Otherwise generate with AI
    onGenerateCustomVerse(query, customPromptNote);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 mb-6">
      
      {/* Search & Direct AI Generation Header */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between mb-4">
        
        {/* Search Bar */}
        <form onSubmit={handleCustomGenerateSubmit} className="flex-1 relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-28 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 transition-all"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.studyingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.studyBtn}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Advanced Book Picker */}
        <button
          onClick={() => setShowAdvancedPicker(!showAdvancedPicker)}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            showAdvancedPicker 
              ? 'bg-slate-800 text-white border-slate-800' 
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvancedPicker ? t.close66Books : t.toggle66Books}</span>
        </button>

      </div>

      {/* Advanced 66 Books Explorer Dropdown Panel */}
      {showAdvancedPicker && (
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 mb-5 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isEnglish ? "Select Book, Chapter & Verse" : "Chọn Sách, Chương & Câu Cụ Thể"}
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTestamentFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  testamentFilter === 'ALL' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.allBooks}
              </button>
              <button
                type="button"
                onClick={() => setTestamentFilter('OT')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  testamentFilter === 'OT' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.oldTestament}
              </button>
              <button
                type="button"
                onClick={() => setTestamentFilter('NT')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  testamentFilter === 'NT' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.newTestament}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Book Selector */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {t.bookLabel}
              </label>
              <select
                value={selectedBookId}
                onChange={(e) => handleQuickBookSelect(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {filteredBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {isEnglish ? `${b.nameEn} (${b.nameVi})` : `${b.nameVi} (${b.nameEn})`} - {b.chapters} {isEnglish ? "ch." : "chương"}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {t.chapterLabel} (1 - {selectedBookObj.chapters})
              </label>
              <input
                type="number"
                min="1"
                max={selectedBookObj.chapters}
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Verse Range Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                {t.verseLabel}
              </label>
              <input
                type="text"
                value={verseRange}
                onChange={(e) => setVerseRange(e.target.value)}
                placeholder="vd: 16 hoặc 6-7"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Custom Focus Prompt Note */}
          <div className="mt-3">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {t.pastorNoteLabel}
            </label>
            <input
              type="text"
              value={customPromptNote}
              onChange={(e) => setCustomPromptNote(e.target.value)}
              placeholder={t.pastorNotePlaceholder}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              {t.selectedPassagePrefix} <strong className="text-amber-800">
                {isEnglish ? `${selectedBookObj.nameEn} ${chapter}:${verseRange}` : `${selectedBookObj.nameVi} ${chapter}:${verseRange}`}
              </strong> ({isEnglish ? `${selectedBookObj.nameVi} ${chapter}:${verseRange}` : `${selectedBookObj.nameEn} ${chapter}:${verseRange}`})
            </span>
            <button
              type="button"
              onClick={handleCustomGenerateSubmit}
              disabled={isGenerating}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.studyingBtn}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.openOutlineBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Curated Pre-Loaded Bible Verses (Instant - No API Key Needed) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            {t.curatedTitle}
          </span>
          <span className="text-[11px] text-slate-700">
            {CURATED_PASSAGES.length} {t.curatedSubtitle}
          </span>
        </div>

        {/* Quick Verses Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CURATED_PASSAGES.map((passage) => {
            const isSelected = selectedPassageId === passage.id;
            return (
              <button
                key={passage.id}
                onClick={() => onSelectPassage(passage.id)}
                className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-700 bg-amber-100/90 shadow-sm ring-1 ring-amber-700/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-serif font-bold text-slate-900 flex items-center justify-between">
                    <span>{isEnglish ? passage.referenceEn : passage.referenceVi}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium truncate">
                    {isEnglish ? passage.referenceVi : passage.referenceEn}
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-amber-900 font-semibold truncate">
                  {isEnglish ? passage.categoryLabelEn : passage.categoryLabelVi}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
