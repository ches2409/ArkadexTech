
import React from 'react';

interface Props {
  onStart: () => void;
}

const LandingView: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-bg-dark overflow-x-hidden">
      {/* Cinematic Scanlines Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      {/* Tech Grid Background */}
      <div className="fixed inset-0 bg-cyber-grid bg-[length:60px_60px] opacity-[0.15] pointer-events-none"></div>
      
      {/* Top Ticker: Neural Feed */}
      <div className="w-full h-8 bg-primary/5 border-b border-primary/20 flex items-center overflow-hidden z-[60] font-mono">
         <div className="whitespace-nowrap flex animate-[marquee_40s_linear_infinite]">
            {[1,2,3,4].map(i => (
               <div key={i} className="flex items-center space-x-12 px-12">
                  <span className="text-[10px] text-primary font-bold">>> PROTOCOL_STABLE: NODES_ONLINE [42/42]</span>
                  <span className="text-[10px] text-white/40">>> ENCRYPTED_TUNNEL: AES-256_ACTIVE</span>
                  <span className="text-[10px] text-secondary font-bold">>> NEW_RECORD: USER_VX9 SETS 0.04ms RESPONSE</span>
                  <span className="text-[10px] text-primary/60">>> ARENA_FUNDS: $2,400,102.50_LIQUID</span>
               </div>
            ))}
         </div>
      </div>

      {/* Navigation */}
      <nav className="w-full h-20 flex items-center justify-between px-6 md:px-16 sticky top-0 bg-bg-dark/95 backdrop-blur-xl border-b border-white/5 z-50">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 border-2 border-primary flex items-center justify-center -skew-x-12 bg-primary/10 shadow-[0_0_20px_rgba(163,255,0,0.3)]">
               <span className="font-display font-black text-3xl text-primary">A</span>
            </div>
            <div className="flex flex-col">
               <h1 className="font-display font-black text-2xl tracking-tighter text-white leading-none">ARKADEX</h1>
               <span className="font-mono text-[8px] text-secondary uppercase font-bold tracking-[0.2em]">Neural_Arena_v4.2</span>
            </div>
         </div>
         
         <div className="hidden lg:flex space-x-10 items-center">
            {['Nosotros', 'Circuitos', 'Facciones', 'Ranking'].map(item => (
               <a key={item} href={`#${item.toLowerCase()}`} className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-primary transition-all relative group py-2">
                  {item}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
               </a>
            ))}
         </div>

         <button onClick={onStart} className="px-8 py-3 bg-neon-gradient text-black font-display font-black text-[10px] uppercase tracking-[0.2em] clip-btn hover:scale-110 transition-all shadow-[0_0_20px_rgba(163,255,0,0.4)]">
            AUTH_SESSION
         </button>
      </nav>

      {/* HERO SECTION: THE ASCENSION */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative px-6 py-20 overflow-hidden">
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover brightness-[0.08] contrast-[1.2] grayscale hover:grayscale-0 transition-all duration-[3000ms]"
               alt="Cyber Arena Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-transparent to-bg-dark"></div>
         </div>

         <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
               <div className="mb-8 inline-flex items-center gap-4 px-6 py-2 bg-primary/5 border-l-4 border-primary backdrop-blur-md">
                  <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  <p className="font-mono text-[10px] text-primary uppercase font-black tracking-[0.5em]">
                     SYNC_SIGNAL: OPTIMAL_CONNECTION_ESTABLISHED
                  </p>
               </div>
               <h1 className="font-display text-[10vw] lg:text-[110px] font-black text-white uppercase leading-[0.8] mb-6 tracking-tighter glitch-text" data-text="ASCEND">
                  ASCEND
               </h1>
               <h2 className="font-display text-4xl md:text-6xl font-black text-secondary uppercase tracking-[0.2em] mb-12 italic text-glow-secondary">
                  BEYOND_DATA
               </h2>
               <div className="max-w-xl mx-auto lg:mx-0 mb-12 relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-50"></div>
                  <p className="font-body text-2xl md:text-3xl text-white italic font-black uppercase tracking-tighter leading-none mb-6">
                     TU CONCIENCIA ES EL <span className="text-primary text-glow-primary">ÚLTIMO HARDWARE</span> QUE NECESITAS ACTUALIZAR.
                  </p>
                  <p className="font-mono text-xs text-gray-500 uppercase leading-relaxed max-w-md tracking-wider">
                     Protocolos de matchmaking neural de ultra-baja latencia. Bienvenido a la infraestructura de competición definitiva para la élite digital.
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <button onClick={onStart} className="px-16 py-6 bg-primary text-black font-display font-black text-xs uppercase tracking-[0.4em] clip-btn hover:shadow-[0_0_40px_rgba(163,255,0,0.5)] transition-all">
                     INIT_SYNC_SEQUENCE
                  </button>
                  <button className="px-12 py-6 border border-white/10 text-white font-display font-black text-xs uppercase tracking-[0.4em] clip-btn hover:border-primary transition-all backdrop-blur-sm group">
                     <span className="group-hover:text-primary transition-colors tracking-widest">NETWORK_STATS</span>
                  </button>
               </div>
            </div>
            <div className="w-full max-w-[550px] lg:w-[480px] relative order-1 lg:order-2">
               <div className="absolute -top-12 -right-12 w-40 h-40 border-r-2 border-t-2 border-secondary/30 animate-pulse pointer-events-none"></div>
               <div className="absolute -bottom-12 -left-12 w-40 h-40 border-l-2 border-b-2 border-primary/30 animate-pulse delay-1000 pointer-events-none"></div>
               <div className="relative p-1 bg-gradient-to-tr from-primary/40 via-transparent to-secondary/40 clip-hacker overflow-hidden">
                  <div className="relative aspect-[4/5] bg-bg-dark clip-hacker overflow-hidden group">
                     <img 
                        src="https://images.unsplash.com/photo-1614017273232-fb4ae29e1e2d?auto=format&fit=crop&q=80&w=1000" 
                        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        alt="Neural Subject Alpha"
                     />
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(163,255,0,0.1)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent h-[10%] w-full animate-[scan_3s_linear_infinite] z-20 pointer-events-none"></div>
                     <div className="absolute top-6 right-6 text-right">
                        <p className="font-mono text-[8px] text-primary uppercase font-bold tracking-tighter">BIOMETRIC_READING</p>
                        <p className="font-display text-lg text-white font-black leading-none">STABLE</p>
                     </div>
                     <div className="absolute bottom-8 left-8 right-8 font-mono bg-black/60 backdrop-blur-md p-4 border border-white/10">
                        <div className="flex justify-between text-[10px] text-primary mb-2 font-black uppercase">
                           <span>NEURAL_LOAD</span>
                           <span>88%</span>
                        </div>
                        <div className="h-1 bg-white/10 w-full">
                           <div className="h-full bg-primary w-[88%] shadow-[0_0_10px_#A3FF00]"></div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute -left-16 top-1/3 bg-bg-dark border border-primary/40 p-5 backdrop-blur-2xl -rotate-6 hidden xl:block z-30 shadow-2xl">
                  <p className="font-mono text-[8px] text-primary uppercase font-black mb-1">ID_AUTH_0x829</p>
                  <p className="font-display text-sm text-white font-black">#KAOS_MASTER</p>
                  <div className="mt-3 flex gap-1">
                     <div className="w-1 h-4 bg-primary"></div>
                     <div className="w-1 h-4 bg-primary/40"></div>
                     <div className="w-1 h-4 bg-primary/10"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CONNECTION INTERRUPT CHALLENGE */}
      <section className="w-full h-32 bg-primary/5 flex items-center justify-center relative overflow-hidden border-y border-primary/20">
         <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
         <div className="absolute -left-20 top-0 h-full w-40 bg-primary/10 -skew-x-[45deg] animate-[marquee_15s_linear_infinite]"></div>
         <div className="relative z-10 px-6 text-center">
            <h3 className="font-display text-xl md:text-2xl font-black text-white uppercase italic tracking-[0.2em] group cursor-default">
               <span className="text-primary animate-pulse mr-4">>></span>
               LA DESCONEXIÓN ES EL FIN DEL PROGRESO. <span className="text-primary text-glow-primary glitch-text" data-text="MANTÉN EL ENLACE">MANTÉN EL ENLACE</span> O DESAPARECE EN EL RUIDO.
               <span className="text-primary animate-pulse ml-4 font-mono text-sm underline tracking-widest opacity-40">STAY_CONNECTED_v0.9</span>
            </h3>
         </div>
      </section>

      {/* NOSOTROS: ARKADEX_CORE */}
      <section id="nosotros" className="w-full py-40 bg-bg-dark relative overflow-hidden border-y border-white/5">
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Data Structure" />
         </div>
         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-12">
               <div className="space-y-4">
                  <p className="font-mono text-[10px] text-primary uppercase font-bold tracking-[0.6em] animate-pulse">>> ACCESSING_CORE_MANIFESTO</p>
                  <h2 className="font-display text-6xl font-black text-white uppercase italic tracking-tighter leading-none">EL NÚCLEO <br/> <span className="text-primary text-glow-primary">ARKADEX</span></h2>
               </div>
               <p className="font-body text-2xl text-gray-300 leading-relaxed italic border-l-4 border-primary pl-8 bg-primary/5 py-4">
                  "Arkadex no es una plataforma, es una <span className="text-white font-bold">infraestructura de guerra digital</span>. Nacimos para los arquitectos del caos y los puristas de la ejecución, eliminando la barrera entre el pensamiento y el impacto."
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-6 bg-surface-dark border border-white/5 hover:border-primary/40 transition-all clip-btn group">
                     <h4 className="font-display text-xs text-white mb-4 uppercase tracking-[0.2em] font-black group-hover:text-primary transition-colors">VISIÓN_NEURAL</h4>
                     <p className="font-mono text-[10px] text-gray-500 uppercase leading-relaxed tracking-wider">Democratizar el alto rendimiento competitivo mediante redes descentralizadas y protocolos de transparencia absoluta.</p>
                  </div>
                  <div className="p-6 bg-surface-dark border border-white/5 hover:border-secondary/40 transition-all clip-btn group">
                     <h4 className="font-display text-xs text-white mb-4 uppercase tracking-[0.2em] font-black group-hover:text-secondary transition-colors">OBJETIVO_CRÍTICO</h4>
                     <p className="font-mono text-[10px] text-gray-500 uppercase leading-relaxed tracking-wider">Erradicar la latencia en todas sus formas: técnica, económica y social. Tu habilidad es el único dato que importa.</p>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="relative border-2 border-white/10 p-2 clip-hacker bg-black/40 backdrop-blur-sm">
                  <div className="bg-bg-dark p-10 border border-white/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-primary/30">SYSTEM_LOG_v.011</div>
                     <p className="font-mono text-xs text-primary mb-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">terminal</span> root@arkadex:~$ info --manifesto
                     </p>
                     <div className="space-y-6 font-mono text-[11px] text-gray-400 leading-relaxed uppercase">
                        <p><span className="text-white font-bold">ARKADEX</span> fue fundado por un colectivo de ingenieros de red y pro-gamers cansados de los sistemas de competición cerrados y corruptos.</p>
                        <p>Buscamos la <span className="text-secondary font-bold">Sincronización Total</span>: un estado de flujo puro donde el hardware se vuelve una extensión de la voluntad biológica.</p>
                        <p>Nuestra plataforma procesa más de <span className="text-primary font-bold">4.2 PB</span> de datos competitivos para asegurar que cada milisegundo de gloria sea ganado legítimamente.</p>
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-primary"></div>)}
                              <div className="w-4 h-1 bg-white/10"></div>
                           </div>
                           <span className="text-[10px] text-primary">CORE_STABILITY: 99.9%</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* REDESIGNED NEURAL_PROVOCATION: SYSTEM ALERT STYLE */}
      <section className="w-full py-32 bg-bg-dark relative overflow-hidden border-b border-white/5">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="bg-surface-dark border border-white/10 p-1 relative group">
               <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-primary group-hover:scale-110 transition-transform"></div>
               <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-secondary group-hover:scale-110 transition-transform"></div>
               
               <div className="bg-bg-dark/80 p-12 md:p-20 relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 opacity-[0.03] font-mono text-[10px] leading-none overflow-hidden select-none pointer-events-none whitespace-pre">
                     {Array.from({length: 40}).map((_, i) => (
                        <div key={i}>01011110001010101010111010010101011110001010101010111010010</div>
                     ))}
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                     <div className="flex items-center gap-4 bg-primary/10 border border-primary/30 px-6 py-2">
                        <span className="material-symbols-outlined text-primary text-xl animate-pulse">warning</span>
                        <span className="font-mono text-xs text-primary uppercase font-black tracking-[0.4em]">SYSTEM_CHALLENGE_ACTIVE</span>
                     </div>
                     <div className="text-right font-mono text-[9px] text-gray-500 uppercase tracking-widest hidden md:block">
                        PROBABILITY_OF_FAILURE: 94.2% <br/>
                        NETWORK_LATENCY: 1.2MS
                     </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                     <h2 className="font-display text-3xl md:text-5xl lg:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                        <span className="block mb-2 opacity-60">TU CÓDIGO TIENE ERRORES.</span>
                        <span className="block text-primary text-glow-primary glitch-text" data-text="TU VOLUNTAD TIENE LÍMITES.">TU VOLUNTAD TIENE LÍMITES.</span>
                        <span className="block mt-4 text-secondary text-glow-secondary">LA ARENA LOS ENCONTRARÁ TODOS.</span>
                     </h2>
                  </div>

                  <div className="mt-16 flex items-center justify-between gap-8 relative z-10 pt-8 border-t border-white/5">
                     <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary via-secondary to-transparent w-3/4 animate-pulse"></div>
                     </div>
                     <p className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.5em] animate-pulse">AWAITING_INPUT</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FACCIONES: PROTOCOLS */}
      <section id="facciones" className="w-full py-40 bg-bg-dark relative">
         <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
            <div className="inline-block px-4 py-1 border border-white/10 mb-6">
               <span className="font-mono text-[10px] text-gray-500 uppercase font-black">ARENA_SECTORS_PHASE_04</span>
            </div>
            <h2 className="font-display text-7xl font-black text-white uppercase italic tracking-tighter mb-8">ELIGE TU <span className="text-secondary">PROTOCOLO</span></h2>
            <div className="max-w-3xl mx-auto space-y-6 mb-16">
               <p className="font-body text-2xl text-gray-400 italic font-medium leading-relaxed">
                  "En Arkadex, tu código es tu identity, pero tu facción es tu voluntad colectiva. <span className="text-white">¿Eres la sombra que acecha, el virus que corrompe, la precisión que ejecuta o la fuerza que arrasa?</span>"
               </p>
               <div className="h-px w-32 bg-primary/40 mx-auto"></div>
               <p className="font-mono text-[11px] text-primary/80 uppercase tracking-[0.4em] font-black animate-pulse italic">
                  ADVERTENCIA: La neutralidad es el camino hacia la irrelevancia. Toma una decisión. Define tu existencia digital.
               </p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-[750px] border-y border-white/5">
            <FactionTechCard 
               name="NOXKORE" 
               color="primary" 
               img="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000"
               manifesto="El ruido es el refugio de los incompetentes. Noxkore opera en las frecuencias del silencio absoluto."
               specialty="TACTICAL_STEALTH"
               description="Para los calculadores. Los que ganan la partida antes de que el enemigo sepa que ha empezado. ¿Tienes la paciencia de un depredador?"
            />
            <FactionTechCard 
               name="KRYPTAX" 
               color="secondary" 
               img="https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1000"
               manifesto="El orden es una prisión. Kryptax es el virus que la desmantela desde adentro."
               specialty="SYSTEM_CHAOS"
               description="Para los rebeldes. Los impredecibles que rompen el meta con pura intuición. ¿Eres tú quien controla el caos, o el caos te controla a ti?"
            />
            <FactionTechCard 
               name="SYNTHEX" 
               color="primary" 
               img="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000"
               manifesto="La carne es débil; el algoritmo es perfecto. Somos la precisión ejecutada en nanosegundos."
               specialty="NEURAL_PRECISION"
               description="Para los perfeccionistas. Donde cada píxel y cada frame cuentan. ¿Es tu mente una herramienta de precisión o solo un procesador lento?"
            />
            <FactionTechCard 
               name="RAVEX" 
               color="secondary" 
               img="https://images.unsplash.com/photo-1560253023-3ee71f173795?auto=format&fit=crop&q=80&w=1000"
               manifesto="Velocidad absoluta. Impacto total. Ravex es la fuerza cinética que rompe cualquier frente."
               specialty="KINETIC_FURY"
               description="Para los imparables. Los que no conocen la retirada y se alimentan de la inercia del combate. ¿Late tu corazón lo suficientemente rápido?"
            />
         </div>
      </section>

      {/* DESTINY PROTOCOL SECTION (IMAGE 7 INSPIRED) */}
      <section className="w-full py-48 bg-bg-dark relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-24">
               
               {/* Decorative Left Visual */}
               <div className="lg:w-1/2 relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative border-2 border-white/5 p-4 clip-hacker bg-surface-dark/40 backdrop-blur-xl">
                     <div className="relative aspect-square overflow-hidden clip-hacker">
                        <img 
                           src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200" 
                           className="w-full h-full object-cover grayscale brightness-[0.3] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-[2000ms]"
                           alt="Legacy Core"
                        />
                        {/* HUD Elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-48 h-48 border border-primary/20 rounded-full animate-spin-slow"></div>
                           <div className="absolute w-64 h-64 border border-secondary/10 rounded-full animate-reverse-spin"></div>
                           <span className="material-symbols-outlined text-white text-6xl opacity-40 group-hover:opacity-100 transition-opacity">memory</span>
                        </div>
                     </div>
                  </div>
                  {/* Floating Labels */}
                  <div className="absolute -top-10 -right-10 bg-surface-dark border border-white/10 p-4 font-mono text-[9px] uppercase tracking-widest hidden xl:block shadow-2xl z-20">
                     <p className="text-primary mb-1">PROTO_STATUS: MASTERED</p>
                     <p className="text-gray-500">ID: OWNER_OF_VOID</p>
                  </div>
               </div>

               {/* Text Content */}
               <div className="lg:w-1/2 space-y-12">
                  <div className="space-y-4">
                     <p className="font-mono text-[10px] text-primary uppercase font-black tracking-[0.8em]">>> FINAL_PHASE_INITIATED</p>
                     <h2 className="font-display text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none glitch-text" data-text="HAZTE DUEÑO DE TU DESTINO">
                        HAZTE DUEÑO <br/> <span className="text-secondary text-glow-secondary">DE TU DESTINO</span>
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-10">
                     <div className="space-y-4 relative pl-8 border-l-2 border-white/10 group hover:border-primary transition-colors">
                        <h4 className="font-display text-sm text-white font-black uppercase tracking-widest group-hover:text-primary transition-colors">FORJA TU PROPIO CAMINO</h4>
                        <p className="font-body text-xl text-gray-400 italic leading-snug">
                           La arena no perdona a los indecisos. Aquí, cada decisión que tomas se escribe en el código fuente de la historia. No eres un usuario, eres un arquitecto.
                        </p>
                     </div>

                     <div className="space-y-4 relative pl-8 border-l-2 border-white/10 group hover:border-secondary transition-colors">
                        <h4 className="font-display text-sm text-white font-black uppercase tracking-widest group-hover:text-secondary transition-colors">RECLAMA TU LEGADO</h4>
                        <p className="font-body text-xl text-gray-400 italic leading-snug">
                           No esperes a que el sistema te asigne un lugar. Toma el control del mainframe y redefine lo que es posible. Tu reputación es tu único firewall contra el olvido.
                        </p>
                     </div>

                     <div className="space-y-4 relative pl-8 border-l-2 border-white/10 group hover:border-primary transition-colors">
                        <h4 className="font-display text-sm text-white font-black uppercase tracking-widest group-hover:text-primary transition-colors">DRENA EL RUIDO</h4>
                        <p className="font-body text-xl text-gray-400 italic leading-snug">
                           Tu habilidad es la moneda. Tu voluntad es el hardware. En Arkadex, el éxito no es un algoritmo, es una ejecución impecable en tiempo real.
                        </p>
                     </div>
                  </div>

                  <div className="pt-10 space-y-6">
                     <p className="font-mono text-[10px] text-primary/60 uppercase tracking-[0.3em] animate-pulse max-w-sm italic font-bold">
                        >> PROTOCOLO DE ACCESO DETECTADO. HAZ CLIC EN EL BOTÓN PARA CARGAR TU CONCIENCIA EN EL MAINFRAME DE ARKADEX.
                     </p>
                     <button onClick={onStart} className="px-16 py-6 bg-primary text-black font-display font-black text-xs uppercase tracking-[0.5em] clip-btn hover:shadow-[0_0_50px_rgba(163,255,0,0.6)] hover:scale-105 transition-all">
                        ENTER_THE_VOID
                     </button>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-24 bg-bg-dark border-t border-white/5 px-6 md:px-24">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="md:col-span-2 space-y-10">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 border-2 border-primary flex items-center justify-center -skew-x-12">
                     <span className="font-display font-black text-2xl text-primary">A</span>
                  </div>
                  <h2 className="font-display font-black text-4xl text-white tracking-tighter">ARKADEX</h2>
               </div>
               <p className="font-mono text-[10px] text-gray-600 max-w-sm uppercase leading-loose tracking-widest">
                  Infraestructura de competición global distribuida. © 2024 ARKADEX_NETWORK // AUTORIZACIÓN_NIVEL_ALPHA_REQUERIDA.
               </p>
            </div>
            <div className="space-y-8">
               <h5 className="font-display text-[11px] text-white font-black uppercase tracking-[0.4em]">SYSTEM_LINKS</h5>
               <ul className="space-y-4">
                  {['Mainframe', 'Tournaments', 'Ranking_Logs', 'Security_Docs'].map(l => (
                     <li key={l}><a href="#" className="font-mono text-[10px] text-gray-500 hover:text-primary uppercase transition-colors">>> {l}</a></li>
                  ))}
               </ul>
            </div>
            <div className="space-y-8">
               <h5 className="font-display text-[11px] text-white font-black uppercase tracking-[0.4em]">CONNECT_PORT</h5>
               <div className="flex gap-4">
                  {['discord', 'twitch', 'terminal'].map(icon => (
                     <div key={icon} className="w-12 h-12 border border-white/10 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </footer>

      <style>{`
         @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(1000%); opacity: 0; }
         }
         @keyframes scan-line {
            0% { top: 0; }
            100% { top: 100%; }
         }
         @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
         }
         @keyframes reverse-spin {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
         }
         .animate-spin-slow { animation: spin-slow 20s linear infinite; }
         .animate-reverse-spin { animation: reverse-spin 15s linear infinite; }
         .text-glow-primary { text-shadow: 0 0 15px rgba(163, 255, 0, 0.7); }
         .text-glow-secondary { text-shadow: 0 0 15px rgba(213, 0, 249, 0.7); }
      `}</style>
    </div>
  );
};

const FactionTechCard = ({ name, color, img, manifesto, specialty, description }: any) => (
   <div className="relative group overflow-hidden cursor-crosshair flex flex-col min-h-[500px] border-x border-white/5">
      <div className="absolute inset-0">
         <img src={img} className="w-full h-full object-cover grayscale brightness-[0.2] transition-all duration-[1500ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-50" alt={name} />
         <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent"></div>
      </div>
      <div className="absolute bottom-12 left-10 right-10 group-hover:opacity-0 transition-opacity duration-300">
         <p className={`font-mono text-[9px] text-${color} uppercase tracking-[0.5em] mb-4 font-black`}>{specialty}</p>
         <h4 className="font-display text-5xl font-black text-white uppercase tracking-tighter italic">{name}</h4>
      </div>
      <div className="absolute inset-0 bg-bg-dark/95 backdrop-blur-xl p-12 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-center border-l-2 border-primary/20 translate-x-10 group-hover:translate-x-0">
         <div className="mb-6">
            <h4 className="font-display text-6xl font-black text-white uppercase italic tracking-tighter mb-2">{name}</h4>
            <div className={`h-1 w-24 bg-${color}`}></div>
         </div>
         <p className="font-body text-lg text-gray-200 leading-tight italic mb-6 uppercase font-bold tracking-tight">
            "{manifesto}"
         </p>
         <p className="font-mono text-[10px] text-gray-500 uppercase leading-relaxed mb-10 border-l border-white/10 pl-4">
            {description}
         </p>
         <button className={`w-full py-5 border border-${color}/40 text-white font-display font-black text-[10px] uppercase tracking-[0.4em] hover:bg-${color} hover:text-black transition-all clip-btn`}>
            INIT_SYNC_WITH_{name}
         </button>
      </div>
   </div>
);

export default LandingView;
