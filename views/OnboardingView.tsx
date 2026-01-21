
import React, { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

const OnboardingView: React.FC<Props> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0); // 0 is Pre-Auth / Breach
  const [loadingProgress, setLoadingProgress] = useState(0);
  const totalSteps = 3;

  useEffect(() => {
    if (step === 0) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(1), 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Hidden handler for admin bypass (Shift + Click on the admin link)
  const handleAdminBypass = () => {
    window.location.hash = 'admin';
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
        <div className="z-10 text-center space-y-8 max-w-lg w-full">
          <div className="flex justify-center mb-12">
            <div className="w-24 h-24 border-4 border-primary/20 flex items-center justify-center relative animate-pulse">
               <div className="absolute inset-0 border-2 border-primary animate-ping opacity-20"></div>
               <span className="material-symbols-outlined text-primary text-5xl">lock_open</span>
            </div>
          </div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-[0.5em] mb-4 italic">Bypassing_Firewall</h2>
          <div className="w-full h-1 bg-white/5 relative overflow-hidden border border-white/10">
            <div 
              className="h-full bg-primary shadow-[0_0_15px_#A3FF00] transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between font-mono text-[9px] text-gray-500 uppercase">
             <span className="animate-pulse">Injecting_Neural_Bridge...</span>
             <span>{Math.round(loadingProgress)}%</span>
          </div>
          <div className="mt-12 space-y-2 font-mono text-[10px] text-left text-primary/40 h-24 overflow-hidden opacity-50">
             <p>> Initializing local socket tunnel...</p>
             <p>> Port 8291: HANDSHAKE_SUCCESS</p>
             <p>> Neural identity trace detected.</p>
             <p>> Bypassing standard authorization protocols...</p>
             <p>> ACCESS_GRANTED_LEVEL_ALPHA</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-dark p-4 md:p-10">
      {/* Immersive HUD Overlays */}
      <div className="fixed inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-10 pointer-events-none"></div>
      <div className="fixed inset-0 border-[20px] md:border-[40px] border-surface-dark pointer-events-none z-50 mix-blend-overlay"></div>
      
      {/* Corner Brackets */}
      <div className="fixed top-10 left-10 w-20 h-20 border-l-4 border-t-4 border-primary/40 pointer-events-none z-[60]"></div>
      <div className="fixed top-10 right-10 w-20 h-20 border-r-4 border-t-4 border-primary/40 pointer-events-none z-[60]"></div>
      <div className="fixed bottom-10 left-10 w-20 h-20 border-l-4 border-b-4 border-primary/40 pointer-events-none z-[60]"></div>
      <div className="fixed bottom-10 right-10 w-20 h-20 border-r-4 border-b-4 border-primary/40 pointer-events-none z-[60]"></div>

      <div className="w-full max-w-7xl bg-surface-dark/40 backdrop-blur-3xl border border-white/5 flex flex-col lg:flex-row relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Left Side: Intimidation & Diagnostics */}
        <div className="w-full lg:w-[450px] bg-black/60 p-10 md:p-16 flex flex-col border-r border-white/10">
           <div className="mb-20">
              <div className="flex items-center space-x-4 mb-4">
                 <div className="w-12 h-12 border-2 border-secondary flex items-center justify-center -skew-x-12 shadow-[0_0_20px_rgba(213,0,249,0.4)]">
                    <span className="font-display font-black text-2xl text-secondary italic">A</span>
                 </div>
                 <h1 className="font-display text-4xl font-black text-white tracking-tighter uppercase leading-none italic">
                    ARENA <br/> <span className="text-secondary">UPLOADER</span>
                 </h1>
              </div>
              <p className="font-mono text-[9px] text-secondary/60 uppercase font-black tracking-[0.5em]">SYSTEM_VERSION_v4.2.0_STABLE</p>
           </div>

           <div className="space-y-12 flex-1">
              <div className="space-y-4">
                 <h4 className="font-display text-xs text-white font-black uppercase tracking-widest border-b border-white/5 pb-2">THREAT_ASSESSMENT</h4>
                 <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-gray-500">POTENTIAL_SYNC_ERROR</span>
                    <span className="text-primary font-black">0.02%</span>
                 </div>
                 <div className="h-1 bg-white/5 w-full">
                    <div className="h-full bg-primary w-full opacity-40"></div>
                 </div>
                 <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-gray-500">NEURAL_DEGRADATION</span>
                    <span className="text-secondary font-black">NONE</span>
                 </div>
              </div>

              <div className="p-6 bg-secondary/5 border border-secondary/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xs text-secondary animate-pulse">radar</span>
                 </div>
                 <p className="font-body text-lg text-gray-300 italic font-medium leading-tight mb-4">
                    "Muchos intentan entrar, pero pocos soportan la presión del enlace. Tu código será puesto a prueba, tu voluntad será despojada de adornos."
                 </p>
                 <p className="font-mono text-[8px] text-secondary font-black uppercase tracking-widest">>> ARENA_ELDER_PROTOCOL</p>
              </div>

              <div className="mt-auto pt-10 border-t border-white/5">
                 <div className="flex items-center gap-4 text-gray-600 mb-2">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest">LIVE_CONNECTION: ENCRYPTED</span>
                 </div>
                 <div className="flex gap-1">
                    {Array.from({length: 20}).map((_, i) => (
                       <div key={i} className={`h-4 w-1 bg-primary/20 animate-pulse`} style={{ animationDelay: `${i * 100}ms` }}></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Interface */}
        <div className="flex-1 p-10 md:p-20 relative flex flex-col bg-bg-dark/40">
           {/* Terminal Watermark */}
           <div className="absolute top-10 right-10 flex items-center space-x-2 text-primary/10 select-none">
              <span className="font-display text-8xl font-black">0{step}</span>
           </div>

           <div className="mb-16">
              <h2 className="font-display text-5xl font-black text-white uppercase italic tracking-tighter mb-4 glitch-text" data-text="AUTHORIZE_YOUR_CODE">
                 AUTHORIZE_YOUR_CODE
              </h2>
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest leading-relaxed max-w-md">
                 No hay vuelta atrás. Una vez que tu identidad se sincronice con el núcleo, te conviertes en propiedad de la Arena.
              </p>
           </div>

           <div className="flex-1 space-y-12 relative z-10">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-10">
                  <div className="inline-flex items-center gap-4 px-4 py-2 border border-primary/20 bg-primary/5">
                     <span className="w-2 h-2 bg-primary animate-ping"></span>
                     <span className="font-mono text-[10px] text-primary font-black uppercase tracking-[0.4em]">IDENTITY_SCRAPE_v01</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <ModernInput label="CODENAME_TAG" placeholder="Escribe tu alias..." icon="fingerprint" />
                    <ModernInput label="NEURAL_REACH" placeholder="email@arkadex.net" icon="alternate_email" type="email" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-10">
                  <div className="inline-flex items-center gap-4 px-4 py-2 border border-secondary/20 bg-secondary/5">
                     <span className="w-2 h-2 bg-secondary animate-ping"></span>
                     <span className="font-mono text-[10px] text-secondary font-black uppercase tracking-[0.4em]">CRYPTOGRAPHIC_SEAL</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <ModernInput label="CIPHER_KEY" placeholder="••••••••" icon="lock" type="password" />
                    <ModernInput label="RE_VALIDATE" placeholder="••••••••" icon="key" type="password" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-10">
                  <div className="inline-flex items-center gap-4 px-4 py-2 border border-white/20 bg-white/5">
                     <span className="w-2 h-2 bg-white animate-ping"></span>
                     <span className="font-mono text-[10px] text-white font-black uppercase tracking-[0.4em]">PHILOSOPHY_SYNC</span>
                  </div>
                  <div className="grid grid-cols-1 gap-12">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['NOXKORE', 'KRYPTAX', 'SYNTHEX', 'RAVEX'].map(f => (
                           <button key={f} className="relative aspect-square bg-surface-dark border border-white/5 hover:border-primary transition-all group overflow-hidden">
                              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                 <span className="font-display text-[10px] text-white font-bold mb-2">{f}</span>
                                 <div className="h-0.5 w-8 bg-white/20 group-hover:bg-primary transition-all"></div>
                              </div>
                           </button>
                        ))}
                     </div>
                     <div className="p-6 bg-primary/5 border-l-4 border-primary/40 backdrop-blur-md flex items-start gap-6">
                        <input type="checkbox" className="mt-1 w-6 h-6 border-2 border-primary/20 bg-transparent rounded-none appearance-none checked:bg-primary transition-all cursor-pointer" />
                        <p className="font-mono text-[10px] text-gray-500 uppercase leading-relaxed font-bold">
                           RECONOZCO QUE MI CÓDIGO PERTENECE A LA RED ARKADEX. TODAS LAS VICTORIAS Y DERROTAS SERÁN REGISTRADAS EN LA CADENA NEURAL PERMANENTE. ACEPTO LOS PROTOCOLOS DE LA ARENA.
                        </p>
                     </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center gap-8 mt-12">
                <button 
                  onClick={() => step < 3 ? setStep(step + 1) : onComplete()}
                  className="w-full py-8 bg-neon-gradient text-black font-display font-black uppercase tracking-[0.5em] hover:scale-105 transition-all clip-btn shadow-[0_0_40px_rgba(163,255,0,0.4)] active:scale-95 text-sm"
                >
                  {step === 3 ? 'LEGALIZE_IDENTITY' : 'PROCEED_SYNC'}
                </button>
                {step > 1 ? (
                   <button onClick={() => setStep(step - 1)} className="w-full md:w-auto px-16 py-8 border border-white/10 text-gray-400 font-display font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all clip-btn text-xs">REVERSE_SEQ</button>
                ) : (
                   <button onClick={onBack} className="w-full md:w-auto px-12 py-8 text-gray-700 font-mono text-[9px] uppercase tracking-[0.3em] hover:text-red-500 transition-colors font-black">ABORT_AUTHORIZATION</button>
                )}
              </div>
           </div>

           {/* Hidden Architect Port (Admin Access) */}
           <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
              <div className="flex items-center space-x-3 opacity-40">
                 <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                 <span className="font-mono text-[9px] text-white font-black">NEURAL_AUTH_PORT: 8291_ESTABLISHED</span>
              </div>
              
              <button 
                onClick={handleAdminBypass}
                className="font-mono text-[8px] text-gray-600 hover:text-secondary uppercase tracking-[0.4em] transition-colors flex items-center gap-2 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">>></span>
                ARCHITECT_ACCESS_MAIN_MAINFRAME
                <span className="material-symbols-outlined text-[10px]">settings_input_component</span>
              </button>

              <div className="flex items-center gap-6 opacity-40">
                 <span className="font-mono text-[9px] text-white">LATENCY: 0.002MS</span>
                 <span className="font-mono text-[9px] text-white italic underline">SECURITY_LEVEL: ALPHA</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ModernInput = ({ label, placeholder, icon, type = "text" }: any) => (
  <div className="space-y-4 group">
    <label className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-focus-within:text-primary transition-colors flex items-center gap-2">
       <span className="w-1 h-3 bg-primary/20 group-focus-within:bg-primary"></span>
       {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-gray-600 group-focus-within:text-primary transition-all text-2xl">{icon}</span>
      </div>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-black/40 border border-white/10 p-7 pl-16 text-white font-mono text-sm focus:border-primary/60 transition-all outline-none clip-btn placeholder:text-gray-800 backdrop-blur-md focus:bg-primary/5"
      />
      {/* Decorative Input Ornament */}
      <div className="absolute top-0 right-0 p-1">
         <div className="w-1 h-1 bg-white/20 group-focus-within:bg-primary group-focus-within:animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default OnboardingView;
