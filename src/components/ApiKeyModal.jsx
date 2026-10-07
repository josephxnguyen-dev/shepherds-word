import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Vui lòng nhập API Key.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Test the key with a quick lightweight ping to Gemini
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${inputKey.trim()}`;
      const res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Ping test' }] }]
        })
      });

      if (!res.ok) {
        // Try fallback to gemini-1.5-flash
        const testFallback = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${inputKey.trim()}`;
        const res2 = await fetch(testFallback, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Ping test' }] }]
          })
        });

        if (!res2.ok) {
          const errData = await res2.json().catch(() => ({}));
          throw new Error(errData.error?.message || 'Khóa API không hợp lệ hoặc đã hết hạn.');
        }
      }

      onSaveApiKey(inputKey.trim());
      setTestResult({ success: true, message: 'Khóa API Gemini hợp lệ và đã được lưu an toàn!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Lỗi kiểm tra API Key.' });
    } finally {
      setTesting(false);
    }
  };

  const handleClearKey = () => {
    setInputKey('');
    onSaveApiKey('');
    setTestResult({ success: true, message: 'Đã xóa khóa API.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">Cài Đặt Google Gemini AI</h2>
              <p className="text-xs text-amber-100">Kích hoạt tạo bài giảng cho bất kỳ câu Kinh Thánh nào</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Free Tier Info Banner */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/80 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Miễn Phí 100% Qua Google AI Studio</span>
            </div>
            <p className="leading-relaxed">
              Google cung cấp gói miễn phí lên đến <strong>1.500 yêu cầu / ngày</strong> (15 yêu cầu / phút) cho các mô hình Gemini Flash. Mục sư có thể lấy mã khóa hoàn toàn miễn phí chỉ trong 1 phút!
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer pt-1"
            >
              <span>Lấy API Key Miễn Phí Tại Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-700 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Khóa được lưu bảo mật trong trình duyệt của bạn (LocalStorage) và không gửi tới bất kỳ máy chủ nào khác.
              </p>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {testResult.success ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {apiKey ? (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Xóa Khóa Hiện Tại
                </button>
              ) : <div></div>}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={testing}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Kiểm Tra...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu & Kích Hoạt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
