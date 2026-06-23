import React, { useState, useEffect } from 'react';
import { WisdomQuote } from './types';
import { WISDOM_POOL } from './constants';
import { playWoodClickSound, playChiselSound } from './audio';
import KrogCanvas from './components/KrogCanvas';
import KrogCrusher from './components/KrogCrusher';
import KrogDiary from './components/KrogDiary';
import {
  Flame,
  PenTool,
  Hammer,
  Feather,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Info,
  Layers,
  Heart,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [todayWisdom, setTodayWisdom] = useState<WisdomQuote>(WISDOM_POOL[0]);
  const [dayOfYear, setDayOfYear] = useState<number>(1);
  const [customQuoteIndex, setCustomQuoteIndex] = useState<number | null>(null);
  const [flameIntensity, setFlameIntensity] = useState<number>(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Lifted States from KrogCrusher to make them globally reactive on the landing page
  const [stones, setStones] = useState<number>(() => {
    const saved = localStorage.getItem('krog_stones_collected');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [shells, setShells] = useState<number>(() => {
    const saved = localStorage.getItem('krog_shells_collected');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('krog_purchased_items');
    return saved ? JSON.parse(saved) : [];
  });

  // Bonfire dynamic click talk/sparks state
  interface FireFloat {
    id: number;
    text: string;
  }
  const [fireFloats, setFireFloats] = useState<FireFloat[]>([]);
  const [dinoTalk, setDinoTalk] = useState<string>('');

  // Sync state variables across localStorage
  useEffect(() => {
    localStorage.setItem('krog_stones_collected', stones.toString());
  }, [stones]);

  useEffect(() => {
    localStorage.setItem('krog_shells_collected', shells.toString());
  }, [shells]);

  useEffect(() => {
    localStorage.setItem('krog_purchased_items', JSON.stringify(purchasedIds));
  }, [purchasedIds]);

  // Spark clearing
  useEffect(() => {
    if (fireFloats.length > 0) {
      const timer = setTimeout(() => {
        setFireFloats((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fireFloats]);

  // Calculate day of the year to get matching Krog deterministic wisdom quote
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);

    setDayOfYear(day);
    const index = day % WISDOM_POOL.length;
    setTodayWisdom(WISDOM_POOL[index]);
  }, []);

  const handleNextQuote = () => {
    if (soundEnabled) {
      playChiselSound();
    }
    const currentIndex = customQuoteIndex !== null ? customQuoteIndex : (dayOfYear % WISDOM_POOL.length);
    const nextIndex = (currentIndex + 1) % WISDOM_POOL.length;
    setCustomQuoteIndex(nextIndex);
    setTodayWisdom(WISDOM_POOL[nextIndex]);
  };

  const handleResetToToday = () => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    const index = dayOfYear % WISDOM_POOL.length;
    setCustomQuoteIndex(null);
    setTodayWisdom(WISDOM_POOL[index]);
  };

  const handleFlameClick = () => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    setFlameIntensity((prev) => (prev >= 1.6 ? 1.0 : prev + 0.2));

    const fireSparksText = [
      'Bộp! Lửa cháy to rực rỡ! 🔥',
      'Tí tách... Ấm quá xèo xèo! 🪵',
      'Thổi mạnh, quăng thêm củi nào!',
      'Xua tan mệt mỏi ngày hôm nay! ⛰️',
      'Sáng bừng cả căn hang đá cổ rồi!',
      'Hơi ấm sưởi ấm tâm hồn Krog! ✨'
    ];
    setFireFloats((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: fireSparksText[Math.floor(Math.random() * fireSparksText.length)]
      }
    ]);
  };

  const handleDinoClick = () => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    const dinoQuotes = [
      'Éc Éc! Krog bớt lười đi đập đá! 🦖',
      'Graoo! Sò bướng rơi ra mau! 🐚',
      'Éc éc! Sưởi ké mông ấm quá đi! 🔥',
      'Chụt chụt! Thèm thịt voi nướng cực! 🍖',
      'T-Rex nhí chúc bạn mài rìu dẻo dai! 👑',
      'Graoo! Đá nứt rồi, đập mạnh rầm rầm!'
    ];
    const rq = dinoQuotes[Math.floor(Math.random() * dinoQuotes.length)];
    setDinoTalk(rq);
    setTimeout(() => {
      setDinoTalk('');
    }, 2500);
  };

  const toggleFaq = (index: number) => {
    if (soundEnabled) {
      playWoodClickSound();
    }
    setActiveFaq(activeFaq === index ? null : index);
  };

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
      modern: 'Hệ thống đơ sập lúc nửa đêm, bị réo đầu dậy khóc thét họp khấn.',
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
      a: 'Hoàn toàn không! Bộ tộc Krog từ Takaction Studio sống thuần chất như hạt cát bãi sông. Mọi nhật ký thầm kín, nét vẽ vách đá hoang dã hay gia sản sò đá của bạn đều lưu trực tiếp bên trong ổ đá cá nhân (Local State) ngay trên thiết bị của bạn. Chúng tôi không thu thập bất cứ dữ liệu nào.'
    },
    {
      q: 'Ứng dụng này có cần mạng Internet để chơi không?',
      a: 'Ý chí dũng mãnh và chiếc rìu đá của Krog không dựa dẫm vào sấm sét hay mây gió! Bạn hoàn toàn có thể mang Krog vào hầm lò sâu thẳm, lên núi tuyết mờ mịt hoặc khu rừng hẻo lánh không một vạch sóng điện thoại mà vẫn ngắm lời khuyên tổ tiên, đập đá đếm sò và viết ghi chép thoải mái.'
    },
    {
      q: 'Trò đập đá trực tiếp trên trang chủ có lưu thứ hạng không?',
      a: 'Tài sản đá rừng, vỏ sò lấp lánh và trang bị thượng cổ bạn kiếm được trong tiệm đồ Oog-Ruk đều được lưu tự động vào bộ nhớ trình duyệt của bạn (Local Storage). Hãy thoải mái đâm băm, đập phá bất cứ lúc nào bão tố áp lực tràn về!'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2a2521] selection:bg-amber-900/10 font-sans flex flex-col items-center">
      {/* Premium Web Header */}
      <header className="w-full max-w-6xl px-6 py-4 border-b border-amber-950/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#faf8f5]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl filter contrast-125 select-none">🪓</span>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-900">
              Cổng Game Trải Nghiệm Thượng Cổ • Takaction Studio
            </span>
            <span className="font-serif font-black text-xl text-amber-950 leading-none">
              Krog Việt Nam
            </span>
          </div>
        </div>

        {/* Live Counters & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-amber-100/45 px-3 py-1.5 rounded-full border border-amber-950/5 text-[11px] font-mono font-bold text-amber-950/90 select-none">
            <span className="flex items-center gap-1">
              🪨 <span className="text-amber-950 font-black">{stones}</span> Đá
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-900/25" />
            <span className="flex items-center gap-1">
              🐚 <span className="text-amber-950 font-black">{shells}</span> Sò
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              if (nextState) {
                playWoodClickSound();
              }
            }}
            className={`p-2.5 rounded-full cursor-pointer border hover:scale-105 duration-100 flex items-center justify-center ${
              soundEnabled
                ? 'bg-amber-100/60 border-amber-900/15 text-amber-900'
                : 'bg-gray-100 border-gray-950/10 text-gray-400'
            }`}
            title={soundEnabled ? 'Tắt âm thanh gõ đá' : 'Bật âm thanh gõ đá'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Hero Showcase Frame */}
      <main className="w-full max-w-6xl px-4 md:px-6 py-8 space-y-16 flex-1">
        
        {/* Dynamic Prehistoric Welcome Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-amber-150/40 border border-amber-900/10 p-8 md:p-14 text-center sm:text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xs"
                 style={{
                   backgroundImage: 'radial-gradient(circle at top right, rgba(120, 53, 4, 0.05), transparent 60%)',
                   boxShadow: 'inset 0 0 50px rgba(139, 92, 26, 0.02)'
                 }}>
          
          <div className="md:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-900/10 text-orange-950 font-mono text-[11px] uppercase font-black tracking-widest select-none">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse" />
              Liệu Pháp Chữa Lành Kỷ Đồ Đá Độc Quyền từ Takaction
            </div>

            <h1 className="text-4.5xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-amber-950 leading-none">
              Quay Về Lối Sống <span className="text-orange-700 underline decoration-wavy decoration-orange-300">Tối Giản</span> Thời Tiền Sử
            </h1>

            <p className="font-serif text-base md:text-lg text-amber-900/85 leading-relaxed max-w-2xl">
              Quá mệt mỏi với chuỗi ngày gõ phím ảo và những cuộc họp nghẹt thở nơi văn phòng? Thử ngay <strong>Krog Việt Nam</strong> — giải pháp chiêm nghiệm răn dạy cổ xưa và đập đá trực báo giải sầu sảng khoái ngay trên trình duyệt để tìm lại sự bình yên mộc mạc nhất.
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              <button
                onClick={() => {
                  const el = document.getElementById('interactive-ritual-section');
                  if (el) {
                    if (soundEnabled) playWoodClickSound();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3.5 bg-orange-700 hover:bg-orange-850 text-white font-serif font-black text-sm rounded-xl cursor-pointer transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
              >
                Trải Nghiệm Nghi Thức Ngay ↓
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('comparison-section');
                  if (el) {
                    if (soundEnabled) playWoodClickSound();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-3.5 bg-amber-150/10 hover:bg-amber-100 text-amber-950 font-serif text-sm font-black rounded-xl border border-amber-955/20 cursor-pointer duration-100"
              >
                Đời sống Krog là gì?
              </button>
            </div>
          </div>

          {/* Majestic Hero Interactive Bonfire Widget */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-[#faf7f0]/95 p-6 rounded-3xl border border-amber-950/10 relative shadow-sm h-full"
               style={{
                 backgroundImage: 'radial-gradient(circle at bottom, rgba(234, 115, 22, 0.04) 0%, transparent 80%)'
               }}>
            
            <div
              onClick={handleFlameClick}
              className="w-32 h-32 relative flex items-center justify-center cursor-pointer select-none group"
              title="Đống lửa sưởi ấm - Chạm mồi lửa"
            >
              <div
                className="absolute w-20 h-20 rounded-full bg-yellow-400/20 blur-xl transition-all duration-300 animate-pulse"
                style={{
                  transform: `scale(${(flameIntensity * (purchasedIds.includes('warm_bonfire') ? 1.45 : 1.05))})`
                }}
              />
              <div className="absolute w-24 h-24 rounded-full bg-orange-500/15 blur-lg -z-10 animate-pulse pointer-events-none" />

              {/* Extras indicators if purchased */}
              {purchasedIds.includes('roasted_mammoth') && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                  <span className="text-3xl filter drop-shadow">🍖</span>
                  <span className="bg-amber-950/80 text-[7px] text-amber-100 px-1 py-0.2 rounded font-mono font-bold uppercase scale-85 whitespace-nowrap">
                    Voi nướng béo ngậy
                  </span>
                </div>
              )}

              {/* Fire SVG rendering */}
              <svg viewBox="0 0 100 100" className="w-full h-full select-none relative z-10">
                <line x1="30" y1="80" x2="70" y2="80" stroke="#5c4e43" strokeWidth="6" strokeLinecap="round" />
                <line x1="35" y1="85" x2="65" y2="75" stroke="#483d35" strokeWidth="5" strokeLinecap="round" />
                <path
                  d="M50,20 C60,45 65,55 58,78 C52,78 48,78 42,78 C35,55 40,45 50,20 Z"
                  fill="#f97316"
                  className="origin-bottom animate-pulse"
                  style={{
                    transform: `scaleY(${(flameIntensity * (purchasedIds.includes('warm_bonfire') ? 1.4 : 1.0))})`,
                    transition: 'transform 0.2s ease-out'
                  }}
                />
                <path
                  d="M50,32 C56,50 60,58 55,76 C51,76 49,76 45,76 C40,58 44,50 50,32 Z"
                  fill="#eab308"
                  className="origin-bottom animate-bounce"
                  style={{
                    transform: `scaleY(${(flameIntensity * (purchasedIds.includes('warm_bonfire') ? 1.4 : 1.0))})`,
                    transition: 'transform 0.3s ease-out'
                  }}
                />
              </svg>

              {/* Spark texts */}
              {fireFloats.map((f) => (
                <div
                  key={f.id}
                  className="absolute -top-2 font-mono text-[9px] font-black text-orange-950 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200 shadow-md animate-float-up whitespace-nowrap z-30"
                >
                  {f.text}
                </div>
              ))}
            </div>

            {/* Companion T-Rex if purchased */}
            {purchasedIds.includes('funny_dino') ? (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDinoClick();
                }}
                className="mt-3 flex flex-col items-center cursor-pointer z-20 hover:scale-110 duration-150 transition-all select-none relative"
              >
                {dinoTalk && (
                  <div className="absolute -top-10 bg-amber-950 text-[8px] text-amber-50 px-2.5 py-1 rounded-md shadow-md whitespace-nowrap animate-bounce font-mono font-bold border border-amber-800/85 z-30">
                    {dinoTalk}
                  </div>
                )}
                <span className="text-3.5xl filter drop-shadow animate-pulse">🦖</span>
                <span className="bg-emerald-800 text-[6px] text-emerald-100 px-1.5 py-0.2 rounded-full font-mono font-black mt-1 uppercase tracking-wider">
                  Bé Khủng Long Éc Éc
                </span>
              </div>
            ) : (
              <div className="text-[10px] text-amber-900/60 font-mono tracking-wider font-bold mt-2 uppercase select-none">
                🔥 Gỗ Reo Tí Tách
              </div>
            )}
          </div>
        </section>

        {/* 4 Pillars of Krog Wilderness */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-black uppercase text-amber-900 tracking-widest block">
              Móng Vuốt Bản Sắc
            </span>
            <h2 className="text-3xl font-serif font-black text-amber-950">
              Ba Trụ Cột Tâm Bản Sắc Krog
            </h2>
            <p className="text-xs font-serif text-amber-800 font-bold max-w-lg mx-auto">
              Không màu mè hoa mỹ, không lấp lánh ảo tưởng — Krog từ Takaction đem đến liệu pháp giải thoát thực chất nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-amber-950/10 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-amber-950/10 block">🪓</span>
              <h3 className="font-mono text-[11px] font-black text-amber-900 tracking-wider uppercase">
                I. Không Phức Tạp (Zero Complexity)
              </h3>
              <p className="text-xs font-serif text-amber-950/80 leading-relaxed">
                Không đăng ký, không khai báo thông tin lằng nhằng, không hệ thống đám mây ảo vọng. Mở trang chủ là bạn có thể sống trọn vẹn tại hang đá ấm áp.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-amber-950/10 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-amber-950/10 block">🛡️</span>
              <h3 className="font-mono text-[11px] font-black text-amber-900 tracking-wider uppercase">
                II. Riêng Tư Tuyệt Đối (Local-First)
              </h3>
              <p className="text-xs font-serif text-amber-950/80 leading-relaxed">
                Mọi nhật ký thổ lộ, nét chạm khắc trên vách đá hay số vỏ sò cặm cụi lượm lặt đều lưu trọn vẹn và an toàn bên trong thiết bị của chính bạn. Không rò rỉ.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-amber-950/10 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-amber-950/10 block">🌅</span>
              <h3 className="font-mono text-[11px] font-black text-amber-900 tracking-wider uppercase">
                III. Chúc Ngủ Ngon Mỗi Ngày (Focus Now)
              </h3>
              <p className="text-xs font-serif text-amber-950/80 leading-relaxed">
                Lấy đúng một triết lý an nhiên của tổ tiên để thiền định mài tâm. Trút bỏ sạch bách nỗi âu lo công việc, vẽ một chú chim nhỏ rồi nhẹ lòng chợp mắt an lành.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Interactive Portal (Chơi Trực Tiếp Trên Web) */}
        <section id="interactive-ritual-section" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-amber-900 font-bold">
              <Layers className="w-4 h-4 text-orange-700" /> Bảng Thống Kế Nghi Thức
            </div>
            <h2 className="text-3.5xl font-serif font-black text-amber-950 leading-tight">
              Khu Vực Nghi Thức Bộ Lạc Trực Tiếp
            </h2>
            <p className="text-xs font-serif text-amber-800 font-bold max-w-xl mx-auto">
              Không cần thông qua mô phỏng điện thoại, hãy tự mình thực hành 4 liệu pháp tối giản ngay trên khung cảnh vách đá dưới này.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: Wisdom Slate & Translator */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Slate 1: Wisdom Card */}
              <div className="bg-white rounded-3xl border border-amber-955/10 p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden"
                   style={{
                     backgroundImage: 'radial-gradient(circle at bottom right, rgba(139, 92, 26, 0.02) 0%, transparent 80%)'
                   }}>
                <div className="flex justify-between items-center border-b border-amber-950/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-orange-50 rounded-xl border border-amber-950/5">
                      <Flame className="w-5 h-5 text-orange-600 fill-orange-500 animate-pulse" />
                    </span>
                    <h4 className="font-serif font-black text-base text-amber-950">
                      Bia Đá Lời Răn Tổ Tiên
                    </h4>
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    🌅 Bình Minh Thứ {dayOfYear}
                  </span>
                </div>

                <div className="bg-[#ede8df]/30 border border-amber-950/10 rounded-2xl p-6 text-center space-y-4 relative">
                  <span className="text-5xl font-serif font-black absolute top-1.5 left-4 text-amber-950/5 select-none">“</span>
                  
                  <p className="font-serif italic text-amber-950 text-base leading-relaxed px-2 select-text">
                    {todayWisdom.content}
                  </p>
                  
                  <span className="text-5xl font-serif font-black absolute bottom-1 right-4 text-amber-950/5 select-none">”</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleNextQuote}
                    className="px-5 py-2.5 rounded-xl border border-amber-955/20 bg-[#ede8df]/70 text-amber-950 font-mono text-xs font-black cursor-pointer hover:bg-orange-100/60 duration-150 flex items-center justify-center gap-2"
                  >
                    Xin Sang Quẻ Khắc Lời Răn Khác 🪓
                  </button>

                  {customQuoteIndex !== null && (
                    <button
                      onClick={handleResetToToday}
                      className="px-3 py-2 text-amber-900 font-mono text-xs font-bold underline cursor-pointer hover:text-amber-950"
                    >
                      Bia Hôm Nay
                    </button>
                  )}
                </div>
              </div>

              {/* Slate 2: Translator Center */}
              <div className="bg-white rounded-3xl border border-amber-955/10 p-6 shadow-sm overflow-hidden">
                <div className="border-b border-amber-950/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-50 rounded-xl border border-amber-950/5">
                      <Feather className="w-5 h-5 text-emerald-700" />
                    </span>
                    <div className="flex flex-col">
                      <h4 className="font-serif font-black text-base text-amber-950 leading-none">
                        Nhật Ký Thổ Ngữ Krog
                      </h4>
                      <span className="text-[10px] text-amber-800 font-serif italic mt-1 font-bold">
                        Trút bầu tâm sự rồi xem đá thiêng dịch ra chữ nguyên thuỷ...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <KrogDiary />
                </div>
              </div>

            </div>

            {/* COLUMN 2: Drawing Wall & Stone Clicker */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Slate 3: Cavern Drawing Whiteboard */}
              <div className="bg-white rounded-3xl border border-amber-955/10 p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-amber-950/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-blue-50 rounded-xl border border-amber-950/5">
                      <PenTool className="w-5 h-5 text-blue-700" />
                    </span>
                    <h4 className="font-serif font-black text-base text-amber-950">
                      Vách Vẽ Ca Khảo Cổ
                    </h4>
                  </div>
                  <span className="text-[10px] font-serif text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-955/5">
                    Dùng Chuột Hoặc Tay Để Vẽ
                  </span>
                </div>

                {/* Direct Cavern Board Canvas */}
                <div className="h-[240px] bg-[#f4f1ea] rounded-2xl border border-amber-950/15 overflow-hidden relative">
                  <KrogCanvas purchasedIds={purchasedIds} />
                </div>
              </div>

              {/* Slate 4: Live Monolith Crusher */}
              <div className="bg-white rounded-3xl border border-amber-955/10 p-6 shadow-sm">
                <div className="border-b border-amber-950/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-50 rounded-xl border border-amber-950/5">
                      <Hammer className="w-5 h-5 text-amber-800" />
                    </span>
                    <div className="flex flex-col">
                      <h4 className="font-serif font-black text-base text-amber-950 leading-none">
                        Vách Đá Giải Sầu & Tiệm Oog-Ruk
                      </h4>
                      <span className="text-[10px] text-amber-800 font-serif italic mt-1 font-bold">
                        Click trực tiếp vào đá để xả sầu, tích sò nâng cấp trang bị thượng cổ!
                      </span>
                    </div>
                  </div>
                </div>

                <KrogCrusher
                  stones={stones}
                  setStones={setStones}
                  shells={shells}
                  setShells={setShells}
                  purchasedIds={purchasedIds}
                  setPurchasedIds={setPurchasedIds}
                />
              </div>

            </div>

          </div>
        </section>

        {/* Life comparison sheet strictly matching requests */}
        <section id="comparison-section" className="space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-black uppercase text-amber-900 tracking-widest block">
              <TrendingUp className="w-4 h-4 inline-block mr-1" /> Thước Đo Bản Thân
            </span>
            <h2 className="text-3xl font-serif font-black text-amber-950">
              Công Văn Phòng Ngột Ngạt vs. Bản Sắc Tự Do của Krog
            </h2>
            <p className="text-xs font-serif text-amber-800 font-bold">
              "Khi mệt mỏi mệt mỏi, hãy ngồi xuống bên bờ suối mài rìu mài rìu."
            </p>
          </div>

          <div className="overflow-hidden border border-amber-950/10 rounded-3xl bg-white shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 bg-amber-950 text-amber-50 font-serif text-xs uppercase tracking-wider font-extrabold py-4 px-5 sticky top-0 z-10 select-none">
              <div className="md:col-span-3 flex items-center">Hạng Mục So Sánh</div>
              <div className="md:col-span-4 mt-2 md:mt-0 flex items-center text-red-300">⚡ Cuộc Sống Văn Phòng Thường Nhật</div>
              <div className="md:col-span-5 mt-2 md:mt-0 flex items-center text-emerald-300 font-bold">🪓 Đời Sống Krog Tự Tại</div>
            </div>

            <div className="divide-y divide-amber-950/5">
              {compareItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-5 text-sm font-serif leading-relaxed transition-colors duration-150 ${
                    item.isHighlight ? 'bg-amber-100/15' : 'hover:bg-amber-50/10'
                  }`}
                >
                  <div className="md:col-span-3 font-serif text-sm font-black text-amber-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 block" />
                    {item.criteria}
                  </div>
                  <div className="md:col-span-4 text-[#7c6a58] italic pr-4">
                    {item.modern}
                  </div>
                  <div className="md:col-span-5 text-amber-950 font-bold flex items-start gap-2">
                    <span className="text-emerald-700 font-sans text-xs pt-1">✔</span>
                    <span>{item.krog}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traditional FAQs Panel without prompt builder or and AI stuff */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-[#7c695a] font-black">
              <HelpCircle className="w-4 h-4 text-orange-950" /> Trợ Giúp Nghi Nghi
            </div>
            <h2 className="text-3xl font-serif font-black text-amber-950">
              Giải Đáp Thắc Mắc Về Bộ Tộc Krog
            </h2>
            <p className="text-xs font-serif text-[#7c695a] font-bold">
              "Bình dị, thuần phác, nói thật nói thẳng giũ sạch gầu sầu."
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 pt-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-amber-955/15 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 md:p-5 flex justify-between items-center font-serif font-black text-amber-950 hover:bg-amber-50/20 cursor-pointer select-none transition-colors"
                >
                  <span>🚀 {idx + 1}. {faq.q}</span>
                  <span className="text-amber-800 text-lg transition-transform font-mono duration-200 ml-2">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>

                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-0 text-xs md:text-sm text-amber-900/85 leading-relaxed font-serif border-t border-amber-950/5 bg-amber-50/25">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Exquisite Production-Level Web Footer with Takaction focus */}
      <footer className="w-full bg-amber-950 text-amber-100 py-12 px-6 border-t border-amber-950 select-none opacity-95">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl">🪓</span>
              <span className="font-serif font-black text-lg text-white">Krog Việt Nam</span>
            </div>
            <p className="text-xs text-amber-300 max-w-sm font-serif">
              "Đập đá dọn sầu — Nghĩ bớt bớt, cười sung sướng, sống an lành như cỏ dại bờ suối."
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-2 text-center md:text-right">
            <p className="text-xs font-serif text-amber-200">
              Sản phẩm phục vụ cộng đồng, phát triển bởi <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mr-1" /> <strong>Takaction Studio</strong>
            </p>
            <div className="text-[10px] font-mono text-amber-400">
              © {new Date().getFullYear()} Takaction Studio. Tất cả các chiếc rìu đá đều đã được mài bóng loáng.
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
