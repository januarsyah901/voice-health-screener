import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface OnboardingPageProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  
  // Profile state builder
  const [name, setName] = useState('Esti');
  const [nik, setNik] = useState('');
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Perempuan');
  const [alamat, setAlamat] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [agama, setAgama] = useState('');
  const [height, setHeight] = useState(160);
  const [weight, setWeight] = useState(55);
  const [keluhan, setKeluhan] = useState('');
  const [riwayatPenyakitDahulu, setRiwayatPenyakitDahulu] = useState('');
  const [riwayatKesehatanKeluarga, setRiwayatKesehatanKeluarga] = useState('');
  const [riwayatSosial, setRiwayatSosial] = useState('');
  const [polaMakan, setPolaMakan] = useState('3 kali sehari');
  const [aktivitasFisik, setAktivitasFisik] = useState('30 menit');
  const [alergi, setAlergi] = useState('Tidak Ada');
  const [pengobatanStatus, setPengobatanStatus] = useState<'Belum' | 'Sudah'>('Belum');
  const [pengobatanKondisi, setPengobatanKondisi] = useState<'Membaik' | 'Tidak Membaik' | '-'>('-');

  const [consentAudio, setConsentAudio] = useState(true);
  const [consentSensors, setConsentSensors] = useState(true);
  const [consentResearch, setConsentResearch] = useState(true);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        name,
        nik,
        age,
        gender,
        alamat,
        pekerjaan,
        agama,
        height,
        weight,
        keluhan,
        riwayatPenyakitDahulu,
        riwayatKesehatanKeluarga,
        riwayatSosial,
        polaMakan,
        aktivitasFisik,
        alergi,
        pengobatanStatus,
        pengobatanKondisi,
        consent: {
          audio: consentAudio,
          sensors: consentSensors,
          research: consentResearch
        }
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-fog flex items-center justify-center px-4 font-sohne py-12 text-ink">
      
      {/* Steep Card wrapper */}
      <div className="w-full max-w-xl bg-pure-white border border-dove/20 rounded-cards p-6 md:p-8 shadow-steep relative">
        
        {/* Progress Line - Rust color */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-dove/10 rounded-t-cards overflow-hidden">
          <div 
            className="bg-rust h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Indicator Header */}
        <div className="flex justify-between items-center text-[11px] text-graphite mb-8 pt-2">
          <span className="font-medium">LANGKAH {step} DARI 4</span>
          <span className="font-semibold text-ink uppercase tracking-wider">
            {step === 1 && 'Selamat Datang'}
            {step === 2 && 'Rekam Medis Pasien'}
            {step === 3 && 'Akses Privasi'}
            {step === 4 && 'Tutorial Posisi'}
          </span>
        </div>

        {/* STEP 1: WELCOME SCREEN */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <span className="text-5xl block select-none text-rust space-x-3"><i className="fa-solid fa-lungs"></i><i className="fa-solid fa-heart"></i></span>
            <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight leading-none">
              Selamat datang di AIRA
            </h2>
            <p className="text-[14px] text-ash leading-relaxed max-w-md mx-auto">
              AIRA membantu memantau kesehatan sistem kardiorespirasi (jantung & paru) secara berkala menggunakan sensor cerdas smartphone Anda.
            </p>
            
            <div className="bg-apricot-wash/30 border border-rust/10 p-5 text-left rounded-xl">
              <h4 className="text-[11px] font-bold text-rust uppercase tracking-wider mb-3">
                Persiapan Sebelum Mulai:
              </h4>
              <ul className="text-[13px] space-y-2 text-ash list-disc list-inside leading-relaxed">
                <li>Temukan tempat tenang bebas dari suara bising atau percakapan.</li>
                <li>Siapkan smartphone Anda agar mudah dioperasikan.</li>
                <li>Gunakan pakaian yang mudah dilonggarkan di area dada.</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE DATA FORM */}
        {step === 2 && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="font-signifier text-[28px] font-normal text-ink text-center mb-4 leading-none">
              Identitas & Rekam Medis
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="16 Digit NIK"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Usia (Tahun)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Agama
                </label>
                <input
                  type="text"
                  value={agama}
                  onChange={(e) => setAgama(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  placeholder="Agama"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Tinggi (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Berat (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  placeholder="Pekerjaan"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Alamat Lengkap
              </label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="Alamat Lengkap"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Keluhan Utama
              </label>
              <textarea
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                rows={2}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="Tulis keluhan utama Anda..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Riwayat Penyakit Dahulu
                </label>
                <input
                  type="text"
                  value={riwayatPenyakitDahulu}
                  onChange={(e) => setRiwayatPenyakitDahulu(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  placeholder="hipertensi/diabetes/asma/jantung/lainnya"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Riwayat Penyakit Keluarga
                </label>
                <input
                  type="text"
                  value={riwayatKesehatanKeluarga}
                  onChange={(e) => setRiwayatKesehatanKeluarga(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  placeholder="hipertensi/diabetes/asma/jantung/lainnya"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Riwayat Sosial & Lingkungan
              </label>
              <input
                type="text"
                value={riwayatSosial}
                onChange={(e) => setRiwayatSosial(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="perokok, paparan asap rokok, alkohol, dll"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Pola Makan
                </label>
                <select
                  value={polaMakan}
                  onChange={(e) => setPolaMakan(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-2 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                >
                  <option value="1 kali sehari">1 kali sehari</option>
                  <option value="2 kali sehari">2 kali sehari</option>
                  <option value="3 kali sehari">3 kali sehari</option>
                  <option value="4 kali sehari">4 kali sehari</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Fisik / Hari
                </label>
                <select
                  value={aktivitasFisik}
                  onChange={(e) => setAktivitasFisik(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-2 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                >
                  <option value="30 menit">30 menit</option>
                  <option value="60 menit">60 menit</option>
                  <option value="90 menit">90 menit</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Riwayat Alergi
                </label>
                <input
                  type="text"
                  value={alergi}
                  onChange={(e) => setAlergi(e.target.value)}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                  placeholder="obat/makanan/minuman/tidak ada"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Pernah Pengobatan
                </label>
                <select
                  value={pengobatanStatus}
                  onChange={(e) => {
                    setPengobatanStatus(e.target.value as any);
                    if (e.target.value === 'Belum') setPengobatanKondisi('-');
                  }}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite"
                >
                  <option value="Belum">Belum</option>
                  <option value="Sudah">Sudah</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                  Hasil Pengobatan
                </label>
                <select
                  value={pengobatanKondisi}
                  onChange={(e) => setPengobatanKondisi(e.target.value as any)}
                  disabled={pengobatanStatus === 'Belum'}
                  className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2 text-sm text-ink focus:outline-none focus:border-graphite disabled:bg-fog/50"
                >
                  <option value="-">-</option>
                  <option value="Membaik">Membaik</option>
                  <option value="Tidak Membaik">Tidak Membaik</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & CONSENT FORM */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-signifier text-[28px] font-normal text-ink text-center mb-4">
              Konfigurasi Privasi & Izin Sensor
            </h3>
            
            <p className="text-[13px] text-ash leading-relaxed text-center max-w-sm mx-auto">
              Keamanan data Anda adalah prioritas utama. Rekaman suara biologis diolah langsung pada perangkat Anda dan dienkripsi saat dikirim.
            </p>

            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-sky-wash/20 border border-dove/20 rounded-xl shadow-sm">
                <div className="flex-1 pr-4">
                  <h4 className="text-xs font-semibold uppercase text-ink">Izin Akses Mikrofon</h4>
                  <p className="text-[11px] text-ash mt-1">
                    Dibutuhkan untuk merekam sinyal akustik katup jantung dan hembusan napas paru.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentAudio}
                  onChange={(e) => setConsentAudio(e.target.checked)}
                  className="w-4 h-4 accent-ink mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between p-4 bg-sky-wash/20 border border-dove/20 rounded-xl shadow-sm">
                <div className="flex-1 pr-4">
                  <h4 className="text-xs font-semibold uppercase text-ink">Izin Akses Kamera & Akselerometer</h4>
                  <p className="text-[11px] text-ash mt-1">
                    Digunakan untuk membaca sinyal denyut kapiler jari (PPG) dan mendeteksi getaran pernapasan dada.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentSensors}
                  onChange={(e) => setConsentSensors(e.target.checked)}
                  className="w-4 h-4 accent-ink mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between p-4 bg-sky-wash/20 border border-dove/20 rounded-xl shadow-sm">
                <div className="flex-1 pr-4">
                  <h4 className="text-xs font-semibold uppercase text-ink">Opt-in Penyimpanan Data Riset (Anonim)</h4>
                  <p className="text-[11px] text-ash mt-1">
                    Membantu tim medis mengembangkan akurasi model AI diagnostik secara global tanpa melacak identitas Anda.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consentResearch}
                  onChange={(e) => setConsentResearch(e.target.checked)}
                  className="w-4 h-4 accent-ink mt-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TUTORIAL ANIMATIONS GUIDE */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-signifier text-[28px] font-normal text-ink text-center mb-4">
              Panduan Perekaman Sensor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-pure-white border border-dove/35 p-4 rounded-xl shadow-sm">
                <span className="text-2xl block animate-pulse text-rust"><i className="fa-solid fa-microphone"></i></span>
                <h4 className="text-[11px] font-semibold mt-2 text-ink uppercase">
                  SUARA JANTUNG
                </h4>
                <p className="text-[11px] text-ash mt-1.5 leading-relaxed">
                  Tempelkan area bawah smartphone/mikrofon langsung ke dada kiri bawah tanpa terhalang baju.
                </p>
              </div>

              <div className="bg-pure-white border border-dove/35 p-4 rounded-xl shadow-sm">
                <span className="text-2xl block text-rust"><i className="fa-solid fa-wind"></i></span>
                <h4 className="text-[11px] font-semibold mt-2 text-ink uppercase">
                  SUARA PARU
                </h4>
                <p className="text-[11px] text-ash mt-1.5 leading-relaxed">
                  Tarik napas dalam-dalam melalui hidung dan buang napas perlahan lewat mulut yang terbuka lebar.
                </p>
              </div>

              <div className="bg-pure-white border border-dove/35 p-4 rounded-xl shadow-sm">
                <span className="text-2xl block text-rust"><i className="fa-solid fa-camera"></i></span>
                <h4 className="text-[11px] font-semibold mt-2 text-ink uppercase">
                  PPG KAMERA
                </h4>
                <p className="text-[11px] text-ash mt-1.5 leading-relaxed">
                  Tutup kamera belakang utama dan nyalakan flash menggunakan ujung jari telunjuk dengan tekanan ringan.
                </p>
              </div>
            </div>

            <div className="bg-apricot-wash text-rust p-4 text-center text-xs font-semibold rounded-xl border border-rust/10 uppercase tracking-wide">
              [ Setup Berhasil. Anda Siap Memulai Pemindaian Pertama ]
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex justify-between items-center pt-6 mt-8 border-t border-dove/20">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`text-xs font-semibold cursor-pointer ${
              step === 1 ? 'text-dove/40 cursor-not-allowed' : 'text-graphite hover:text-ink'
            }`}
          >
            KEMBALI
          </button>

          <button
            onClick={handleNext}
            className="steep-btn-primary text-xs cursor-pointer"
          >
            {step === 4 ? 'SELESAI & MASUK' : 'SELANJUTNYA'}
          </button>
        </div>

      </div>
    </div>
  );
};
