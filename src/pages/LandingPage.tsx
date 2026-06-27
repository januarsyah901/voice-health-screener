import React from 'react';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, onRegister }) => {
  return (
    <div className="relative min-h-screen bg-pure-white flex flex-col font-sohne text-ink overflow-x-hidden">
      
      {/* TheraHive Style Top Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex justify-between items-center z-20 border-b border-dove/20">
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="AIRA Logo" 
            className="w-8 h-8 rounded-xl object-cover" 
          />
          <img 
            src="/name.png" 
            alt="AIRA" 
            className="h-6 object-contain" 
          />
        </div>
        <div className="flex items-center space-x-5">
          <button 
            onClick={onLogin}
            className="text-[14px] font-semibold text-ink hover:text-rust transition-colors cursor-pointer"
          >
            Masuk
          </button>
          <button 
            onClick={onRegister}
            className="steep-btn-primary text-[13px] px-5 py-2 cursor-pointer shadow-sm"
          >
            Daftar Akun
          </button>
        </div>
      </header>

      {/* Hero Section - Inspired by TheraHive split/minimalist layout */}
      <div className="w-full bg-fog/30 py-16 md:py-24 px-6 relative overflow-hidden">
        {/* Soft decorative blur glow in the corner */}
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-apricot-wash/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rust bg-apricot-wash px-3 py-1 rounded-full border border-rust/10">
                <i className="fa-solid fa-circle-check mr-1.5"></i> Screening Akustik & Biomarker AI
              </span>
            </div>
            
            <h1 className="text-[42px] md:text-[62px] font-extrabold text-ink tracking-tight leading-[1.05] max-w-2xl">
              Dengarkan Tubuhmu Sebelum <span className="text-rust underline decoration-wavy decoration-1 underline-offset-8">Terlambat</span>.
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-ash max-w-xl leading-relaxed font-normal">
              Skrining awal mandiri risiko penyakit jantung & paru klinis dari smartphone Anda. Memadukan visualisasi audio stetoskop digital, analisis denyut kapiler, dan kecerdasan buatan dalam 5 menit.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button 
                onClick={onStart}
                className="steep-btn-primary px-8 py-3.5 text-[15px] font-semibold cursor-pointer shadow-md"
              >
                Mulai Skrining Gratis
              </button>
              <a 
                href="#cara-kerja" 
                className="steep-btn-secondary text-[14px] font-semibold hover:text-rust text-center flex items-center justify-center py-2"
              >
                Pelajari Alur Kerja <i className="fa-solid fa-arrow-right ml-1.5"></i>
              </a>
            </div>
          </div>

          {/* Right Visual Column (Interactive Waveform Card) */}
          <div className="lg:col-span-5 bg-pure-white border border-dove/30 p-6 rounded-cards shadow-steep space-y-4">
            <div className="flex items-center justify-between border-b border-dove/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rust animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-graphite">Demo Sinyal Osiloskop</span>
              </div>
              <span className="text-[11px] text-rust font-semibold">[ Real-time Feedback ]</span>
            </div>
            
            <div className="h-40 rounded-xl overflow-hidden bg-fog/20 border border-dove/25">
              <WaveformVisualizer isRecording={false} type="ambient" />
            </div>
            
            <p className="text-[12px] text-graphite leading-relaxed text-center">
              Visualisasi grafik gelombang memantau anomali katup jantung secara non-invasif dari smartphone.
            </p>
          </div>

        </div>
      </div>

      {/* Trust Badges - TheraHive clean gray logos strip */}
      <section className="bg-pure-white border-y border-dove/20 py-8 text-center px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[11px] font-bold tracking-wider text-graphite uppercase whitespace-nowrap">
            Divalidasi & Dikembangkan Bersama:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {['RS Jantung Utama', 'Universitas Kedokteran', 'Lab Biomarker Pusat', 'Klinik Kesehatan Digital'].map((logo, idx) => (
              <div 
                key={idx}
                className="border border-dove/20 rounded-xl py-3 text-[12px] font-semibold text-graphite tracking-tight hover:border-rust hover:text-ink transition-colors bg-fog/10"
              >
                <i className="fa-solid fa-hospital mr-1.5 text-rust/80"></i> {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TheraHive Style How it Works layout (Grid layout with rounded sections) */}
      <section id="cara-kerja" className="bg-fog/20 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-rust font-bold bg-apricot-wash px-3 py-1 rounded-full border border-rust/10">
              Metodologi Skrining
            </span>
            <h2 className="text-[36px] md:text-[48px] font-extrabold text-ink tracking-tight leading-none">
              Empat Langkah Pengukuran
            </h2>
            <p className="text-[14px] text-ash leading-relaxed">
              Proses pemeriksaan akustik digital mandiri dirancang sederhana, terstruktur, dan minim kecemasan teknis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                num: '01', 
                title: 'Kalibrasi Mikrofon', 
                desc: 'Memastikan tingkat kebisingan ruangan ideal untuk mendeteksi frekuensi paru & jantung.', 
                icon: 'fa-microphone-lines',
                bgClass: 'bg-pure-white border border-dove/30' 
              },
              { 
                num: '02', 
                title: 'Akustik Jantung & Paru', 
                desc: 'Perekaman audio biologis katup organ melalui mikrofon bawaan di dada Anda.', 
                icon: 'fa-lungs-virus',
                bgClass: 'bg-apricot-wash/30 border border-rust/15' 
              },
              { 
                num: '03', 
                title: 'PPG Kapiler Jari', 
                desc: 'Analisis saturasi oksigen SpO2 dan HRV melalui pantulan flash kamera belakang.', 
                icon: 'fa-heart-pulse',
                bgClass: 'bg-sky-wash/35 border border-dove/25' 
              },
              { 
                num: '04', 
                title: 'AI Fusi Laporan', 
                desc: 'Penyusunan indikasi risiko, ringkasan skor biomarker, dan rekomendasi medis lengkap.', 
                icon: 'fa-square-poll-horizontal',
                bgClass: 'bg-pure-white border border-dove/30' 
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className={`${step.bgClass} p-6 rounded-cards flex flex-col justify-between space-y-6 hover:shadow-steep transition-all duration-350 hover:-translate-y-1`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-extrabold text-rust/30">{step.num}</span>
                  <span className="text-lg text-rust"><i className={`fa-solid ${step.icon}`}></i></span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-[15px] text-ink">{step.title}</h3>
                  <p className="text-[12px] text-ash leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - clean minimalist icons grid */}
      <section className="bg-pure-white border-t border-dove/20 py-16 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-graphite font-bold">Teknologi Terintegrasi</span>
            <h2 className="text-[28px] md:text-[34px] font-extrabold text-ink tracking-tight">
              Infrastruktur Web & Pemrosesan AI
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 items-center pt-2">
            {[
              { name: 'React', icon: 'devicon-react-original' },
              { name: 'TypeScript', icon: 'devicon-typescript-plain' },
              { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original' },
              { name: 'Vite', icon: 'devicon-vite-plain' },
              { name: 'Node.js', icon: 'devicon-nodejs-plain' },
              { name: 'Python', icon: 'devicon-python-plain' }
            ].map((tech, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1 hover:scale-105 transition-transform">
                <i className={`${tech.icon} text-3xl text-ink hover:text-rust transition-colors duration-150`}></i>
                <span className="text-[11px] font-semibold text-graphite">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TheraHive Style Alert Box for Medical Disclaimer */}
      <section className="py-12 px-6 border-t border-dove/20 bg-apricot-wash/15">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-4 bg-pure-white border border-rust/10 p-5 rounded-cards shadow-sm">
            <span className="text-xl text-rust mt-0.5"><i className="fa-solid fa-triangle-exclamation"></i></span>
            <div className="space-y-1">
              <h4 className="text-[12px] font-bold text-rust uppercase tracking-wider">
                AIRA — Pembatasan Tanggung Jawab
              </h4>
              <p className="text-[13px] text-ash leading-relaxed">
                AIRA (Acoustic Intelligence for Respiratory Assessment) adalah platform skrining kardiorespirasi presisi berbasis smartphone yang mengintegrasikan Digital Respiratory Biomarkers, Explainable Artificial Intelligence, dan Personal Digital Twin untuk memprediksi risiko penyakit jantung dan paru secara dini, memberikan rekomendasi kesehatan personal, serta mendukung terciptanya layanan kesehatan yang lebih preventif, prediktif, dan inklusif. Alat ini adalah pendeteksi awal dan bukan pengganti diagnosis formal klinis dokter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Band */}
      <footer className="w-full bg-ink text-pure-white py-16 text-center border-t border-dove/20">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-center">
            <img 
              src="/logo_name.png" 
              alt="AIRA" 
              className="h-10 object-contain brightness-0 invert" 
            />
          </div>
          <p className="text-[11px] text-graphite uppercase tracking-wider">
            [ Acoustic Intelligence for Respiratory Assessment ]
          </p>
          <p className="text-[11px] text-dove/40 max-w-xl mx-auto leading-relaxed pt-4 border-t border-dove/10">
            © 2026 AIRA. Semua hak cipta dilindungi. Didesain menggunakan sistem gaya Steep minimalis yang terinspirasi dari tata letak humanis TheraHive.
          </p>
        </div>
      </footer>
    </div>
  );
};
