import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VerseSelector from './components/VerseSelector';
import BilingualVerseCard from './components/BilingualVerseCard';
import AudienceModeSelector from './components/AudienceModeSelector';
import KeyPointsSection from './components/KeyPointsSection';
import TeachingPlanSection from './components/TeachingPlanSection';
import ParablesSection from './components/ParablesSection';
import PulpitModeModal from './components/PulpitModeModal';
import ApiKeyModal from './components/ApiKeyModal';
import SavedNotesDrawer from './components/SavedNotesDrawer';
import { CURATED_PASSAGES } from './data/curatedPassages';
import { generateSermonStudy } from './services/geminiService';
import { Sparkles, AlertCircle, CheckCircle, BookOpen, Heart, ArrowUp } from 'lucide-react';

export default function App() {
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

  // Handle saving passage to notebook
  const handleToggleSavePassage = () => {
    if (isCurrentSaved) {
      setSavedPassages(prev => prev.filter(p => p.id !== currentPassage.id));
      showToast('Đã bỏ lưu khỏi sổ tay.');
    } else {
      setSavedPassages(prev => [currentPassage, ...prev]);
      showToast(`Đã lưu "${currentPassage.referenceVi}" vào sổ tay bài giảng!`);
    }
  };

  const handleDeleteSaved = (id) => {
    setSavedPassages(prev => prev.filter(p => p.id !== id));
    showToast('Đã xóa bài khỏi sổ tay.');
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('shepherd_gemini_key', key);
      showToast('Đã kết nối và lưu khóa Google Gemini thành công!');
    } else {
      localStorage.removeItem('shepherd_gemini_key');
      showToast('Đã xóa khóa API.');
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
        customFocus: customNote
      });

      // Add to custom passages pool and select it
      setCustomPassages(prev => [generatedPassage, ...prev.filter(p => p.referenceVi !== generatedPassage.referenceVi)]);
      setSelectedPassageId(generatedPassage.id);
      showToast(`Đã soạn thành công bài giảng cho "${generatedPassage.referenceVi}"!`);
    } catch (err) {
      console.error(err);
      setGenerationError(err.message || 'Lỗi tạo bài giảng. Vui lòng thử lại hoặc kiểm tra API Key.');
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

      {/* Navbar */}
      <Navbar
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
            Đồng Hành Cùng Mục Sư & Người Giảng Dạy
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Soạn Bài Giảng & Khám Phá Lời Chúa
          </h1>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Chọn câu Kinh Thánh để nhận dàn bài giải kinh sâu sắc, kế hoạch sư phạm trực quan, và các câu chuyện ngụ ngôn thuần Việt chạm đến tấm lòng người nghe.
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
                <strong className="font-bold">Lỗi Soạn Thảo: </strong>
                <span>{generationError}</span>
              </div>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
            >
              Đóng
            </button>
          </div>
        )}

        {/* 1. Scripture Selector (Curated Quick-Select & 66 Books AI Generator) */}
        <VerseSelector
          selectedPassageId={currentPassage.id}
          onSelectPassage={(id) => setSelectedPassageId(id)}
          onGenerateCustomVerse={handleGenerateCustomVerse}
          isGenerating={isGenerating}
          hasApiKey={Boolean(apiKey)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        {/* 2. Bilingual Scripture Text Card (Side-by-side or Tabs, BTT/NVB/BD2011/BPT & NIV/ESV/KJV) */}
        <BilingualVerseCard
          passage={currentPassage}
          onSavePassage={handleToggleSavePassage}
          isSaved={isCurrentSaved}
        />

        {/* 3. Audience Mode Selector (Sunday Sermon, Youth, Small Group) */}
        <AudienceModeSelector
          currentMode={audienceMode}
          onSelectMode={(mode) => setAudienceMode(mode)}
        />

        {/* 4. Exegetical Key Points Section (3 Core Points with Greek/Hebrew nuance & applications) */}
        <KeyPointsSection
          studyPackage={currentStudyPackage}
          audienceMode={audienceMode}
        />

        {/* 5. Teaching & Learning Plan Section (Hook - Book - Look - Took + Timeline + Discussion questions) */}
        <TeachingPlanSection
          studyPackage={currentStudyPackage}
        />

        {/* 6. Authentic Vietnamese Contemporary Parables & Real-life Illustrations */}
        <ParablesSection
          studyPackage={currentStudyPackage}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-700 space-y-2 mt-12 no-print">
        <div className="flex items-center justify-center gap-1.5 font-medium text-slate-800">
          <span>Xây dựng với tâm tình phục vụ Hội Thánh Chúa</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
        <p className="max-w-md mx-auto text-slate-600">
          Hỗ trợ song ngữ Tiếng Việt & Tiếng Anh • Văn phong mục vụ tự nhiên, ấm áp • Tương thích mọi thiết bị di động, máy tính bảng và màn hình bục giảng.
        </p>
      </footer>

      {/* Preacher Pulpit Mode Modal (Fullscreen Prompter with timer) */}
      <PulpitModeModal
        isOpen={isPulpitOpen}
        onClose={() => setIsPulpitOpen(false)}
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
