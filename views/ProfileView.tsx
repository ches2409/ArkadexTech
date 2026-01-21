
import React from 'react';
import { MOCK_PLAYER, MOCK_TOURNAMENTS, MOCK_MATCHES } from '../constants';

interface Props {
  onAdmin: () => void;
  onLogout: () => void;
}

const ProfileView: React.FC<Props> = ({ onAdmin, onLogout }) => {
  const AVATAR_URL = "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200";

  return (
    <div className="min-h-screen bg-bg-dark text-gray-200">
      {/* Cinematic HUD Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-cyber-grid"></div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-bg-dark/90 backdrop-blur-xl sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <div className="w-8 h-8 border-2 border-primary flex items-center justify-center -skew-x-12 bg-primary/10">
                  <span className="font-display font-bold text-primary">A</span>
               </div>
               <span className="font-display font-bold text-lg tracking-widest text-white uppercase">ARKADEX</span>
            </div>
            <div className="hidden md:flex space-x-10">
               {['Circuitos', 'Facciones', 'Ranking', 'Terminal'].map(l => (
                  <a key={l} href="#" className="font-display text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-primary transition-colors">{l}</a>
               ))}
            </div>
            <div className="flex items-center space-x-6">
               <button onClick={onAdmin} className="material-symbols-outlined text-gray-400 hover:text-primary transition-colors text-xl">admin_panel_settings</button>
               <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
                  <div className="text-right">
                     <p className="text-[10px] font-display font-black text-white uppercase leading-none">{MOCK_PLAYER.tag}</p>
                     <p className="text-[8px] text-primary font-mono uppercase font-bold">LVL_{MOCK_PLAYER.level}</p>
                  </div>
                  <img src={AVATAR_URL} className="w-10 h-10 border-2 border-primary clip-corner-br grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Player Avatar" />
               </div>
            </div>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
         {/* LEFT SIDEBAR: IDENTITY CARD */}
         <aside className="lg:col-span-3 space-y-8">
            <div className="bg-surface-dark border border-white/10 relative clip-hacker overflow-hidden group">
               <div className="h-32 bg-gradient-to-br from-primary/30 to-secondary/30 relative">
                  <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
               </div>
               <div className="px-8 pb-10 -mt-16 text-center relative z-10">
                  <div className="relative inline-block mb-6">
                     <img src={AVATAR_URL} className="w-28 h-28 border-4 border-bg-dark clip-corner-tl shadow-2xl mx-auto" alt="User" />
                     <div className="absolute -bottom-2 -right-2 bg-primary p-1.5 border-2 border-bg-dark">
                        <span className="material-symbols-outlined text-black text-xs block font-bold">verified</span>
                     </div>
                  </div>
                  <h2 className="font-display text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{MOCK_PLAYER.tag}</h2>
                  <div className="flex justify-center gap-3 mb-8">
                    <span className="bg-white/5 text-gray-400 px-3 py-1 text-[9px] font-mono border border-white/5 uppercase">#ID_{MOCK_PLAYER.id.replace('#','')}</span>
                    <span className="bg-secondary/20 text-secondary border border-secondary/40 px-3 py-1 text-[9px] font-black uppercase tracking-widest">PRO_RANK</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-10">
                     <SidebarStat label="VICTORIAS" value={MOCK_PLAYER.wins} color="primary" />
                     <SidebarStat label="RANK_POS" value="#42" color="secondary" />
                  </div>

                  <div className="text-left p-4 bg-primary/5 border-l-4 border-primary mb-8">
                     <p className="text-[9px] font-display font-black uppercase text-gray-500 mb-2">Protocolo_Facción</p>
                     <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-primary text-xl">security</span>
                        <div>
                           <p className="font-display font-bold text-white text-xs uppercase italic tracking-widest">{MOCK_PLAYER.faction}</p>
                           <p className="font-mono text-[8px] text-gray-500 uppercase">Division_Special_Ops</p>
                        </div>
                     </div>
                  </div>

                  <button onClick={onLogout} className="w-full py-4 bg-red-600/10 border border-red-600/30 text-red-500 font-display font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all clip-btn">
                     DISCONNECT_SESSION
                  </button>
               </div>
            </div>
         </aside>

         {/* CONTENT AREA: PERFORMANCE LOGS */}
         <section className="lg:col-span-9 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <PerformanceCard label="CURRENT_RANK" value={MOCK_PLAYER.rank} icon="military_tech" color="primary" />
               <PerformanceCard label="K/D_RATIO" value={MOCK_PLAYER.kd} icon="target" color="secondary" />
               <PerformanceCard label="COMBAT_HOURS" value={MOCK_PLAYER.hours} icon="timer" color="white" />
               <PerformanceCard label="ARENA_WINS" value={MOCK_PLAYER.tournamentsWon} icon="workspace_premium" color="primary" />
            </div>

            {/* TOURNAMENTS SECTION */}
            <div className="space-y-8">
               <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <h3 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter">
                     ARENAS <span className="text-primary text-glow-primary">ACTIVAS</span>
                  </h3>
                  <button className="font-mono text-[9px] text-primary font-black uppercase tracking-widest hover:underline">VIEW_ALL_LOGS >></button>
               </div>
               <div className="space-y-6">
                  {MOCK_TOURNAMENTS.map(t => (
                    <TournamentRow key={t.id} tournament={t} />
                  ))}
               </div>
            </div>
         </section>
      </main>
    </div>
  );
};

const SidebarStat = ({ label, value, color }: any) => (
  <div className="bg-bg-dark/50 border border-white/5 p-3 text-left">
     <p className="text-[8px] uppercase text-gray-600 font-black mb-1">{label}</p>
     <p className={`font-display font-black text-lg text-${color}`}>{value}</p>
  </div>
);

const PerformanceCard = ({ label, value, icon, color }: any) => (
  <div className={`bg-surface-dark border-l-4 border-${color} p-6 group hover:bg-primary/5 transition-all clip-btn`}>
     <div className="flex justify-between items-start mb-4">
        <p className="text-[9px] text-gray-500 font-display font-black uppercase tracking-widest">{label}</p>
        <span className={`material-symbols-outlined text-xl opacity-30 text-${color}`}>{icon}</span>
     </div>
     <h4 className="font-display font-black text-3xl text-white tracking-tighter">{value}</h4>
  </div>
);

const TournamentRow = ({ tournament }: any) => {
   const statusColor = tournament.status === 'LIVE' ? 'primary' : tournament.status === 'REGISTER' ? 'secondary' : 'white';
   return (
      <div className={`bg-surface-dark border border-white/5 flex flex-col md:flex-row group hover:border-${statusColor}/40 transition-all clip-hacker relative overflow-hidden`}>
         <div className="md:w-64 h-40 md:h-auto overflow-hidden relative">
            <img src={tournament.image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt="Arena Image" />
            {tournament.status === 'LIVE' && (
               <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[8px] font-black px-3 py-1 animate-pulse uppercase">
                  BROADCASTING_LIVE
               </div>
            )}
         </div>
         <div className="p-8 flex-1 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
               <h4 className="font-display font-black text-2xl text-white uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors italic">{tournament.title}</h4>
               <div className="flex flex-wrap gap-6 text-gray-500 font-mono text-[10px] uppercase tracking-widest">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">sports_esports</span> {tournament.game}</span>
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">payments</span> {tournament.prize}</span>
               </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
               <p className="font-mono text-[10px] text-primary uppercase font-black">{tournament.status === 'LIVE' ? 'NEXT_MATCH' : 'ROSTER_STATUS'}</p>
               <p className="font-display text-2xl text-white font-black">{tournament.participants}</p>
               <button className={`w-full md:w-40 py-3 bg-${statusColor} text-black font-display font-black text-[9px] uppercase tracking-[0.3em] hover:scale-105 transition-all clip-btn`}>
                  {tournament.status === 'LIVE' ? 'JOIN_STREAM' : 'INIT_ROSTER'}
               </button>
            </div>
         </div>
      </div>
   );
};

export default ProfileView;
