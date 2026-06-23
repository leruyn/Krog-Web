import React from 'react';
import { Sparkles, Terminal, Flame, Info, Heart, ShieldAlert } from 'lucide-react';
import { playWoodClickSound } from '../audio';

export default function KrogPhilosophy() {
  return (
    <div className="text-[#2a2521] space-y-6 select-text max-w-full">
      {/* Header section with raw typography */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900/10 border border-amber-900/20 text-amber-950 font-mono text-[10px] uppercase font-bold tracking-widest mb-3 select-none">
          <Flame className="w-3 h-3 text-amber-800 fill-amber-800 animate-pulse" /> Triết Lý Nguyên Thủy
        </div>
        <h1 className="text-3xl font-serif font-black tracking-tight text-amber-950 leading-none">
          Krog Việt Nam
        </h1>
        <p className="text-xs font-mono text-amber-800 mt-1 font-bold">
          "Nghĩ ít, đập đá nhiều, lòng ắt an."
        </p>
      </div>

      {/* Intro paragraph */}
      <div className="font-serif text-sm text-[#3d332a] leading-relaxed border-l-2 border-amber-900/20 pl-4 italic">
        "Krog thấy người hiện đại chạy rất nhanh, lưng mang nhiều balo nặng trĩu. Đầu người hiện đại có nhiều sợi cáp phát sáng, hễ sếp mắng là sợi cáp đứt, tiếng la hét dội vang bến bờ. Thôi, hãy tắt phiến đá lấp lánh, mài chiếc rìu đá thật bén, và về hang sưởi ấm."
      </div>

      {/* The Three Pillars of Krog */}
      <div>
        <h3 className="font-mono text-xs font-black uppercase text-amber-950 tracking-wider mb-2.5 flex items-center select-none">
          <Info className="w-4 h-4 mr-1.5 stroke-2 text-amber-900" /> Ba Trụ Cột Tối Giản (Krog Pillars)
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="bg-amber-100/30 rounded-xl p-3 border border-amber-950/5 relative overflow-hidden" 
               onClick={playWoodClickSound}>
            <span className="absolute -right-3 -bottom-3 text-3xl font-black text-amber-950/10 select-none">🪓</span>
            <span className="font-mono text-[10px] font-bold text-amber-900 block tracking-wider uppercase mb-0.5">I. Không Phức Tạp (Zero Complexity)</span>
            <p className="text-[11px] font-sans text-amber-950/80 leading-relaxed">
              Không đăng nhập, không đăng ký tài khoản, không hệ thống máy chủ mạng nhện rắc rối (No Cloud/No API/No Backend). Bật phát lên luôn.
            </p>
          </div>

          <div className="bg-amber-100/30 rounded-xl p-3 border border-amber-950/5 relative overflow-hidden"
               onClick={playWoodClickSound}>
            <span className="absolute -right-3 -bottom-3 text-3xl font-black text-amber-950/10 select-none">🛡️</span>
            <span className="font-mono text-[10px] font-bold text-amber-900 block tracking-wider uppercase mb-0.5">II. Quyền Riêng Tư Tuyệt Đối (Local-First)</span>
            <p className="text-[11px] font-sans text-amber-950/80 leading-relaxed">
              Dữ liệu thuộc về bạn và nằm trọn vẹn trên thiết bị của bạn. Không một dòng thu thập dữ liệu trái phép nào xảy ra bên trong hang của Krog.
            </p>
          </div>

          <div className="bg-amber-100/30 rounded-xl p-3 border border-amber-950/5 relative overflow-hidden"
               onClick={playWoodClickSound}>
            <span className="absolute -right-3 -bottom-3 text-3xl font-black text-amber-950/10 select-none">🌅</span>
            <span className="font-mono text-[10px] font-bold text-amber-900 block tracking-wider uppercase mb-0.5">III. Tập Trung Vào Hôm Nay (Focus on Now)</span>
            <p className="text-[11px] font-sans text-amber-950/80 leading-relaxed">
              Mỗi ngày lấy đúng một câu châm ngôn (deterministic wisdom theo thuật toán Day-Of-Year). Suy ngẫm, vẽ nguệch ngoạc để trút áp lực rồi lại tắt app đi làm việc thật của mình.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Spec Stack overview */}
      <div>
        <h3 className="font-mono text-xs font-black uppercase text-amber-950 tracking-wider mb-2.5 flex items-center select-none">
          <Terminal className="w-4 h-4 mr-1.5 stroke-2 text-amber-900" /> Bản Thiết Kế Giao Diện di động
        </h3>

        <div className="bg-amber-950 text-amber-100 rounded-xl p-4 font-mono text-[10.5px] leading-relaxed border border-amber-950 shadow-inner space-y-2">
          <div>
            <span className="text-yellow-400 font-bold">// Kiến trúc Native Android Stack</span>
          </div>
          <div>
            <span className="text-amber-400 font-bold">Language:</span> Kotlin &amp; Modern Declarative UI
          </div>
          <div>
            <span className="text-amber-400 font-bold">Giao Diện chính:</span> Jetpack Compose (Vạn tuế!)
          </div>
          <div>
            <span className="text-amber-400 font-bold">Lưu trữ:</span> Jetpack DataStore (Preferences)
          </div>
          <div>
            <span className="text-amber-400 font-bold">Tiện ích:</span> Jetpack Glance AppWidget API
          </div>
          <div>
            <span className="text-amber-400 font-bold">Thuật toán quote:</span> (Day of year % Wisdom Pool Size)
          </div>
          <div className="pt-1.5 border-t border-amber-900/50 mt-1 flex justify-between select-none">
            <span className="text-amber-500 opacity-65">// BUILD SUCCESSFUL</span>
            <span className="text-green-400">● STABLE</span>
          </div>
        </div>
      </div>

      {/* Why Developers get Headaches funny thought */}
      <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-950/10">
        <h4 className="font-mono text-[10.5px] font-black uppercase text-amber-900 mb-1 flex items-center select-none">
          <ShieldAlert className="w-4 h-4 mr-1 text-red-800" /> Krog Trị Liệu Cho Dev
        </h4>
        <p className="text-xs text-amber-950/80 leading-relaxed font-serif">
          Hằng ngày dev phải gõ đá lơ lửng, tộc trưởng bảo đổi tên này thành tên nọ, sâu gỗ (bug) bò khắp phiến đá phát sáng khiến đầu bốc khói. Hãy dùng tính năng <strong>Đập Đá</strong> tiêu trừ ác mộng, rồi gõ nỗi oán hờn vào <strong>Nhật Ký Vách Đá</strong> để nó dịch sang tiếng người đá cổ xưa cười vui cả ngày!
        </p>
      </div>

      {/* Footer credits in typography style */}
      <div className="text-[10px] font-mono text-amber-900/40 select-none pt-4 border-t border-amber-950/5 flex justify-between items-center">
        <span className="flex items-center gap-1">
          Thiết kế mộc mạc với <Heart className="w-3.5 h-3.5 text-red-700 fill-red-700" /> tại Việt Nam
        </span>
        <span>Mã nguồn Open-Source 🪵</span>
      </div>
    </div>
  );
}
