import React, { useState, useEffect } from 'react';
import type { UserProfile, ScreeningSession } from '../types';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { PPGVisualizer } from '../components/PPGVisualizer';
import { CircularGauge } from '../components/CircularGauge';
import { generateResult, MOCK_FACTS } from '../utils/mockData';

interface ScreeningFlowProps {
  profile: UserProfile;
  onCompleteSession: (session: ScreeningSession) => void;
  onCancel: () => void;
}

type Step = 
  | 'start' 
  | 'cough'
  | 'breath'
  | 'speech'
  | 'biomarker' 
  | 'questionnaire' 
  | 'processing' 
  | 'result';

export const ScreeningFlow: React.FC<ScreeningFlowProps> = ({
  profile,
  onCompleteSession,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('start');
  const [session, setSession] = useState<ScreeningSession>({
    id: `ses-${Date.now()}`,
    date: new Date().toISOString(),
    lungAudios: {},
    answers: {}
  });

  // --- STEP 1: START STATE (Environment Check) ---
  const [ambientVolume, setAmbientVolume] = useState<number>(0);
  const [hasMicAccess, setHasMicAccess] = useState<boolean>(false);
  const [isCheckingNoise, setIsCheckingNoise] = useState<boolean>(false);

  useEffect(() => {
    if (currentStep === 'start' && !isCheckingNoise) {
      setIsCheckingNoise(true);
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setHasMicAccess(true);
        })
        .catch(() => {
          setHasMicAccess(false);
        });
    }
  }, [currentStep]);

  const handleAmbientVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
  };

  const isEnvironmentQuiet = ambientVolume < 18;

  // --- STEP 1.1: COUGH RECORDING STATE (Batuk 3-5 Kali) ---
  const [coughRecording, setCoughRecording] = useState<boolean>(false);
  const [coughProgress, setCoughProgress] = useState<number>(0);
  const [coughRecorded, setCoughRecorded] = useState<boolean>(false);
  const [coughCount, setCoughCount] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (coughRecording) {
      setCoughProgress(0);
      setCoughCount(0);
      timer = setInterval(() => {
        setCoughProgress((prev) => {
          if (prev >= 8) {
            clearInterval(timer);
            setCoughRecording(false);
            setCoughRecorded(true);
            setCoughCount(Math.floor(Math.random() * 3) + 3); // Simulates 3-5 coughs detected
            return 8;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [coughRecording]);

  const handleStartCoughRec = () => {
    setCoughRecorded(false);
    setCoughRecording(true);
  };

  // --- STEP 2: BREATH RECORDING STATE (Nafas 30 Detik) ---
  const [breathRecording, setBreathRecording] = useState<boolean>(false);
  const [breathProgress, setBreathProgress] = useState<number>(0);
  const [breathRecorded, setBreathRecorded] = useState<boolean>(false);
  const [breathVisualPhase, setBreathVisualPhase] = useState<'Tarik Napas (Hidung)' | 'Hembuskan (Mulut)'>('Tarik Napas (Hidung)');

  useEffect(() => {
    let timer: any;
    if (breathRecording) {
      setBreathProgress(0);
      timer = setInterval(() => {
        setBreathProgress((prev) => {
          if (prev % 5 === 0) {
            setBreathVisualPhase(p => p === 'Tarik Napas (Hidung)' ? 'Hembuskan (Mulut)' : 'Tarik Napas (Hidung)');
          }
          if (prev >= 30) {
            clearInterval(timer);
            setBreathRecording(false);
            setBreathRecorded(true);
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathRecording]);

  const handleStartBreathRec = () => {
    setBreathRecorded(false);
    setBreathRecording(true);
  };

  // --- STEP 3: SPEECH RECORDING STATE (Bicara Sesuai Bacaan AIRA) ---
  const [speechRecording, setSpeechRecording] = useState<boolean>(false);
  const [speechProgress, setSpeechProgress] = useState<number>(0);
  const [speechRecorded, setSpeechRecorded] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (speechRecording) {
      setSpeechProgress(0);
      timer = setInterval(() => {
        setSpeechProgress((prev) => {
          if (prev >= 18) {
            clearInterval(timer);
            setSpeechRecording(false);
            setSpeechRecorded(true);
            return 18;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [speechRecording]);

  const handleStartSpeechRec = () => {
    setSpeechRecorded(false);
    setSpeechRecording(true);
  };

  // --- STEP 4: BIOMARKERS SENSORS STATE ---
  const [biomarkerSubStep, setBiomarkerSubStep] = useState<'ppg' | 'accelerometer'>('ppg');
  const [ppgResultData, setPpgResultData] = useState<{ hr: number; spo2: number; hrv: number } | null>(null);
  const [accRecording, setAccRecording] = useState<boolean>(false);
  const [accProgress, setAccProgress] = useState<number>(0);
  const [accComplete, setAccComplete] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (accRecording) {
      setAccProgress(0);
      timer = setInterval(() => {
        setAccProgress((prev) => {
          if (prev >= 15) {
            clearInterval(timer);
            setAccRecording(false);
            setAccComplete(true);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [accRecording]);

  const handlePPGComplete = (data: { hr: number; spo2: number; hrv: number }) => {
    setPpgResultData(data);
    setBiomarkerSubStep('accelerometer');
  };

  const handleStartAcc = () => {
    setAccRecording(true);
  };

  const handleBiomarkersComplete = () => {
    setSession(prev => ({
      ...prev,
      ppgData: ppgResultData || undefined,
      sensorData: {
        rr: 16 + Math.round(Math.random() * 3),
        hrv: ppgResultData?.hrv || 42
      }
    }));
    setCurrentStep('questionnaire');
  };

  // --- STEP 5: QUESTIONNAIRE STATE ---
  const [questIndex, setQuestIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    chestPain: 'no',
    palpitation: 'no',
    sobActivity: 'no',
    swollenLegs: 'no',
    cough: 'no',
    coughBlood: 'no',
    wheezing: 'no',
    sobLying: 'no',
    smoking: profile.riwayatSosial.includes('perokok') ? 'Ya' : 'Tidak',
    familyHistory: profile.riwayatKesehatanKeluarga !== 'Tidak Ada' ? 'yes' : 'no',
    hypertension: profile.riwayatPenyakitDahulu.includes('hipertensi') ? 'yes' : 'no',
    diabetes: profile.riwayatPenyakitDahulu.includes('diabetes') ? 'yes' : 'no',
    weight: profile.weight,
    height: profile.height
  });

  const questions = [
    {
      id: 'cardio',
      title: 'Gejala Jantung (Cardiovascular Symptoms)',
      fields: [
        { id: 'chestPain', label: 'Apakah Anda mengalami nyeri dada dalam 30 hari terakhir?', type: 'select', options: [{ v: 'yes', l: 'Ya, Terasa Nyeri/Nyeri Tekan' }, { v: 'no', l: 'Tidak Pernah' }] },
        { id: 'palpitation', label: 'Apakah jantung sering berdebar-debar (palpitasi) tanpa sebab jelas?', type: 'select', options: [{ v: 'yes', l: 'Ya, Sering' }, { v: 'no', l: 'Tidak' }] },
        { id: 'sobActivity', label: 'Apakah Anda merasa sesak napas saat melakukan aktivitas fisik ringan?', type: 'select', options: [{ v: 'yes', l: 'Ya, Mudah Lelah/Sesak' }, { v: 'no', l: 'Tidak' }] },
        { id: 'swollenLegs', label: 'Apakah kaki atau pergelangan kaki Anda sering membengkak?', type: 'select', options: [{ v: 'yes', l: 'Ya, Membengkak' }, { v: 'no', l: 'Tidak' }] }
      ]
    },
    {
      id: 'respiratory',
      title: 'Gejala Paru & Pernapasan (Respiratory Symptoms)',
      fields: [
        { id: 'cough', label: 'Apakah Anda mengalami batuk persisten lebih dari 2 minggu?', type: 'select', options: [{ v: 'yes', l: 'Ya, Batuk Kering/Berdahak' }, { v: 'no', l: 'Tidak' }] },
        { id: 'coughBlood', label: 'Apakah Anda pernah mengalami batuk berdarah?', type: 'select', options: [{ v: 'yes', l: 'Ya, Pernah' }, { v: 'no', l: 'Tidak' }] },
        { id: 'wheezing', label: 'Apakah ada suara mengi (bunyi ngik saat membuang napas)?', type: 'select', options: [{ v: 'yes', l: 'Ya, Mengi' }, { v: 'no', l: 'Tidak' }] },
        { id: 'sobLying', label: 'Apakah Anda merasa sesak napas saat berbaring telentang?', type: 'select', options: [{ v: 'yes', l: 'Ya, Harus Diganjal Bantal' }, { v: 'no', l: 'Tidak' }] }
      ]
    }
  ];

  const handleQuestSelectChange = (id: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleQuestNext = () => {
    if (questIndex < questions.length - 1) {
      setQuestIndex(questIndex + 1);
    } else {
      setSession(prev => ({
        ...prev,
        answers
      }));
      setCurrentStep('processing');
    }
  };

  const handleQuestBack = () => {
    if (questIndex > 0) {
      setQuestIndex(questIndex - 1);
    }
  };

  // --- STEP 6: PROCESSING STATE ---
  const [processingFact, setProcessingFact] = useState<string>(MOCK_FACTS[0]);
  const [processingSubStep, setProcessingSubStep] = useState<number>(0);

  useEffect(() => {
    if (currentStep === 'processing') {
      const factInterval = setInterval(() => {
        setProcessingFact(MOCK_FACTS[Math.floor(Math.random() * MOCK_FACTS.length)]);
      }, 4000);

      const stepTimer0 = setTimeout(() => setProcessingSubStep(1), 1000);
      const stepTimer1 = setTimeout(() => setProcessingSubStep(2), 2500);
      const stepTimer2 = setTimeout(() => setProcessingSubStep(3), 4000);
      const stepTimer3 = setTimeout(() => setProcessingSubStep(4), 5200);
      const stepTimer4 = setTimeout(() => {
        setProcessingSubStep(5);
        
        const generatedRes = generateResult(
          answers,
          'Baik',
          session.ppgData,
          session.sensorData
        );
        
        const finalSessionState: ScreeningSession = {
          ...session,
          result: generatedRes
        };
        
        setSession(finalSessionState);
        setCurrentStep('result');
      }, 6500);

      return () => {
        clearInterval(factInterval);
        clearTimeout(stepTimer0);
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
        clearTimeout(stepTimer4);
      };
    }
  }, [currentStep]);

  // --- STEP 7: RESULTS STATE ---
  const handleSaveResult = () => {
    onCompleteSession(session);
  };

  const handlePrintResult = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10 font-sohne pb-24 text-ink">
      
      {/* Container Card */}
      <div className="bg-pure-white border border-dove/30 rounded-cards p-6 md:p-8 shadow-steep">
        
        {/* STEP 1: START SCREENING (Noise Check) */}
        {currentStep === 'start' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 select-none text-rust"><i className="fa-solid fa-microphone"></i></span>
              <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
                Kalibrasi Kebisingan Ruangan
              </h2>
              <p className="text-[13px] text-graphite max-w-md mx-auto leading-relaxed uppercase font-medium">
                [ Memastikan lingkungan yang tenang sebelum merekam suara biologis ]
              </p>
            </div>

            {/* Quietness visualizer */}
            <div className="space-y-4">
              <div className="h-32 rounded-cards overflow-hidden bg-fog/30">
                <WaveformVisualizer 
                  isRecording={true} 
                  type="ambient" 
                  onVolumeChange={handleAmbientVolumeChange}
                />
              </div>

              {/* Volume gauge indicator */}
              <div className="flex flex-col items-center bg-fog border border-dove/20 rounded-xl p-5 shadow-sm">
                <span className="text-[11px] text-graphite uppercase tracking-wider mb-2 font-medium">
                  Tingkat Kebisingan:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-semibold text-ink">
                    {Math.round(ambientVolume)}
                  </span>
                  <span className="text-[12px] text-graphite">dB SPL</span>
                </div>
                
                {/* Meter bar */}
                <div className="w-full max-w-xs bg-dove/10 h-2 rounded-full overflow-hidden mt-3 border border-dove/10">
                  <div 
                    className={`h-full transition-all duration-150 ${
                      isEnvironmentQuiet ? 'bg-rust' : 'bg-status-critical'
                    }`}
                    style={{ width: `${Math.min(100, ambientVolume * 2)}%` }}
                  />
                </div>

                <div className="flex items-center mt-3 space-x-2 text-[12px] font-medium tracking-wide uppercase">
                  {isEnvironmentQuiet ? (
                    <span className="text-rust flex items-center space-x-1.5"><i className="fa-solid fa-circle-check"></i> <span>Lingkungan Cukup Tenang</span></span>
                  ) : (
                    <span className="text-status-critical flex items-center space-x-1.5"><i className="fa-solid fa-triangle-exclamation"></i> <span>Terdeteksi Kebisingan Tinggi</span></span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-dove/20">
              <button 
                onClick={onCancel}
                className="steep-btn-secondary text-xs cursor-pointer text-graphite hover:text-ink"
              >
                Batalkan
              </button>
              <button
                onClick={() => setCurrentStep('cough')}
                disabled={!isEnvironmentQuiet && hasMicAccess}
                className={`steep-btn-primary text-xs cursor-pointer ${
                  isEnvironmentQuiet || !hasMicAccess
                    ? 'opacity-100'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Lanjutkan Ke Perekaman Batuk →
              </button>
            </div>
          </div>
        )}

        {/* STEP 1.1: COUGH RECORDING (Batuk 3-5 Kali) */}
        {currentStep === 'cough' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 select-none text-rust"><i className="fa-solid fa-head-side-cough"></i></span>
              <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
                Perekaman Batuk Pasien
              </h2>
              <p className="text-[13px] text-ash max-w-sm mx-auto leading-relaxed">
                Silakan batuk keras sebanyak <strong>3 sampai 5 kali</strong> di dekat mikrofon smartphone Anda.
              </p>
            </div>

            {/* Visualizer */}
            <div className="space-y-4">
              <div className="h-40 rounded-cards overflow-hidden bg-fog/20 border border-dove/35">
                <WaveformVisualizer isRecording={coughRecording} type="heart" />
              </div>

              <div className="flex flex-col items-center p-5 bg-fog border border-dove/20 rounded-xl shadow-sm">
                {coughRecording ? (
                  <div className="text-center space-y-2">
                    <span className="text-3xl font-semibold text-rust">
                      {8 - coughProgress} DETIK
                    </span>
                    <p className="text-[12px] font-medium text-rust animate-pulse uppercase tracking-wider">
                      Mendeteksi suara hentakan batuk akustik...
                    </p>
                  </div>
                ) : coughRecorded ? (
                  <div className="text-center space-y-1.5 py-2 uppercase tracking-wide">
                    <span className="text-ink text-sm font-semibold block flex items-center space-x-1.5 justify-center"><i className="fa-solid fa-circle-check text-rust"></i> <span>Data Batuk Tersimpan</span></span>
                    <p className="text-[12px] text-graphite font-normal">
                      Jumlah Batuk Terdeteksi: <strong className="text-ink">{coughCount} Kali</strong>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartCoughRec}
                    className="steep-btn-primary text-xs cursor-pointer animate-pulse"
                  >
                    <i className="fa-solid fa-microphone mr-1.5"></i> Mulai Rekam Batuk (8 Detik)
                  </button>
                )}

                {coughRecording && (
                  <div className="w-full bg-dove/10 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-rust h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(coughProgress / 8) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-dove/20">
              <button 
                onClick={() => setCurrentStep('start')}
                className="steep-btn-secondary text-xs cursor-pointer text-graphite hover:text-ink"
              >
                ← Kembali
              </button>
              
              <button
                onClick={() => setCurrentStep('breath')}
                disabled={!coughRecorded && !coughRecording}
                className={`steep-btn-primary text-xs cursor-pointer ${
                  coughRecorded ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Lanjutkan ke Pernapasan →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BREATH RECORDING (Nafas 30 Detik) */}
        {currentStep === 'breath' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 select-none text-rust"><i className="fa-solid fa-wind"></i></span>
              <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
                Perekaman Suara Pernapasan
              </h2>
              <p className="text-[13px] text-ash max-w-sm mx-auto leading-relaxed">
                Tarik napas dalam-dalam lewat hidung dan hembuskan perlahan lewat mulut secara konsisten selama 30 detik.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-40 rounded-cards overflow-hidden bg-fog/20 border border-dove/35">
                <WaveformVisualizer isRecording={breathRecording} type="lung" />
              </div>

              <div className="flex flex-col items-center p-5 bg-fog border border-dove/20 rounded-xl shadow-sm">
                {breathRecording ? (
                  <div className="text-center space-y-3 w-full">
                    <span className="text-3xl font-semibold text-rust">
                      {30 - breathProgress} DETIK
                    </span>
                    <div className="text-[11px] font-semibold text-rust bg-apricot-wash px-4 py-1 rounded-full border border-rust/10 inline-block uppercase tracking-wider">
                      {breathVisualPhase}
                    </div>
                    <div className="w-24 bg-dove/10 h-1 rounded-full overflow-hidden mx-auto">
                      <div 
                        className="bg-rust h-full transition-all duration-1000 ease-in-out"
                        style={{ width: `${((breathProgress % 5) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : breathRecorded ? (
                  <div className="text-center space-y-1.5 py-2 uppercase tracking-wide">
                    <span className="text-ink text-sm font-semibold block flex items-center space-x-1.5 justify-center"><i className="fa-solid fa-circle-check text-rust"></i> <span>Suara Napas 30 Detik Tersimpan</span></span>
                    <p className="text-[12px] text-graphite font-normal">
                      Kualitas Spektral: <strong className="text-ink">Stabil (92%)</strong>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartBreathRec}
                    className="steep-btn-primary text-xs cursor-pointer"
                  >
                    <i className="fa-solid fa-microphone mr-1.5"></i> Mulai Rekam Napas (30 Detik)
                  </button>
                )}

                {breathRecording && (
                  <div className="w-full bg-dove/10 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-rust h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(breathProgress / 30) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-dove/20">
              <button 
                onClick={() => setCurrentStep('cough')}
                disabled={breathRecording}
                className="steep-btn-secondary text-xs cursor-pointer text-graphite hover:text-ink"
              >
                ← Kembali
              </button>

              <button
                onClick={() => setCurrentStep('speech')}
                disabled={!breathRecorded && !breathRecording}
                className={`steep-btn-primary text-xs cursor-pointer ${
                  breathRecorded ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Lanjutkan ke Membaca Teks →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SPEECH RECORDING (Bicara Sesuai Bacaan AIRA) */}
        {currentStep === 'speech' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 select-none text-rust"><i className="fa-solid fa-comment-medical"></i></span>
              <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
                Biomarker Vokal & Ucapan
              </h2>
              <p className="text-[13px] text-ash max-w-sm mx-auto leading-relaxed">
                Tekan rekam dan bacalah teks paragraf AIRA di bawah ini dengan suara tenang dan lantang.
              </p>
            </div>

            {/* Reading Prompt Box */}
            <div className="bg-sky-wash/20 border border-dove/20 rounded-cards p-5 text-center">
              <span className="block text-[11px] font-bold text-rust uppercase tracking-wider mb-2">
                [ Teks Untuk Dibaca ]
              </span>
              <p className="text-[15px] font-medium leading-relaxed text-ink italic max-w-lg mx-auto">
                "Saya {profile.name}, menggunakan aplikasi AIRA untuk mendeteksi dini biomarker vokal kardiorespirasi. Saya bersuara secara konsisten dan tenang untuk memastikan keakuratan ekstraksi data akustik paru-paru dan detak jantung."
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center p-5 bg-fog border border-dove/20 rounded-xl shadow-sm">
                {speechRecording ? (
                  <div className="text-center space-y-2">
                    <span className="text-3xl font-semibold text-rust">
                      {18 - speechProgress} DETIK
                    </span>
                    <p className="text-[12px] font-medium text-rust animate-pulse uppercase tracking-wider">
                      Mengekstraksi formulan vokal & biomarker akustik...
                    </p>
                  </div>
                ) : speechRecorded ? (
                  <div className="text-center space-y-1.5 py-2 uppercase tracking-wide">
                    <span className="text-ink text-sm font-semibold block flex items-center space-x-1.5 justify-center"><i className="fa-solid fa-circle-check text-rust"></i> <span>Biomarker Vokal Tersimpan</span></span>
                    <p className="text-[12px] text-graphite font-normal">
                      Pencocokan Paragraf: <strong className="text-ink">100% Sesuai</strong>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartSpeechRec}
                    className="steep-btn-primary text-xs cursor-pointer animate-pulse"
                  >
                    <i className="fa-solid fa-microphone mr-1.5"></i> Mulai Rekam Bicara (18 Detik)
                  </button>
                )}

                {speechRecording && (
                  <div className="w-full bg-dove/10 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-rust h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(speechProgress / 18) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-dove/20">
              <button 
                onClick={() => setCurrentStep('breath')}
                disabled={speechRecording}
                className="steep-btn-secondary text-xs cursor-pointer text-graphite hover:text-ink"
              >
                ← Kembali
              </button>
              
              <button
                onClick={() => setCurrentStep('biomarker')}
                disabled={!speechRecorded && !speechRecording}
                className={`steep-btn-primary text-xs cursor-pointer ${
                  speechRecorded ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Lanjutkan ke Biomarker Sensor →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BIOMARKERS SENSORS */}
        {currentStep === 'biomarker' && (
          <div className="space-y-6">
            {biomarkerSubStep === 'ppg' ? (
              <div className="space-y-6">
                <PPGVisualizer isActive={true} onComplete={handlePPGComplete} />
                
                <div className="flex justify-between pt-6 border-t border-dove/20">
                  <button 
                    onClick={() => setCurrentStep('speech')}
                    className="steep-btn-secondary text-xs cursor-pointer text-graphite hover:text-ink"
                  >
                    ← Kembali
                  </button>
                  <button 
                    onClick={() => handlePPGComplete({ hr: 72, spo2: 98, hrv: 44 })}
                    className="steep-btn-secondary text-xs cursor-pointer text-graphite"
                  >
                    [ Lewati / Simulasi ]
                  </button>
                </div>
              </div>
            ) : (
              // Accelerometer sub-step
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-3xl block mb-2 select-none text-rust"><i className="fa-solid fa-mobile-screen-button"></i></span>
                  <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
                    Seismokardiografi
                  </h2>
                  <p className="text-[13px] text-ash max-w-sm mx-auto leading-relaxed">
                    Tempelkan hp secara datar menempel pada dada tengah. Sensor gerak mikro mendeteksi denyut jantung & napas.
                  </p>
                </div>

                <div className="bg-sky-wash/20 border border-dove/20 rounded-cards p-8 text-center flex flex-col items-center justify-center min-h-[200px] shadow-sm">
                  {accRecording ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 border-2 border-rust/20 border-t-rust animate-spin rounded-full mx-auto"></div>
                      <span className="text-2xl font-semibold text-ink block">
                        {15 - accProgress} DETIK
                      </span>
                      <p className="text-[12px] font-medium text-rust animate-pulse uppercase">
                        [ PENGUKURAN SENSOR SEISMIS... HARAP DIAM ]
                      </p>
                    </div>
                  ) : accComplete ? (
                    <div className="space-y-2 py-4 tracking-wide">
                      <span className="text-ink text-sm font-semibold block flex items-center justify-center space-x-1.5"><i className="fa-solid fa-circle-check"></i> <span>Data Akselerasi Disimpan</span></span>
                      <p className="text-[12px] text-ash">
                        HRV & laju pernapasan terhitung optimal.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartAcc}
                      className="steep-btn-primary text-xs cursor-pointer animate-pulse"
                    >
                      Mulai Pengukuran Sensor (15s)
                    </button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-dove/20">
                  <button
                    onClick={() => setBiomarkerSubStep('ppg')}
                    disabled={accRecording}
                    className="steep-btn-secondary text-xs cursor-pointer text-graphite hover:text-ink"
                  >
                    ← Kembali ke PPG
                  </button>

                  <button
                    onClick={handleBiomarkersComplete}
                    disabled={!accComplete && !accRecording}
                    className={`steep-btn-primary text-xs cursor-pointer ${
                      accComplete ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    Lanjutkan ke Kuesioner →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: QUESTIONNAIRE */}
        {currentStep === 'questionnaire' && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-3xl block mb-2 select-none text-rust"><i className="fa-solid fa-clipboard-list"></i></span>
              <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight mb-2">
                Gejala Klinis Subjektif
              </h2>
              <p className="text-[13px] text-graphite max-w-sm mx-auto leading-relaxed uppercase font-semibold">
                [ Validasi parameter gejala pengguna ]
              </p>
            </div>

            {/* Questions panel */}
            <div className="space-y-6 bg-sky-wash/20 border border-dove/25 rounded-cards p-6">
              <h3 className="text-xs font-semibold uppercase text-rust tracking-wider border-b border-dove/10 pb-2">
                {questions[questIndex].title}
              </h3>
              
              <div className="space-y-4">
                {questions[questIndex].fields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-ink leading-normal">
                      {field.label}
                    </label>
                    <select
                      value={answers[field.id] || ''}
                      onChange={(e) => handleQuestSelectChange(field.id, e.target.value)}
                      className="w-full bg-pure-white border border-dove/40 rounded-inputs px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-graphite"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.v} value={opt.v}>
                          {opt.l}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-dove/20">
              <button
                onClick={handleQuestBack}
                disabled={questIndex === 0}
                className={`text-xs font-semibold cursor-pointer ${
                  questIndex === 0 ? 'text-dove/40 cursor-not-allowed' : 'text-graphite hover:text-ink'
                }`}
              >
                ← KEMBALI
              </button>

              <button
                onClick={handleQuestNext}
                className="steep-btn-primary text-xs cursor-pointer"
              >
                {questIndex === questions.length - 1 ? 'Kirim & Analisis AI' : 'Selanjutnya →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: PROCESSING SCREEN */}
        {currentStep === 'processing' && (
          <div className="space-y-8 py-10 flex flex-col items-center">
            
            {/* Spinning neural circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dove/20 border-t-rust rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-2 border-rust/10 border-b-rust rounded-full animate-spin [animation-direction:reverse]"></div>
              <span className="text-3xl select-none text-rust"><i className="fa-solid fa-robot"></i></span>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-signifier text-[28px] font-normal text-ink tracking-tight leading-none">
                AIRA Core Neural Computation...
              </h2>
              
              <div className="text-[12px] space-y-2.5 max-w-xs mx-auto text-left font-medium mt-6 border border-dove/20 p-5 rounded-xl bg-fog">
                <div className="flex justify-between items-center">
                  <span className="text-ash">1. Akustik Batuk Pasien</span>
                  <span className={processingSubStep >= 1 ? "text-rust font-semibold" : "text-graphite animate-pulse"}>
                    {processingSubStep >= 1 ? 'OK' : 'Running'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ash">2. Spektral Pernapasan 30s</span>
                  <span className={processingSubStep >= 2 ? "text-rust font-semibold" : "text-graphite animate-pulse"}>
                    {processingSubStep >= 2 ? 'OK' : 'Running'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ash">3. Ekstraksi Vokal & Ucapan</span>
                  <span className={processingSubStep >= 3 ? "text-rust font-semibold" : "text-graphite animate-pulse"}>
                    {processingSubStep >= 3 ? 'OK' : 'Running'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ash">4. Fusi Digital Twin & AI</span>
                  <span className={processingSubStep >= 4 ? "text-rust font-semibold" : "text-graphite animate-pulse"}>
                    {processingSubStep >= 4 ? 'OK' : 'Running'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fact Box */}
            <div className="w-full max-w-md bg-apricot-wash text-rust border border-rust/10 p-5 text-center mt-6 rounded-cards">
              <span className="block text-[11px] font-bold uppercase tracking-wider mb-2">
                Info Medis:
              </span>
              <p className="text-[13px] text-rust leading-relaxed italic">
                "{processingFact}"
              </p>
            </div>
          </div>
        )}

        {/* STEP 7: RESULTS DISPLAY */}
        {currentStep === 'result' && session.result && (
          <div className="space-y-8">
            
            {/* Header / gauge summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-dove/20 pb-6">
              <CircularGauge score={session.result.score} size={180} />
              
              <div className="space-y-3">
                <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full border border-rust/20 bg-apricot-wash text-rust inline-block uppercase">
                  Analysis Compiled OK
                </span>
                <h2 className="font-signifier text-[32px] font-normal text-ink tracking-tight leading-none">
                  Laporan Hasil Skrining AIRA
                </h2>
                <p className="text-[13px] text-ash leading-relaxed">
                  Berdasarkan kalkulasi algoritma AIRA, nilai indeks fusi biomarker Anda adalah sebesar <strong>{session.result.score}/100</strong>. Harap tinjau indikasi medis di bawah.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button 
                    onClick={handlePrintResult}
                    className="steep-btn-secondary text-xs border border-dove/40 hover:bg-fog rounded-full px-4 py-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-file-pdf mr-1.5"></i> Cetak PDF
                  </button>
                  <button 
                    onClick={() => alert('Fitur berbagi laporan medis!')}
                    className="steep-btn-secondary text-xs border border-dove/40 hover:bg-fog rounded-full px-4 py-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-share-nodes mr-1.5"></i> Bagikan Dokter
                  </button>
                </div>
              </div>
            </div>

            {/* Organ card lists */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-semibold tracking-wider text-graphite uppercase">
                Deteksi Kondisi Per Organ
              </h3>

              {/* Heart Card */}
              <div className="bg-apricot-wash/30 border border-rust/10 p-5 rounded-cards space-y-3">
                <div className="flex justify-between items-center border-b border-rust/10 pb-2.5">
                  <span className="font-bold text-xs uppercase tracking-wider text-rust flex items-center">
                    <i className="fa-solid fa-heart mr-1.5"></i> Auskultasi Jantung
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    session.result.heartStatus === 'danger'
                      ? 'text-rust'
                      : 'text-ink'
                  }`}>
                    {session.result.heartStatus === 'normal' ? 'NORMAL' : 'WASPADA'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[13px] text-ash">
                  {session.result.heartFindings.map((f, i) => (
                    <p key={i} className="flex items-start leading-relaxed">
                      <span className="mr-2 font-semibold">•</span> {f}
                    </p>
                  ))}
                  <p className="text-[11px] text-graphite mt-2 font-medium">
                    AI Confidence Index: {session.result.heartConfidence}%
                  </p>
                </div>
              </div>

              {/* Lung Card */}
              <div className="bg-sky-wash/30 border border-dove/20 p-5 rounded-cards space-y-3">
                <div className="flex justify-between items-center border-b border-dove/20 pb-2.5">
                  <span className="font-bold text-xs uppercase tracking-wider text-ink flex items-center">
                    <i className="fa-solid fa-lungs mr-1.5"></i> Respirasi Paru-Paru
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    session.result.lungStatus === 'danger'
                      ? 'text-rust'
                      : 'text-ink'
                  }`}>
                    {session.result.lungStatus === 'normal' ? 'NORMAL' : 'WASPADA'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[13px] text-ash">
                  {session.result.lungFindings.map((f, i) => (
                    <p key={i} className="flex items-start leading-relaxed">
                      <span className="mr-2 font-semibold">•</span> {f}
                    </p>
                  ))}
                  <p className="text-[11px] text-graphite mt-2 font-medium">
                    AI Confidence Index: {session.result.lungConfidence}%
                  </p>
                </div>
              </div>
            </div>

            {/* Biomarker Table */}
            <div className="bg-pure-white border border-dove/30 rounded-cards p-5 shadow-sm">
              <h3 className="text-[11px] font-semibold tracking-wider text-graphite uppercase mb-4">
                Metrik Biomarker Terukur
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-ink">
                  <thead>
                    <tr className="border-b border-dove/20 text-graphite uppercase tracking-wider text-[10px] font-semibold">
                      <th className="py-2.5">Parameter</th>
                      <th className="py-2.5">Nilai Sensor</th>
                      <th className="py-2.5">Rentang Normal</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dove/10 text-[13px]">
                    <tr>
                      <td className="py-3">Heart Rate (Denyut Nadi)</td>
                      <td className="py-3 font-semibold">{session.result.biomarkers.hr} BPM</td>
                      <td className="py-3 text-graphite">60 - 100 BPM</td>
                      <td className="py-3 text-right text-rust font-semibold">OK</td>
                    </tr>
                    <tr>
                      <td className="py-3">Estimasi SpO2 (Saturasi)</td>
                      <td className="py-3 font-semibold">{session.result.biomarkers.spo2}%</td>
                      <td className="py-3 text-graphite">≥ 95%</td>
                      <td className="py-3 text-right text-rust font-semibold">OK</td>
                    </tr>
                    <tr>
                      <td className="py-3">Laju Napas (Respiration Rate)</td>
                      <td className="py-3 font-semibold">{session.result.biomarkers.rr} / min</td>
                      <td className="py-3 text-graphite">12 - 20 / min</td>
                      <td className="py-3 text-right text-rust font-semibold">OK</td>
                    </tr>
                    <tr>
                      <td className="py-3">HRV (Variabilitas RMSSD)</td>
                      <td className="py-3 font-semibold">{session.result.biomarkers.hrv} MS</td>
                      <td className="py-3 text-graphite">&gt; 25 MS</td>
                      <td className={`py-3 text-right font-semibold ${session.result.biomarkers.hrv < 25 ? 'text-rust' : 'text-rust'}`}>
                        {session.result.biomarkers.hrv < 25 ? 'Rendah' : 'OK'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conditions list */}
            <div className="bg-fog border border-dove/20 rounded-cards p-5 space-y-3">
              <h3 className="text-[11px] font-semibold tracking-wider text-graphite uppercase">
                Stratifikasi Relevansi Kondisi Klien
              </h3>
              
              <div className="space-y-2">
                {session.result.conditions.map((c, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-3 bg-pure-white border border-dove/20 rounded-xl font-medium uppercase shadow-sm">
                    <span className="font-semibold text-ink">{c.name}</span>
                    <span className={`px-3 py-1 rounded-full border font-semibold text-[10px] ${
                      c.risk === 'High'
                        ? 'bg-rust text-pure-white border-rust/10'
                        : c.risk === 'Medium'
                        ? 'bg-sky-wash text-ink border-dove/20'
                        : 'bg-apricot-wash text-rust border-rust/10'
                    }`}>
                      Risiko {c.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-6 border-t border-dove/20">
              <button
                onClick={handleSaveResult}
                className="steep-btn-primary text-xs cursor-pointer shadow-sm"
              >
                Simpan & Kembali ke Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
