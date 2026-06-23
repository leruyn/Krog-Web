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

  const [activeFace, setActiveFace] = useState<'normal' | 'cracked' | 'broken'>('normal');
  const [crackSeverity, setCrackSeverity] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [isHitting, setIsHitting] = useState<boolean>(false);

  const expressions = [
    'Oải lắm! Đập thêm!',
    'Hả giáp! Rầm!',
    'Sếp la krog? Bốp!',
    'Yêu đơn phương? Cút!',
    'Rời phố về hang đập đá!',
    'Đá mẻ rồi, đập mạnh!',
    'Tránh ra, krog đang điên!'
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
      desc: 'Hương vị béo ngậy nướng lá dâu rừng thơm phức sưởi ấm bụng đói Krog suốt mùa tuyết rơi.',
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
      desc: 'Một quả trứng nứt ra chú T-Rex siêu dễ thương đi loanh quanh hú ré động viên Krog.',
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
      id: 'vip_cave_cert',
      name: 'Sổ Đỏ Hang VIP',
      desc: 'Chủ sở hữu danh giá hang đá độc quyền có cách âm chống bão dông hú gió bấc.',
      stoneCost: 150,
      shellCost: 15,
      emoji: '🌋',
      type: 'badge' as const,
    },
    {
      id: 'ancient_paint',
      name: 'Cọ Vẽ Vẽ Bậy Tổ Tiên',
      desc: 'Nhựa quả mâm xôi để nguệch ngoạc hổ báo bờm ngựa lên vách hang xả trét hết sẩy.',
      stoneCost: 80,
      shellCost: 4,
      emoji: '🎨',
      type: 'badge' as const,
    },
    {
      id: 'title_billionaire',
      name: 'Danh Hiệu Triệu Phú Sò',
      desc: 'Khiến tộc nhân nể sợ, cúi đầu chào bái và dâng hiến dưa hấu hoang mỗi buổi sáng.',
      stoneCost: 250,
      shellCost: 30,
      emoji: '👑',
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
  let shellChance = 0.3;
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

  // Bonus from tribal gong: increase shell chance by 10%
  if (purchasedIds.includes('tribal_gong')) {
    shellChance = Math.min(0.95, shellChance + 0.10);
  }

  const handleSmash = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    playSmashSound();
    setIsHitting(true);
    setTimeout(() => setIsHitting(false), 90);

    // Increment points
    const clickStones = clickMultiplier;
    const clickShells = Math.random() < shellChance ? 1 : 0;
    setStones((prev) => prev + clickStones);
    if (clickShells > 0) {
      setShells((prev) => prev + clickShells);
    }

    // Capture click coordinate inside relative container
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Generate cracking severity
    setCrackSeverity((prev) => {
      const next = prev + 1;
      if (next >= 12) {
        // Reset full fracture animation
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
        vy: Math.sin(angle) * speed - 2, // Upward bias
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setParticles((prev) => [...prev, ...nextParticles]);

    // Floating text
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
      alert('Krog chưa gom đủ đá núi hoặc vỏ sò lấp lánh rồi!');
      return;
    }

    playChiselSound();
    setStones((prev) => prev - stoneCost);
    setShells((prev) => prev - shellCost);
    setPurchasedIds((prev) => [...prev, id]);

    // Show a floating visual response
    setFloatTexts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: 150,
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
    <div className="flex flex-col h-full bg-[#f4f1ea] p-4 text-[#2a2521] select-none justify-between">
      {/* Pocket counts */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="bg-amber-100/40 border border-amber-950/10 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪨</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold tracking-wide text-amber-800 uppercase">Đá lượm được</span>
              <span className="font-mono text-base font-black text-amber-950 leading-none">{stones}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-100/40 border border-amber-950/10 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐚</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold tracking-wide text-amber-800 uppercase">Sò quý đổi thịt</span>
              <span className="font-mono text-base font-black text-amber-950 leading-none">{shells}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle View Buttons */}
      <div className="flex border border-amber-950/10 rounded-lg p-0.5 bg-amber-50/50 my-1 justify-between text-xs font-mono font-bold">
        <button
          onClick={() => { playWoodClickSound(); setActiveSubView('smash'); }}
          className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer ${
            activeSubView === 'smash' ? 'bg-amber-900 text-[#f4f1ea]' : 'text-amber-900/60 hover:text-amber-900'
          }`}
        >
          🪨 Đập Đá Ngày Đêm
        </button>
        <button
          onClick={() => { playWoodClickSound(); setActiveSubView('shop'); }}
          className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubView === 'shop' ? 'bg-amber-900 text-[#f4f1ea]' : 'text-amber-900/60 hover:text-amber-900'
          }`}
        >
          🏪 Tiệm Đồ Oog-Ruk
          {purchasedIds.length > 0 && (
            <span className="bg-orange-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
              {purchasedIds.length}
            </span>
          )}
        </button>
      </div>

      {activeSubView === 'smash' ? (
        <>
          {/* Main Interactive Rock */}
          <div className="flex-1 flex flex-col items-center justify-center relative my-2">
            <p className="text-center font-mono text-[9px] uppercase text-amber-800 tracking-wider font-bold mb-2">
              {clickMultiplier > 1 ? `⚒️ Đang cầm: ${toolLabel}` : 'Chạm liên tục để mài sắc tảng đá xả xì-trét'}
            </p>

            <div
              onClick={handleSmash}
              className={`w-36 h-36 relative rounded-full flex items-center justify-center cursor-pointer transition-transform duration-75 active:scale-95 ${
                isHitting ? 'scale-90 rotate-1' : 'hover:scale-105'
              }`}
            >
              {/* SVG Stone rendering with dynamic fissures */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl select-none">
                {/* The Raw Rock Shape */}
                <polygon
                  points="20,40 30,20 60,15 85,35 90,65 70,85 35,90 12,70"
                  fill="#7a7065"
                  stroke="#433b35"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Rock highlight shading */}
                <polygon
                  points="30,22 58,18 80,36 50,50"
                  fill="#a39689"
                  opacity="0.35"
                />
                {/* Ambient shadow bottom */}
                <polygon
                  points="32,87 70,82 85,65 60,65"
                  fill="#2a2521"
                  opacity="0.25"
                />

                {/* Dynamic Crack layers based on clicks */}
                {crackSeverity > 0 && (
                  <path
                    d="M 50,50 L 30,35 M 50,50 L 70,40"
                    stroke="#1c1815"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {crackSeverity > 3 && (
                  <path
                    d="M 30,35 L 20,45 M 70,40 L 85,45 M 50,50 L 55,75"
                    stroke="#1c1815"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}
                {crackSeverity > 6 && (
                  <path
                    d="M 55,75 L 35,85 M 55,75 L 75,82 M 30,35 L 45,20"
                    stroke="#1c1815"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
                {crackSeverity > 9 && (
                  <path
                    d="M 12,70 L 40,50 L 90,65"
                    stroke="#0e0a08"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* SVG Sparkle Icon in the middle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-amber-100 flex items-center justify-center font-black font-mono text-lg tracking-wider bg-transparent">
                {toolEmoji}
              </div>

              {/* Flying Particles */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute bg-[#504840] border border-[#2a2521]"
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
                  className="absolute font-mono text-[11px] font-black text-[#5c4a3c] bg-white/90 px-1.5 py-0.5 rounded-md border border-amber-950/20 shadow-xs pointer-events-none whitespace-nowrap animate-float-up animate-none"
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
        <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 py-1.5 my-1 space-y-2">
          <div className="bg-orange-100/50 border border-orange-900/10 rounded-xl p-2.5 mb-2">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1">
              ⛺ Bộ Tộc Oog-Ruk Chào Bạn!
            </h5>
            <p className="text-[10px] text-orange-900/80 leading-normal font-sans mt-0.5">
              Trao đổi vỏ sò lấp lánh và đá thô lượm trên núi để đổi lấy tư trang cực xịn sưởi ấm hang lạnh.
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
                      ? 'bg-amber-100/20 border-amber-950/5 opacity-75'
                      : 'bg-amber-50/70 border-amber-950/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl bg-[#eae2d5] p-1.5 rounded-xl border border-amber-950/10 flex items-center justify-center">
                      {item.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10.5px] font-mono font-bold text-amber-950 flex items-center gap-1">
                        {item.name}
                        {isPurchased && (
                          <span className="bg-emerald-600 text-white text-[7px] font-mono px-1 py-0.1 rounded uppercase">
                            Đã Sở Hữu
                          </span>
                        )}
                      </span>
                      <span className="text-[9.5px] text-amber-900/75 leading-tight font-sans">
                        {item.desc}
                      </span>
                      <span className="text-[8.5px] font-mono text-amber-800 font-bold mt-1 flex items-center gap-2">
                        Giá: <span className="text-amber-950">🪨 {item.stoneCost}</span>
                        {item.shellCost > 0 && <span className="text-amber-950">🐚 {item.shellCost}</span>}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(item.id, item.stoneCost, item.shellCost)}
                    disabled={isPurchased}
                    className={`px-2.5 py-1.5 rounded-lg font-mono text-[9.5px] font-bold shrink-0 cursor-pointer transition-all ${
                      isPurchased
                        ? 'bg-amber-100 text-amber-950/30 border-none cursor-not-allowed'
                        : canAfford
                        ? 'bg-orange-850 hover:bg-orange-950 text-white border border-transparent'
                        : 'bg-amber-200/55 text-amber-900/50 cursor-pointer hover:bg-amber-200'
                    }`}
                  >
                    {isPurchased ? 'Sở hữu' : 'Đổi ngay'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hammer/Axe selection buttons */}
      <div className="flex items-center justify-between mt-1.5 border-t border-amber-950/10 pt-2.5">
        <button
          onClick={handleResetPocket}
          className="text-[9.5px] font-mono px-2.5 py-1 rounded bg-[#e8e3d5] border border-amber-950/15 text-amber-900 cursor-pointer hover:bg-red-100 hover:text-red-950 duration-150"
        >
          Để Đá Lại Rừng 🏔️
        </button>

        <span className="font-mono text-[9px] italic text-[#80766a] flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-orange-600 fill-orange-500 animate-pulse" /> Đã sắm {purchasedIds.length}/{shopItems.length} bảo bối
        </span>
      </div>
    </div>
  );
}
