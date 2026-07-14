import React, { useState, useEffect } from 'react';
import { WisdomQuote } from './types';
import { WISDOM_POOL, KROG_DICTIONARY } from './constants';
import { playWoodClickSound, playChiselSound, playSmashSound } from './audio';
import { TRANSLATIONS, BILINGUAL_FEATURES, BILINGUAL_FAQS, WISDOM_POOL_EN, KROG_DICTIONARY_EN } from './translation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Shield,
  Clock,
  Heart,
  X,
  Menu,
  Sparkle,
  Hammer,
  BookOpen,
  Palette,
  Smartphone,
  Share2,
  ExternalLink,
  Award,
  CheckCircle,
  Star,
  Info,
  ChevronRight,
  Compass,
  Smile,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Globe
} from 'lucide-react';

const FEATURE_ICONS = {
  crusher: Hammer,
  diary: BookOpen,
  canvas: Palette,
  bonfire: Flame
};

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lang, setLang] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('krog_lang');
    return (saved === 'vi' || saved === 'en') ? saved : 'vi';
  });
  const [todayWisdom, setTodayWisdom] = useState<WisdomQuote>(WISDOM_POOL[0]);
  const [dayOfYear, setDayOfYear] = useState<number>(1);
  const [customQuoteIndex, setCustomQuoteIndex] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Custom hash-router for Google Play Privacy Policy compliance
  const [viewPolicy, setViewPolicy] = useState<'privacy' | 'terms' | null>(null);
  const [policyLang, setPolicyLang] = useState<'vi' | 'en'>('vi');

  // Feature Showcase Gallery active tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<'crusher' | 'diary' | 'canvas' | 'bonfire'>('crusher');

  // Sync localStorage with lang state
  useEffect(() => {
    localStorage.setItem('krog_lang', lang);
    setPolicyLang(lang);
  }, [lang]);

  // Translate helper
  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['vi']?.[key] || key;
  };

  // Sound helper
  const triggerSound = (soundFn: () => void) => {
    if (soundEnabled) {
      soundFn();
    }
  };

  // Toast notifier
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Listen to URL hash changes so Google Play reviewers can access policy directly via URL#privacy
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') {
        setViewPolicy('privacy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#terms') {
        setViewPolicy('terms');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setViewPolicy(null);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash to navigate
  const navigateToPolicy = (type: 'privacy' | 'terms') => {
    triggerSound(playChiselSound);
    window.location.hash = type;
  };

  const navigateToHome = () => {
    triggerSound(playWoodClickSound);
    window.location.hash = '';
    setViewPolicy(null);
  };

  // Set daily deterministic wisdom base
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    setDayOfYear(day);
  }, []);

  // Update todayWisdom whenever language, custom selection, or day changes
  useEffect(() => {
    const pool = lang === 'en' ? WISDOM_POOL_EN : WISDOM_POOL;
    const index = customQuoteIndex !== null ? customQuoteIndex : (dayOfYear % pool.length);
    setTodayWisdom(pool[index] || pool[0]);
  }, [lang, dayOfYear, customQuoteIndex]);

  // Next Wisdom Stone Chisel
  const handleNextQuote = () => {
    triggerSound(playChiselSound);
    const pool = lang === 'en' ? WISDOM_POOL_EN : WISDOM_POOL;
    const currentIndex = customQuoteIndex !== null ? customQuoteIndex : (dayOfYear % pool.length);
    const nextIndex = (currentIndex + 1) % pool.length;
    setCustomQuoteIndex(nextIndex);
    setTodayWisdom(pool[nextIndex]);
  };

  // Smooth scroll
  const scrollToId = (id: string) => {
    setMobileMenuOpen(false);
    if (viewPolicy) {
      navigateToHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Share action
  const handleShare = () => {
    triggerSound(playWoodClickSound);
    const title = lang === 'en' ? 'Krog - Prehistoric Minimalism' : 'Krog - Tiền Sử Tối Giản';
    const text = lang === 'en' 
      ? 'Return to the cave, crack raw stones, and find pure peace with Krog!' 
      : 'Quay về hang đá, gõ đá giải sầu và tìm lại sự bình yên thuần khiết cùng Krog!';
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(t('toast_copied'));
    }
  };

  // Interactive showcase items
  const featureShowcaseItems = BILINGUAL_FEATURES[lang] as Record<string, {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    details: string[];
    ambientQuote: string;
    label: string;
    mockDesc: string;
  }>;

  return (
    <div className="min-h-screen bg-[#050403] text-[#ede5d8] font-sans antialiased relative selection:bg-[#d4943a]/30 selection:text-[#fff] grain">
      
      {/* Absolute Backdrop Visual Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[750px] pointer-events-none bg-[radial-gradient(circle_at_50%_-100px,rgba(212,148,58,0.11)_0%,rgba(5,4,3,0)_70%)] z-0" />
      <div className="absolute top-[1500px] right-0 w-[500px] h-[500px] pointer-events-none bg-[radial-gradient(circle,rgba(212,148,58,0.02)_0%,rgba(0,0,0,0)_80%)]" />
      <div className="absolute bottom-[400px] left-0 w-[600px] h-[600px] pointer-events-none bg-[radial-gradient(circle,rgba(212,148,58,0.03)_0%,rgba(0,0,0,0)_85%)]" />

      {/* Floating System Messages / Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#161310] border border-[#d4943a]/30 px-6 py-4 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] text-center text-xs font-mono text-[#d4943a] max-w-sm"
          >
            <div className="flex items-center gap-3 justify-center">
              <Sparkle className="w-4 h-4 animate-spin text-[#d4943a]" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURY SLATE HEADER - REDESIGNED */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050403]/85 border-b border-[#d4943a]/8 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-22">
            
            {/* Logo Group */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={navigateToHome}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4943a]/20 via-[#1a130b] to-[#050403] flex items-center justify-center border border-[#d4943a]/25 shadow-lg shadow-black/60 group-hover:border-[#d4943a]/70 transition-all duration-300">
                <span className="text-xl font-serif text-[#ede5d8] font-bold tracking-tight">K</span>
              </div>
              <div className="text-left">
                <span className="text-2xl font-serif font-black tracking-[0.25em] text-gradient bg-gradient-to-r from-[#ede5d8] via-[#d4943a] to-[#ede5d8] bg-clip-text text-transparent block">KROG</span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-[#9a8d7e] uppercase block -mt-0.5">
                  {lang === 'en' ? 'PREHISTORIC MINIMALISM' : 'TIỀN SỬ TỐI GIẢN'}
                </span>
              </div>
            </div>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-10 text-[11px] font-mono font-semibold tracking-widest text-[#9a8d7e]">
              <button onClick={() => scrollToId('philosophy')} className="hover:text-[#ede5d8] transition-colors cursor-pointer relative py-1 group">
                {t('nav_philosophy')}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4943a] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => scrollToId('features')} className="hover:text-[#ede5d8] transition-colors cursor-pointer relative py-1 group">
                {t('nav_features')}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4943a] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => scrollToId('compare')} className="hover:text-[#ede5d8] transition-colors cursor-pointer relative py-1 group">
                {t('nav_differences')}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4943a] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => scrollToId('faq')} className="hover:text-[#ede5d8] transition-colors cursor-pointer relative py-1 group">
                {t('nav_faq')}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4943a] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => navigateToPolicy('privacy')} className={`transition-colors cursor-pointer relative py-1 group ${viewPolicy ? 'text-[#d4943a]' : 'hover:text-[#ede5d8]'}`}>
                {t('nav_legal')}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4943a] transition-all group-hover:w-full" />
              </button>
            </nav>

            {/* Right Side Settings & Action CTA */}
            <div className="hidden md:flex items-center gap-5">
              {/* Language Selector */}
              <div className="flex items-center bg-[#14110e] border border-[#d4943a]/15 p-1 rounded-xl">
                <button
                  onClick={() => {
                    triggerSound(playWoodClickSound);
                    setLang('vi');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest font-black transition-all cursor-pointer ${
                    lang === 'vi' ? 'bg-[#d4943a] text-black font-extrabold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => {
                    triggerSound(playWoodClickSound);
                    setLang('en');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest font-black transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-[#d4943a] text-black font-extrabold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => {
                  playWoodClickSound();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  soundEnabled 
                    ? 'bg-[#1a140f] border-[#d4943a]/30 text-[#d4943a] hover:bg-[#d4943a]/15' 
                    : 'bg-[#141210] border-white/5 text-gray-600 hover:text-gray-300'
                }`}
                title={soundEnabled ? t('sound_off_tip') : t('sound_on_tip')}
              >
                {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
              </button>
              
              <a
                href="https://play.google.com/store/apps/details?id=com.ruyn.krog"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b37d32] via-[#e2a853] to-[#b37d32] hover:brightness-110 active:scale-[0.98] text-[#050403] font-mono text-[11px] font-black tracking-[0.18em] transition-all duration-300 shadow-xl shadow-black/40 border border-[#d4943a]/30"
              >
                {t('download_now')}
              </a>
            </div>

            {/* Mobile Actions and Burger Toggle */}
            <div className="flex items-center gap-3.5 md:hidden">
              {/* Language toggle for mobile */}
              <button
                onClick={() => {
                  triggerSound(playWoodClickSound);
                  setLang(lang === 'vi' ? 'en' : 'vi');
                }}
                className="p-2.5 rounded-xl bg-[#141210] border border-white/5 text-[#d4943a] text-[10px] font-mono font-black cursor-pointer"
                title="Toggle Language"
              >
                {lang.toUpperCase()}
              </button>

              <button
                onClick={() => {
                  playWoodClickSound();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  soundEnabled ? 'bg-[#1a140f] border-[#d4943a]/25 text-[#d4943a]' : 'bg-[#141210] border-white/5 text-gray-500'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => {
                  triggerSound(playWoodClickSound);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="p-2.5 rounded-xl bg-[#141210] border border-white/5 text-[#ede5d8] cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#d4943a]/10 bg-[#050403] overflow-hidden"
            >
              <div className="px-5 py-7 space-y-4 flex flex-col font-mono text-xs font-bold tracking-[0.18em] text-[#9a8d7e]">
                <button onClick={() => scrollToId('philosophy')} className="text-left py-2 hover:text-[#ede5d8]">{lang === 'en' ? 'CAVE PHILOSOPHY' : 'TRIẾT LÝ HANG ĐÁ'}</button>
                <button onClick={() => scrollToId('features')} className="text-left py-2 hover:text-[#ede5d8]">{lang === 'en' ? 'HEALING FEATURES' : 'TÍNH NĂNG CHỮA LÀNH'}</button>
                <button onClick={() => scrollToId('compare')} className="text-left py-2 hover:text-[#ede5d8]">{lang === 'en' ? 'THE DIFFERENCE' : 'SỰ KHÁC BIỆT'}</button>
                <button onClick={() => scrollToId('faq')} className="text-left py-2 hover:text-[#ede5d8]">{lang === 'en' ? 'FREQUENTLY ASKED QUESTIONS' : 'HỎI ĐÁP THƯỜNG GẶP'}</button>
                <button onClick={() => { setMobileMenuOpen(false); navigateToPolicy('privacy'); }} className="text-left py-2 text-[#d4943a]">{lang === 'en' ? 'PRIVACY POLICY' : 'CHÍNH SÁCH BẢO MẬT'}</button>
                
                <a
                  href="https://play.google.com/store/apps/details?id=com.ruyn.krog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-4 rounded-xl bg-gradient-to-r from-[#b37d32] to-[#e2a853] text-[#050403] font-black block text-[11px] tracking-widest mt-4"
                >
                  {lang === 'en' ? 'DOWNLOAD ON GOOGLE PLAY' : 'TẢI KROG TRÊN GOOGLE PLAY'}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* RENDER DEDICATED LEGAL POLICY VIEW IF TRIGGERED */}
      <AnimatePresence mode="wait">
        {viewPolicy ? (
          <motion.div
            key="policyView"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-28"
          >
            {/* Navigation back and language switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-white/5 mb-12">
              <button
                onClick={navigateToHome}
                className="inline-flex items-center gap-2.5 text-xs font-mono font-bold tracking-widest text-[#9a8d7e] hover:text-[#ede5d8] transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#d4943a] transition-transform group-hover:-translate-x-1" />
                {policyLang === 'en' ? 'BACK TO HOME' : 'QUAY LẠI TRANG CHỦ'}
              </button>

              <div className="flex items-center bg-[#14110e] border border-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setPolicyLang('vi')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest font-black transition-all cursor-pointer ${
                    policyLang === 'vi' ? 'bg-[#d4943a] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  TIẾNG VIỆT
                </button>
                <button
                  onClick={() => setPolicyLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest font-black transition-all cursor-pointer ${
                    policyLang === 'en' ? 'bg-[#d4943a] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ENGLISH
                </button>
              </div>
            </div>

            {/* Render Vietnamese Privacy Policy & Terms */}
            {policyLang === 'vi' ? (
              <div className="space-y-12 text-[#ede5d8]/90 font-sans text-sm leading-relaxed text-left">
                
                {/* VI Header */}
                <div className="space-y-4">
                  <div className="inline-block bg-[#d4943a]/10 border border-[#d4943a]/30 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">
                    Cổng Pháp Lý Ứng Dụng
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-serif text-[#ede5d8] tracking-tight font-medium">
                    {viewPolicy === 'privacy' ? 'Chính Sách Bảo Mật (Privacy Policy)' : 'Điều Khoản Sử Dụng (Terms of Service)'}
                  </h1>
                  <p className="text-xs font-mono text-gray-500">Cập nhật lần cuối: Ngày 13 Tháng 7 Năm 2026</p>
                </div>

                {viewPolicy === 'privacy' ? (
                  /* VI PRIVACY POLICY */
                  <div className="space-y-8">
                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4" /> 1. Giới thiệu tổng quan
                      </h2>
                      <p>
                        Ứng dụng <strong>Krog</strong> (gọi tắt là "Ứng dụng") được thiết kế và phát triển bởi <strong>Takaction Studio</strong> (đại diện bởi nhà phát triển Việt Ruyn). Chúng tôi coi trọng việc bảo vệ sự riêng tư của bạn. Krog là một ứng dụng chăm sóc tinh thần <strong>hoàn toàn phi lợi nhuận</strong> và hoạt động <strong>ngoại tuyến (offline) 100%</strong>. 
                      </p>
                      <p>
                        Chính sách bảo mật này giải thích rõ ràng và minh bạch rằng chúng tôi không thu thập bất kỳ dữ liệu cá nhân nào từ phía người sử dụng, phù hợp với các tiêu chuẩn khắt khe nhất của Google Play Console.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4" /> 2. Không thu thập thông tin cá nhân
                      </h2>
                      <p>
                        Chúng tôi thiết lập cơ chế hoạt động tuyệt đối an toàn. Krog:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        <li><strong>Không yêu cầu đăng ký tài khoản:</strong> Bạn không cần cung cấp Email, Số điện thoại, Tên hay bất kỳ thông tin định danh nào để sử dụng ứng dụng.</li>
                        <li><strong>Không thu thập dữ liệu thiết bị:</strong> Chúng tôi không thu thập địa chỉ IP, mã định danh thiết bị (IMEI/Android ID), vị trí địa lý, danh bạ hay dữ liệu cuộc gọi.</li>
                        <li><strong>Không tích hợp SDK theo dõi bên thứ ba:</strong> Chúng tôi không tích hợp bất kỳ công cụ phân tích hành vi người dùng, quảng cáo thu thập thông tin (như Google AdMob, Unity Ads, Facebook SDK, hay Firebase Analytics).</li>
                      </ul>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 3. Lưu trữ dữ liệu cục bộ (Offline Local Storage)
                      </h2>
                      <p>
                        Mọi hoạt động của bạn trong ứng dụng bao gồm: số lượng đá núi đập nứt, số củi khô nhặt được, cấp độ dụng cụ và các văn bản bạn tự viết/dịch trong phần Nhật Ký <strong>chỉ được lưu trữ duy nhất và cục bộ</strong> trên bộ nhớ nội bộ của chính thiết bị của bạn (sử dụng SQLite hoặc SharedPreferences của hệ điều hành Android).
                      </p>
                      <p>
                        Dữ liệu này không bao giờ được gửi lên đám mây, máy chủ hay truyền tải ra ngoài thiết bị của bạn. Khi bạn gỡ cài đặt ứng dụng, toàn bộ dữ liệu này sẽ tự động bị xóa sạch hoàn toàn khỏi thiết bị.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Award className="w-4 h-4" /> 4. Quyền truy cập thiết bị (Permissions)
                      </h2>
                      <p>
                        Krog là ứng dụng tối giản, không đòi hỏi các quyền truy cập nhạy cảm. Chúng tôi:
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                        <li><strong>KHÔNG</strong> truy cập Máy ảnh (Camera) hay Micro.</li>
                        <li><strong>KHÔNG</strong> truy cập Vị trí địa lý (GPS/Location).</li>
                        <li><strong>KHÔNG</strong> truy cập Bộ lưu trữ ngoài hoặc Thư viện ảnh trừ khi cần lưu bức vẽ vách đá do chính bạn chủ động bấm lưu.</li>
                        <li>Có thể sử dụng quyền Rung (Vibrate) ở mức cơ bản để tạo hiệu ứng phản hồi lực kéo nhẹ khi bạn đập đá giải sầu (haptic feedback). Bạn có thể tắt hoàn toàn phản hồi này trong cài đặt hệ thống.</li>
                      </ul>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Smile className="w-4 h-4" /> 5. Quyền riêng tư của Trẻ em
                      </h2>
                      <p>
                        Vì Krog không thu thập, lưu trữ hay chia sẻ bất kỳ thông tin cá nhân nào, ứng dụng hoàn toàn an toàn và lành mạnh cho mọi lứa tuổi, kể cả trẻ em dưới 13 tuổi. Chúng tôi hoàn toàn tuân thủ Đạo luật bảo vệ quyền riêng tư trực tuyến của trẻ em (COPPA) và các quy định tương đương trên toàn cầu.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4" /> 6. Liên hệ chúng tôi
                      </h2>
                      <p>
                        Nếu bạn có bất kỳ câu hỏi, phản hồi hay thắc mắc nào liên quan đến Chính sách bảo mật của ứng dụng Krog, vui lòng liên hệ với nhà phát triển chính thức qua hòm thư điện tử:
                      </p>
                      <div className="bg-[#14110e] border border-[#d4943a]/15 p-4 rounded-xl mt-2 font-mono text-xs">
                        <p className="text-gray-400">Nhà phát triển: <strong className="text-[#ede5d8]">Việt Ruyn (Takaction Studio)</strong></p>
                        <p className="text-gray-400 mt-1">Hòm thư hỗ trợ: <a href="mailto:vietruyn@gmail.com" className="text-[#d4943a] underline hover:text-[#e2a853]">vietruyn@gmail.com</a></p>
                        <p className="text-gray-400 mt-1">Liên kết Store: <span className="text-[#ede5d8]">https://play.google.com/store/apps/details?id=com.ruyn.krog</span></p>
                      </div>
                    </section>
                  </div>
                ) : (
                  /* VI TERMS OF SERVICE */
                  <div className="space-y-8">
                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">1. Chấp thuận điều khoản</h2>
                      <p>
                        Bằng việc tải xuống, cài đặt và sử dụng ứng dụng Krog, bạn đồng ý tuân thủ toàn bộ các điều khoản dịch vụ dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không cài đặt hoặc ngừng sử dụng ứng dụng ngay lập tức.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">2. Mục đích sử dụng ứng dụng</h2>
                      <p>
                        Krog là một ứng dụng thiền, giảm stress và giải trí cá nhân thô sơ. Ứng dụng này được cung cấp hoàn toàn <strong>miễn phí, phi lợi nhuận, không có quảng cáo</strong> và chỉ nhằm mục đích giúp người dùng thư giãn tinh thần trong thời gian ngắn.
                      </p>
                      <p>
                        Ứng dụng không thay thế cho bất kỳ phương pháp điều trị y khoa hay lời khuyên tâm lý chuyên nghiệp nào từ bác sĩ hoặc chuyên gia tâm thần học.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">3. Quyền sở hữu trí tuệ</h2>
                      <p>
                        Mọi hình ảnh, nhãn hiệu, mã nguồn, biểu tượng thiết kế, câu trích dẫn Krog, âm thanh và giao diện người dùng thuộc bản quyền sở hữu của <strong>Takaction Studio</strong>. Bạn không được phép sao chép, đảo ngược kỹ thuật (reverse-engineering), phân phối lại hoặc thương mại hóa bất kỳ phần nào của ứng dụng khi chưa có sự cho phép bằng văn bản từ chúng tôi.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">4. Miễn trừ trách nhiệm</h2>
                      <p>
                        Chúng tôi nỗ lực tối đa để đảm bảo ứng dụng hoạt động ổn định và an toàn. Tuy nhiên, Krog được cung cấp trên cơ sở "nguyên trạng" (as-is). Nhà phát triển Việt Ruyn và Takaction Studio không chịu trách nhiệm pháp lý đối với bất kỳ mất mát dữ liệu nào (ví dụ: mất số đá tích lũy do lỗi thiết bị hoặc xóa bộ nhớ đệm), hoặc bất kỳ thiệt hại trực tiếp/gián tiếp phát sinh từ việc sử dụng ứng dụng.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">5. Thay đổi điều khoản</h2>
                      <p>
                        Chúng tôi có quyền cập nhật, sửa đổi hoặc thay đổi các điều khoản dịch vụ này bất cứ lúc nào để phù hợp với các quy định pháp luật mới hoặc yêu cầu từ Google Play. Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải công khai trên trang web này.
                      </p>
                      <p>
                        Nếu bạn tiếp tục sử dụng ứng dụng sau khi các thay đổi được công bố, điều đó có nghĩa là bạn chấp thuận các điều khoản mới cập nhật.
                      </p>
                    </section>
                  </div>
                )}
              </div>
            ) : (
              /* EN PRIVACY POLICY & TERMS */
              <div className="space-y-12 text-[#ede5d8]/90 font-sans text-sm leading-relaxed text-left">
                
                {/* EN Header */}
                <div className="space-y-4">
                  <div className="inline-block bg-[#d4943a]/10 border border-[#d4943a]/30 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">
                    Legal & Compliance Center
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-serif text-[#ede5d8] tracking-tight font-medium">
                    {viewPolicy === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                  </h1>
                  <p className="text-xs font-mono text-gray-500">Last updated: July 13, 2026</p>
                </div>

                {viewPolicy === 'privacy' ? (
                  /* EN PRIVACY POLICY */
                  <div className="space-y-8">
                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4" /> 1. Introduction
                      </h2>
                      <p>
                        The <strong>Krog</strong> mobile application (hereinafter referred to as the "App") is designed, developed, and maintained by <strong>Takaction Studio</strong> (represented by developer Viet Ruyn). We deeply care about your privacy. Krog is a <strong>strictly non-profit, ad-free</strong> mental wellness application designed to work <strong>100% offline</strong>.
                      </p>
                      <p>
                        This Privacy Policy clarifies and guarantees that we do not collect, process, or share any personal information or device telemetry from our users, fully satisfying Google Play Console Developer Requirements.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4" /> 2. No Personal Data Collection
                      </h2>
                      <p>
                        Krog operates with absolute user-privacy at its core:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        <li><strong>No Account Registration Required:</strong> You do not need to sign up, log in, or provide any email, phone number, name, or identification credentials.</li>
                        <li><strong>No Device Information Captured:</strong> We do not fetch, read, or upload IP addresses, device identifiers (IMEI, MAC, or Android ID), geolocation data, or hardware specifications.</li>
                        <li><strong>No Third-Party SDK Integrations:</strong> We do not integrate any user tracking tools, behavioral analytic services, or ad platforms (such as Google AdMob, Firebase SDK, Unity, or Facebook SDK).</li>
                      </ul>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 3. Pure Local-Only Storage
                      </h2>
                      <p>
                        All progress data, including crushed stone count, collected firewood, hammer upgrade level, and texts you write or translate inside the Prehistoric Diary module, are stored <strong>strictly on your physical device</strong> using Android’s standard local SQLite database or SharedPreferences wrapper.
                      </p>
                      <p>
                        No data ever leaves your device or travels through the internet. When you uninstall the App, all associated local data is permanently wiped from your device.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Award className="w-4 h-4" /> 4. Device Permissions
                      </h2>
                      <p>
                        Krog is extremely lightweight and does not request any intrusive device permissions:
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                        <li>We <strong>DO NOT</strong> access your camera, microphone, or call logs.</li>
                        <li>We <strong>DO NOT</strong> request access to GPS or location-tracking services.</li>
                        <li>We may trigger the device’s Haptic Vibration feedback to simulate stone crushing impact. This basic hardware trigger can be customized or disabled entirely inside your Android settings.</li>
                      </ul>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Smile className="w-4 h-4" /> 5. Children's Privacy
                      </h2>
                      <p>
                        Since Krog does not collect, record, or share any personal information of any kind, it is entirely safe and compliant for users of all ages, including children under the age of 13. We strictly adhere to the Children's Online Privacy Protection Act (COPPA) standards.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4" /> 6. Support Contact
                      </h2>
                      <p>
                        For any security audits, policy questions, or questions about Krog, please contact the developer via the official email:
                      </p>
                      <div className="bg-[#14110e] border border-[#d4943a]/15 p-4 rounded-xl mt-2 font-mono text-xs">
                        <p className="text-gray-400">Developer: <strong className="text-[#ede5d8]">Viet Ruyn (Takaction Studio)</strong></p>
                        <p className="text-gray-400 mt-1">Official Email: <a href="mailto:vietruyn@gmail.com" className="text-[#d4943a] underline hover:text-[#e2a853]">vietruyn@gmail.com</a></p>
                        <p className="text-gray-400 mt-1">App Package ID: <span className="text-[#ede5d8]">com.ruyn.krog</span></p>
                      </div>
                    </section>
                  </div>
                ) : (
                  /* EN TERMS OF SERVICE */
                  <div className="space-y-8">
                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">1. Acceptance of Terms</h2>
                      <p>
                        By downloading, installing, or playing Krog, you explicitly agree to be bound by these Terms of Service. If you do not agree, please stop using and uninstall the application immediately.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">2. Purpose of Application</h2>
                      <p>
                        Krog is provided solely for personal entertainment, mindfulness, and relaxation. It is a <strong>100% free, non-profit, non-commercial</strong> product.
                      </p>
                      <p>
                        The application is not a clinical medical tool and does not replace medical advice, counseling, or professional psychological therapy.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">3. Intellectual Property</h2>
                      <p>
                        All graphics, logos, source code, Krog-themed quotes, prehistoric sound files, and user interface layouts are the intellectual property of <strong>Takaction Studio</strong>. Any unlicensed distribution, reverse engineering, or commercial replication is strictly forbidden.
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="text-lg font-serif text-[#d4943a] font-semibold">4. Limitation of Liability</h2>
                      <p>
                        Krog is provided on an "as-is" and "as-available" basis without warranties of any kind. Developer Viet Ruyn and Takaction Studio shall not be liable for any data losses (such as game save files reset due to system cache clear) or any direct/indirect damages arising from the use of Krog.
                      </p>
                    </section>
                  </div>
                )}
              </div>
            )}

            {/* Back CTA Button */}
            <div className="pt-12 border-t border-white/5 mt-16 text-left">
              <button
                onClick={navigateToHome}
                className="px-6 py-3.5 bg-[#14110e] hover:bg-[#d4943a]/10 border border-[#d4943a]/25 hover:border-[#d4943a] text-xs font-mono text-[#d4943a] font-black tracking-widest rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> QUAY LẠI TRANG CHỦ KROG
              </button>
            </div>

          </motion.div>
        ) : (
          /* MAIN LANDING PAGE VIEW */
          <motion.div
            key="mainView"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            
            {/* HERO SECTION - REFINED ULTRA-LUXURY CENTERED FLOW */}
            <section id="hero" className="relative pt-20 pb-20 md:pt-32 md:pb-36 overflow-hidden flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-10">
                
                {/* Compact Premium Badge */}
                <div className="inline-flex items-center gap-2.5 bg-[#d4943a]/8 border border-[#d4943a]/25 px-5 py-2.5 rounded-full shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4943a] fill-[#d4943a]/10" />
                  <span className="text-[10px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">
                    {t('hero_badge')}
                  </span>
                </div>

                {/* Dramatic Typography Title */}
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-[#ede5d8] tracking-tight leading-[1.05] font-light">
                  {t('hero_title_1')} <br />
                  <span className="font-medium bg-gradient-to-r from-[#ede5d8] via-[#e2a853] to-[#ede5d8] bg-clip-text text-transparent font-serif italic">
                    {t('hero_title_2')}
                  </span>
                </h1>

                {/* Highly Professional Subtext */}
                <p className="text-base sm:text-lg text-gray-400 font-serif leading-relaxed max-w-3xl mx-auto font-light">
                  {t('hero_desc')}
                </p>

                {/* CENTERED INTERACTIVE WISDOM STONE CARD */}
                <div className="max-w-xl mx-auto bg-gradient-to-b from-[#1b1510] to-[#0a0807] rounded-3xl border border-[#d4943a]/25 p-1.5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#d4943a]/3 blur-[50px] rounded-full pointer-events-none" />
                  
                  {/* Top luxury label */}
                  <div className="p-3.5 border-b border-[#d4943a]/8 bg-black/40 flex justify-between items-center text-[10px] font-mono px-5">
                    <span className="text-[#9a8d7e] flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5 text-[#d4943a]" /> {lang === 'en' ? 'Daily Wisdom Oracle' : 'Lời Sấm Truyền Krog'}
                    </span>
                    <span className="text-[#d4943a] bg-[#d4943a]/10 px-2.5 py-0.5 rounded-full border border-[#d4943a]/15 text-[8px] font-black">
                      OFFLINE ONLY
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6 text-left">
                    <div className="bg-[#0e0c0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#d4943a]/3 rounded-full blur-xl" />
                      <span className="text-[8px] font-mono text-[#d4943a] uppercase tracking-widest block mb-3 font-semibold">
                        {lang === 'en' ? 'Daily Wisdom Oracle' : 'Lời sấm truyền hôm nay'}
                      </span>
                      <p className="text-sm sm:text-base text-[#ede5d8]/90 font-serif leading-relaxed italic min-h-[4rem]">
                        "{todayWisdom.content}"
                      </p>
                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500">
                        <span>{lang === 'en' ? 'Oracle #' : 'Sấm truyền #'} {todayWisdom.id}</span>
                        <button
                          onClick={handleNextQuote}
                          className="text-[#d4943a] hover:text-[#ede5d8] font-bold flex items-center gap-1 transition-colors cursor-pointer group/btn"
                        >
                          {lang === 'en' ? 'Chisel next stone' : 'Gõ đá tiếp'} <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Stats Section */}
                <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/5 font-serif max-w-2xl mx-auto">
                  <div>
                    <span className="text-3xl sm:text-4xl font-light text-[#ede5d8] block">10K+</span>
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#9a8d7e] uppercase block mt-1.5">{t('stat_krog')}</span>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-light text-[#d4943a] block">0%</span>
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#9a8d7e] uppercase block mt-1.5">{t('stat_ads')}</span>
                  </div>
                  <div>
                    <span className="text-3xl sm:text-4xl font-light text-[#ede5d8] block">100%</span>
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#9a8d7e] uppercase block mt-1.5">{t('stat_privacy')}</span>
                  </div>
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.ruyn.krog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-gradient-to-b from-[#1c1611] to-[#0c0a08] hover:from-[#d4943a]/12 hover:to-[#d4943a]/4 border border-[#d4943a]/25 hover:border-[#d4943a]/70 px-8 py-4.5 rounded-2xl transition-all duration-300 shadow-2xl group cursor-pointer text-left w-full sm:w-auto"
                  >
                    <svg className="w-8 h-8 text-[#d4943a] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L19.5,12.16L17.87,13L16.82,12.16L17.87,11.33M3,3.15L17.1,10.2L14.5,12.16L3,3.15M3,20.85L14.5,12.16L17.1,13.8L3,20.85Z" />
                    </svg>
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-[#9a8d7e] uppercase block">{t('download_free_on')}</span>
                      <span className="text-sm font-bold text-[#ede5d8] tracking-wide block font-mono">Google Play Store</span>
                    </div>
                  </a>

                  <button
                    onClick={handleShare}
                    className="px-8 py-5 rounded-2xl bg-transparent border border-white/10 hover:border-[#d4943a]/40 hover:bg-[#110f0d] text-[#ede5d8] font-mono text-xs tracking-widest font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
                  >
                    <Share2 className="w-4.5 h-4.5 text-[#d4943a]" /> {t('share_btn')}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#6c5e50] pt-2">
                  <Info className="w-3.5 h-3.5 text-[#d4943a]/50" />
                  {t('security_notice')}
                </div>

              </div>
            </section>

            {/* MARQUEE RUNNING TEXT - HIGHLY REDESIGNED AS HIGH-END MINIMAL BAND */}
            <div className="w-full border-y border-[#d4943a]/15 bg-[#0a0807] py-4.5 overflow-hidden relative z-20">
              <div className="marquee-container">
                <div className="marquee-content whitespace-nowrap flex items-center gap-16">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-16 text-[10px] font-mono tracking-[0.25em] text-[#9a8d7e] font-bold">
                      <span>KROG APP</span>
                      <span className="text-[#d4943a]">•</span>
                      <span>{lang === 'en' ? 'PREHISTORIC MINIMALISM' : 'TIỀN SỬ TỐI GIẢN'}</span>
                      <span className="text-[#d4943a]">•</span>
                      <span>{lang === 'en' ? '0% ADS & FEES' : '0% QUẢNG CÁO & PHÍ'}</span>
                      <span className="text-[#d4943a]">•</span>
                      <span>{lang === 'en' ? '100% OFFLINE SANCTUARY' : '100% NGOẠI TUYẾN'}</span>
                      <span className="text-[#d4943a]">•</span>
                      <span>{lang === 'en' ? 'NO PERSONAL DATA CAPTURED' : 'KHÔNG THU THẬP DỮ LIỆU'}</span>
                      <span className="text-[#d4943a]">•</span>
                      <span>{lang === 'en' ? 'HEAL YOUR WEARY SOUL' : 'CHỮA LÀNH TÂM HỒN'}</span>
                      <span className="text-[#d4943a]">•</span>
                      <span>TAKACTION STUDIO</span>
                      <span className="text-[#d4943a]">•</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PHILOSOPHY SECTION - EDITORIAL DESIGN */}
            <section id="philosophy" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-mt-22">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* Title */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                  <div className="inline-flex items-center gap-2 bg-[#d4943a]/10 border border-[#d4943a]/25 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">{t('philosophy_badge')}</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-serif text-[#ede5d8] tracking-tight font-light leading-tight">
                    {t('philosophy_title_1')} <br />
                    <span className="font-medium bg-gradient-to-r from-[#ede5d8] via-[#e2a853] to-[#ede5d8] bg-clip-text text-transparent font-serif italic">
                      {t('philosophy_title_2')}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 font-serif leading-relaxed">
                    {t('philosophy_desc')}
                  </p>
                </div>

                {/* Content columns */}
                <div className="lg:col-span-7 space-y-12 text-left font-serif">
                  
                  {/* Philosophy item 1 */}
                  <div className="p-8 rounded-2xl bg-[#0c0a08] border border-white/5 space-y-4 hover:border-[#d4943a]/20 transition-all card-glow">
                    <span className="text-2xl block text-[#d4943a]">{t('philosophy_01_title')}</span>
                    <h3 className="text-lg font-medium text-[#ede5d8] tracking-tight">{t('philosophy_01_subtitle')}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                      {t('philosophy_01_desc')}
                    </p>
                  </div>

                  {/* Philosophy item 2 */}
                  <div className="p-8 rounded-2xl bg-[#0c0a08] border border-white/5 space-y-4 hover:border-[#d4943a]/20 transition-all card-glow">
                    <span className="text-2xl block text-[#d4943a]">{t('philosophy_02_title')}</span>
                    <h3 className="text-lg font-medium text-[#ede5d8] tracking-tight">{t('philosophy_02_subtitle')}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                      {t('philosophy_02_desc')}
                    </p>
                  </div>

                  {/* Philosophy item 3 */}
                  <div className="p-8 rounded-2xl bg-[#0c0a08] border border-white/5 space-y-4 hover:border-[#d4943a]/20 transition-all card-glow">
                    <span className="text-2xl block text-[#d4943a]">{t('philosophy_03_title')}</span>
                    <h3 className="text-lg font-medium text-[#ede5d8] tracking-tight">{t('philosophy_03_subtitle')}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                      {t('philosophy_03_desc')}
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* FEATURE SHOWCASE - REDESIGNED BEAUTIFUL BENTO GRID */}
            <section id="features" className="py-24 bg-[#0a0807] border-y border-white/5 scroll-mt-22">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header text */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
                  <div className="inline-flex items-center gap-2 bg-[#d4943a]/8 border border-[#d4943a]/20 px-3.5 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4943a]" />
                    <span className="text-[9px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">{t('features_badge')}</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-serif text-[#ede5d8] tracking-tight font-light">
                    {t('features_title_1')} <span className="font-medium text-[#d4943a] italic">{t('features_title_2')}</span>
                  </h2>
                  <p className="text-sm text-gray-500 font-serif leading-relaxed">
                    {t('features_desc')}
                  </p>
                </div>

                {/* Features Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {Object.entries(featureShowcaseItems).map(([key, value]) => {
                    const Icon = FEATURE_ICONS[key as keyof typeof FEATURE_ICONS];
                    return (
                      <div
                        key={key}
                        className="bg-[#0c0a08] border border-[#d4943a]/10 hover:border-[#d4943a]/30 p-8 rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
                      >
                        {/* Decorative giant faded background emoji */}
                        <div className="absolute -bottom-6 -right-6 text-9xl opacity-5 pointer-events-none select-none transition-transform group-hover:scale-110 duration-500">
                          {key === 'crusher' && '🪨'}
                          {key === 'diary' && '📜'}
                          {key === 'canvas' && '🎨'}
                          {key === 'bonfire' && '🔥'}
                        </div>

                        <div className="space-y-6 relative z-10">
                          
                          {/* Feature Icon and Badge */}
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-[#d4943a]/8 border border-[#d4943a]/20 flex items-center justify-center text-[#d4943a]">
                              {Icon && <Icon className="w-5 h-5" />}
                            </div>
                            <span className="text-[8.5px] font-mono tracking-widest text-[#d4943a] bg-[#d4943a]/10 px-2.5 py-1 rounded-md border border-[#d4943a]/15 font-black uppercase">
                              {value.badge}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-[#9a8d7e] tracking-widest uppercase block">{value.subtitle}</span>
                            <h3 className="text-2xl font-serif text-[#ede5d8] font-medium tracking-tight">{value.title}</h3>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-400 font-serif leading-relaxed">
                            {value.description}
                          </p>

                          {/* List of subfeatures */}
                          <ul className="space-y-2 pt-2 border-t border-white/5 font-serif text-xs text-[#9a8d7e]">
                            {value.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#d4943a] mt-0.5">•</span>
                                <span className="leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>

                        </div>

                        {/* Bottom quote */}
                        <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-serif text-[#d4943a]/75 italic font-light relative z-10">
                          {value.ambientQuote}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Direct Google Play Store Invitation bar */}
                <div className="mt-14 p-6.5 rounded-2xl bg-[#14110e] border border-[#d4943a]/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-left max-w-4xl mx-auto">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-widest text-[#9a8d7e] uppercase block font-bold">{t('free_device_exp')}</span>
                    <p className="text-xs sm:text-sm text-[#ede5d8] font-serif leading-normal font-light">
                      {t('free_device_desc')}
                    </p>
                  </div>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.ruyn.krog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d4943a] hover:bg-[#e2a853] text-black font-mono text-[10px] tracking-widest font-black transition-all cursor-pointer shadow-lg shrink-0"
                  >
                    {t('free_device_btn')} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </section>

               {/* COMPARISON TABLE - HIGH-END PROFESSIONAL LOOK */}
            <section id="compare" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-22">
              <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 bg-[#d4943a]/8 border border-[#d4943a]/20 px-3 py-1 rounded-full">
                  <span className="text-[9px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">{t('compare_badge')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#ede5d8] tracking-tight font-light">
                  {t('compare_title_1')} <span className="font-medium text-[#d4943a] italic">{t('compare_title_2')}</span>
                </h2>
                <p className="text-sm text-gray-500 font-serif max-w-xl mx-auto leading-relaxed">
                  {t('compare_desc')}
                </p>
              </div>

              {/* Table wrapper */}
              <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#0c0a08] shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-serif border-collapse">
                    
                    {/* Header */}
                    <thead>
                      <tr className="border-b border-white/5 bg-black/40 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#9a8d7e]">
                        <th className="p-4 sm:p-6 text-left">{t('compare_th_feature')}</th>
                        <th className="p-4 sm:p-6 text-center text-[#d4943a]">{t('compare_th_krog')}</th>
                        <th className="p-4 sm:p-6 text-center text-gray-500">{t('compare_th_others')}</th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="text-xs sm:text-sm text-gray-300">
                      
                      <tr className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="p-4 sm:p-6 font-medium text-white text-left">
                          {t('compare_row_mode')}
                          <span className="block text-[10px] font-mono text-gray-500 mt-1 uppercase">{t('compare_row_mode_sub')}</span>
                        </td>
                        <td className="p-4 sm:p-6 text-center text-[#d4943a] font-bold">{t('compare_row_mode_krog')}</td>
                        <td className="p-4 sm:p-6 text-center text-gray-400">{t('compare_row_mode_others')}</td>
                      </tr>

                      <tr className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="p-4 sm:p-6 font-medium text-white text-left">
                          {t('compare_row_ads')}
                          <span className="block text-[10px] font-mono text-gray-500 mt-1 uppercase">{t('compare_row_ads_sub')}</span>
                        </td>
                        <td className="p-4 sm:p-6 text-center text-[#d4943a] font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('compare_row_ads_krog')}
                        </td>
                        <td className="p-4 sm:p-6 text-center text-gray-400">{t('compare_row_ads_others')}</td>
                      </tr>

                      <tr className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="p-4 sm:p-6 font-medium text-white text-left">
                          {t('compare_row_fee')}
                          <span className="block text-[10px] font-mono text-gray-500 mt-1 uppercase">{t('compare_row_fee_sub')}</span>
                        </td>
                        <td className="p-4 sm:p-6 text-center text-[#d4943a] font-bold">{t('compare_row_fee_krog')}</td>
                        <td className="p-4 sm:p-6 text-center text-gray-400">{t('compare_row_fee_others')}</td>
                      </tr>

                      <tr className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="p-4 sm:p-6 font-medium text-white text-left">
                          {t('compare_row_privacy')}
                          <span className="block text-[10px] font-mono text-gray-500 mt-1 uppercase">{t('compare_row_privacy_sub')}</span>
                        </td>
                        <td className="p-4 sm:p-6 text-center text-[#d4943a] font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('compare_row_privacy_krog')}
                        </td>
                        <td className="p-4 sm:p-6 text-center text-gray-400">{t('compare_row_privacy_others')}</td>
                      </tr>

                      <tr className="hover:bg-white/1 transition-all">
                        <td className="p-4 sm:p-6 font-medium text-white text-left">
                          {t('compare_row_engage')}
                          <span className="block text-[10px] font-mono text-gray-500 mt-1 uppercase">{t('compare_row_engage_sub')}</span>
                        </td>
                        <td className="p-4 sm:p-6 text-center text-[#d4943a] font-bold">{t('compare_row_engage_krog')}</td>
                        <td className="p-4 sm:p-6 text-center text-gray-400">{t('compare_row_engage_others')}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION DOWNLOAD APPLLET WRAPPER */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#050403] via-[#0f0c0a] to-[#050403] border-y border-white/5 text-center">
              <div className="absolute inset-0 bg-[#d4943a]/3 blur-[120px] rounded-full pointer-events-none" />
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
                
                <h2 className="text-4xl sm:text-5xl font-serif text-[#ede5d8] tracking-tight font-light">
                  {t('cta_title_1')} <br />
                  <span className="font-medium bg-gradient-to-r from-[#ede5d8] via-[#e2a853] to-[#ede5d8] bg-clip-text text-transparent font-serif italic">
                    {t('cta_title_2')}
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-gray-400 font-serif max-w-xl mx-auto leading-relaxed">
                  {t('cta_desc')}
                </p>

                {/* Main store download badge and instructions */}
                <div className="flex flex-col items-center gap-5 justify-center pt-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.ruyn.krog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3.5 bg-black hover:bg-[#141210] text-[#ede5d8] border border-[#d4943a]/30 hover:border-[#d4943a] px-8 py-4.5 rounded-2xl shadow-3xl group transition-all duration-300"
                  >
                    <svg className="w-7 h-7 text-[#d4943a] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L19.5,12.16L17.87,13L16.82,12.16L17.87,11.33M3,3.15L17.1,10.2L14.5,12.16L3,3.15M3,20.85L14.5,12.16L17.1,13.8L3,20.85Z" />
                    </svg>
                    <div className="text-left">
                      <span className="text-[9px] font-mono tracking-widest text-[#9a8d7e] block">{t('download_free_on')}</span>
                      <span className="text-sm font-bold font-mono tracking-wider block">Google Play Store</span>
                    </div>
                  </a>

                  <p className="text-[10px] font-mono text-[#5c5247]">
                    {t('cta_package')}
                  </p>
                </div>

              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
            <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-22">
              
              <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 bg-[#d4943a]/8 border border-[#d4943a]/20 px-3 py-1 rounded-full">
                  <span className="text-[9px] font-mono tracking-widest text-[#d4943a] font-bold uppercase">{t('faq_badge')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#ede5d8] tracking-tight font-light text-left sm:text-center">
                  {t('faq_title_1')} <span className="font-medium text-[#d4943a] italic">{t('faq_title_2')}</span>
                </h2>
              </div>

              {/* Accordion Questions */}
              <div className="space-y-4 text-left">
                {BILINGUAL_FAQS[lang].map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-white/5 bg-[#0c0a08] rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => {
                          triggerSound(playWoodClickSound);
                          setActiveFaq(isOpen ? null : idx);
                        }}
                        className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-white/1"
                      >
                        <span className="font-serif font-medium text-[#ede5d8] sm:text-base text-sm leading-snug">
                          {faq.q}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#d4943a] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 border-t border-white/5 text-xs sm:text-sm text-gray-400 font-serif leading-relaxed font-light">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}
              </div>

            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM FOOTER SECTION */}
      <footer className="border-t border-white/5 bg-[#080706] py-16 text-left relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/5">
            
            {/* Col 1: Brand details */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToHome}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4943a]/20 to-[#1a130b] flex items-center justify-center border border-[#d4943a]/25 shadow-lg shadow-black/60">
                  <span className="text-base font-serif text-[#ede5d8] font-bold">K</span>
                </div>
                <div className="text-left">
                  <span className="text-lg font-serif font-black tracking-widest text-[#ede5d8] block">KROG</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-serif leading-relaxed max-w-sm">
                {t('footer_brand_desc')}
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-[#d4943a] uppercase font-bold block">{t('footer_nav_title')}</span>
              <ul className="space-y-2 text-xs font-serif text-gray-400">
                <li><button onClick={() => scrollToId('philosophy')} className="hover:text-[#ede5d8] cursor-pointer text-left">{t('nav_philosophy')}</button></li>
                <li><button onClick={() => scrollToId('features')} className="hover:text-[#ede5d8] cursor-pointer text-left">{t('nav_features')}</button></li>
                <li><button onClick={() => scrollToId('compare')} className="hover:text-[#ede5d8] cursor-pointer text-left">{t('nav_differences')}</button></li>
                <li><button onClick={() => scrollToId('faq')} className="hover:text-[#ede5d8] cursor-pointer text-left">{t('nav_faq')}</button></li>
              </ul>
            </div>

            {/* Col 3: Compliance & Policy links */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-[#d4943a] uppercase font-bold block">{t('footer_legal_title')}</span>
              <ul className="space-y-2 text-xs font-serif text-gray-400">
                <li>
                  <button
                    onClick={() => navigateToPolicy('privacy')}
                    className="hover:text-[#ede5d8] cursor-pointer text-left flex items-center gap-1.5"
                  >
                    {t('footer_legal_privacy')} <ExternalLink className="w-3 h-3 text-[#d4943a]" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPolicy('terms')}
                    className="hover:text-[#ede5d8] cursor-pointer text-left flex items-center gap-1.5"
                  >
                    {t('footer_legal_terms')} <ExternalLink className="w-3 h-3 text-[#d4943a]" />
                  </button>
                </li>
                <li>
                  <a href="mailto:vietruyn@gmail.com" className="hover:text-[#ede5d8] text-left flex items-center gap-1.5">
                    {t('footer_legal_contact')} <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright and compliance disclosure */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[11px] font-mono text-gray-600">
            <div>
              <p>{t('footer_copyright')}</p>
              <p className="mt-1 text-gray-700">{t('footer_sub')}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[#d4943a]/75 text-[10px]">
                <Shield className="w-3.5 h-3.5" /> {t('play_compliant')}
              </span>
              <span className="text-gray-800">|</span>
              <span>{t('footer_version')}</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
