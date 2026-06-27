import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  onLogout
}) => {
  const [name, setName] = useState(profile.name);
  const [nik, setNik] = useState(profile.nik || '');
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>(profile.gender);
  const [alamat, setAlamat] = useState(profile.alamat || '');
  const [pekerjaan, setPekerjaan] = useState(profile.pekerjaan || '');
  const [agama, setAgama] = useState(profile.agama || '');
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [keluhan, setKeluhan] = useState(profile.keluhan || '');
  const [riwayatPenyakitDahulu, setRiwayatPenyakitDahulu] = useState(profile.riwayatPenyakitDahulu || '');
  const [riwayatKesehatanKeluarga, setRiwayatKesehatanKeluarga] = useState(profile.riwayatKesehatanKeluarga || '');
  const [riwayatSosial, setRiwayatSosial] = useState(profile.riwayatSosial || '');
  const [polaMakan, setPolaMakan] = useState(profile.polaMakan || '3 kali sehari');
  const [aktivitasFisik, setAktivitasFisik] = useState(profile.aktivitasFisik || '30 menit');
  const [alergi, setAlergi] = useState(profile.alergi || 'Tidak Ada');
  const [pengobatanStatus, setPengobatanStatus] = useState<'Belum' | 'Sudah'>(profile.pengobatanStatus || 'Belum');
  const [pengobatanKondisi, setPengobatanKondisi] = useState<'Membaik' | 'Tidak Membaik' | '-'>(profile.pengobatanKondisi || '-');

  const [consentAudio, setConsentAudio] = useState(profile.consent.audio);
  const [consentSensors, setConsentSensors] = useState(profile.consent.sensors);
  const [consentResearch, setConsentResearch] = useState(profile.consent.research);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
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

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const backupData = {
      profile,
      history: localStorage.getItem('cardiolung_history') 
        ? JSON.parse(localStorage.getItem('cardiolung_history')!) 
        : []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aira_data_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 font-sohne space-y-6 pb-24 text-ink">
      
      {/* Title */}
      <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep flex justify-between items-center">
        <div>
          <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight leading-none">
            Pengaturan Profil & Akun Pasien
          </h2>
          <p className="text-[12px] text-graphite mt-2 uppercase font-semibold">
            [ Portal Modifikasi Data Medis dan Demografis AIRA ]
          </p>
        </div>
        <button
          onClick={onLogout}
          className="text-[12px] font-semibold text-rust hover:underline cursor-pointer"
        >
          Keluar Sesi
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-ink text-pure-white text-[12px] rounded-xl p-3.5 text-center font-semibold tracking-wide uppercase">
          [ Data Rekam Medis Berhasil Diperbarui ]
        </div>
      )}

      {/* Main form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side (Medical & Demographics Profile) */}
        <div className="md:col-span-2 bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep space-y-5">
          <h3 className="text-xs font-semibold uppercase text-ink border-b border-dove/10 pb-3">
            Identitas & Parameter Klinis Pasien
          </h3>

          {/* Row 1: Name and NIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
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
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="16 Digit NIK"
                required
              />
            </div>
          </div>

          {/* Row 2: Age, Gender, Religion */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Usia (Tahun)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
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
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="Agama"
              />
            </div>
          </div>

          {/* Row 3: Job and Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Pekerjaan
              </label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="Pekerjaan"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Alamat Rumah
              </label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="Alamat Lengkap"
              />
            </div>
          </div>

          {/* Row 4: Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                required
              />
            </div>
          </div>

          {/* Row 5: Chief Complaints */}
          <div>
            <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
              Keluhan Utama Saat Ini
            </label>
            <textarea
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              rows={2}
              className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
              placeholder="Contoh: Batuk berdahak 3 hari, sesak setelah aktivitas..."
            />
          </div>

          {/* Medical Histories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Riwayat Penyakit Dahulu
              </label>
              <input
                type="text"
                value={riwayatPenyakitDahulu}
                onChange={(e) => setRiwayatPenyakitDahulu(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="hipertensi/diabetes/asma/jantung/lainnya"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Riwayat Kesehatan Keluarga
              </label>
              <input
                type="text"
                value={riwayatKesehatanKeluarga}
                onChange={(e) => setRiwayatKesehatanKeluarga(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="hipertensi/diabetes/asma/jantung/lainnya"
              />
            </div>
          </div>

          {/* Social Histories */}
          <div>
            <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
              Riwayat Sosial & Lingkungan
            </label>
            <input
              type="text"
              value={riwayatSosial}
              onChange={(e) => setRiwayatSosial(e.target.value)}
              className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
              placeholder="perokok, paparan rokok, alkohol, zat adiktif, dll"
            />
          </div>

          {/* Lifestyle parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Pola Makan Per Hari
              </label>
              <select
                value={polaMakan}
                onChange={(e) => setPolaMakan(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
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
                Aktivitas Fisik / Hari
              </label>
              <select
                value={aktivitasFisik}
                onChange={(e) => setAktivitasFisik(e.target.value)}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
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
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                placeholder="obat / makanan / minuman / tidak ada"
              />
            </div>
          </div>

          {/* Undergone Medical Treatment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Telah Melakukan Pengobatan
              </label>
              <div className="flex space-x-2">
                {['Belum', 'Sudah'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setPengobatanStatus(status as any);
                      if (status === 'Belum') setPengobatanKondisi('-');
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      pengobatanStatus === status
                        ? 'bg-ink border-ink text-pure-white'
                        : 'bg-pure-white border-dove/40 text-ink hover:bg-fog'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-graphite uppercase tracking-wider mb-1.5">
                Kondisi Pengobatan Saat Ini
              </label>
              <select
                value={pengobatanKondisi}
                onChange={(e) => setPengobatanKondisi(e.target.value as any)}
                disabled={pengobatanStatus === 'Belum'}
                className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite disabled:bg-fog/50 disabled:text-graphite/60"
              >
                <option value="-">-</option>
                <option value="Membaik">Membaik</option>
                <option value="Tidak Membaik">Tidak Membaik</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="steep-btn-primary text-xs cursor-pointer shadow-sm"
            >
              Simpan Perubahan Data Medis
            </button>
          </div>
        </div>

        {/* Right Side (Settings & Access) */}
        <div className="space-y-6">
          {/* Privacy */}
          <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep space-y-4">
            <h3 className="text-xs font-semibold uppercase text-ink border-b border-dove/10 pb-3">
              Izin & Akses Sensor
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-[13px] text-ink font-medium">
                <span>Akses Mikrofon</span>
                <input
                  type="checkbox"
                  checked={consentAudio}
                  onChange={(e) => setConsentAudio(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-[13px] text-ink font-medium">
                <span>Akses Sensor Fisik</span>
                <input
                  type="checkbox"
                  checked={consentSensors}
                  onChange={(e) => setConsentSensors(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-[13px] text-ink font-medium">
                <span>Data Riset Anonim</span>
                <input
                  type="checkbox"
                  checked={consentResearch}
                  onChange={(e) => setConsentResearch(e.target.checked)}
                  className="w-4 h-4 accent-ink cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="bg-pure-white border border-dove/30 rounded-cards p-6 shadow-steep space-y-3">
            <h3 className="text-xs font-semibold uppercase text-ink">
              Ekspor Data Pasien (GDPR)
            </h3>
            <p className="text-[12px] text-graphite leading-relaxed">
              Unduh salinan lengkap log profil dan riwayat sensor lokal Anda.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="steep-btn-secondary border border-dove/40 hover:bg-fog w-full rounded-full py-2.5 text-xs font-medium cursor-pointer"
            >
              Ekspor Format Portabel (JSON)
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
