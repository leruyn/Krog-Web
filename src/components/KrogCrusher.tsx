import React, { useState, useEffect } from 'react';
import { playSmashSound, playWoodClickSound, playChiselSound } from '../audio';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
}

interface FloatText {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface KrogCrusherProps {
  stones: number;
  setStones: React.Dispatch<React.SetStateAction<number>>;
  shells: number;
  setShells: React.Dispatch<React.SetStateAction<number>>;
  purchasedIds: string[];
  setPurchasedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function KrogCrusher({
  stones,
  setStones,
  shells,
  setShells,
  purchasedIds,
  setPurchasedIds,
}: KrogCrusherProps) {
  const [activeSubView, setActiveSubView] = useState<'smash' | 'shop'>('smash');
  const [crackSeverity, setCrackSeverity] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [isHitting, setIsHitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const expressions = [
    'Oải lắm! Đập thêm!',
    'Hả giáp! Rầm! 🪓',
    'Sếp la krog? Bốp!',
    'Yêu đơn phương? Cút! 💔',
    'Rời phố về hang đập đá!',
    'Đá mẻ rồi, đập mạnh!',
    'Xua tan mệt mỏi! Bốp!'
  ];

  const shopItems = [
    {
      id: 'spoon',
      name: 'Thìa Đá Oog-Ruk',
      desc: 'Công cụ xúc đá tốc độ thấp. Đập đá +2 đá mỗi phát!',
      stoneCost: 20,
      shellCost: 0,
      emoji: '🥄',
      type: 'upgrade' as const,
    },
    {
      id: 'axe_bronze',
      name: 'Rìu Đồng Đại Tộc',
      desc: 'Hỏa lực siêu cấp. Đập đá +5 đá và tăng tỉ lệ lượm sò!',
      stoneCost: 50,
      shellCost: 5,
      emoji: '🪓',
      type: 'upgrade' as const,
    },
    {
      id: 'chisel_gold',
      name: 'Đục Thạch Anh Hoàng Gia',
      desc: 'Được chạm khắc sắc lẹm từ thạch anh núi lửa. Đập đá +10 đá mỗi phát!',
      stoneCost: 120,
      shellCost: 10,
      emoji: '🔱',
      type: 'upgrade' as const,
    },
    {
      id: 'drill_crystal',
      name: 'Khoan Kim Cương Sấm Sét',
      desc: 'Hàng tuyển sấm truyền thời đồ đá. Đập đá +25 đá một cú rầm rầm!',
      stoneCost: 300,
      shellCost: 25,
      emoji: '⚡',
      type: 'upgrade' as const,
    },
    {
      id: 'glove_infinity',
      name: 'Găng Tay Krog Vô Cực',
      desc: 'Bảo bối Thanos tối thượng thung lũng hoang dã. Đập đá +60 đá, sò rơi 95%!',
      stoneCost: 650,
      shellCost: 50,
      emoji: '🥊',
      type: 'upgrade' as const,
    },
    {
      id: 'roasted_mammoth',
      name: 'Thịt Voi Ma Mút',
      desc: 'Hương vị béo ngậy nướng lá dâu rừng thơm phức sưởi ấm bụng đói Krog.',
      stoneCost: 30,
      shellCost: 2,
      emoji: '🍖',
      type: 'badge' as const,
    },
    {
      id: 'warm_bonfire',
      name: 'Ngọn Lửa Sưởi Hang',
      desc: 'Bập bùng sưởi ấm, giúp vơi đi sương mù tối tăm cô độc thâm sâu lâu năm.',
      stoneCost: 45,
      shellCost: 3,
      emoji: '🔥',
      type: 'badge' as const,
    },
    {
      id: 'funny_dino',
      name: 'Bé Khủng Long T-Rex Éc Éc',
      desc: 'Một quả trứng nứt ra chú T-Rex dễ thương đi loanh quanh hú ré động viên Krog.',
      stoneCost: 110,
      shellCost: 8,
      emoji: '🦖',
      type: 'badge' as const,
    },
    {
      id: 'tribal_gong',
      name: 'Chiêng Đồng Tộc Gọi Bầy',
      desc: 'Gõ phát rầm rầm kêu gọi anh em gom cổ vật, tăng tỉ lệ rớt vỏ sò thêm +10%!',
      stoneCost: 180,
      shellCost: 18,
      emoji: '🔔',
      type: 'badge' as const,
    },
    {
      id: 'ancient_paint',
      name: 'Cọ Vẽ Vẽ Bậy Tổ Tiên',
      desc: 'Nhựa quả mâm xôi để nguệch ngoạc sắc màu huyền ảo lên vách hang xả trét.',
      stoneCost: 80,
      shellCost: 4,
      emoji: '🎨',
      type: 'badge' as const,
    }
  ];

  // Update flying particles
  useEffect(() => {
    let frameId: number;
    const updatePhysics = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // Gravity
            rotation: p.rotation + p.vx * 2,
          }))
          .filter((p) => p.y < 500 && p.x > -50 && p.x < 450)
      );
      frameId = requestAnimationFrame(updatePhysics);
    };
    frameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Set floating text cleanup
  useEffect(() => {
    if (floatTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatTexts((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [floatTexts]);

  // Work out multi yields
  let clickMultiplier = 1;
  let shellChance = 0.25;
  let toolLabel = 'Đập tay không (1x)';
  let toolEmoji = '✊';

  if (purchasedIds.includes('glove_infinity')) {
    clickMultiplier = 60;
    shellChance = 0.9;
    toolLabel = '⚡ Găng Tay Krog Vô Cực (60x!)';
    toolEmoji = '🥊';
  } else if (purchasedIds.includes('drill_crystal')) {
    clickMultiplier = 25;
    shellChance = 0.75;
    toolLabel = '🌪️ Khoan Kim Cương Sấm (25x!)';
    toolEmoji = '⚡';
  } else if (purchasedIds.includes('chisel_gold')) {
    clickMultiplier = 10;
    shellChance = 0.61;
    toolLabel = '🔱 Đục Thạch Anh Hoàng Gia (10x!)';
    toolEmoji = '🔱';
  } else if (purchasedIds.includes('axe_bronze')) {
    clickMultiplier = 5;
    shellChance = 0.5;
    toolLabel = '🪓 Rìu Đồng đại tộc (5x!)';
    toolEmoji = '🪓';
  } else if (purchasedIds.includes('spoon')) {
    clickMultiplier = 2;
    shellChance = 0.4;
    toolLabel = '🥄 Thìa Oog-Ruk (2x!)';
    toolEmoji = '🥄';
  }

  if (purchasedIds.includes('tribal_gong')) {
    shellChance = Math.min(0.95, shellChance + 0.10);
  }

  const handleSmash = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    playSmashSound();
    setIsHitting(true);
    setTimeout(() => setIsHitting(false), 90);

    const clickStones = clickMultiplier;
    const clickShells = Math.random() < shellChance ? 1 : 0;
    setStones((prev) => prev + clickStones);
    if (clickShells > 0) {
      setShells((prev) => prev + clickShells);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setCrackSeverity((prev) => {
      const next = prev + 1;
      if (next >= 12) {
        setTimeout(() => setCrackSeverity(0), 400);
        return 12;
      }
      return next;
    });

    // Make particles
    const nextParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      nextParticles.push({
        id: Date.now() + i + Math.random(),
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setParticles((prev) => [...prev, ...nextParticles]);

    const funnyText = clickShells > 0 ? `+${clickMultiplier} Đá & +1 Sò! 🐚` : `+${clickMultiplier} Đá Rừng! 🪨`;
    const randomKrogSpeak = expressions[Math.floor(Math.random() * expressions.length)];
    const floatingMsg = Math.random() < 0.45 ? randomKrogSpeak : funnyText;

    setFloatTexts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY - 15,
        text: floatingMsg,
      },
    ]);
  };

  const handleBuy = (id: string, stoneCost: number, shellCost: number) => {
    if (purchasedIds.includes(id)) return;
    if (stones < stoneCost || shells < shellCost) {
      setErrorMessage('Krog chưa gom đủ đá núi hoặc vỏ sò lấp lánh rồi!');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    playChiselSound();
    setStones((prev) => prev - stoneCost);
    setShells((prev) => prev - shellCost);
    setPurchasedIds((prev) => [...prev, id]);

    setFloatTexts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: 100,
        y: 100,
        text: `🎉 ĐÃ TẬU ĐỒ MỚI!`,
      },
    ]);
  };

  const handleResetPocket = () => {
    if (window.confirm('Krog muốn trả hết đá, vỏ sò và đồ đạc Oog-Ruk về rừng xưa không?')) {
      playWoodClickSound();
      setStones(0);
      setShells(0);
      setPurchasedIds([]);
      setCrackSeverity(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0d0b] p-4 text-[#ede5d8] select-none rounded-2xl border border-[#d4943a]/8 min-h-[350px] justify-between">
      {/* Pocket counts */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="bg-[#1c1915]/60 border border-[#d4943a]/10 rounded-xl p-2 md:p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪨</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold tracking-wide text-[#9a8d7e] uppercase">Đá lượm được</span>
              <span className="font-mono text-xs md:text-sm font-black text-[#ede5d8] leading-none mt-0.5">{stones}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1c1915]/60 border border-[#d4943a]/10 rounded-xl p-2 md:p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐚</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold tracking-wide text-[#9a8d7e] uppercase">Sò đổi bảo bối</span>
              <span className="font-mono text-xs md:text-sm font-black text-[#ede5d8] leading-none mt-0.5">{shells}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle View Buttons */}
      <div className="flex border border-[#d4943a]/8 rounded-lg p-0.5 bg-[#151210] my-1 justify-between text-xs font-mono font-bold">
        <button
          onClick={() => { playWoodClickSound(); setActiveSubView('smash'); }}
          className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer ${
            activeSubView === 'smash' ? 'bg-[#d4943a] text-[#0c0a08]' : 'text-[#9a8d7e] hover:text-[#ede5d8]'
          }`}
        >
          🪨 Đập Đá Ngày Đêm
        </button>
        <button
          onClick={() => { playWoodClickSound(); setActiveSubView('shop'); }}
          className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubView === 'shop' ? 'bg-[#d4943a] text-[#0c0a08]' : 'text-[#9a8d7e] hover:text-[#ede5d8]'
          }`}
        >
          🏪 Tiệm Đồ Oog-Ruk
          {purchasedIds.length > 0 && (
            <span className="bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
              {purchasedIds.length}
            </span>
          )}
        </button>
      </div>

      {activeSubView === 'smash' ? (
        <>
          {/* Main Interactive Rock */}
          <div className="flex-1 flex flex-col items-center justify-center relative my-4 min-h-[160px]">
            <p className="text-center font-mono text-[9px] uppercase text-[#9a8d7e] tracking-wider font-bold mb-2">
              {clickMultiplier > 1 ? `⚒️ Đang dùng: ${toolLabel}` : 'Chạm liên tục để đập tảng đá xả xì-trét'}
            </p>

            <div
              onClick={handleSmash}
              className={`w-28 h-28 relative rounded-full flex items-center justify-center cursor-pointer transition-transform duration-75 active:scale-95 ${
                isHitting ? 'scale-90 rotate-1' : 'hover:scale-105'
              }`}
            >
              {/* SVG Stone rendering with dynamic fissures */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl select-none">
                <polygon
                  points="20,40 30,20 60,15 85,35 90,65 70,85 35,90 12,70"
                  fill="#4a423b"
                  stroke="#2a2521"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <polygon
                  points="30,22 58,18 80,36 50,50"
                  fill="#73675c"
                  opacity="0.35"
                />
                <polygon
                  points="32,87 70,82 85,65 60,65"
                  fill="#1c1815"
                  opacity="0.25"
                />

                {crackSeverity > 0 && (
                  <path
                    d="M 50,50 L 30,35 M 50,50 L 70,40"
                    stroke="#110e0c"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {crackSeverity > 3 && (
                  <path
                    d="M 30,35 L 20,45 M 70,40 L 85,45 M 50,50 L 55,75"
                    stroke="#110e0c"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {crackSeverity > 6 && (
                  <path
                    d="M 55,75 L 35,85 M 55,75 L 75,82 M 30,35 L 45,20"
                    stroke="#110e0c"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
                {crackSeverity > 9 && (
                  <path
                    d="M 12,70 L 40,50 L 90,65"
                    stroke="#000000"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-2xl">
                {toolEmoji}
              </div>

              {/* Flying Particles */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute bg-[#5c5249] border border-[#231e1a]"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.size,
                    height: p.size,
                    transform: `rotate(${p.rotation}deg)`,
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    opacity: 0.9,
                    pointerEvents: 'none',
                  }}
                />
              ))}

              {/* Floating Text values */}
              {floatTexts.map((f) => (
                <div
                  key={f.id}
                  className="absolute font-mono text-[9px] font-black text-[#ede5d8] bg-[#1c1915] px-1.5 py-0.5 rounded border border-[#d4943a]/25 shadow-md pointer-events-none whitespace-nowrap animate-float-up"
                  style={{
                    left: f.x - 30,
                    top: f.y - 10,
                  }}
                >
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Oog-Ruk Exchange Shop view list */
        <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 py-1 my-1 space-y-2">
          {errorMessage && (
            <div className="bg-red-950/80 border border-red-500/30 rounded-xl p-2 text-center text-[10px] text-red-200">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="bg-[#1c1915]/60 border border-[#d4943a]/10 rounded-xl p-2.5">
            <h5 className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#d4943a] flex items-center gap-1">
              ⛺ Oog-Ruk Chào Bạn!
            </h5>
            <p className="text-[9.5px] text-[#9a8d7e] leading-normal font-sans mt-0.5">
              Trao đổi vỏ sò lấp lánh và đá núi lấy tư trang cực xịn sưởi ấm căn hang hoang lạnh.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {shopItems.map((item) => {
              const isPurchased = purchasedIds.includes(item.id);
              const canAfford = stones >= item.stoneCost && shells >= item.shellCost;

              return (
                <div
                  key={item.id}
                  className={`border rounded-xl p-2 flex items-center justify-between gap-2.5 transition-all ${
                    isPurchased
                      ? 'bg-[#1c1915]/20 border-[#d4943a]/5 opacity-60'
                      : 'bg-[#151210] border-[#d4943a]/10 hover:border-[#d4943a]/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl bg-[#1c1915] p-1.5 rounded-xl border border-[#d4943a]/10 flex items-center justify-center">
                      {item.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-bold text-[#ede5d8] flex items-center gap-1">
                        {item.name}
                        {isPurchased && (
                          <span className="bg-emerald-800 text-emerald-100 text-[6px] font-mono px-1 py-0.2 rounded uppercase">
                            Sở Hữu
                          </span>
                        )}
                      </span>
                      <span className="text-[9px] text-[#9a8d7e] leading-tight font-sans">
                        {item.desc}
                      </span>
                      <span className="text-[8px] font-mono text-[#d4943a] mt-1 flex items-center gap-2">
                        Giá: <span>🪨 {item.stoneCost}</span>
                        {item.shellCost > 0 && <span>🐚 {item.shellCost}</span>}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(item.id, item.stoneCost, item.shellCost)}
                    disabled={isPurchased}
                    className={`px-2 py-1 rounded-lg font-mono text-[9px] font-bold shrink-0 cursor-pointer transition-all ${
                      isPurchased
                        ? 'bg-[#1c1915] text-[#9a8d7e]/30 cursor-not-allowed'
                        : canAfford
                        ? 'bg-[#d4943a] text-[#0c0a08] hover:bg-[#e8a838]'
                        : 'bg-[#1c1915] text-[#9a8d7e]/40 hover:bg-[#1c1915]/80'
                    }`}
                  >
                    {isPurchased ? 'Có rồi' : 'Đổi'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-1 border-t border-[#d4943a]/8 pt-2">
        <button
          onClick={handleResetPocket}
          className="text-[8.5px] font-mono px-2 py-1 rounded bg-[#151210] border border-[#d4943a]/12 text-[#9a8d7e] cursor-pointer hover:bg-red-950 hover:text-red-300 transition-colors"
        >
          Để Đá Lại Rừng 🏔️
        </button>

        <span className="font-mono text-[8px] italic text-[#5c5247] flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-[#d4943a] fill-[#d4943a]/30 animate-pulse" /> Đã sắm {purchasedIds.length}/{shopItems.length} bảo bối
        </span>
      </div>
    </div>
  );
}
