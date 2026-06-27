import React, { useState } from 'react';
import type { UserProfile, ScreeningResult } from '../types';
import { CircularGauge } from '../components/CircularGauge';
import { TrendChart } from '../components/TrendChart';

interface DashboardPageProps {
  profile: UserProfile;
  history: ScreeningResult[];
  onStartNewScreening: () => void;
  onViewReport: (id: string) => void;
  onReadArticle: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  history,
  onStartNewScreening,
  onViewReport,
  onReadArticle
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'hr' | 'spo2' | 'hrv'>('score');

  const latestResult = history.length > 0 ? history[history.length - 1] : null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 font-sohne space-y-8 pb-24 text-ink">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-apricot-wash/35 border border-rust/20 rounded-cards p-6 shadow-sm">
        <div>
          <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight leading-none">
            Hai {(!profile.name || profile.name.toLowerCase() === 'admin' || profile.name.toLowerCase() === 'bang jan') ? 'Esti' : profile.name}
          </h2>
          <p className="text-[12px] uppercase tracking-wider text-graphite font-semibold mt-2">
            {latestResult 
              ? `[ Skrining Terakhir: ${formatDate(latestResult.date).toUpperCase()} ]`
              : '[ Belum ada data skrining ]'}
          </p>
        </div>
        
        <button
          onClick={onStartNewScreening}
          className="steep-btn-primary text-sm mt-4 md:mt-0 cursor-pointer shadow-sm"
        >
          <i className="fa-solid fa-microphone mr-1.5"></i> Mulai Skrining Baru
        </button>
      </div>

      {/* Main Stats Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Circular Gauge (Steep card style) */}
        <div className="lg:col-span-1 bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep flex flex-col items-center justify-center min-h-[320px]">
          {latestResult ? (
            <CircularGauge score={latestResult.score} size={200} />
          ) : (
            <div className="text-center space-y-4">
              <span className="text-4xl block opacity-40 select-none"><i className="fa-solid fa-chart-simple"></i></span>
              <p className="text-[13px] text-graphite max-w-[200px] mx-auto leading-relaxed">
                Belum ada data perekaman. Silakan lakukan skrining untuk melihat indeks kesehatan Anda.
              </p>
            </div>
          )}
        </div>

        {/* Right Card: Biomarkers Grid and Trend Graph */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mini biomarkers cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* 1. Jantung Status */}
            <div 
              onClick={() => latestResult && onViewReport(latestResult.id)}
              className="bg-apricot-wash/30 border border-rust/10 p-4 rounded-cards cursor-pointer hover:shadow-sm hover:bg-apricot-wash/55 transition-all flex flex-col justify-between h-28"
            >
              <div className="flex justify-between items-start">
                <span className="text-xl select-none"><i className="fa-solid fa-heart text-rust"></i></span>
                {latestResult && (
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    latestResult.heartStatus === 'danger'
                      ? 'bg-status-critical'
                      : latestResult.heartStatus === 'warning'
                      ? 'bg-status-warning'
                      : 'bg-status-good'
                  }`} />
                )}
              </div>
              <div>
                <span className="block text-[11px] text-graphite uppercase tracking-wider mb-1 font-medium">
                  Jantung
                </span>
                <span className="text-sm font-semibold text-ink uppercase">
                  {latestResult ? latestResult.heartStatus : '--'}
                </span>
              </div>
            </div>

            {/* 2. Paru Status */}
            <div 
              onClick={() => latestResult && onViewReport(latestResult.id)}
              className="bg-sky-wash/30 border border-dove/20 p-4 rounded-cards cursor-pointer hover:shadow-sm hover:bg-sky-wash/50 transition-all flex flex-col justify-between h-28"
            >
              <div className="flex justify-between items-start">
                <span className="text-xl select-none"><i className="fa-solid fa-lungs"></i></span>
                {latestResult && (
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    latestResult.lungStatus === 'danger'
                      ? 'bg-status-critical'
                      : latestResult.lungStatus === 'warning'
                      ? 'bg-status-warning'
                      : 'bg-status-good'
                  }`} />
                )}
              </div>
              <div>
                <span className="block text-[11px] text-graphite uppercase tracking-wider mb-1 font-medium">
                  Kondisi Paru
                </span>
                <span className="text-sm font-semibold text-ink uppercase">
                  {latestResult ? latestResult.lungStatus : '--'}
                </span>
              </div>
            </div>

            {/* 3. Laju Napas */}
            <div className="bg-pure-white border border-dove/30 p-4 rounded-cards flex flex-col justify-between h-28 shadow-sm">
              <span className="text-xl block select-none"><i className="fa-solid fa-wind"></i></span>
              <div>
                <span className="block text-[11px] text-graphite uppercase tracking-wider mb-1 font-medium">
                  Laju Napas (RR)
                </span>
                <span className="text-sm font-semibold text-ink">
                  {latestResult ? `${latestResult.biomarkers.rr} / min` : '--'}
                </span>
              </div>
            </div>

            {/* 4. HRV */}
            <div className="bg-pure-white border border-dove/30 p-4 rounded-cards flex flex-col justify-between h-28 shadow-sm">
              <span className="text-xl block select-none"><i className="fa-solid fa-chart-line"></i></span>
              <div>
                <span className="block text-[11px] text-graphite uppercase tracking-wider mb-1 font-medium">
                  HRV Rata-rata
                </span>
                <span className="text-sm font-semibold text-ink">
                  {latestResult ? `${latestResult.biomarkers.hrv} ms` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Trend chart card */}
          <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep">
            <div className="flex flex-wrap gap-2 mb-6 border-b border-dove/10 pb-4">
              {[
                { id: 'score', label: 'Skor Kesehatan' },
                { id: 'hr', label: 'Denyut Nadi (HR)' },
                { id: 'spo2', label: 'Saturasi (SpO2)' },
                { id: 'hrv', label: 'Variabilitas (HRV)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetric(tab.id as any)}
                  className={`text-[12px] font-medium px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedMetric === tab.id
                      ? 'bg-ink border-ink text-pure-white'
                      : 'bg-pure-white border-dove/40 text-graphite hover:border-graphite'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <TrendChart history={history} metric={selectedMetric} />
          </div>

        </div>
      </div>

      {/* Recommendations & Education block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Recommendations card */}
        <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep">
          <h3 className="text-[13px] font-semibold tracking-wider uppercase text-ink mb-4">
            Rekomendasi Medis Aktif
          </h3>
          
          {latestResult ? (
            <div className="space-y-4">
              {/* Immediate alerts */}
              {latestResult.recommendations.immediate.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-rust uppercase tracking-wider">SEGERA:</h4>
                  {latestResult.recommendations.immediate.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-rust/10 p-4 border border-rust/20 rounded-xl">
                      <span className="text-rust text-sm"><i className="fa-solid fa-triangle-exclamation"></i></span>
                      <p className="text-[13px] text-rust font-semibold leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Short Term */}
              {latestResult.recommendations.shortTerm.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider">JANGKA PENDEK:</h4>
                  {latestResult.recommendations.shortTerm.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-sky-wash/20 p-3.5 border border-dove/20 rounded-xl">
                      <span className="text-ink text-sm mt-0.5">•</span>
                      <p className="text-[13px] text-ink leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Lifestyle */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-graphite uppercase tracking-wider">GAYA HIDUP SEHAT:</h4>
                <div className="space-y-2">
                  {latestResult.recommendations.lifestyle.slice(0, 3).map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2.5 p-3 bg-fog border border-dove/10 rounded-xl text-xs">
                      <span className="text-graphite font-semibold">•</span>
                      <p className="text-[13px] text-ash leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-graphite italic text-center py-8">
              Belum ada rekomendasi aktif. Selesaikan skrining untuk memicu data.
            </p>
          )}
        </div>

        {/* Right: Articles */}
        <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep space-y-4">
          <h3 className="text-[13px] font-semibold tracking-wider uppercase text-ink">
            Edukasi Kesehatan Terpilih
          </h3>
          
          <div className="space-y-4">
            {[
              {
                id: 'art-1',
                title: 'Mengenal Murmur Jantung: Kapan Harus Waspada?',
                category: 'Jantung',
                readTime: '4 MIN',
                themeClass: 'bg-apricot-wash text-rust border-rust/10'
              },
              {
                id: 'art-2',
                title: '5 Latihan Pernapasan untuk Kapasitas Paru',
                category: 'Paru',
                readTime: '5 MIN',
                themeClass: 'bg-sky-wash text-ink border-dove/20'
              }
            ].map((art) => (
              <div 
                key={art.id} 
                onClick={() => onReadArticle(art.id)}
                className="flex items-start justify-between p-4 bg-fog border border-dove/20 rounded-xl hover:bg-sky-wash/10 transition-all cursor-pointer group shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${art.themeClass}`}>
                      {art.category}
                    </span>
                    <span className="text-[10px] text-graphite font-normal">{art.readTime} Baca</span>
                  </div>
                  <h4 className="font-semibold text-sm text-ink group-hover:underline">
                    {art.title}
                  </h4>
                </div>
                <span className="text-graphite group-hover:text-ink text-lg ml-2">→</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
