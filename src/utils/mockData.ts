import type { UserProfile, ScreeningResult } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Esti',
  nik: '3273012345670001',
  age: 32,
  gender: 'Perempuan',
  alamat: 'Jl. Dago Asri No. 45, Bandung',
  pekerjaan: 'PNS',
  agama: 'Islam',
  height: 160,
  weight: 55,
  keluhan: 'Batuk berdahak ringan',
  riwayatPenyakitDahulu: 'Tidak Ada',
  riwayatKesehatanKeluarga: 'Hipertensi (Ibu)',
  riwayatSosial: 'Bukan perokok, tidak konsumsi alkohol',
  polaMakan: '3 kali sehari',
  aktivitasFisik: '30 menit',
  alergi: 'Tidak Ada',
  pengobatanStatus: 'Belum',
  pengobatanKondisi: '-',
  consent: {
    audio: true,
    sensors: true,
    research: true
  }
};

export const MOCK_HISTORY: ScreeningResult[] = [
  {
    id: 'scr-001',
    date: '2026-05-28T09:15:00Z',
    score: 82,
    heartStatus: 'normal',
    heartFindings: ['Detak jantung teratur (S1, S2 normal)', 'Variabilitas irama stabil'],
    heartConfidence: 94,
    lungStatus: 'warning',
    lungFindings: ['Terdeteksi suara vesikuler abnormal', 'Kecurigaan mengi (mild wheezing) di lobus kanan atas'],
    lungConfidence: 86,
    biomarkers: {
      hr: 74,
      spo2: 96,
      hrv: 38,
      rr: 18
    },
    conditions: [
      { name: 'Kecenderungan Bronkospasme Ringan', risk: 'Medium' },
      { name: 'Aritmia', risk: 'Low' },
      { name: 'PPOK (Penyakit Paru Obstruktif Kronis)', risk: 'Low' }
    ],
    recommendations: {
      immediate: ['Hindari pemicu alergi dan asap rokok'],
      shortTerm: ['Lakukan tes spirometri di klinik jika batuk berlanjut', 'Pantau laju pernapasan saat istirahat'],
      lifestyle: ['Latihan pernapasan dalam (diaphragmatic breathing) 5 menit sehari', 'Kurangi asupan garam untuk menjaga tekanan darah']
    }
  },
  {
    id: 'scr-002',
    date: '2026-06-12T14:30:00Z',
    score: 88,
    heartStatus: 'normal',
    heartFindings: ['Ritme sinus normal', 'Kualitas sinyal akustik jantung sangat baik'],
    heartConfidence: 96,
    lungStatus: 'normal',
    lungFindings: ['Suara napas vesikuler bersih di seluruh lapang paru'],
    lungConfidence: 92,
    biomarkers: {
      hr: 68,
      spo2: 98,
      hrv: 46,
      rr: 15
    },
    conditions: [
      { name: 'Kardiorespiratoris Normal', risk: 'Low' }
    ],
    recommendations: {
      immediate: [],
      shortTerm: ['Jadwalkan skrining rutin berikutnya dalam 30 hari'],
      lifestyle: ['Pertahankan aktivitas kardio intensitas sedang 150 menit/minggu', 'Jaga hidrasi tubuh minimal 2 liter air per hari']
    }
  }
];

export const MOCK_FACTS = [
  'Jantung manusia berdetak sekitar 100.000 kali dalam sehari untuk memompa darah ke seluruh tubuh.',
  'Suara detak jantung "lub-dub" berasal dari penutupan katup jantung saat memompa darah.',
  'Kapasitas total paru-paru orang dewasa sekitar 6 liter, namun kita biasanya hanya menghirup 0.5 liter saat istirahat.',
  'Heart Rate Variability (HRV) yang lebih tinggi menunjukkan sistem saraf otonom yang lebih adaptif dan sehat.',
  'Paru-paru sebelah kanan sedikit lebih besar daripada sebelah kiri untuk memberi ruang bagi organ jantung.',
  'Bernapas melalui hidung menghasilkan oksida nitrat yang membantu melebarkan pembuluh darah dan meningkatkan penyerapan oksigen.'
];

export const MOCK_ARTICLES = [
  {
    id: 'art-1',
    title: 'Mengenal Murmur Jantung: Kapan Harus Waspada?',
    category: 'Jantung',
    readTime: '4 menit',
    summary: 'Suara tiupan atau desiran ekstra saat auskultasi jantung bisa menjadi tanda adanya murmur. Pahami perbedaan murmur fisiologis dan patologis.',
    content: `Auskultasi menggunakan stetoskop atau mikrofon pintar sering kali mendeteksi suara desiran ekstra di luar suara "lub-dub" normal. Suara inilah yang disebut murmur jantung.

### Apa Itu Murmur Jantung?
Murmur jantung terjadi karena adanya turbulensi aliran darah yang melewati katup-katup jantung. Aliran turbulen ini bisa disebabkan oleh katup yang menyempit (stenosis) atau katup yang tidak menutup dengan rapat sehingga darah bocor kembali (regurgitasi).

### Dua Jenis Utama Murmur:
1. **Murmur Fisiologis (Inosen):** Umum ditemukan pada anak-anak atau ibu hamil. Terjadi karena darah mengalir lebih cepat dari biasanya (misal saat demam atau olahraga), namun struktur jantungnya sendiri 100% normal. Biasanya tidak berbahaya.
2. **Murmur Patologis:** Terjadi akibat kelainan struktural katup jantung kongenital atau penyakit jantung didapat (seperti penyakit jantung rematik). Murmur jenis ini membutuhkan evaluasi kardiologis lebih lanjut menggunakan Echocardiography (USG Jantung).

### Kapan Harus Menghubungi Dokter?
Jika deteksi murmur disertai dengan gejala seperti nyeri dada, sesak napas saat beraktivitas ringan, pusing atau pingsan, dan pembengkakan pada kaki, Anda disarankan segera menjadwalkan pemeriksaan EKG dan konsultasi dokter spesialis jantung.`
  },
  {
    id: 'art-2',
    title: '5 Latihan Pernapasan untuk Meningkatkan Kapasitas Paru',
    category: 'Paru',
    readTime: '5 menit',
    summary: 'Latihan pernapasan sederhana yang terbukti secara klinis dapat memperkuat otot diafragma dan meningkatkan efisiensi pertukaran oksigen.',
    content: `Menjaga kesehatan paru-paru tidak hanya tentang menghindari asap rokok. Latihan pernapasan terarah adalah salah satu cara terbaik untuk meningkatkan kapasitas paru dan mengurangi tingkat kecemasan.

Berikut adalah 5 latihan yang bisa Anda lakukan di rumah selama 5–10 menit sehari:

### 1. Diaphragmatic Breathing (Pernapasan Diafragma)
Letakkan satu tangan di dada dan tangan lainnya di perut. Tarik napas perlahan melalui hidung, pastikan perut Anda mengembang sementara dada tetap diam. Hembuskan napas perlahan melalui mulut yang sedikit terbuka. Ini memperkuat otot pernapasan utama Anda.

### 2. Pursed-Lip Breathing
Tarik napas melalui hidung selama 2 detik, lalu hembuskan napas secara perlahan melalui bibir yang mengerucut (seperti hendak bersiul) selama 4 detik. Latihan ini membantu menjaga saluran napas tetap terbuka lebih lama sehingga udara yang terperangkap di paru-paru dapat keluar.

### 3. Box Breathing (Pernapasan Kotak)
Gunakan rasio 4-4-4-4:
- Tarik napas dalam 4 detik
- Tahan napas selama 4 detik
- Hembuskan napas dalam 4 detik
- Tahan napas kosong selama 4 detik
Ini sangat efektif untuk menenangkan sistem saraf simpatik (respons fight-or-flight).

### 4. Alternating Nostril Breathing (Nadi Shodhana)
Tutup lubang hidung kanan dengan ibu jari, tarik napas melalui lubang hidung kiri. Tutup lubang kiri dengan jari manis, buka lubang kanan dan hembuskan napas. Tarik napas kembali lewat kanan, tutup, lalu hembuskan lewat kiri. Membantu keseimbangan sirkulasi oksigen.

### 5. Deep Breathing
Berdiri tegak, rentangkan tangan ke samping saat menarik napas dalam-dalam lewat hidung. Turunkan tangan saat mengembuskan napas secara perlahan. Lakukan 5-10 kali untuk membuka rongga dada secara maksimal.`
  },
  {
    id: 'art-3',
    title: 'Memahami HRV: Metrik Utama Kebugaran Sistem Saraf Anda',
    category: 'Gaya Hidup',
    readTime: '3 menit',
    summary: 'Heart Rate Variability (HRV) bukan sekadar denyut nadi. Ini adalah jendela untuk mengintip tingkat stres, pemulihan tubuh, dan kesiapan kardio.',
    content: `Jika denyut nadi Anda adalah 60 kali per menit, itu tidak berarti jantung Anda berdetak tepat sekali setiap detik. Jeda waktu antar detak bervariasi dalam milidetik (misalnya, 0.85 detik, 1.15 detik, 0.95 detik). Variabilitas inilah yang disebut Heart Rate Variability (HRV).

### Mengapa HRV Sangat Penting?
HRV dikendalikan secara langsung oleh Sistem Saraf Otonom (SSO) yang terbagi dua:
- **Sistem Saraf Simpatik:** Mempercepat detak jantung (respons stres / *fight-or-flight*).
- **Sistem Saraf Parasimpatik:** Memperlambat detak jantung (respons istirahat / *rest-and-digest*).

Variabilitas yang tinggi berarti jantung Anda sangat responsif terhadap pergantian kedua sinyal ini, menandakan tubuh Anda bugar, rileks, dan memiliki kemampuan pemulihan yang baik. Sebaliknya, HRV yang rendah menandakan tubuh Anda sedang dalam kondisi stres kronis, kelelahan, atau kurang tidur.

### Cara Meningkatkan HRV Secara Alami:
- **Tidur Cukup:** Konsistensi jam tidur sangat memengaruhi pemulihan SSO.
- **Latihan Aerobik Rutin:** Meningkatkan tonus parasimpatik (vagal tone).
- **Latihan Pernapasan Lambat:** Bernapas dengan laju ~6 napas per menit menyinkronkan ritme jantung dengan napas (resonansi ritme).
- **Manajemen Stres:** Meditasi dan meditasi mindfulness terbukti menaikkan baseline HRV.`
  }
];

export function generateResult(answers: Record<string, any>, _heartQuality: string, ppgData?: any, sensorData?: any): ScreeningResult {
  // Simple heuristic risk engine to simulate clinical AI assessment
  let heartScore = 90;
  let lungScore = 90;
  
  const heartFindings: string[] = [];
  const lungFindings: string[] = [];
  
  // Parse questionnaire answers
  const chestPain = answers.chestPain === 'yes';
  const palpitation = answers.palpitation === 'yes';
  const sobActivity = answers.sobActivity === 'yes';
  const swollenLegs = answers.swollenLegs === 'yes';
  
  const cough = answers.cough === 'yes';
  const coughBlood = answers.coughBlood === 'yes';
  const wheezing = answers.wheezing === 'yes';
  const sobLying = answers.sobLying === 'yes';
  
  const smoking = answers.smoking || 'Tidak';
  const familyHistory = answers.familyHistory === 'yes';
  const hypertension = answers.hypertension === 'yes';

  
  // Evaluate Heart Status
  let heartRiskPoints = 0;
  if (chestPain) heartRiskPoints += 3;
  if (palpitation) heartRiskPoints += 2;
  if (sobActivity) heartRiskPoints += 2;
  if (swollenLegs) heartRiskPoints += 2;
  if (hypertension) heartRiskPoints += 1;
  if (familyHistory) heartRiskPoints += 1;
  
  let heartStatus: 'normal' | 'warning' | 'danger' = 'normal';
  if (heartRiskPoints >= 5) {
    heartStatus = 'danger';
    heartScore -= 35;
    heartFindings.push('Terdeteksi irama jantung tidak teratur (potensi fibrilasi atrium/PVC)');
    heartFindings.push('Indikasi beban kerja jantung berlebih dengan murmur sistolik ringan');
  } else if (heartRiskPoints >= 2) {
    heartStatus = 'warning';
    heartScore -= 15;
    heartFindings.push('Fluktuasi ritme ringan terdeteksi selama latihan');
    heartFindings.push('Pola kontraktilitas katup dalam batas toleransi normal');
  } else {
    heartStatus = 'normal';
    heartFindings.push('Ritme sinus normal, suara S1 dan S2 bersih');
    heartFindings.push('Tidak terdeteksi adanya murmur akustik patologis');
  }
  
  // Evaluate Lung Status
  let lungRiskPoints = 0;
  if (cough) lungRiskPoints += 2;
  if (coughBlood) lungRiskPoints += 5;
  if (wheezing) lungRiskPoints += 3;
  if (sobLying) lungRiskPoints += 2;
  if (smoking === 'Ya') lungRiskPoints += 2;
  
  let lungStatus: 'normal' | 'warning' | 'danger' = 'normal';
  if (lungRiskPoints >= 5) {
    lungStatus = 'danger';
    lungScore -= 40;
    lungFindings.push('Terdeteksi suara napas tambahan (crackles kasar) di lobus basal kanan');
    lungFindings.push('Kecurigaan penyempitan jalan napas obstruktif (wheezing persisten)');
  } else if (lungRiskPoints >= 2) {
    lungStatus = 'warning';
    lungScore -= 20;
    lungFindings.push('Suara napas sedikit melemah di area basal posterior');
    lungFindings.push('Terdeteksi tanda kongesti respiratorik ringan');
  } else {
    lungStatus = 'normal';
    lungFindings.push('Suara napas vesikuler normal di seluruh zona paru-paru');
    lungFindings.push('Fase inhalasi dan ekshalasi simetris tanpa hambatan');
  }
  
  // Adjust based on biomarkers
  const hr = ppgData?.hr || 72;
  const spo2 = ppgData?.spo2 || 98;
  const hrv = ppgData?.hrv || sensorData?.hrv || 42;
  const rr = sensorData?.rr || 16;
  
  if (spo2 < 95) {
    lungScore -= 15;
    lungFindings.push(`Desaturasi oksigen ringan terdeteksi (${spo2}%)`);
  }
  if (hr > 100 || hr < 50) {
    heartScore -= 10;
    heartFindings.push(`Frekuensi denyut nadi abnormal (${hr} bpm)`);
  }
  
  // Compute overall health score
  const overallScore = Math.max(12, Math.round((heartScore + lungScore) / 2));
  
  // Calculate potential conditions
  const conditionsList: { name: string; risk: 'Low' | 'Medium' | 'High' }[] = [];
  
  if (heartStatus === 'danger') {
    conditionsList.push({ name: 'Aritmia Kardiovaskular', risk: 'High' });
    conditionsList.push({ name: 'Insufisiensi Katup', risk: 'Medium' });
  } else if (heartStatus === 'warning') {
    conditionsList.push({ name: 'Aritmia / Ekstrasistol', risk: 'Medium' });
  } else {
    conditionsList.push({ name: 'Aritmia Kardiovaskular', risk: 'Low' });
  }
  
  if (lungStatus === 'danger') {
    if (wheezing) {
      conditionsList.push({ name: 'Asma Obstruktif Akut', risk: 'High' });
      conditionsList.push({ name: 'PPOK Eksaserbasi', risk: 'Medium' });
    } else {
      conditionsList.push({ name: 'Infeksi Saluran Napas / Pneumonia', risk: 'High' });
    }
  } else if (lungStatus === 'warning') {
    conditionsList.push({ name: 'Bronkospasme / Asma Ringan', risk: 'Medium' });
    conditionsList.push({ name: 'PPOK (Tahap Awal)', risk: 'Low' });
  } else {
    conditionsList.push({ name: 'PPOK & Asma', risk: 'Low' });
  }
  
  // Recommendations build
  const immediateRecs: string[] = [];
  const shortTermRecs: string[] = [];
  const lifestyleRecs: string[] = [];
  
  if (overallScore < 60) {
    immediateRecs.push('Segera lakukan pemeriksaan fisik komprehensif ke dokter spesialis');
    immediateRecs.push('Jika Anda sesak napas hebat atau nyeri dada menjalar, hubungi UGD (119)');
    shortTermRecs.push('Lakukan perekaman EKG 12-lead standard');
    shortTermRecs.push('Dapatkan rujukan rontgen dada (Thorax)');
  } else if (overallScore < 80) {
    shortTermRecs.push('Jadwalkan konsultasi dokter keluarga dalam 7-14 hari kedepan');
    shortTermRecs.push('Catat riwayat tekanan darah dan frekuensi napas harian');
    lifestyleRecs.push('Hindari olahraga terlalu berat sebelum mendapat izin dokter');
  } else {
    shortTermRecs.push('Lakukan skrining ulang mandiri dalam 30 hari');
    lifestyleRecs.push('Lanjutkan latihan kardio 30 menit sehari (seperti jalan cepat)');
  }
  
  // Add personalized recommendations based on profile
  if (smoking === 'Ya') {
    lifestyleRecs.push('Ikuti program konseling berhenti merokok untuk memulihkan elastisitas paru');
  }
  if (answers.weight > 90 || (answers.height && (answers.weight / Math.pow(answers.height / 100, 2)) > 27)) {
    lifestyleRecs.push('Lakukan konsultasi gizi untuk menurunkan berat badan ke rentang ideal');
  }
  lifestyleRecs.push('Lakukan teknik pernapasan perut (diaphragmatic breathing) 5-10 menit sebelum tidur');
  
  return {
    id: `scr-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    score: overallScore,
    heartStatus,
    heartFindings,
    heartConfidence: Math.floor(82 + Math.random() * 15),
    lungStatus,
    lungFindings,
    lungConfidence: Math.floor(80 + Math.random() * 18),
    biomarkers: {
      hr,
      spo2,
      hrv,
      rr
    },
    conditions: conditionsList,
    recommendations: {
      immediate: immediateRecs,
      shortTerm: shortTermRecs,
      lifestyle: lifestyleRecs
    }
  };
}
