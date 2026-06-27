import React, { useState } from 'react';

interface AuthPagesProps {
  type: 'login' | 'register';
  onSuccess: (name: string) => void;
  onCancel: () => void;
  onSwitchType: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  type,
  onSuccess,
  onCancel,
  onSwitchType
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (type === 'register' && !name)) {
      setError('Harap isi semua kolom.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(type === 'register' ? name : email.split('@')[0]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-fog flex items-center justify-center px-4 font-sohne py-12 text-ink">
      
      {/* Card: 24px radius (Steep card style) with shadow-steep */}
      <div className="relative w-full max-w-md bg-pure-white rounded-cards p-8 shadow-steep z-10 border border-dove/20">
        
        {/* Back Button */}
        <button 
          onClick={onCancel}
          className="absolute top-6 left-6 text-[12px] font-medium text-graphite hover:text-ink flex items-center space-x-1 cursor-pointer"
        >
          <span>←</span> <span>Kembali</span>
        </button>

        <div className="text-center mt-6 mb-8">
          <span className="text-4xl mb-3 block select-none text-rust"><i className="fa-solid fa-lungs"></i></span>
          <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
            {type === 'login' ? 'Masuk Akun' : 'Daftar Baru'}
          </h2>
          <p className="text-[12px] tracking-wide text-graphite uppercase">
            {type === 'login' 
              ? '[ Akses data skrining akustik ]' 
              : '[ Daftar pemantauan biomarker ]'}
          </p>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/20 text-rust text-xs rounded-xl p-3 mb-6 text-center font-sohne">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Bang Jan"
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-3 text-sm text-ink focus:outline-none focus:border-graphite focus:bg-fog transition-all font-sohne"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cth: name@example.com"
              className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-3 text-sm text-ink focus:outline-none focus:border-graphite focus:bg-fog transition-all font-sohne"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-3 text-sm text-ink focus:outline-none focus:border-graphite focus:bg-fog transition-all font-sohne"
            />
          </div>

          {type === 'login' && (
            <div className="flex justify-end">
              <a href="#" className="text-xs text-ink hover:underline">Lupa sandi?</a>
            </div>
          )}

          {/* Filled Dark CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="steep-btn-primary w-full mt-6 py-3 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-pure-white/30 border-t-pure-white rounded-full animate-spin"></span>
            ) : (
              type === 'login' ? 'Masuk Sekarang' : 'Daftar & Lanjut'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-dove/20 text-center text-xs">
          <span className="text-graphite font-normal">
            {type === 'login' ? 'Belum punya akun?' : 'Sudah memiliki akun?'}
          </span>{' '}
          <button 
            onClick={onSwitchType}
            className="text-ink font-semibold hover:underline cursor-pointer"
          >
            {type === 'login' ? 'Daftar disini' : 'Masuk disini'}
          </button>
        </div>
      </div>
    </div>
  );
};
