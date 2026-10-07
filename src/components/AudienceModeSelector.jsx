import React from 'react';
import { Church, Flame, Users, Sparkles } from 'lucide-react';

export default function AudienceModeSelector({ currentMode, onSelectMode }) {
  const modes = [
    {
      id: 'sermon',
      icon: Church,
      titleVi: 'Giảng Luận Chúa Nhật',
      titleEn: 'Sunday Sermon',
      badgeVi: 'Hội Thánh',
      badgeEn: 'Congregation',
      descVi: 'Bố cục bài giảng sâu nhiệm, văn phong mục vụ trang trọng, kêu gọi ăn năn và biến đổi tâm linh.',
      color: 'amber'
    },
    {
      id: 'youth',
      icon: Flame,
      titleVi: 'Giới Trẻ & Thanh Niên',
      titleEn: 'Youth & Young Adults',
      badgeVi: 'Thanh Thiếu Niên',
      badgeEn: 'Youth Ministry',
      descVi: 'Văn phong trẻ trung, hiện đại, giải tỏa áp lực học tập, sự nghiệp, overthinking và đời sống số.',
      color: 'indigo'
    },
    {
      id: 'smallGroup',
      icon: Users,
      titleVi: 'Nhóm Nhỏ & Tế Bào',
      titleEn: 'Small Group & Cell',
      badgeVi: 'Thông Công',
      badgeEn: 'Fellowship',
      descVi: 'Không gian ấm cúng, câu hỏi tương tác bộc bạch lòng mình, đồng hành và cầu thay gắn bó.',
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            Đối Tượng Mục Vụ (Audience Mode)
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            Lựa chọn bối cảnh để hệ thống tự động tinh chỉnh dàn bài, ngôn ngữ và các câu chuyện minh họa phù hợp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-700 bg-amber-50/60 shadow-sm ring-1 ring-amber-700/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-amber-200/80 text-amber-950 font-medium'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {mode.badgeVi}
                  </span>
                </div>

                <div className="font-serif font-bold text-slate-900 text-base">
                  {mode.titleVi}
                </div>
                <div className="text-xs text-slate-700 font-medium mb-1.5">
                  {mode.titleEn}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {mode.descVi}
                </p>
              </div>

              {isSelected && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse"></span>
                  Đang Kích Hoạt
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
