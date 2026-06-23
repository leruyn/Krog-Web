import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { KROG_DICTIONARY } from '../constants';
import { playChiselSound, playWoodClickSound } from '../audio';
import { Feather, History, Trash2, HelpCircle } from 'lucide-react';

export default function KrogDiary() {
  const [inputText, setInputText] = useState<string>('');
  const [diaries, setDiaries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('krog_cave_diaries');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default-1',
        originalText: 'Đi làm gặp sếp giao việc dồn dập, deadline sát nút làm tôi rất stress mệt mỏi.',
        krogText: 'Vác rìu đi săn bắn 🪓 gặp tộc trưởng hung dữ 👹 mài rìu bẩy đá 🪨 dồn dập, thú dữ đuổi cắn sau mông 🦖 sát gáy làm tôi rất đầu Krog bốc khói núi lửa 🔥 tay bủn rủn, lưng đau nhừ 🪵.',
        timestamp: 'Bình minh xa xưa'
      }
    ];
  });

  const [showHelper, setShowHelper] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('krog_cave_diaries', JSON.stringify(diaries));
  }, [diaries]);

  // Translate logic using the Krog dictionary
  const translateToKrog = (text: string): string => {
    let lowerText = text.toLowerCase();
    let translated = text;

    // Sort dictionary keys by length (longest first) to avoid early substring replacements
    const keys = Object.keys(KROG_DICTIONARY).sort((a, b) => b.length - a.length);

    // Dynamic replace matching ignores casing
    keys.forEach((key) => {
      const krogWord = KROG_DICTIONARY[key];
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translated = translated.replace(regex, krogWord);
    });

    return translated;
  };

  const handleCarve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playChiselSound();
    const krogTranslated = translateToKrog(inputText);

    const today = new Date();
    const formattedDate = `Bình minh ngày ${today.getDate()}/${today.getMonth() + 1}`;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      originalText: inputText,
      krogText: krogTranslated,
      timestamp: formattedDate,
    };

    setDiaries((prev) => [newEntry, ...prev]);
    setInputText('');
  };

  const handleDelete = (id: string) => {
    playWoodClickSound();
    setDiaries((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f1ea] p-4 text-[#2a2521] select-none justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-mono text-sm uppercase tracking-wider text-amber-900 font-bold flex items-center">
            <Feather className="w-4 h-4 mr-1.5 stroke-2" /> Nhật Ký Vách Đá
          </h3>
          <button
            onClick={() => {
              playWoodClickSound();
              setShowHelper(!showHelper);
            }}
            className="text-amber-800 hover:text-amber-950 p-1 rounded-full cursor-pointer transition-all"
            title="Từ điển Krog"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-amber-800 font-sans italic mb-3">
          Trút nỗi niềm văn phòng. Đá ma thuật tự dịch sang tiếng nguyên thuỷ...
        </p>

        {/* Dictionary Guide help panel */}
        {showHelper && (
          <div className="bg-amber-100/60 rounded-xl p-3 border border-amber-950/15 mb-3 text-[11px] font-mono leading-relaxed text-amber-950 animate-fade-in">
            <p className="font-bold border-b border-amber-900/10 pb-1 mb-1 text-amber-900">🪨 DANH TỪ CỔ KHUYÊN DÙNG:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <div>• đi làm, làm việc</div>
              <div className="text-amber-800">→ săn bắn, bẩy đá</div>
              <div>• lương, tiền</div>
              <div className="text-amber-800">→ vỏ sò</div>
              <div>• sếp, quản lý</div>
              <div className="text-amber-800">→ tộc trưởng</div>
              <div>• deadline</div>
              <div className="text-amber-800">→ thú dữ đuổi dồn dập</div>
              <div>• stress, mệt</div>
              <div className="text-amber-800">→ đầu bốc khói, lưng mỏi</div>
              <div>• máy tính, điện thoại</div>
              <div className="text-amber-800">→ phiến đá phát sáng</div>
            </div>
          </div>
        )}

        {/* Form to submit */}
        <form onSubmit={handleCarve} className="flex gap-1.5 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Hôm nay đi làm gặp sếp giục deadline stress mệt..."
            className="flex-1 text-xs px-3 py-2.5 rounded-lg bg-amber-50/50 border border-amber-950/20 text-[#2a2521] placeholder-amber-900/35 focus:outline-hidden focus:border-amber-900 focus:bg-amber-50/90 font-sans"
            maxLength={140}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-amber-900 disabled:opacity-40 text-amber-50 px-3 py-2 rounded-lg font-mono text-xs cursor-pointer font-bold transition-all hover:bg-amber-950 flex items-center shrink-0"
          >
            Khắc Đá 🪓
          </button>
        </form>

        {/* List of previously carved stones */}
        <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/70">
            <History className="w-3.5 h-3.5" /> Lịch sử bia đá
          </div>

          {diaries.length === 0 ? (
            <div className="text-center py-6 text-[11px] font-mono italic text-amber-800/40">
              Vách đá nhẵn thín. Chưa ghi khắc điều chi.
            </div>
          ) : (
            diaries.map((diary) => (
              <div
                key={diary.id}
                className="bg-amber-100/30 rounded-xl p-3 border border-amber-950/10 relative group hover:bg-amber-100/50 transition-colors"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at bottom, rgba(160,110,60,0.02) 0%, transparent 100%)'
                }}
              >
                <div className="flex justify-between items-center mb-1 border-b border-dashed border-amber-950/5 pb-1">
                  <span className="text-[9px] font-mono font-bold text-amber-800">
                    🦕 {diary.timestamp}
                  </span>
                  <button
                    onClick={() => handleDelete(diary.id)}
                    className="text-amber-900/40 hover:text-red-700 cursor-pointer p-0.5 rounded transition-all"
                    title="Xóa bia đá"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs font-serif leading-relaxed text-[#2c2621]">
                  "{diary.krogText}"
                </p>

                <p className="text-[10px] text-amber-950/40 font-mono mt-1.5 border-t border-amber-950/5 pt-1 truncate">
                  Gốc: {diary.originalText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-center text-[9px] font-mono text-amber-900/70 border-t border-amber-950/5 pt-2.5 mt-2 select-none">
        Mọi nhật ký được khắc chìm hoàn toàn vào bộ nhớ cục bộ trình duyệt.
      </div>
    </div>
  );
}
