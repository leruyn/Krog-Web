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
  const [selectedColor, setSelectedColor] = useState<string>('#2a2521'); // Charcoal
  const [selectedWidth, setSelectedWidth] = useState<number>(6);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canvasCleared, setCanvasCleared] = useState<boolean>(false);

  const premiumPaintUnlocked = purchasedIds.includes('ancient_paint');

  const baseColors = [
    { name: 'Than Củi (Charcoal)', value: '#2a2521' },
    { name: 'Đất Sét Đỏ (Ochre)', value: '#aa4d3d' },
    { name: 'Rêu Phong (Moss)', value: '#436130' },
    { name: 'Vỏ Sò Trắng (Chalk)', value: '#f4f1ea' },
  ];

  const colors = premiumPaintUnlocked
    ? [
        ...baseColors,
        { name: 'Quả Mâm Xôi (Raspberry Pink)', value: '#c21d7b' },
        { name: 'Hoàng Tổ Kim (Tribal Amber)', value: '#d97706' },
        { name: 'Lam Ngọc Bích (Lava Teal)', value: '#06b6d4' },
        { name: 'Mắc Ma Núi Lửa (Volcano Orange)', value: '#f97316' },
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

      // Keep lines on resize if possible, or just scale properly
      const rect = container.getBoundingClientRect();
      const currentWidth = canvas.width;
      const currentHeight = canvas.height;

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

    // Draw grid pattern (Cave Wall look)
    ctx.strokeStyle = 'rgba(42, 37, 33, 0.03)';
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

    // Throttle sound play slightly or rely on movement distance
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
    <div className="flex flex-col h-full bg-[#f4f1ea] p-4 text-[#2a2521] select-none">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-mono text-sm uppercase tracking-wider text-amber-900 font-bold flex items-center">
            <PenTool className="w-4 h-4 mr-1 stroke-2" /> Vách Đá Tự Sự
          </h3>
          <p className="text-[11px] text-amber-800 font-sans italic">
            Dùng ngón tay/chuột khắc ý nghĩ lơ lửng của krog...
          </p>
        </div>

        <div className="flex gap-1.5 bg-amber-100/50 p-1 rounded-lg border border-amber-900/10">
          <button
            onClick={handleUndo}
            disabled={historyIndexRef.current === 0}
            className="p-1 px-1.5 rounded hover:bg-amber-100 disabled:opacity-30 cursor-pointer text-amber-900"
            title="Sửa sai (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndexRef.current === strokeHistoryRef.current.length - 1}
            className="p-1 px-1.5 rounded hover:bg-amber-100 disabled:opacity-30 cursor-pointer text-amber-900"
            title="Khôi phục (Redo)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-1 px-1.5 rounded hover:bg-red-200 hover:text-red-950 cursor-pointer text-amber-900 duration-150"
            title="Lau sạch vách hang"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-amber-50 rounded-xl border border-dashed border-amber-950/20 shadow-inner overflow-hidden cursor-crosshair touch-none"
        style={{
          boxShadow: 'inset 0 4px 16px rgba(115, 80, 40, 0.05)',
          background: 'linear-gradient(to bottom, #faf8f5, #f5f2e9)'
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
          <div className="absolute inset-0 bg-amber-50/80 backdrop-blur-xs flex items-center justify-center animate-fade-out pointer-events-none">
            <span className="font-mono text-xs tracking-widest text-amber-800 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 stroke-2 animate-pulse" /> ĐÃ LAU SẠCH VÁCH HANG
            </span>
          </div>
        )}

        {lines.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-transparent opacity-35 pointer-events-none">
            <span className="text-3xl filter grayscale contrast-150 mb-2">🐚</span>
            <span className="text-[11px] font-mono tracking-wide max-w-[210px] text-amber-950">
              Vẽ bất cứ thứ gì bạn muốn quăng đi. Lau bằng nút đỏ.
            </span>
          </div>
        )}
      </div>

      {/* Color and Width selectors */}
      <div className="mt-3 grid grid-cols-1 gap-2 border-t border-amber-950/5 pt-3">
        {/* Color Palette */}
        <div className="flex gap-2 items-center justify-between">
          <label className="text-[10px] font-mono text-amber-900 font-bold uppercase flex items-center gap-0.5">
            Màu Sắc:
            {premiumPaintUnlocked && (
              <span className="text-[8px] text-orange-600 font-black animate-pulse font-serif" title="Đã mở khóa Cọ Vẽ Cổ Tiên!">✨ VIP</span>
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
                className={`w-6 h-6 rounded-full border-2 relative cursor-pointer outline-hidden transition-all ${
                  selectedColor === color.value ? 'scale-115 border-amber-900 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.value === '#f4f1ea' ? '#ffffff' : color.value }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <span className="absolute inset-0.5 rounded-full border border-white mix-blend-difference" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div className="flex gap-2 items-center justify-between mt-1">
          <label className="text-[11px] font-mono text-amber-900 font-bold uppercase">Nét Vẽ:</label>
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
                    ? 'bg-amber-900 text-amber-50 border-amber-950'
                    : 'bg-amber-100/50 text-amber-900/60 border-amber-900/10 hover:bg-amber-100'
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
