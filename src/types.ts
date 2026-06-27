export interface UserProfile {
  name: string;
  nik: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  alamat: string;
  pekerjaan: string;
  agama: string;
  height: number;
  weight: number;
  keluhan: string;
  riwayatPenyakitDahulu: string;
  riwayatKesehatanKeluarga: string;
  riwayatSosial: string;
  polaMakan: string;
  aktivitasFisik: string;
  alergi: string;
  pengobatanStatus: 'Belum' | 'Sudah';
  pengobatanKondisi: 'Membaik' | 'Tidak Membaik' | '-';
  consent: {
    audio: boolean;
    sensors: boolean;
    research: boolean;
  };
}

export interface ScreeningResult {
  id: string;
  date: string;
  score: number;
  heartStatus: 'normal' | 'warning' | 'danger';
  heartFindings: string[];
  heartConfidence: number;
  lungStatus: 'normal' | 'warning' | 'danger';
  lungFindings: string[];
  lungConfidence: number;
  biomarkers: {
    hr: number;
    spo2: number;
    hrv: number;
    rr: number;
  };
  conditions: {
    name: string;
    risk: 'Low' | 'Medium' | 'High';
  }[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    lifestyle: string[];
  };
}

export interface ScreeningSession {
  id: string;
  date: string;
  heartAudioUrl?: string;
  heartQuality?: 'Baik' | 'Cukup' | 'Kurang';
  lungAudios: {
    [key: string]: string; // URL to recorded audio or dummy
  };
  ppgData?: {
    hr: number;
    spo2: number;
    hrv: number;
  };
  sensorData?: {
    rr: number;
    hrv: number;
  };
  answers: {
    [key: string]: string | boolean | number;
  };
  result?: ScreeningResult;
}
