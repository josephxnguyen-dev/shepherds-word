import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VerseSelector from './components/VerseSelector';
import BilingualVerseCard from './components/BilingualVerseCard';
import AudienceModeSelector from './components/AudienceModeSelector';
import LessonLengthSelector from './components/LessonLengthSelector';
import KeyPointsSection from './components/KeyPointsSection';
import TeachingPlanSection from './components/TeachingPlanSection';
import ParablesSection from './components/ParablesSection';
import PulpitModeModal from './components/PulpitModeModal';
import ApiKeyModal from './components/ApiKeyModal';
import SavedNotesDrawer from './components/SavedNotesDrawer';
import { CURATED_PASSAGES } from './data/curatedPassages';
import { generateSermonStudy } from './services/geminiService';
import { UI_STRINGS } from './data/translations';
import { Sparkles, AlertCircle, CheckCircle, Heart } from 'lucide-react';

export default function App() {
  // Main language state: 'en' (English) | 'vi' (Vietnamese) | 'bilingual' (Dual)
  const [mainLanguage, setMainLanguage] = useState(() => {
    return localStorage.getItem('shepherd_main_language') || 'en';
  });

  // Lesson length duration: 'short' (15m) | 'medium' (30-45m) | 'long' (60+m)
  const [lessonLength, setLessonLength] = useState(() => {
    return localStorage.getItem('shepherd_lesson_length') || 'medium';
  });

  const [selectedPassageId, setSelectedPassageId] = useState('php-4-6-7');
  const [audienceMode, setAudienceMode] = useState('sermon'); // 'sermon' | 'youth' | 'smallGroup'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('shepherd_gemini_key') || '');
  
  const [customPassages, setCustomPassages] = useState(() => {
    try {
      const stored = localStorage.getItem('shepherd_custom_passages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedPassages, setSavedPassages] = useState(() => {
    try {
      const stored = localStorage.getItem('shepherd_saved_passages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isPulpitOpen, setIsPulpitOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Persist main language
  const handleSetMainLanguage = (lang) => {
    setMainLanguage(lang);
    localStorage.setItem('shepherd_main_language', lang);
    showToast(
      lang === 'en' 
        ? 'Switched full app to English Mode' 
        : lang === 'bilingual' 
        ? 'Switched to Bilingual / Dual Mode' 
        : 'Đã chuyển sang Chế độ Tiếng Việt'
    );
  };

  // Persist lesson length
  const handleSelectLessonLength = (len) => {
    setLessonLength(len);
    localStorage.setItem('shepherd_lesson_length', len);
    const label = len === 'short' ? '15 Mins (~15p)' : len === 'long' ? '60+ Mins (>1h)' : '30-45 Mins';
    showToast(
      mainLanguage === 'en' 
        ? `Adjusted lesson plan to ${label}` 
        : `Đã chỉnh thời lượng bài giảng sang ${label}`
    );
  };

  // Save custom passages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shepherd_custom_passages', JSON.stringify(customPassages));
    } catch (e) {
      console.error('Failed to save custom passages', e);
    }
  }, [customPassages]);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shepherd_saved_passages', JSON.stringify(savedPassages));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [savedPassages]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Resolve active passage
  const allPassages = [...CURATED_PASSAGES, ...customPassages];
  const currentPassage = allPassages.find(p => p.id === selectedPassageId) || CURATED_PASSAGES[0];

  // Resolve study package for active audience mode
  const currentStudyPackage = 
    currentPassage.modes?.[audienceMode] || 
    currentPassage.modes?.sermon || 
    currentPassage.rawStudyPackage;

  const isCurrentSaved = savedPassages.some(p => p.id === currentPassage.id);

  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';

  // Handle saving passage to notebook
  const handleToggleSavePassage = () => {
    if (isCurrentSaved) {
      setSavedPassages(prev => prev.filter(p => p.id !== currentPassage.id));
      showToast(isEnglish ? 'Removed from notebook.' : 'Đã bỏ lưu khỏi sổ tay.');
    } else {
      setSavedPassages(prev => [currentPassage, ...prev]);
      showToast(
        isEnglish 
          ? `Saved "${currentPassage.referenceEn}" to notebook!`
          : `Đã lưu "${currentPassage.referenceVi}" vào sổ tay bài giảng!`
      );
    }
  };

  const handleDeleteSaved = (id) => {
    setSavedPassages(prev => prev.filter(p => p.id !== id));
    showToast(isEnglish ? 'Deleted outline from notebook.' : 'Đã xóa bài khỏi sổ tay.');
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('shepherd_gemini_key', key);
      showToast(isEnglish ? 'Connected and saved Google Gemini API key!' : 'Đã kết nối và lưu khóa Google Gemini thành công!');
    } else {
      localStorage.removeItem('shepherd_gemini_key');
      showToast(isEnglish ? 'Cleared API key.' : 'Đã xóa khóa API.');
    }
  };

  // Handle dynamic AI generation for any verse
  const handleGenerateCustomVerse = async (verseReference, customNote) => {
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const generatedPassage = await generateSermonStudy({
        apiKey,
        verseReference,
        audienceMode,
        lessonLength,
        customFocus: customNote
      });

      // Add to custom passages pool and select it
      setCustomPassages(prev => [generatedPassage, ...prev.filter(p => p.referenceVi !== generatedPassage.referenceVi)]);
      setSelectedPassageId(generatedPassage.id);
      showToast(
        isEnglish 
          ? `Successfully generated outline for "${generatedPassage.referenceEn || verseReference}"!`
          : `Đã soạn thành công bài giảng cho "${generatedPassage.referenceVi}"!`
      );
    } catch (err) {
      console.error(err);
      setGenerationError(err.message || 'Error generating study. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar with Language Toggle */}
      <Navbar
        mainLanguage={mainLanguage}
        onChangeMainLanguage={handleSetMainLanguage}
        onOpenPulpitMode={() => setIsPulpitOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        hasApiKey={Boolean(apiKey)}
        savedCount={savedPassages.length}
        onPrint={handlePrint}
      />

      {/* Hero Sub-header */}
      <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-100 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            {t.heroBadge}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            {t.heroHeading}
          </h1>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>
        </div>
      </div>

      {/* Main App Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        
        {/* Error Alert if AI generation failed */}
        {generationError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-6 flex items-start justify-between gap-3 text-sm animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">{isEnglish ? "Generation Error: " : "Lỗi Soạn Thảo: "}</strong>
                <span>{generationError}</span>
              </div>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
            >
              {isEnglish ? "Dismiss" : "Đóng"}
            </button>
          </div>
        )}

        {/* 1. Scripture Selector */}
        <VerseSelector
          mainLanguage={mainLanguage}
          selectedPassageId={currentPassage.id}
          onSelectPassage={(id) => setSelectedPassageId(id)}
          onGenerateCustomVerse={handleGenerateCustomVerse}
          isGenerating={isGenerating}
          hasApiKey={Boolean(apiKey)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        {/* 2. Bilingual Scripture Text Card */}
        <BilingualVerseCard
          mainLanguage={mainLanguage}
          passage={currentPassage}
          onSavePassage={handleToggleSavePassage}
          isSaved={isCurrentSaved}
        />

        {/* 3. Audience Mode Selector */}
        <AudienceModeSelector
          mainLanguage={mainLanguage}
          currentMode={audienceMode}
          onSelectMode={(mode) => setAudienceMode(mode)}
        />

        {/* 4. Lesson Length / Duration Selector (Short 15m, Med 30-45m, Long 60+m) */}
        <LessonLengthSelector
          mainLanguage={mainLanguage}
          lessonLength={lessonLength}
          onSelectLessonLength={handleSelectLessonLength}
        />

        {/* 5. Exegetical Key Points Section */}
        <KeyPointsSection
          mainLanguage={mainLanguage}
          studyPackage={currentStudyPackage}
          audienceMode={audienceMode}
        />

        {/* 6. Teaching & Learning Plan Section (Scaled with lessonLength) */}
        <TeachingPlanSection
          mainLanguage={mainLanguage}
          studyPackage={currentStudyPackage}
          lessonLength={lessonLength}
        />

        {/* 7. Authentic Parables & Real-life Illustrations */}
        <ParablesSection
          mainLanguage={mainLanguage}
          studyPackage={currentStudyPackage}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-700 space-y-2 mt-12 no-print">
        <div className="flex items-center justify-center gap-1.5 font-medium text-slate-800">
          <span>{t.footerHeart}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
        <p className="max-w-md mx-auto text-slate-600">
          {t.footerDetails}
        </p>
      </footer>

      {/* Preacher Pulpit Mode Modal */}
      <PulpitModeModal
        isOpen={isPulpitOpen}
        onClose={() => setIsPulpitOpen(false)}
        mainLanguage={mainLanguage}
        lessonLength={lessonLength}
        passage={currentPassage}
        audienceMode={audienceMode}
        studyPackage={currentStudyPackage}
      />

      {/* Google Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Saved Sermon Notes Drawer */}
      <SavedNotesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPassages={savedPassages}
        onSelectPassage={(id) => setSelectedPassageId(id)}
        onDeleteSavedPassage={handleDeleteSaved}
        currentPassageId={currentPassage.id}
      />

    </div>
  );
}
