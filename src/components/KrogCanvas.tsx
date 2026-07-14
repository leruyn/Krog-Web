import React, { useRef, useState, useEffect } from 'react';
import { LineStroke } from '../types';
import { playScratchSound, playWoodClickSound } from '../audio';
import { Trash2, RotateCcw, RotateCw, Sparkles, PenTool } from 'lucide-react';

interface KrogCanvasProps {
  onSave?: (saved: LineStroke[]) => void;
  purchasedIds?: string[];
}

export default function KrogCanvas({ onSave, purchasedIds = [] }: KrogCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokeHistoryRef = useRef<LineStroke[][]>([[]]);
  const historyIndexRef = useRef<number>(0);

  const [lines, setLines] = useState<LineStroke[]>([]);
  const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[] | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#d4943a'); // Tribal Gold/Amber
  const [selectedWidth, setSelectedWidth] = useState<number>(6);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canvasCleared, setCanvasCleared] = useState<boolean>(false);

  const premiumPaintUnlocked = purchasedIds.includes('ancient_paint');

  const baseColors = [
    { name: 'Hoàng Tổ Kim (Tribal Gold)', value: '#d4943a' },
    { name: 'Vỏ Sò Trắng (Chalk)', value: '#ede5d8' },
    { name: 'Đất Sét Đỏ (Ochre)', value: '#aa4d3d' },
    { name: 'Rêu Phong (Moss)', value: '#436130' },
  ];

  const colors = premiumPaintUnlocked
    ? [
        ...baseColors,
        { name: 'Quả Mâm Xôi (Raspberry Pink)', value: '#c21d7b' },
        { name: 'Mắc Ma Núi Lửa (Volcano Orange)', value: '#f97316' },
        { name: 'Lam Ngọc Bích (Lava Teal)', value: '#06b6d4' },
        { name: 'Than Củi (Charcoal)', value: '#1a1512' },
      ]
    : baseColors;

  const widths = [
    { label: 'Thanh', value: 3 },
    { label: 'Vừa', value: 6 },
    { label: 'Thô', value: 12 },
  ];

  // Auto-resize canvas to match its container nicely
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();

      // Only resize if different to avoid redundant clearings
      if (Math.abs(canvas.width - rect.width) > 5 || Math.abs(canvas.height - (rect.height - 10)) > 5) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        redrawCanvas();
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [lines]);

  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number, isFirst: boolean, color: string, width: number) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    if (isFirst) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y); // Small dot
      ctx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern (Cave Wall look in golden accent)
    ctx.strokeStyle = 'rgba(212, 148, 58, 0.04)';
    ctx.lineWidth = 1;
    const size = 30;
    for (let x = 0; x < canvas.width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw actual lines
    lines.forEach((line) => {
      if (line.points.length === 0) return;
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;

      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [lines]);

  // Handle pointer draw coordinates safely
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentLine([{ x, y }]);
    e.currentTarget.setPointerCapture(e.pointerId);

    drawPoint(ctx, x, y, true, selectedColor, selectedWidth);
    playScratchSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentLine) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lastPt = currentLine[currentLine.length - 1];
    const dist = Math.hypot(x - lastPt.x, y - lastPt.y);
    if (dist > 10 && Math.random() < 0.4) {
      playScratchSound();
    }

    const nextPoints = [...currentLine, { x, y }];
    setCurrentLine(nextPoints);

    // Dynamic draw
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = selectedWidth;
    ctx.moveTo(lastPt.x, lastPt.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (currentLine && currentLine.length > 0) {
      const newLineStroke: LineStroke = {
        points: currentLine,
        color: selectedColor,
        width: selectedWidth,
      };
      const updatedLines = [...lines, newLineStroke];
      setLines(updatedLines);

      // Save to history index
      const newHistory = strokeHistoryRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(updatedLines);
      strokeHistoryRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;

      if (onSave) onSave(updatedLines);
    }
    setCurrentLine(null);
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      playWoodClickSound();
      historyIndexRef.current -= 1;
      setLines(strokeHistoryRef.current[historyIndexRef.current]);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < strokeHistoryRef.current.length - 1) {
      playWoodClickSound();
      historyIndexRef.current += 1;
      setLines(strokeHistoryRef.current[historyIndexRef.current]);
    }
  };

  const handleClear = () => {
    playWoodClickSound();
    const updatedLines: LineStroke[] = [];
    setLines(updatedLines);

    // Save history clear step
    const newHistory = strokeHistoryRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(updatedLines);
    strokeHistoryRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;

    setCanvasCleared(true);
    setTimeout(() => setCanvasCleared(false), 800);

    if (onSave) onSave(updatedLines);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0d0b] p-4 text-[#ede5d8] select-none rounded-2xl border border-[#d4943a]/8">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#d4943a] font-bold flex items-center">
            <PenTool className="w-4 h-4 mr-1 stroke-2" /> Vách Đá Tự Sự
          </h3>
          <p className="text-[10px] text-[#9a8d7e] font-serif italic">
            Dùng ngón tay/chuột khắc ý nghĩ lơ lửng của krog...
          </p>
        </div>

        <div className="flex gap-1 bg-[#1c1915] p-1 rounded-lg border border-[#d4943a]/12">
          <button
            onClick={handleUndo}
            disabled={historyIndexRef.current === 0}
            className="p-1 px-1.5 rounded hover:bg-[#d4943a]/10 disabled:opacity-30 cursor-pointer text-[#ede5d8] transition-colors"
            title="Sửa sai (Undo)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndexRef.current === strokeHistoryRef.current.length - 1}
            className="p-1 px-1.5 rounded hover:bg-[#d4943a]/10 disabled:opacity-30 cursor-pointer text-[#ede5d8] transition-colors"
            title="Khôi phục (Redo)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1 px-1.5 rounded hover:bg-red-950/50 hover:text-red-400 cursor-pointer text-[#9a8d7e] duration-150 transition-colors"
            title="Lau sạch vách hang"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Styled Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-[#110e0c] rounded-xl border border-[#d4943a]/15 shadow-inner overflow-hidden cursor-crosshair touch-none"
        style={{
          boxShadow: 'inset 0 4px 16px rgba(0, 0, 0, 0.5)',
          background: 'linear-gradient(to bottom, #110e0c, #1a1512)'
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block absolute top-0 left-0"
        />

        {canvasCleared && (
          <div className="absolute inset-0 bg-[#0c0a08]/90 backdrop-blur-xs flex items-center justify-center anim-fade-out pointer-events-none">
            <span className="font-mono text-[10px] tracking-widest text-[#d4943a] flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 stroke-2 animate-pulse" /> ĐÃ LAU SẠCH VÁCH HANG
            </span>
          </div>
        )}

        {lines.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-transparent opacity-35 pointer-events-none">
            <span className="text-3xl filter grayscale contrast-150 mb-2">🐚</span>
            <span className="text-[10px] font-mono tracking-wide max-w-[210px] text-[#9a8d7e]">
              Vẽ bất cứ thứ gì bạn muốn quăng đi. Lau bằng nút rác đỏ.
            </span>
          </div>
        )}
      </div>

      {/* Color and Width selectors */}
      <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[#d4943a]/8 pt-3">
        {/* Color Palette */}
        <div className="flex gap-2 items-center justify-between">
          <label className="text-[10px] font-mono text-[#9a8d7e] font-bold uppercase flex items-center gap-0.5">
            Màu sắc:
            {premiumPaintUnlocked && (
              <span className="text-[8px] text-[#d4943a] font-black animate-pulse font-serif" title="Đã mở khóa Cọ Vẽ Cổ Tiên!">✨ VIP</span>
            )}
          </label>
          <div className="flex gap-1.5 flex-wrap justify-end max-w-[210px]">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setSelectedColor(color.value);
                  playWoodClickSound();
                }}
                className={`w-5.5 h-5.5 rounded-full border relative cursor-pointer outline-hidden transition-all ${
                  selectedColor === color.value ? 'scale-110 border-[#d4943a] shadow-lg shadow-[#d4943a]/10' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <span className="absolute inset-0.5 rounded-full border border-[#0c0a08]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div className="flex gap-2 items-center justify-between mt-1">
          <label className="text-[10px] font-mono text-[#9a8d7e] font-bold uppercase">Nét vẽ:</label>
          <div className="flex gap-1">
            {widths.map((w) => (
              <button
                key={w.value}
                onClick={() => {
                  setSelectedWidth(w.value);
                  playWoodClickSound();
                }}
                className={`px-2.5 py-0.5 text-[10px] font-mono rounded-md border cursor-pointer outline-hidden transition-all ${
                  selectedWidth === w.value
                    ? 'bg-[#d4943a] text-[#0c0a08] border-[#d4943a] font-bold'
                    : 'bg-[#1c1915] text-[#9a8d7e] border-[#d4943a]/12 hover:bg-[#231f1a]'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
