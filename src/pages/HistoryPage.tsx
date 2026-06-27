import React, { useState } from 'react';
import type { ScreeningResult } from '../types';

interface HistoryPageProps {
  history: ScreeningResult[];
  onViewReport: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onViewReport,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'warning' | 'danger'>('all');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.heartFindings.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.lungFindings.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const organWarning = item.heartStatus === 'warning' || item.lungStatus === 'warning';
    const organDanger = item.heartStatus === 'danger' || item.lungStatus === 'danger';
    const organNormal = item.heartStatus === 'normal' && item.lungStatus === 'normal';

    let matchesStatus = true;
    if (statusFilter === 'normal') matchesStatus = organNormal;
    if (statusFilter === 'warning') matchesStatus = organWarning && !organDanger;
    if (statusFilter === 'danger') matchesStatus = organDanger;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 font-sohne space-y-6 pb-24 text-ink">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep">
        <div>
          <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight leading-none">
            Riwayat Skrining Kesehatan
          </h2>
          <p className="text-[12px] text-graphite mt-1.5 uppercase font-semibold">
            [ Log Perekaman dan Diagnostik AI ]
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat skrining? Tindakan ini tidak dapat dibatalkan.')) {
                onClearHistory();
              }
            }}
            className="text-[12px] font-semibold text-rust hover:underline mt-3 sm:mt-0 cursor-pointer"
          >
            Hapus Semua Riwayat
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Cari temuan atau ID skrining..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-3 text-[13px] text-ink focus:outline-none focus:border-graphite focus:bg-fog"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'normal', label: 'Normal' },
            { id: 'warning', label: 'Waspada' },
            { id: 'danger', label: 'Perhatian' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id as any)}
              className={`text-[12px] font-medium px-4 py-2 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === btn.id
                  ? 'bg-ink border-ink text-pure-white'
                  : 'bg-pure-white border-dove/40 text-graphite hover:border-graphite'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const hasDanger = item.heartStatus === 'danger' || item.lungStatus === 'danger';
            const hasWarning = item.heartStatus === 'warning' || item.lungStatus === 'warning';
            
            let statusColor = 'bg-status-good/10 text-status-good border-status-good/20';
            let label = 'Normal';
            if (hasDanger) {
              statusColor = 'bg-status-critical/10 text-status-critical border-status-critical/20';
              label = 'Perlu Tindakan';
            } else if (hasWarning) {
              statusColor = 'bg-status-warning/10 text-status-warning border-status-warning/20';
              label = 'Perlu Perhatian';
            }

            return (
              <div
                key={item.id}
                onClick={() => onViewReport(item.id)}
                className="bg-pure-white border border-dove/30 rounded-cards p-5 shadow-sm hover:shadow-steep hover:bg-sky-wash/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink">
                      #{item.id.toUpperCase()}
                    </span>
                    <span className="text-dove/60">•</span>
                    <span className="text-[12px] text-graphite">
                      {formatDate(item.date)}
                    </span>
                    <span className={`text-[11px] font-semibold px-3 py-0.5 rounded-full border ${statusColor}`}>
                      {label}
                    </span>
                  </div>
                  
                  <div className="text-[13px] text-ash leading-relaxed max-w-xl">
                    <strong className="text-ink text-[11px] uppercase tracking-wider font-semibold mr-1">Temuan:</strong>
                    {item.heartFindings[0]}, {item.lungFindings[0]}
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end md:self-auto">
                  <div className="text-right">
                    <span className="block text-[11px] text-graphite uppercase tracking-wider font-medium">
                      Skor Indeks
                    </span>
                    <span className="text-2xl font-signifier font-normal text-ink">
                      {item.score}
                    </span>
                  </div>
                  <span className="text-graphite group-hover:text-ink text-lg transition-colors">
                    →
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-pure-white border border-dove/30 rounded-cards p-12 text-center text-[13px] text-graphite italic shadow-sm">
            [ Belum ada data skrining tercatat ]
          </div>
        )}
      </div>

    </div>
  );
};
