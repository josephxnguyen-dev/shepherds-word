import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Maximize2, 
  Key, 
  Bookmark, 
  Printer, 
  Share2, 
  Languages 
} from 'lucide-react';

export default function Navbar({
  onOpenPulpitMode,
  onOpenApiKeyModal,
  onOpenSavedDrawer,
  hasApiKey,
  savedCount,
  onPrint
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-700 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/10">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Mục Vụ Lời Chúa
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Shepherd's Word
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block">
                Hệ Thống Soạn Bài Giảng & Nghiên Cứu Kinh Thánh Song Ngữ Tự Nhiên
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Pulpit Mode */}
            <button
              onClick={onOpenPulpitMode}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 border border-slate-300 transition-all duration-200 active:scale-95 shadow-xs"
              title="Chế độ toàn màn hình cho bục giảng với đồng hồ bấm giờ"
            >
              <Maximize2 className="w-4 h-4 text-amber-700" />
              <span className="hidden md:inline">Bục Giảng</span>
            </button>

            {/* Print / Export */}
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all active:scale-95 shadow-xs"
              title="In tài liệu hoặc xuất PDF"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">In / PDF</span>
            </button>

            {/* Saved Outlines */}
            <button
              onClick={onOpenSavedDrawer}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all active:scale-95 shadow-xs"
              title="Sổ tay lưu bài giảng"
            >
              <Bookmark className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Sổ Tay</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-amber-700 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* AI Key Settings */}
            <button
              onClick={onOpenApiKeyModal}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 shadow-xs border ${
                hasApiKey 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
              }`}
              title="Cài đặt Google Gemini API Key"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">
                {hasApiKey ? 'Gemini AI: Sẵn Sàng' : 'Kết Nối AI Key'}
              </span>
              <span className="sm:hidden">AI</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
