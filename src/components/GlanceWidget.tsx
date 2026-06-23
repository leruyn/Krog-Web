import React, { useState } from 'react';
import { WISDOM_POOL } from '../constants';
import { playWoodClickSound } from '../audio';
import { LayoutGrid, Eye, Terminal, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';

export default function GlanceWidget() {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [quoteIndex, setQuoteIndex] = useState<number>(() => {
    // Current day of the year index formula to align with the prompt
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day % WISDOM_POOL.length;
  });

  const [activeSubTab, setActiveSubTab] = useState<'emulator' | 'code'>('emulator');

  const handleNextQuote = () => {
    playWoodClickSound();
    setQuoteIndex((prev) => (prev + 1) % WISDOM_POOL.length);
  };

  const handlePrevQuote = () => {
    playWoodClickSound();
    setQuoteIndex((prev) => (prev - 1 + WISDOM_POOL.length) % WISDOM_POOL.length);
  };

  const activeQuote = WISDOM_POOL[quoteIndex];

  // Sizes metadata for simulator layout styling
  const sizeMetadata = {
    small: { title: 'Tiện ích Nhỏ (2x2)', width: 'w-48', height: 'h-36', text: 'text-[10px]' },
    medium: { title: 'Tiện ích Vừa (3x2)', width: 'w-64', height: 'h-40', text: 'text-xs' },
    large: { title: 'Tiện ích Lớn (4x2)', width: 'w-76', height: 'h-48', text: 'text-[13px]' },
  };

  const widgetCode = `// KrogWidget.kt - Jetpack Glance Code
package com.krog.vietnam.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import com.krog.vietnam.data.WisdomRepository

class KrogWidget : GlanceAppWidget() {

    override suspend fun provideContent(context: Context, id: GlanceId) {
        val repository = WisdomRepository()
        val todayWisdom = repository.getTodayWisdom()

        provideContent {
            KrogWidgetLayout(quote = todayWisdom.content)
        }
    }

    @Composable
    private fun KrogWidgetLayout(quote: String) {
        Column(
          modifier = GlanceModifier
            .fillMaxSize()
            .background(ColorProvider(androidx.compose.ui.graphics.Color(0xFFF4F1EA)))
            .padding(16.dp),
          horizontalAlignment = Alignment.CenterHorizontally,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = "HÔM NAY KROG NÓI:",
            style = TextStyle(
              color = ColorProvider(androidx.compose.ui.graphics.Color(0xFF8C7E6A)),
              fontWeight = FontWeight.Bold,
              fontSize = androidx.glance.text.FontSize(11f)
            ),
            modifier = GlanceModifier.padding(bottom = 8.dp)
          )
          
          Text(
            text = "\\"\$quote\\"",
            style = TextStyle(
              color = ColorProvider(androidx.compose.ui.graphics.Color(0xFF2C2C2C)),
              fontSize = androidx.glance.text.FontSize(14f),
              fontStyle = androidx.glance.text.FontStyle.Italic
            ),
            modifier = GlanceModifier.fillMaxWidth()
          )
        }
    }
}`;

  return (
    <div className="flex flex-col h-full bg-[#f4f1ea] p-4 text-[#2a2521] select-none justify-between overflow-y-auto">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-mono text-sm uppercase tracking-wider text-amber-900 font-bold flex items-center">
            <LayoutGrid className="w-4 h-4 mr-1.5 stroke-2" /> Tiện ích Android
          </h3>
          <div className="flex gap-1 bg-amber-200/40 p-0.5 rounded-lg border border-amber-950/10">
            <button
              onClick={() => { playWoodClickSound(); setActiveSubTab('emulator'); }}
              className={`px-2 py-0.5 text-[9px] font-mono cursor-pointer rounded-md font-bold uppercase ${
                activeSubTab === 'emulator' ? 'bg-amber-900 text-amber-50' : 'text-amber-900/60 hover:text-amber-900'
              }`}
            >
              Giả Lập Widget
            </button>
            <button
              onClick={() => { playWoodClickSound(); setActiveSubTab('code'); }}
              className={`px-2 py-0.5 text-[9px] font-mono cursor-pointer rounded-md font-bold uppercase ${
                activeSubTab === 'code' ? 'bg-amber-900 text-amber-50' : 'text-amber-900/60 hover:text-amber-900'
              }`}
            >
              Glance Code
            </button>
          </div>
        </div>
        <p className="text-[11px] text-amber-800 font-sans italic mb-4">
          Widget hiện trên màn hình Android thật dùng Jetpack Glance...
        </p>

        {activeSubTab === 'emulator' ? (
          <div className="flex flex-col items-center">
            {/* Form Size Options */}
            <div className="flex gap-1.5 mb-4 justify-center">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    setSize(sz);
                    playWoodClickSound();
                  }}
                  className={`px-2 py-1 text-[9px] font-mono cursor-pointer rounded border transition-all ${
                    size === sz
                      ? 'bg-amber-950 text-amber-50 border-amber-950'
                      : 'bg-amber-100/50 text-amber-900 border-amber-900/10 hover:bg-amber-100'
                  }`}
                >
                  {sz === 'small' ? 'Nhỏ 2x2' : sz === 'medium' ? 'Vừa 3x2' : 'Lớn 4x2'}
                </button>
              ))}
            </div>

            {/* Simulated Desktop Home Screen Wallpaper */}
            <div
              className="w-full h-64 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4 border border-amber-950/20"
              style={{
                backgroundImage: 'linear-gradient(to bottom, #111827, #1f2937, #111827)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Wallpaper decorative sky stars */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/25 via-transparent to-transparent opacity-40 pointer-events-none" />

              {/* Pseudo android status bar */}
              <div className="absolute top-0 left-0 w-full px-4 py-1 flex justify-between text-[8px] font-mono text-gray-400 font-bold opacity-70 pointer-events-none">
                <span>Bộ Tộc Việt 🌿</span>
                <span className="flex gap-1">
                  <span>📶</span>
                  <span>🔋 100%</span>
                </span>
              </div>

              {/* Tiny desktop shortcuts above */}
              <div className="absolute top-6 left-4 flex flex-col items-center gap-0.5 scale-75 opacity-70 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-amber-50/10 border border-white/15 flex items-center justify-center text-lg shadow-sm">
                  🪓
                </div>
                <span className="text-[7px] text-gray-300 font-mono">Mài Rìu</span>
              </div>

              <div className="absolute top-6 right-4 flex flex-col items-center gap-0.5 scale-75 opacity-70 pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-amber-50/10 border border-white/15 flex items-center justify-center text-lg shadow-sm">
                  🔥
                </div>
                <span className="text-[7px] text-gray-300 font-mono">Đốt Đống Lửa</span>
              </div>

              {/* Interactive Widget card on home screen */}
              <div
                className={`transition-all duration-300 ${sizeMetadata[size].width} ${sizeMetadata[size].height} bg-[#f4f1ea] rounded-xl flex flex-col items-center justify-center p-3 text-center border-2 border-amber-950/25 relative shadow-xl`}
                style={{
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(200,180,150,0.1) 0%, transparent 80%)'
                }}
              >
                {/* Size Label Tag inside emulator */}
                <div className="absolute -top-2.5 bg-amber-900 text-amber-50 font-mono text-[7px] font-bold px-1.5 py-0.5 rounded-full border border-amber-950 tracking-widest uppercase">
                  Krog Glance Widget
                </div>

                <div className="text-[10px] uppercase font-mono tracking-widest text-[#7c695a] font-black pb-1 hover:scale-105 duration-100 italic">
                  🌿 HÔM NAY KROG NÓI:
                </div>

                <div
                  className={`font-serif text-[#2c2621] mt-1 italic select-none line-clamp-4 ${sizeMetadata[size].text}`}
                  style={{
                    lineHeight: '1.4',
                  }}
                >
                  "{activeQuote.content}"
                </div>
              </div>

              {/* Pseudo screen search bar / hotseat */}
              <div className="absolute bottom-2 flex w-11/12 gap-3 justify-center scale-90 opacity-60">
                <div className="bg-white/10 border border-white/15 rounded-full w-4/5 py-1.5 px-3 flex items-center text-[7px] font-mono text-gray-300">
                  <span>Hỏi khôn ngoan Krog...</span>
                </div>
              </div>
            </div>

            {/* Wisdom card selector arrows below screen */}
            <div className="flex gap-4 mt-3.5 items-center justify-center">
              <button
                onClick={handlePrevQuote}
                className="w-8 h-8 rounded-full border border-amber-900/10 hover:border-amber-900/40 bg-amber-50 flex items-center justify-center text-amber-900 cursor-pointer shadow-xs active:scale-95 duration-150"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="text-[10px] font-mono text-amber-900 font-bold uppercase tracking-wide">
                Bản cổ {activeQuote.id} / 30
              </div>
              <button
                onClick={handleNextQuote}
                className="w-8 h-8 rounded-full border border-amber-900/10 hover:border-amber-900/40 bg-amber-50 flex items-center justify-center text-amber-900 cursor-pointer shadow-xs active:scale-95 duration-150"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* GLANCE COMPOSER CODE BLOCK */
          <div className="relative">
            <pre className="text-[10px] font-mono bg-amber-950/95 text-amber-200/90 p-3 rounded-xl overflow-x-auto max-h-[290px] leading-relaxed select-all border border-amber-950 shadow-inner">
              {widgetCode}
            </pre>
            <div className="absolute top-2 right-2 bg-amber-900 text-amber-50 rounded px-1.5 py-0.5 pointer-events-none font-mono text-[7px] font-bold uppercase tracking-wider">
              Kotlin
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[9px] font-mono text-amber-900/60 border-t border-amber-950/5 pt-2.5 mt-2">
        Jetpack Glance cho phép render layout bằng Compose ngay trên System Widget.
      </div>
    </div>
  );
}
