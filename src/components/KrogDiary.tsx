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
    <div className="flex flex-col h-full bg-[#0f0d0b] p-4 text-[#ede5d8] select-none justify-between rounded-2xl border border-[#d4943a]/8">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#d4943a] font-bold flex items-center">
            <Feather className="w-4 h-4 mr-1.5 stroke-2" /> Nhật Ký Vách Đá
          </h3>
          <button
            onClick={() => {
              playWoodClickSound();
              setShowHelper(!showHelper);
            }}
            type="button"
            className="text-[#9a8d7e] hover:text-[#ede5d8] p-1 rounded-full cursor-pointer transition-all"
            title="Từ điển Krog"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
        <p className="text-[10px] text-[#9a8d7e] font-serif italic mb-3">
          Trút nỗi niềm văn phòng. Đá ma thuật tự dịch sang tiếng nguyên thuỷ...
        </p>

        {/* Dictionary Guide help panel */}
        {showHelper && (
          <div className="bg-[#1c1915] rounded-xl p-3 border border-[#d4943a]/12 mb-3 text-[10px] font-mono leading-relaxed text-[#ede5d8] animate-fade-in">
            <p className="font-bold border-b border-[#d4943a]/8 pb-1 mb-1 text-[#d4943a]">🪨 DANH TỪ CỔ KHUYÊN DÙNG:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div>• đi làm, làm việc</div>
              <div className="text-[#d4943a]">→ săn bắn, bẩy đá</div>
              <div>• lương, tiền</div>
              <div className="text-[#d4943a]">→ vỏ sò</div>
              <div>• sếp, quản lý</div>
              <div className="text-[#d4943a]">→ tộc trưởng</div>
              <div>• deadline</div>
              <div className="text-[#d4943a]">→ thú dữ đuổi dồn dập</div>
              <div>• stress, mệt</div>
              <div className="text-[#d4943a]">→ đầu bốc khói, lưng mỏi</div>
              <div>• máy tính, điện thoại</div>
              <div className="text-[#d4943a]">→ phiến đá phát sáng</div>
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
            className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#1c1915] border border-[#d4943a]/12 text-[#ede5d8] placeholder-[#9a8d7e]/40 focus:outline-hidden focus:border-[#d4943a] focus:bg-[#1c1915]/90 font-sans"
            maxLength={140}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#d4943a] text-[#0c0a08] disabled:opacity-30 px-3.5 py-2 rounded-lg font-mono text-xs cursor-pointer font-bold transition-all hover:bg-[#e8a838] flex items-center shrink-0"
          >
            Khắc Đá 🪓
          </button>
        </form>

        {/* List of previously carved stones */}
        <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#9a8d7e]">
            <History className="w-3.5 h-3.5" /> Lịch sử bia đá
          </div>

          {diaries.length === 0 ? (
            <div className="text-center py-6 text-[10px] font-mono italic text-[#9a8d7e]/40">
              Vách đá nhẵn thín. Chưa ghi khắc điều chi.
            </div>
          ) : (
            diaries.map((diary) => (
              <div
                key={diary.id}
                className="bg-[#151210] rounded-xl p-3 border border-[#d4943a]/8 relative group hover:border-[#d4943a]/20 transition-all duration-200"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at bottom, rgba(212,148,58,0.01) 0%, transparent 100%)'
                }}
              >
                <div className="flex justify-between items-center mb-1 border-b border-dashed border-[#d4943a]/5 pb-1">
                  <span className="text-[8px] font-mono font-bold text-[#d4943a]">
                    🦕 {diary.timestamp}
                  </span>
                  <button
                    onClick={() => handleDelete(diary.id)}
                    type="button"
                    className="text-[#9a8d7e]/40 hover:text-red-400 cursor-pointer p-0.5 rounded transition-all"
                    title="Xóa bia đá"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs font-serif leading-relaxed text-[#ede5d8]/90">
                  "{diary.krogText}"
                </p>

                <p className="text-[9px] text-[#9a8d7e]/50 font-mono mt-1.5 border-t border-[#d4943a]/5 pt-1 truncate">
                  Gốc: {diary.originalText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-center text-[8px] font-mono text-[#9a8d7e]/50 border-t border-[#d4943a]/5 pt-2 mt-2 select-none">
        Mọi nhật ký được khắc chìm hoàn toàn vào bộ nhớ cục bộ trình duyệt.
      </div>
    </div>
  );
}
