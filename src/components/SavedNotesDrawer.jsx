import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Download, 
  FileText, 
  Calendar 
} from 'lucide-react';

export default function SavedNotesDrawer({
  isOpen,
  onClose,
  savedPassages,
  onSelectPassage,
  onDeleteSavedPassage,
  currentPassageId
}) {
  if (!isOpen) return null;

  const handleExportAllMarkdown = () => {
    if (savedPassages.length === 0) return;

    let md = `# SỔ TAY BÀI GIẢNG & LỜI CHÚA (SHEPHERD'S WORD NOTEBOOK)\n*Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}*\n\n---\n\n`;

    savedPassages.forEach((p, idx) => {
      const modeKey = Object.keys(p.modes || {})[0] || 'sermon';
      const pkg = p.modes?.[modeKey];

      md += `## ${idx + 1}. ${p.referenceVi} (${p.referenceEn})\n`;
      md += `**Chủ đề**: ${pkg?.titleVi || ''} - *${pkg?.titleEn || ''}*\n\n`;
      md += `> "${p.translations?.vi?.BTT || p.translations?.vi?.NVB || ''}"\n\n`;
      md += `### Điểm Then Chốt:\n`;
      pkg?.keyPoints?.forEach((pt, pIdx) => {
        md += `${pIdx + 1}. **${pt.pointVi}**\n   - Giải nghĩa: ${pt.exegesisVi}\n   - Áp dụng: ${pt.applicationVi}\n`;
      });
      md += `\n### Minh Họa Đời Sống:\n`;
      pkg?.parables?.forEach((pb) => {
        md += `#### ${pb.titleVi}\n${pb.storyVi}\n\n`;
      });
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Muc-Vu-Loi-Chua-So-Tay-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-slate-900">
                  Sổ Tay Bài Giảng Đã Lưu
                </h2>
                <p className="text-xs text-slate-500">
                  {savedPassages.length} bài giảng trong kho lưu trữ
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {savedPassages.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700 mb-1">
                  Chưa Có Bài Giảng Nào Được Lưu
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Hãy nhấn nút "Lưu Sổ Tay" trên bất kỳ câu Kinh Thánh nào để dễ dàng tra cứu lại khi đứng trên bục giảng.
                </p>
              </div>
            ) : (
              savedPassages.map((item) => {
                const isCurrent = item.id === currentPassageId;
                const modeKey = Object.keys(item.modes || {})[0] || 'sermon';
                const pkg = item.modes?.[modeKey];

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/50'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-serif font-bold text-sm text-slate-900">
                          {item.referenceVi}
                        </span>
                        <span className="text-xs text-slate-500 ml-1.5">
                          ({item.referenceEn})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDeleteSavedPassage(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Xóa bài này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-amber-800 line-clamp-1 mb-1">
                      {pkg?.titleVi || 'Bài Giảng Đã Lưu'}
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 italic mb-3">
                      "{item.translations?.vi?.BTT || item.translations?.vi?.NVB || ''}"
                    </p>

                    <button
                      onClick={() => {
                        onSelectPassage(item.id);
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Mở Dàn Bài Này</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {savedPassages.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleExportAllMarkdown}
                className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Xuất Tất Cả Ra File Markdown (.md)</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
