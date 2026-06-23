import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  PenTool,
  Hammer,
  Feather,
  Smartphone,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  Zap,
  TrendingUp,
  Layers,
  Heart
} from 'lucide-react';
import { playWoodClickSound } from '../audio';
import { EmulatorTab } from '../types';

interface KrogLandingProps {
  setViewMode: (mode: 'landing' | 'emulator') => void;
  setActiveTab: (tab: EmulatorTab) => void;
  soundEnabled: boolean;
  stones: number;
  shells: number;
  purchasedCount: number;
}

export default function KrogLanding({
  setViewMode,
  setActiveTab,
  soundEnabled,
  stones,
  shells,
  purchasedCount
}: KrogLandingProps) {
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const iconPrompt = `3D claymation design style style, a cute primitive stone axe and a mammoth steak roasted on prehistoric bonfire, soft organic plasticine texture, vibrant saturated colors, isolated on solid clay beige background, mobile app tile game logo, high fidelity, 8k render, professional design`;

  const handleCopyPrompt = () => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    navigator.clipboard.writeText(iconPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const navigateToFeature = (tab: EmulatorTab) => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    setActiveTab(tab);
    setViewMode('emulator');
    // Scroll to top of window or phone
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      tab: 'wisdom' as EmulatorTab,
      icon: <Flame className="w-5 h-5 text-orange-600 fill-orange-500" />,
      title: 'Đăng Đàn Lời Răn Tổ Tiên',
      badge: 'Bộ Lục Lẽ Sống',
      desc: 'Mỗi ngày thức dậy, vách đá hé mở một ý niệm mộc mạc từ tổ tiên cổ xưa. Không cần lướt mạng xã hội ồn ào xô bồ, ngẫm đúng một câu là lòng nhẹ nhõm như đi rừng hái quả dâu hoang.',
      cta: 'Đọc lời răn vách hang 🌌'
    },
    {
      tab: 'crusher' as EmulatorTab,
      icon: <Hammer className="w-5 h-5 text-amber-800" />,
      title: 'Đập Đá Đổi Vỏ Sò',
      badge: 'Xả Giận Bôm Bốp',
      desc: 'Kho tàng xả xì-trét tưng bừng bằng cách đập vào tảng đá thiêng để thu lượm vỏ sò dạo biển. Dùng sò đổi lấy các loại vũ khí huyền thoại từ Rìu Đồng thô sơ đến cả Găng Tay Vô Cực quyền uy.',
      cta: 'Cầm rìu băm đá ngay 🔨'
    },
    {
      tab: 'canvas' as EmulatorTab,
      icon: <PenTool className="w-5 h-5 text-blue-700" />,
      title: 'Vẽ Bậy Vách Hang Thần Bí',
      badge: 'Vẩy Màu Tự Do',
      desc: 'Một bức vách thiêng liêng để bạn tha hồ chấm mực nhựa cây hoang dã, vẽ nên những loài khủng long trong trí tưởng tượng không hề gò bó rập khuôn.',
      cta: 'Trở thành danh họa tiền sử 🎨'
    },
    {
      tab: 'diary' as EmulatorTab,
      icon: <Feather className="w-5 h-5 text-emerald-700" />,
      title: 'Nhật Ký Lông Vũ Thổ Ngữ',
      badge: 'Bình Tâm Hóa Krog',
      desc: 'Gõ những uất ức phiền muộn của cuộc sống công sở thường nhật bằng chữ viết ngày nay, Krog sẽ giúp bạn quy đổi chúng thành tiếng nói nguyên thủy cực bựa, bật cười xua tan âu sầu.',
      cta: 'Trút giận bằng thổ ngữ Krog 📝'
    }
  ];

  const compareItems = [
    {
      criteria: 'Mục Tiêu Sống',
      modern: 'Chạy đua KPI, gồng mình tăng ca, ám ảnh hộp thư sếp gọi sầm sập.',
      krog: 'Chỉ cần no bụng thịt voi ma mút nướng dâu rừng, mài chiếc rìu đá thật bóng loáng.',
      isHighlight: false
    },
    {
      criteria: 'An Toàn Tuyệt Đối',
      modern: 'Sợ lộ tài khoản bí mật, lo sợ rò rỉ hình ảnh riêng tư cho kẻ xấu.',
      krog: 'Mọi thứ khắc lên hòn đá bỏ túi của chính bạn. Không lưu trữ trên mạng nên không lo ai dòm ngó!',
      isHighlight: true
    },
    {
      criteria: 'Khi Gặp Rắc Rối',
      modern: 'Hệ thống đơ sập lúc nửa đêm, bị réo đầu dậy khóc thét họp khẩn.',
      krog: 'Đá nứt vỡ thì vứt xó, ra bờ suối tìm hòn đá mới trơn láng mài lại từ đầu. Đầu óc thanh tịnh tự do.',
      isHighlight: false
    },
    {
      criteria: 'Liệu Pháp Chữa Lành',
      modern: 'Đổi từ màn hình máy tính sang màn hình điện thoại, tốn tiền mua khóa học thiền định vẫn bồn chồn.',
      krog: 'Nhặt một cây búa gõ cộc cộc bôm bốp vào tảng thạch anh, ngắm lửa bập bùng reo cười sảng khoái.',
      isHighlight: true
    }
  ];

  const faqs = [
    {
      q: 'Krog có thu thập dữ liệu cá nhân của tôi không?',
      a: 'Hoàn toàn không! Bộ tộc Krog sống thuần chất như hạt cát bãi sông. Mọi nhật ký thầm kín, nét vẽ vách đá hoang dã hay gia sản sò đá của bạn đều lưu trực tiếp bên trong ổ đá cá nhân ngay trên thiết bị của bạn. Krog không có máy chủ lưu trữ trên mạng và không cần bán gì ngoài việc đi săn hái lượm thịt voi nướng.'
    },
    {
      q: 'Ứng dụng này có cần mạng Internet để chơi không?',
      a: 'Ý chí dũng mãnh và chiếc rìu đá của Krog không dựa dẫm vào sấm sét hay mây gió! Bạn hoàn toàn có thể mang Krog vào hầm lò sâu thẳm, lên núi tuyết mờ mịt hoặc khu rừng hẻo lánh không một vạch sóng điện thoại mà vẫn ngắm lời khuyên tổ tiên, đập đá đếm sò và viết ghi chép vớ vẩn thoải mái.'
    },
    {
      q: 'Trò đập đá có giới hạn thời gian hay số lượt không?',
      a: 'Không hề giới hạn! Krog luôn khuyến khích tinh thần lao động chân tay bền bỉ để mài dũa ý chí. Bạn có thể đập đá thả ga bất kỳ khi nào cảm thấy áp lực từ cuộc sống cuồn cuộn bên ngoài áp tới để thấy âm thanh cộc cộc vang lên kéo nụ cười về lại đôi môi.'
    }
  ];

  return (
    <div className="w-full max-w-5xl py-6 px-4 md:px-8 space-y-16 animate-fade-in text-[#2a2521]">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-amber-150/40 border border-amber-950/10 p-8 md:p-14 text-center space-y-6 shadow-sm"
               style={{
                 backgroundImage: 'radial-gradient(circle at top right, rgba(120, 53, 4, 0.05), transparent 60%)',
                 boxShadow: 'inset 0 0 40px rgba(139, 92, 26, 0.03)'
               }}>
        <div className="absolute top-4 right-4 animate-bounce">
          <span className="text-4xl filter drop-shadow opacity-85">🦖</span>
        </div>
        <div className="absolute bottom-6 left-6 animate-pulse hidden md:block">
          <span className="text-4xl filter drop-shadow opacity-75">🪵</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-900/10 text-orange-950 font-mono text-[11px] uppercase font-bold tracking-widest select-none">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse" />
          Liệu Pháp Chữa Lành Độc Đáo Kỷ Đồ Đá
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-amber-950 leading-none max-w-3xl mx-auto">
          Quay Về Lối Sống <span className="text-orange-700 underline decoration-wavy decoration-orange-300">Tối Giản</span> Thời Tiền Sử
        </h1>

        <p className="font-serif text-base md:text-lg text-amber-900/85 max-w-2.5xl mx-auto leading-relaxed">
          Quá mệt mỏi với chuỗi ngày gõ phím ảo và những cuộc họp nghẹt thở nơi văn phòng? Thử ngay <strong>Krog Việt Nam</strong> — ứng dụng chiêm nghiệm răn dạy cổ xưa và bấm đập đá giải sầu để tìm lại sự thanh thản nguyên bản nhất bên đống lửa hồng.
        </p>

        {/* Interactive Stats Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-serif font-bold text-amber-950 opacity-90 pt-2 select-none">
          <span className="px-3 py-1 bg-[#ede8df] rounded-lg border border-amber-950/5 flex items-center gap-1.5">
            🔨 Đã băm đập: {stones} Đá thiêng
          </span>
          <span className="px-3 py-1 bg-[#ede8df] rounded-lg border border-amber-950/5 flex items-center gap-1.5">
            🐚 Sở hữu: {shells} Vỏ sò óng ánh
          </span>
          <span className="px-3 py-1 bg-[#ede8df] rounded-lg border border-amber-950/5 flex items-center gap-1.5">
            🎁 Sưu tầm: {purchasedCount} Đồ chơi thượng cổ
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              if (soundEnabled) playWoodClickSound();
              setViewMode('emulator');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-orange-700 hover:bg-orange-850 text-white font-serif font-black text-lg rounded-2xl cursor-pointer transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2.5"
          >
            <Smartphone className="w-5 h-5 animate-pulse" />
            Bước Vào Hang Chơi Ngay 🔥
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('features-section');
              if (el) {
                if (soundEnabled) playWoodClickSound();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-6 py-4 bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 font-serif text-sm font-black rounded-2xl border border-amber-950/15 cursor-pointer duration-100"
          >
            Tìm Hiểu 4 Nghi Thức Bộ Lạc ↓
          </button>
        </div>
      </section>

      {/* Comparison section strictly without developer terminology */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-orange-900 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Thước Đo Bản Thân
          </div>
          <h2 className="text-3xl font-serif font-black text-amber-950">
            Cuộc Sống Thường Nhật vs. Đời Sống Krog
          </h2>
          <p className="text-xs font-serif text-amber-800 font-bold">
            "Khi mệt mỏi dừng lại một chút mới thấu hiểu lối sống nào thật sự vui sướng"
          </p>
        </div>

        <div className="overflow-hidden border border-amber-950/10 rounded-2xl bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-amber-950 text-amber-50 font-serif text-xs uppercase tracking-wider font-extrabold py-3.5 px-4 sticky top-0 z-10">
            <div className="md:col-span-3 flex items-center">Hạng Mục So Sánh</div>
            <div className="md:col-span-4 mt-2 md:mt-0 flex items-center text-red-350">⚡ Cuộc Sống Văn Phòng Mỗi Ngày</div>
            <div className="md:col-span-5 mt-2 md:mt-0 flex items-center text-green-300 font-bold">🪓 Đời Sống Krog Bên Vách Hang</div>
          </div>

          <div className="divide-y divide-amber-950/5">
            {compareItems.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-12 gap-2 p-4 md:p-5 text-sm font-serif leading-relaxed transition-colors duration-150 ${
                  item.isHighlight ? 'bg-amber-100/15' : 'hover:bg-amber-50/20'
                }`}
              >
                <div className="md:col-span-3 font-serif text-sm font-black text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-600 block" />
                  {item.criteria}
                </div>
                <div className="md:col-span-4 text-[#7c6a58] italic pr-4">
                  {item.modern}
                </div>
                <div className="md:col-span-5 text-amber-955 font-bold flex items-start gap-2">
                  <span className="text-emerald-700 font-sans text-xs pt-1">✔</span>
                  <span>{item.krog}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Grid */}
      <section id="features-section" className="space-y-8 scrolling-mt-20">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-[#7c695a] font-black">
            <Layers className="w-3.5 h-3.5" /> Thú Vui Núi Hang
          </div>
          <h2 className="text-3xl font-serif font-black text-amber-950">
            Trải Nghiệm Những Hoạt Động Tiền Sử lý Thú
          </h2>
          <p className="text-xs font-serif text-amber-800 font-bold max-w-xl mx-auto">
            Không cần tài khoản lằng nhằng, chỉ cần chiếc điện thoại nhỏ để thưởng thức trọn vẹn 4 sở thích kỳ diệu của bộ tộc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-amber-950/10 p-6 space-y-4 hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between"
              style={{
                boxShadow: '0 8px 30px rgba(115, 80, 40, 0.03)'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-950/5 group-hover:scale-110 duration-150 transition-all">
                    {feat.icon}
                  </div>
                  <span className="font-serif text-[11px] font-black text-amber-800 bg-amber-100/50 px-3 py-1 rounded-full">
                    {feat.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-black text-amber-950 group-hover:text-orange-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-amber-900/80 leading-relaxed font-serif">
                    {feat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateToFeature(feat.tab)}
                  className="w-full py-2.5 px-4 bg-amber-50 hover:bg-orange-100/40 text-amber-950 hover:text-orange-850 font-serif text-xs font-black mt-2 rounded-xl border border-amber-950/15 group-hover:border-orange-900/30 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-800 group-hover:-translate-y-0.5 transition-all" />
                  {feat.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promocode / Prompt generator decorated beautifully */}
      <section className="bg-amber-950 text-amber-100 rounded-3xl p-6 md:p-10 border border-amber-950 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-44 h-44 rounded-full bg-amber-900/30 blur-2xl pointer-events-none" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            🎨 Bí Mật Tạo Hình Ảnh Bộ Tộc
          </div>
          <h2 className="text-2xl md:text-3.5xl font-serif font-black text-white leading-tight">
            Sáng Tạo Biểu Tượng Krog Phác Họa Đất Sét Độc Quyền
          </h2>
          <p className="text-xs font-serif text-amber-300 max-w-2xl">
            Tặng bạn công thức mô tả (Prompt) phong cách mỹ thuật đất sét nặn 3D từ Takaction Studio để tự tay phác họa nên một chiếc Rìu Đá mộc mạc làm hình nền học tập hoặc làm ảnh đại diện tinh tế.
          </p>
        </div>

        {/* Copy Shell Box */}
        <div className="bg-amber-900/40 rounded-2xl p-4 border border-amber-900/60 font-serif text-xs leading-relaxed space-y-3 relative group">
          <div className="flex justify-between items-center border-b border-amber-900/40 pb-2 mb-1 select-none">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400">🔥 Bản tả bằng tiếng Anh mẫu</span>
            <button
              onClick={handleCopyPrompt}
              className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900/80 rounded-md border border-amber-800 text-[10px] font-serif font-black text-amber-200 cursor-pointer duration-100 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-green-400 animate-pulse" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Đã sao chép! 🥳' : 'Sao chép mô tả'}
            </button>
          </div>
          <p className="text-amber-100 italic select-all leading-normal group-hover:text-white transition-colors">
            "{iconPrompt}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-serif text-amber-400/85 select-none">
          <span>💡 Cách làm:</span>
          <span className="bg-[#5c2d15] px-2 py-0.5 rounded border border-amber-900">Sao chép bản tả trên</span>
          <span className="text-amber-300">→</span>
          <span className="bg-[#5c2d15] px-2 py-0.5 rounded border border-amber-900">Dán vào phần mềm vẽ ảnh thông minh (như Midjourney, DALL-E)</span>
          <span className="text-amber-300">→</span>
          <span className="text-white">Thưởng thức tác phẩm đẹp mắt!</span>
        </div>
      </section>

      {/* Prehistoric FAQ Sections */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-orange-950 font-bold">
            <HelpCircle className="w-4 h-4" /> Bản Ghi Tra Hỏi
          </div>
          <h2 className="text-3xl font-serif font-black text-amber-950">
            Hỏi Đáp Trắc Ẩn Về Bộ Tộc Krog
          </h2>
          <p className="text-xs font-serif text-amber-800 font-bold">
            "Không hoa mỹ danh xưng, không lừa dối người chơi, thuần phác mộc mạc"
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-amber-950/10 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 md:p-5 flex justify-between items-center font-serif font-black text-[#2a2521] hover:bg-amber-100/10 cursor-pointer select-none transition-colors"
              >
                <span>🚀 {idx + 1}. {faq.q}</span>
                <span className="text-amber-800 text-lg transition-transform font-mono duration-200 ml-2">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>

              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-0 text-xs md:text-sm text-amber-900/85 leading-relaxed font-serif border-t border-amber-950/5 bg-amber-50/20">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Promotion Footer */}
      <footer className="text-center space-y-3 pt-10 border-t border-amber-950/5 select-none opacity-85">
        <p className="font-serif text-sm italic text-amber-900">
          "Đập đá dọn sầu — Nghĩ bớt bớt, cười sung sướng, sống an lành như cỏ dại bờ suối."
        </p>
        <div className="text-[10px] font-serif text-amber-900/60 flex items-center justify-center gap-1 flex-col sm:flex-row">
          <span className="flex items-center gap-0.5">
            Phát triển bằng tình yêu bởi <Heart className="w-3 h-3 text-red-700 fill-red-700" /> và Takaction Studio
          </span>
          <span className="hidden sm:inline">|</span>
          <span>© 10,000 Trước Công Nguyên. Krog Vietnam.</span>
        </div>
      </footer>
    </div>
  );
}
