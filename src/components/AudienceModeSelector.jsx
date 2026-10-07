import React from 'react';
import { Church, Flame, Users, Sparkles } from 'lucide-react';
import { UI_STRINGS } from '../data/translations';

export default function AudienceModeSelector({ mainLanguage, currentMode, onSelectMode }) {
  const t = UI_STRINGS[mainLanguage === 'en' ? 'en' : 'vi'];
  const isEnglish = mainLanguage === 'en';

  const modes = [
    {
      id: 'sermon',
      icon: Church,
      title: isEnglish ? 'Sunday Sermon' : 'Giảng Luận Chúa Nhật',
      secondaryTitle: isEnglish ? 'Giảng Luận Chúa Nhật' : 'Sunday Sermon',
      badge: isEnglish ? 'Congregation' : 'Hội Thánh',
      desc: isEnglish 
        ? 'Homiletic structure, pastoral theological depth, warm congregational exhortation, calling to renewal.'
        : 'Bố cục bài giảng sâu nhiệm, văn phong mục vụ trang trọng, kêu gọi ăn năn và biến đổi tâm linh.'
    },
    {
      id: 'youth',
      icon: Flame,
      title: isEnglish ? 'Youth & Young Adults' : 'Giới Trẻ & Thanh Niên',
      secondaryTitle: isEnglish ? 'Giới Trẻ & Thanh Niên' : 'Youth & Young Adults',
      badge: isEnglish ? 'Youth Ministry' : 'Thanh Thiếu Niên',
      desc: isEnglish
        ? 'Vibrant, relatable language addressing digital burnout, peer pressure, overthinking, career and identity.'
        : 'Văn phong trẻ trung, hiện đại, giải tỏa áp lực học tập, sự nghiệp, overthinking và đời sống số.'
    },
    {
      id: 'smallGroup',
      icon: Users,
      title: isEnglish ? 'Small Group & Cell Group' : 'Nhóm Nhỏ & Tế Bào',
      secondaryTitle: isEnglish ? 'Nhóm Nhỏ & Tế Bào' : 'Small Group & Cell Group',
      badge: isEnglish ? 'Fellowship' : 'Thông Công',
      desc: isEnglish
        ? 'Warm, conversational atmosphere with vulnerable discovery questions, mutual care, and community action steps.'
        : 'Không gian ấm cúng, câu hỏi tương tác bộc bạch lòng mình, đồng hành và cầu thay gắn bó.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            {t.audienceSectionTitle}
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            {t.audienceSectionSubtitle}
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
                    {mode.badge}
                  </span>
                </div>

                <div className="font-serif font-bold text-slate-900 text-base">
                  {mode.title}
                </div>
                <div className="text-xs text-slate-700 font-medium mb-1.5">
                  {mode.secondaryTitle}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {mode.desc}
                </p>
              </div>

              {isSelected && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse"></span>
                  {t.audienceActive}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
