import React, { useState } from 'react';
import { MOCK_ARTICLES } from '../utils/mockData';

interface EducationPageProps {
  selectedArticleId: string | null;
  onSelectArticle: (id: string | null) => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({
  selectedArticleId,
  onSelectArticle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'Jantung' | 'Paru' | 'Gaya Hidup'>('all');

  const filteredArticles = MOCK_ARTICLES.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const activeArticle = MOCK_ARTICLES.find(a => a.id === selectedArticleId);

  // VIEW SINGLE ARTICLE DETAILS
  if (selectedArticleId && activeArticle) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 py-10 font-sohne pb-24 text-ink">
        
        {/* Back navigation */}
        <button
          onClick={() => onSelectArticle(null)}
          className="text-xs text-graphite hover:text-ink flex items-center space-x-1 font-semibold mb-6 cursor-pointer"
        >
          <span>←</span> <span>Kembali ke Daftar Artikel</span>
        </button>

        {/* Article Body - Steep editorial layout */}
        <article className="bg-pure-white border border-dove/30 rounded-cards p-6 md:p-8 shadow-steep space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-rust/10 bg-apricot-wash text-rust uppercase tracking-wider">
                {activeArticle.category}
              </span>
              <span className="text-[11px] text-graphite font-normal uppercase">• {activeArticle.readTime} Baca</span>
            </div>
            
            <h1 className="font-signifier text-[36px] md:text-[52px] font-normal text-ink tracking-tight leading-tight">
              {activeArticle.title}
            </h1>
          </div>

          <p className="text-[14px] text-ash border-l-2 border-rust pl-4 italic leading-relaxed">
            {activeArticle.summary}
          </p>

          <div className="text-[15px] text-ash leading-[1.45] whitespace-pre-line space-y-4">
            {activeArticle.content}
          </div>
        </article>

      </div>
    );
  }

  // ARTICLES LIST VIEW
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 font-sohne space-y-6 pb-24 text-ink">
      
      {/* Header */}
      <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep">
        <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight leading-none">
          Pusat Edukasi Medis AIRA
        </h2>
        <p className="text-[12px] text-graphite mt-2 uppercase font-semibold">
          [ Informasi dan bacaan kardiorespiratori terverifikasi ]
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Cari topik kesehatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-3 text-[13px] text-ink focus:outline-none focus:border-graphite focus:bg-fog"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua', icon: null },
            { id: 'Jantung', label: 'Jantung', icon: <i className="fa-solid fa-heart mr-1.5 text-rust"></i> },
            { id: 'Paru', label: 'Paru', icon: <i className="fa-solid fa-lungs mr-1.5"></i> },
            { id: 'Gaya Hidup', label: 'Gaya Hidup', icon: <i className="fa-solid fa-seedling mr-1.5"></i> }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveCategory(btn.id as any)}
              className={`text-[12px] font-medium px-4 py-2.5 rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center ${
                activeCategory === btn.id
                  ? 'bg-ink border-ink text-pure-white'
                  : 'bg-pure-white border-dove/40 text-graphite hover:border-graphite'
              }`}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art.id)}
              className="bg-pure-white border border-dove/35 rounded-cards p-5 shadow-sm hover:shadow-steep transition-all cursor-pointer flex flex-col justify-between group duration-200"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="font-semibold text-rust uppercase tracking-wider">
                    {art.category.toUpperCase()}
                  </span>
                  <span className="text-graphite">{art.readTime}</span>
                </div>
                
                <h3 className="font-semibold text-[15px] text-ink group-hover:underline line-clamp-2 leading-snug">
                  {art.title}
                </h3>
                
                <p className="text-[13px] text-ash line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
              
              <div className="mt-5 pt-3 border-t border-dove/10 flex justify-end text-[11px] font-semibold text-rust group-hover:underline">
                Baca Selengkapnya →
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-pure-white border border-dove/30 rounded-cards p-12 text-center text-[13px] text-graphite italic shadow-sm">
            [ Artikel edukasi tidak ditemukan ]
          </div>
        )}
      </div>

    </div>
  );
};
