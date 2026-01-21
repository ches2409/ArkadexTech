
import React, { useState, useEffect, useMemo } from 'react';

interface Props {
  onLogout: () => void;
  onProfile: () => void;
}

// Lore-based Views
type AdminSubView = 
  | 'MAINFRAME_HUB' | 'NEURAL_PROFILES' | 'TACTICAL_SQUADS' 
  | 'ARENA_OPERATIONS' | 'VIRTUAL_SOFTWARE' 
  | 'CLEARANCE_LEVELS' | 'CORE_PROTOCOLS';

// --- DATA TYPES ---
type TournamentStatus = 'LIVE' | 'REGISTER' | 'DRAFT' | 'OPEN' | 'FINISHED';
type ClearanceLevel = 'ALPHA' | 'BETA' | 'GAMMA' | 'OMEGA';
type SubjectStatus = 'ONLINE' | 'OFFLINE' | 'LOCKED' | 'SUSPENDED';

interface AdminTournament {
  id: string;
  title: string;
  gameId: string;
  date: string;
  prize: string;
  status: TournamentStatus;
  currentParticipants: number;
  maxParticipants: number;
  image: string;
}

interface AdminGame {
  id: string;
  name: string;
  engine: string;
}

interface AdminSubject {
  id: string;
  tag: string;
  email: string;
  faction: string;
  clearance: ClearanceLevel;
  status: SubjectStatus;
  rank: string;
  kd: number;
  reputation: number;
  avatar: string;
  syncRatio: number; 
}

// --- INITIAL MOCKS ---
const INITIAL_GAMES: AdminGame[] = [
  { id: 'G-001', name: 'Valorant', engine: 'Riot_Kernel' },
  { id: 'G-002', name: 'League of Legends', engine: 'Riot_Kernel' },
  { id: 'G-003', name: 'Apex Legends', engine: 'Source_EVO' },
  { id: 'G-004', name: 'Counter-Strike 2', engine: 'Source_2' },
];

const INITIAL_TOURNAMENTS: AdminTournament[] = [
  { id: 'TRN-001', title: 'Cyber Winter Cup 2024', gameId: 'G-001', date: '2024-12-15', prize: '$5,000', status: 'LIVE', currentParticipants: 32, maxParticipants: 32, image: 'https://picsum.photos/seed/game1/400/250' },
  { id: 'TRN-002', title: 'Neon Blitz Series', gameId: 'G-003', date: '2024-11-20', prize: '15,000 Pts', status: 'REGISTER', currentParticipants: 12, maxParticipants: 64, image: 'https://picsum.photos/seed/game2/400/250' },
];

const INITIAL_SUBJECTS: AdminSubject[] = [
  { id: '#8291', tag: 'KaosMaster99', email: 'kaos@arkadex.net', faction: 'NOXKORE', clearance: 'ALPHA', status: 'ONLINE', rank: 'DIAMOND', kd: 2.84, reputation: 98, avatar: 'https://picsum.photos/seed/p1/200/200', syncRatio: 94.2 },
  { id: '#1022', tag: 'NeonWraith', email: 'wraith@arkadex.net', faction: 'KRYPTAX', clearance: 'BETA', status: 'ONLINE', rank: 'MASTER', kd: 3.12, reputation: 85, avatar: 'https://picsum.photos/seed/p2/200/200', syncRatio: 88.5 },
  { id: '#4490', tag: 'VoidWalker', email: 'void@arkadex.net', faction: 'SYNTHEX', clearance: 'GAMMA', status: 'OFFLINE', rank: 'PLATINUM', kd: 1.95, reputation: 92, avatar: 'https://picsum.photos/seed/p3/200/200', syncRatio: 72.1 },
  { id: '#0012', tag: 'Cypher_X', email: 'admin@sector.omega', faction: 'RAVEX', clearance: 'OMEGA', status: 'LOCKED', rank: 'CHALLENGER', kd: 4.50, reputation: 10, avatar: 'https://picsum.photos/seed/p4/200/200', syncRatio: 99.9 },
  { id: '#9921', tag: 'Spectral_01', email: 'spec@arkadex.net', faction: 'NOXKORE', clearance: 'ALPHA', status: 'ONLINE', rank: 'GOLD', kd: 1.20, reputation: 100, avatar: 'https://picsum.photos/seed/p5/200/200', syncRatio: 45.3 },
];

const AdminView: React.FC<Props> = ({ onLogout, onProfile }) => {
  const [activeSubView, setActiveSubView] = useState<AdminSubView>('MAINFRAME_HUB');
  const [tournaments, setTournaments] = useState<AdminTournament[]>(INITIAL_TOURNAMENTS);
  const [subjects, setSubjects] = useState<AdminSubject[]>(INITIAL_SUBJECTS);
  const [extractingIds, setExtractingIds] = useState<Set<string>>(new Set());
  const [logs, setLogs] = useState<Array<{type: string, msg: string, color: string}>>([
    { type: '[SYNC]', msg: 'Subject_#8291 updated clearance to Alpha', color: 'white' },
    { type: '[PTS]', msg: 'Nox_Vanguard gained +420 reputation points', color: 'primary' },
    { type: '[WARN]', msg: 'Attempted bypass on Sector_Omega suppressed', color: 'secondary' },
    { type: '[ARENA]', msg: "New Arena Node 'Midnight Showdown' online", color: 'blue-400' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [tournamentForm, setTournamentForm] = useState<Partial<AdminTournament>>({
    title: '', gameId: 'G-001', prize: '', status: 'OPEN', date: '', maxParticipants: 32
  });

  const [subjectForm, setSubjectForm] = useState<Partial<AdminSubject>>({
    id: '', tag: '', email: '', faction: 'NOXKORE', rank: 'IRON', kd: 1.0, syncRatio: 100, clearance: 'ALPHA'
  });

  const [latency, setLatency] = useState(0.024);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => +(prev + (Math.random() * 0.004 - 0.002)).toFixed(3));
      setSystemTime(new Date().toLocaleTimeString());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const matchesSearch = s.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.id.includes(searchQuery) || 
                           (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFaction = factionFilter === 'ALL' || s.faction === factionFilter;
      return matchesSearch && matchesFaction;
    });
  }, [subjects, searchQuery, factionFilter]);

  const toggleSubjectStatus = (id: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'LOCKED' ? 'ONLINE' : 'LOCKED' };
      }
      return s;
    }));
  };

  const updateClearance = (id: string, level: ClearanceLevel) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, clearance: level } : s));
  };

  const handleForceSync = () => {
    setIsScanning(true);
    setTimeout(() => {
      let critCount = 0;
      setSubjects(prev => prev.map(s => {
        const newRatio = +(Math.random() * 40 + 60).toFixed(1);
        if (newRatio < 70) critCount++;
        return { ...s, syncRatio: newRatio };
      }));
      
      const newLog = { 
        type: '[SYSTEM]', 
        msg: `Neural_Bridge_Reset: Sync completed. ${critCount} subjects showing instability.`, 
        color: critCount > 0 ? 'secondary' : 'primary' 
      };
      setLogs(prev => [newLog, ...prev]);
      setIsScanning(false);
    }, 2000);
  };

  const handleNeuralExtraction = (subject: AdminSubject) => {
    if (extractingIds.has(subject.id)) return;

    // Iniciar secuencia de extracción
    setExtractingIds(prev => new Set(prev).add(subject.id));

    setTimeout(() => {
      const isHighRank = ['MASTER', 'CHALLENGER', 'OMEGA'].includes(subject.rank);
      const msg = isHighRank 
        ? `Extraction Successful: High-tier neural data harvested from ${subject.tag} (${subject.rank}).`
        : `Extraction Finished: Basic behavioral data collected from ${subject.tag}.`;
      
      setLogs(prev => [{ type: '[EXTRACT]', msg, color: isHighRank ? 'secondary' : 'white' }, ...prev]);
      
      if (subject.syncRatio < 30) {
        setLogs(prev => [{ type: '[CRITICAL]', msg: `Warning: Mental feedback detected during extraction of ${subject.tag}!`, color: 'red-500' }, ...prev]);
      }

      setExtractingIds(prev => {
        const next = new Set(prev);
        next.delete(subject.id);
        return next;
      });

      // ¡NUEVO!: Abrir el protocolo de modificación automáticamente al terminar
      setSubjectForm(subject);
      setIsEditSubjectModalOpen(true);

    }, 1800);
  };

  const handleCreateSubject = () => {
    const clampedKd = Math.max(0, Math.min(10, subjectForm.kd || 1.0));
    const clampedSync = Math.max(0, Math.min(100, subjectForm.syncRatio || 100));

    const newId = `#${Math.floor(Math.random() * 9000 + 1000)}`;
    const newSubject: AdminSubject = {
      id: newId,
      tag: subjectForm.tag || 'NUEVO_SUJETO',
      email: subjectForm.email || 'anon@arkadex.net',
      faction: subjectForm.faction || 'NOXKORE',
      clearance: subjectForm.clearance || 'ALPHA',
      status: 'ONLINE',
      rank: subjectForm.rank || 'GOLD',
      kd: clampedKd,
      reputation: 100,
      avatar: `https://picsum.photos/seed/${newId}/200/200`,
      syncRatio: clampedSync
    };
    setSubjects([newSubject, ...subjects]);
    
    if (newSubject.kd > 3.0) {
      setLogs(prev => [{ type: '[ALERT]', msg: `HVT DETECTED: ${newSubject.tag} injected with Lethal Index ${newSubject.kd}`, color: 'secondary' }, ...prev]);
    } else {
      setLogs(prev => [{ type: '[INJECTION]', msg: `New Subject ${newSubject.tag} injected into ${newSubject.faction} sector.`, color: 'primary' }, ...prev]);
    }
    
    setIsAddSubjectModalOpen(false);
    setSubjectForm({ tag: '', email: '', faction: 'NOXKORE', rank: 'IRON', kd: 1.0, syncRatio: 100, clearance: 'ALPHA' });
  };

  const handleUpdateSubject = () => {
    const clampedKd = Math.max(0, Math.min(10, subjectForm.kd || 1.0));
    const clampedSync = Math.max(0, Math.min(100, subjectForm.syncRatio || 100));

    setSubjects(prev => prev.map(s => 
      s.id === subjectForm.id 
        ? { ...s, ...subjectForm, kd: clampedKd, syncRatio: clampedSync } as AdminSubject 
        : s
    ));

    setLogs(prev => [{ type: '[REWRITE]', msg: `Neural code for ${subjectForm.tag} successfully updated. Integrity verified.`, color: 'secondary' }, ...prev]);
    setIsEditSubjectModalOpen(false);
    setSubjectForm({ id: '', tag: '', email: '', faction: 'NOXKORE', rank: 'IRON', kd: 1.0, syncRatio: 100, clearance: 'ALPHA' });
  };

  const handleCreateTournament = () => {
    const newId = `TRN-${Math.floor(Math.random() * 900 + 100)}`;
    const newTournament: AdminTournament = {
      id: newId,
      title: tournamentForm.title || 'Nueva Arena',
      gameId: tournamentForm.gameId || 'G-001',
      date: tournamentForm.date || 'TBD',
      prize: tournamentForm.prize || '$0',
      status: (tournamentForm.status as TournamentStatus) || 'OPEN',
      currentParticipants: 0,
      maxParticipants: tournamentForm.maxParticipants || 32,
      image: `https://picsum.photos/seed/${newId}/400/250`
    };
    setTournaments([newTournament, ...tournaments]);
    setIsAddModalOpen(false);
  };

  const renderViewContent = () => {
    switch (activeSubView) {
      case 'MAINFRAME_HUB':
        return (
          <div className="space-y-8 animate-in fade-in duration-1000">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 border-b border-white/5 pb-8">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 border border-primary text-primary font-mono text-[8px] font-black uppercase tracking-widest animate-pulse">INTELLIGENCE_STREAM_0x82</span>
                    <span className="text-gray-600 font-mono text-[10px] uppercase">LINK: <span className="text-white">ENCRYPTED_MASTERNODE</span></span>
                  </div>
                  <h2 className="font-display font-black text-5xl text-white uppercase italic tracking-tighter leading-none">MAINFRAME_HUB</h2>
               </div>
               <div className="text-right font-mono text-xs flex flex-col gap-1">
                  <p className="text-gray-500 uppercase tracking-widest">LOCAL_CLOCK: <span className="text-white">{systemTime}</span></p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-gray-500 text-[10px]">SYNC_DELAY:</span>
                    <span className="text-primary font-black">{latency}ms</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <HubMetricCard label="Neural_Subjects" value={subjects.length} trend="+12" icon="person" color="primary" />
               <HubMetricCard label="Tactical_Units" value="128" trend="+2" icon="shield_person" color="secondary" />
               <HubMetricCard label="Arena_Nodes" value={tournaments.length} trend="ACTIVE" icon="stadium" color="blue-400" />
               <HubMetricCard label="Total_Points_Red" value="1.4M" trend="+240k" icon="military_tech" color="primary" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
               <div className="xl:col-span-8 space-y-8">
                  <div className="bg-surface-dark border border-white/5 p-8 clip-corner-tl relative group">
                     <div className="absolute top-0 right-0 p-6 opacity-5 font-display text-4xl font-black">SUPERIORITY</div>
                     <h3 className="font-display font-black text-xl text-white uppercase mb-8 flex items-center gap-3 italic">
                        <span className="w-1.5 h-6 bg-secondary shadow-[0_0_15px_#D500F9]"></span> TACTICAL_SUPERIORITY_INDEX
                     </h3>
                     <div className="space-y-4">
                        {[
                          { name: 'NOX_VANGUARD', points: 15400, winrate: '78%', faction: 'NOXKORE' },
                          { name: 'KRYPT_HACKERS', points: 12100, winrate: '62%', faction: 'KRYPTAX' },
                          { name: 'SYNTH_ELITE', points: 11800, winrate: '81%', faction: 'SYNTHEX' },
                        ].map((squad, idx) => (
                           <div key={idx} className="flex items-center gap-6 p-4 bg-black/40 border border-white/5 clip-btn hover:border-secondary/40 transition-all group/row">
                              <span className="font-display font-black text-2xl text-white/20 italic group-hover/row:text-secondary transition-colors">0{idx+1}</span>
                              <div className="flex-1">
                                 <div className="flex justify-between items-end mb-2">
                                    <h4 className="font-display font-black text-white uppercase tracking-wider italic">{squad.name}</h4>
                                    <span className="font-mono text-[10px] text-secondary font-black">{squad.points} PTS</span>
                                 </div>
                                 <div className="h-1 bg-white/5 w-full">
                                    <div className="h-full bg-secondary shadow-[0_0_8px_#D500F9]" style={{ width: `${(squad.points/16000)*100}%` }}></div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-mono text-[8px] text-gray-500 uppercase">WIN_RATE</p>
                                 <p className="font-display font-black text-white italic">{squad.winrate}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-surface-dark border border-white/5 p-8 clip-corner-tl">
                     <h3 className="font-display font-black text-xl text-white uppercase mb-8 flex items-center gap-3 italic">
                        <span className="w-1.5 h-6 bg-primary shadow-[0_0_15px_#A3FF00]"></span> HIGH_VALUE_SUBJECTS
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subjects.filter(s => s.kd > 2.5).slice(0, 3).map((player, idx) => (
                           <div key={idx} className={`bg-bg-dark border ${player.kd > 3.0 ? 'border-red-500/50' : 'border-white/5'} p-5 clip-corner-br relative overflow-hidden group hover:border-primary transition-all`}>
                              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.02] transition-opacity"></div>
                              {player.kd > 3.0 && <div className="absolute top-0 right-0 bg-red-600 text-white font-mono text-[7px] px-2 py-0.5 animate-pulse uppercase font-black">HVT_ALERT</div>}
                              <div className="flex justify-between items-start mb-6">
                                 <div>
                                    <p className="font-mono text-[9px] text-gray-600 uppercase">SUBJECT_ID</p>
                                    <h5 className="font-display font-black text-white text-lg italic tracking-tight truncate w-32">{player.tag}</h5>
                                 </div>
                                 <span className={`w-2 h-2 rounded-full ${player.status === 'ONLINE' ? 'bg-primary animate-pulse' : 'bg-gray-600'}`}></span>
                              </div>
                              <div className="flex justify-between items-end">
                                 <div>
                                    <p className="font-mono text-[8px] text-primary font-black uppercase">RANK: {player.rank}</p>
                                    <p className="font-display font-black text-white text-xl leading-none">{player.reputation * 10} PTS</p>
                                 </div>
                                 <button onClick={() => setActiveSubView('NEURAL_PROFILES')} className="material-symbols-outlined text-gray-700 hover:text-white transition-colors">monitoring</button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="xl:col-span-4 space-y-8">
                  <div className="bg-surface-dark border border-white/10 p-1 clip-corner-tl group relative overflow-hidden">
                     <div className="bg-bg-dark p-6 border border-white/5">
                        <p className="font-mono text-[8px] text-primary font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                           <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> LIVE_ARENA_FEED
                        </p>
                        <div className="relative h-40 mb-6 clip-btn overflow-hidden">
                           <img src={tournaments[0]?.image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-700" alt="" />
                           <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
                           <div className="absolute bottom-4 left-4">
                              <h4 className="font-display font-black text-white uppercase italic tracking-tighter">{tournaments[0]?.title}</h4>
                           </div>
                        </div>
                        <div className="space-y-4 font-mono text-[10px]">
                           <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-gray-500 uppercase">LEADING_PLAYER:</span>
                              <span className="text-white font-black">CYPHER_X</span>
                           </div>
                           <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-gray-500 uppercase">ACTIVE_SUJECTS:</span>
                              <span className="text-white font-black">32 / 32</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-gray-500 uppercase">PRIZE_POOL:</span>
                              <span className="text-primary font-black">$5,000</span>
                           </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-primary text-black font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:shadow-[0_0_15px_#A3FF00] transition-all">SYNC_BROADCAST</button>
                     </div>
                  </div>

                  <div className="bg-surface-dark border border-white/5 clip-corner-tl flex flex-col h-[300px]">
                     <div className="bg-black/60 px-6 py-3 border-b border-white/5 flex justify-between items-center">
                        <h4 className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.3em] font-black italic">ACTION_LOGGER</h4>
                        <span className="font-mono text-[8px] text-primary opacity-50">STREANING_V4.2</span>
                     </div>
                     <div className="flex-1 p-6 font-mono text-[10px] overflow-y-auto space-y-2 scrollbar-hide bg-black/20">
                        {logs.map((log, idx) => (
                          <p key={idx} className={`text-${log.color}`}>
                            <span className="text-gray-600">{log.type}</span> {log.msg}
                          </p>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'NEURAL_PROFILES':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 relative">
            {isScanning && (
              <div className="absolute inset-0 z-[100] bg-bg-dark/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300 overflow-hidden clip-hacker border border-primary/20">
                <div className="text-center space-y-6">
                   <div className="relative w-24 h-24 mx-auto mb-8">
                      <div className="absolute inset-0 border-2 border-primary animate-ping opacity-20"></div>
                      <div className="absolute inset-0 border border-primary animate-spin"></div>
                      <span className="material-symbols-outlined text-primary text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">wifi_tethering</span>
                   </div>
                   <h3 className="font-display font-black text-2xl text-white uppercase italic tracking-tighter glitch-text" data-text="SCANNING_ALL_NODES...">SCANNING_ALL_NODES...</h3>
                   <div className="w-64 h-1 bg-white/5 mx-auto relative overflow-hidden border border-white/10">
                      <div className="h-full bg-primary animate-[scan-progress_2s_ease-in-out_infinite] shadow-[0_0_15px_#A3FF00] w-1/3"></div>
                   </div>
                   <p className="font-mono text-[9px] text-primary uppercase tracking-[0.4em] font-black animate-pulse">RECALIBRATING_NEURAL_LINK</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-primary/5 border border-primary/20 p-6 clip-hacker relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-primary opacity-40">AUTO_SCAN: ACTIVE</div>
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 border-2 border-primary flex items-center justify-center relative bg-primary/10">
                    <span className="material-symbols-outlined text-primary animate-ping absolute">input</span>
                    <span className="material-symbols-outlined text-primary">input</span>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white uppercase italic tracking-tighter">[INYECCIÓN_SUJETO_DETECTADA]</h3>
                    <p className="font-mono text-[9px] text-primary uppercase tracking-[0.4em] font-black">Monitoreando nuevos enlaces neurales en el Sector_Omega...</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsAddSubjectModalOpen(true)} className="px-8 py-3 bg-secondary text-white font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:shadow-[0_0_20px_#D500F9] transition-all">
                    INYECTAR_SUJETO
                  </button>
                  <button onClick={handleForceSync} disabled={isScanning} className={`px-8 py-3 bg-primary text-black font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:shadow-[0_0_20px_#A3FF00] transition-all ${isScanning ? 'opacity-50 cursor-wait' : ''}`}>
                    {isScanning ? 'SCANNING...' : 'FORCE_SYNC_ALL'}
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
               <div className="lg:col-span-8 relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="font-mono text-primary font-black text-[10px] animate-pulse">>></span>
                    <span className="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors">terminal</span>
                  </div>
                  <input type="text" placeholder="COMANDO_BÚSQUEDA: QUERY_SUBJECT_BY_ID_OR_ALIAS_OR_UPLINK..." className="w-full bg-surface-dark border border-white/10 p-5 pl-24 text-[11px] font-mono text-white outline-none focus:border-primary clip-btn transition-all placeholder:text-gray-700 focus:bg-primary/5" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
               <div className="lg:col-span-4 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {['ALL', 'NOXKORE', 'KRYPTAX', 'SYNTHEX', 'RAVEX'].map(f => (
                    <button key={f} onClick={() => setFactionFilter(f)} className={`px-4 py-3 font-mono font-black text-[9px] uppercase tracking-widest clip-btn border transition-all whitespace-nowrap ${factionFilter === f ? 'bg-primary text-black border-primary' : 'bg-transparent text-gray-600 border-white/5 hover:border-white/20'}`}>
                      {f}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               {filteredSubjects.map(subject => {
                 const isHVT = subject.kd > 3.0;
                 const isUnstable = subject.syncRatio < 30;
                 const isOmega = subject.rank === 'OMEGA' || subject.clearance === 'OMEGA';
                 const isExtracting = extractingIds.has(subject.id);

                 return (
                   <div key={subject.id} className={`bg-surface-dark border ${isExtracting ? 'border-primary/60' : isHVT ? 'border-red-500/30' : 'border-white/5'} clip-hacker relative group overflow-hidden hover:border-primary/30 transition-all duration-500 ${isExtracting ? 'shadow-[0_0_30px_rgba(163,255,0,0.2)]' : ''}`}>
                      {isExtracting && (
                         <div className="absolute inset-0 z-50 bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
                            <div className="text-center w-full max-w-[240px] space-y-4">
                               <p className="font-mono text-[10px] text-primary font-black animate-pulse uppercase tracking-[0.3em]">LINKING_NEURAL_PATH...</p>
                               <div className="h-1 bg-white/5 w-full relative overflow-hidden clip-btn">
                                  <div className="h-full bg-primary shadow-[0_0_15px_#A3FF00] animate-[scan-progress_1.8s_ease-in-out_forwards]"></div>
                               </div>
                               <p className="font-mono text-[7px] text-gray-500 uppercase tracking-widest">EXTRACTION_ID: {subject.id}</p>
                            </div>
                         </div>
                      )}

                      <div className="absolute top-0 right-0 p-4 font-mono text-[7px] text-gray-800 pointer-events-none select-none text-right">
                         0x82_NODE_SYNC<br/>
                         ID_{subject.id.replace('#','')}<br/>
                         {isHVT ? <span className="text-red-600 font-black animate-pulse">THREAT: HIGH</span> : 'STATUS_OK'}
                      </div>

                      <div className="p-8 flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center gap-6 min-w-[140px]">
                           <div className={`relative p-1 ${isOmega ? 'bg-neon-gradient' : 'bg-gradient-to-tr from-primary/20 via-transparent to-primary/20'} clip-hacker group-hover:from-primary transition-all duration-700`}>
                              <img src={subject.avatar} className={`w-28 h-28 clip-hacker ${isExtracting ? 'animate-pulse' : isUnstable ? 'animate-pulse contrast-125 saturate-200' : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100'} transition-all duration-700`} alt="" />
                              <div className="absolute top-2 right-2 flex gap-1">
                                 <div className={`w-1.5 h-1.5 ${isHVT ? 'bg-red-500' : 'bg-primary'} animate-pulse`}></div>
                              </div>
                           </div>
                           <div className="w-full space-y-2">
                              <div className="flex justify-between text-[8px] font-mono font-black uppercase tracking-widest text-gray-500">
                                 <span>SYNC_RATIO</span>
                                 <span className={isUnstable ? 'text-red-500 animate-pulse' : 'text-primary'}>{subject.syncRatio}%</span>
                              </div>
                              <div className="h-1 bg-white/5 w-full clip-btn">
                                 <div className={`h-full ${isUnstable ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_10px_#A3FF00] transition-all duration-1000`} style={{ width: `${subject.syncRatio}%` }}></div>
                              </div>
                           </div>
                           <div className={`px-4 py-1.5 border font-mono text-[9px] font-black uppercase tracking-[0.3em] ${subject.status === 'LOCKED' ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-primary/20 text-primary bg-primary/5'}`}>
                              {isUnstable ? 'DISSOCIATING' : subject.status === 'LOCKED' ? 'BRAIN_DEAD' : subject.status}
                           </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between space-y-6 overflow-hidden">
                           <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 overflow-hidden">
                                 <p className="font-mono text-[8px] text-primary/40 uppercase mb-1">DOSSIER_TAG_0x001</p>
                                 <h4 className={`font-display font-black text-xl md:text-2xl uppercase italic tracking-tighter leading-none truncate ${isHVT ? 'text-red-500' : 'text-white'}`} title={subject.tag}>{subject.tag}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <p className="font-mono text-[9px] text-gray-400 lowercase tracking-widest italic">{subject.email}</p>
                                    <button onClick={() => navigator.clipboard.writeText(subject.email)} className="material-symbols-outlined text-[10px] text-gray-700 hover:text-primary transition-colors">content_copy</button>
                                 </div>
                                 <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-2">{subject.id} // SEC_DIV: {subject.faction}</p>
                              </div>
                              <div className="bg-black/40 border border-white/5 p-3 clip-btn shrink-0">
                                 <p className="font-mono text-[8px] text-gray-600 uppercase mb-2">AUTH_CLEARANCE</p>
                                 <select value={subject.clearance} onChange={(e) => updateClearance(subject.id, e.target.value as ClearanceLevel)} className={`bg-transparent ${isOmega ? 'text-secondary font-black animate-pulse' : 'text-primary'} font-mono text-[11px] font-black outline-none uppercase cursor-pointer`}>
                                    <option value="ALPHA">ALPHA_LVL</option>
                                    <option value="BETA">BETA_LVL</option>
                                    <option value="GAMMA">GAMMA_LVL</option>
                                    <option value="OMEGA">OMEGA_GOD</option>
                                 </select>
                              </div>
                           </div>

                           <div className={`grid grid-cols-3 gap-6 bg-black/20 p-4 border ${isOmega ? 'border-secondary/40 shadow-[inset_0_0_15px_rgba(213,0,249,0.1)]' : 'border-white/5'} relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
                              <div className="relative z-10">
                                 <p className="font-mono text-[8px] text-gray-500 uppercase mb-1">TACTICAL_RANK</p>
                                 <p className={`font-display font-black text-[11px] uppercase italic tracking-widest ${isOmega ? 'text-secondary' : 'text-white'}`}>{subject.rank}</p>
                              </div>
                              <div className="relative z-10">
                                 <p className="font-mono text-[8px] text-gray-500 uppercase mb-1">LETHAL_INDEX</p>
                                 <p className={`font-display font-black text-[11px] italic tracking-widest ${isHVT ? 'text-red-500' : 'text-primary'}`}>{subject.kd} K/D</p>
                              </div>
                              <div className="relative z-10">
                                 <p className="font-mono text-[8px] text-gray-500 uppercase mb-1">REPUTATION_LVL</p>
                                 <p className="font-display font-black text-secondary text-[11px] italic tracking-widest">{subject.reputation}%</p>
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <button 
                                onClick={() => handleNeuralExtraction(subject)} 
                                disabled={isExtracting}
                                className={`flex-1 py-4 border border-white/10 text-[9px] font-display font-black uppercase italic tracking-widest transition-all clip-btn flex items-center justify-center gap-2 ${isExtracting ? 'bg-primary/20 text-primary border-primary animate-pulse' : 'bg-white/5 text-white hover:bg-primary hover:text-black'}`}
                              >
                                 <span className="material-symbols-outlined text-sm">{isExtracting ? 'sync' : 'monitoring'}</span>
                                 {isExtracting ? 'SINC_EN_CURSO...' : 'NEURAL_EXTRACTION'}
                              </button>
                              <button onClick={() => toggleSubjectStatus(subject.id)} className={`px-8 py-4 border font-display font-black text-[9px] uppercase italic tracking-widest clip-btn transition-all ${subject.status === 'LOCKED' ? 'border-primary text-primary hover:bg-primary/10' : 'border-red-500/40 text-red-500 hover:bg-red-500/10'}`}>
                                 {subject.status === 'LOCKED' ? 'RE_SYNC_BRAIN' : 'FORCE_LOCKDOWN'}
                              </button>
                           </div>
                        </div>
                      </div>

                      <div className="h-1 bg-white/5 w-full flex">
                         <div className={`h-full ${isExtracting ? 'bg-primary' : isHVT ? 'bg-red-500/40' : 'bg-primary/40'} w-1/4`}></div>
                         <div className="h-full bg-secondary/40 w-1/2"></div>
                         <div className={`h-full ${isExtracting ? 'bg-primary' : isHVT ? 'bg-red-500/40' : 'bg-primary/40'} w-1/4`}></div>
                      </div>
                   </div>
                 );
               })}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="py-20 text-center border border-white/5 bg-surface-dark clip-hacker relative overflow-hidden group">
                 <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
                 <span className="material-symbols-outlined text-6xl text-gray-800 mb-6 group-hover:text-primary transition-colors duration-700">emergency_home</span>
                 <p className="font-display font-black text-2xl text-gray-700 uppercase italic tracking-tighter leading-none glitch-text" data-text="NODE_EMPTY: NO_SUBJECTS_SCRAPED">NODE_EMPTY: NO_SUBJECTS_SCRAPED</p>
                 <p className="font-mono text-[10px] text-gray-800 uppercase tracking-widest mt-6">Reinicie el comando de búsqueda o limpie el caché del terminal</p>
              </div>
            )}
            
            <style>{`
              @keyframes scan-progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
          </div>
        );

      case 'ARENA_OPERATIONS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <header className="flex justify-between items-center border-b border-white/5 pb-8">
              <div>
                <h2 className="font-display font-black text-4xl text-white uppercase italic tracking-tighter leading-none">ARENA_OPERATIONS</h2>
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.4em] mt-2 italic">Gestión de Desafíos Globales / Protocolo_0x82</p>
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-4 bg-primary text-black font-display font-black text-xs uppercase tracking-[0.2em] clip-btn hover:shadow-[0_0_25px_rgba(163,255,0,0.5)] transition-all">
                INYECTAR_ARENA
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tournaments.map(trn => (
                <div key={trn.id} className="bg-surface-dark border border-white/10 group overflow-hidden clip-corner-tl flex flex-col hover:border-primary/40 transition-all duration-500">
                  <div className="h-40 relative">
                    <img src={trn.image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="" />
                    <span className={`absolute top-4 left-4 px-3 py-1 text-[8px] font-black border uppercase tracking-widest ${trn.status === 'LIVE' ? 'text-primary border-primary bg-primary/5' : 'text-gray-400 border-white/10 bg-white/5'}`}>
                      {trn.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-display font-black text-lg text-white uppercase mb-4 italic tracking-tight">{trn.title}</h4>
                    <div className="space-y-2 mb-6 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                      <div className="flex justify-between"><span>Software:</span> <span className="text-white font-bold">{INITIAL_GAMES.find(g => g.id === trn.gameId)?.name}</span></div>
                      <div className="flex justify-between"><span>Sujetos:</span> <span className="text-white font-bold">{trn.currentParticipants} / {trn.maxParticipants}</span></div>
                      <div className="flex justify-between"><span>Premio:</span> <span className="text-primary font-bold shadow-primary">{trn.prize}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 border border-white/10 text-[9px] font-display font-black uppercase hover:bg-white/5 clip-btn transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">settings</span> CONFIG_SYS
                      </button>
                      <button className="w-12 h-12 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all clip-btn flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in zoom-in-95 duration-500">
            <span className="material-symbols-outlined text-8xl text-white/5 mb-6">terminal</span>
            <h2 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter opacity-20">SECTOR_EN_DESARROLLO</h2>
            <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mt-4">Protocolo {activeSubView} pendiente de sincronización</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-bg-dark text-gray-200 overflow-hidden relative selection:bg-primary selection:text-black">
      <aside className="w-72 bg-surface-dark border-r border-surface-border flex flex-col z-20 shadow-[10px_0_40px_rgba(0,0,0,0.5)]">
        <div className="h-24 flex items-center px-8 border-b border-surface-border bg-black/40">
          <div className="w-10 h-10 border-2 border-primary flex items-center justify-center -skew-x-12 mr-4 bg-primary/10">
            <span className="font-display font-black text-2xl text-primary italic leading-none">A</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-display font-black text-xl text-white tracking-tighter leading-none italic uppercase">ARKADEX</h1>
            <span className="font-mono text-[8px] text-primary uppercase font-bold tracking-[0.3em]">COMMAND_CENTER</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <div className="space-y-4">
            <p className="px-6 font-mono text-[8px] text-gray-600 uppercase tracking-[0.4em] font-black">ESTRATEGIA_MAESTRA</p>
            <div className="space-y-1">
              <NavLink icon="dashboard" label="Mainframe_Hub" active={activeSubView === 'MAINFRAME_HUB'} onClick={() => setActiveSubView('MAINFRAME_HUB')} />
              <NavLink icon="group" label="Neural_Profiles" active={activeSubView === 'NEURAL_PROFILES'} onClick={() => setActiveSubView('NEURAL_PROFILES')} />
              <NavLink icon="shield_person" label="Tactical_Squads" active={activeSubView === 'TACTICAL_SQUADS'} onClick={() => setActiveSubView('TACTICAL_SQUADS')} />
            </div>
          </div>

          <div className="space-y-4">
            <p className="px-6 font-mono text-[8px] text-gray-600 uppercase tracking-[0.4em] font-black">INFRAESTRUCTURA_CONTIENDA</p>
            <div className="space-y-1">
              <NavLink icon="emoji_events" label="Arena_Ops" active={activeSubView === 'ARENA_OPERATIONS'} onClick={() => setActiveSubView('ARENA_OPERATIONS')} />
              <NavLink icon="sports_esports" label="Virtual_Software" active={activeSubView === 'VIRTUAL_SOFTWARE'} onClick={() => setActiveSubView('VIRTUAL_SOFTWARE')} />
            </div>
          </div>

          <div className="space-y-4">
            <p className="px-6 font-mono text-[8px] text-gray-600 uppercase tracking-[0.4em] font-black">SEGURIDAD_Y_NUCLEO</p>
            <div className="space-y-1">
              <NavLink icon="verified_user" label="Clearance_Lvls" active={activeSubView === 'CLEARANCE_LEVELS'} onClick={() => setActiveSubView('CLEARANCE_LEVELS')} />
              <NavLink icon="settings_input_component" label="Core_Protocols" active={activeSubView === 'CORE_PROTOCOLS'} onClick={() => setActiveSubView('CORE_PROTOCOLS')} />
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-surface-border bg-black/20">
          <button onClick={onLogout} className="w-full flex items-center space-x-4 p-4 bg-bg-dark border border-white/5 clip-btn group hover:border-red-500 transition-all">
            <span className="material-symbols-outlined text-gray-600 group-hover:text-red-500 text-lg">logout</span>
            <span className="text-[10px] font-black text-gray-500 group-hover:text-white font-display uppercase tracking-widest">ABORT_SYSTEM</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-20 border-b border-surface-border flex items-center justify-between px-10 bg-surface-dark/40 backdrop-blur-xl z-20">
          <div className="flex items-center text-gray-600 text-[10px] font-display font-black uppercase tracking-widest italic">
            <span className="material-symbols-outlined text-sm mr-3 text-primary animate-pulse">terminal</span>
            ARKADEX_SYSTEM_0x82 / <span className="text-white ml-2 tracking-tighter">{activeSubView}</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2 font-mono text-[9px] text-gray-600">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
              CORE_SYNC: OPTIMAL
            </div>
            <div className="h-8 w-px bg-white/5 mx-2"></div>
            <button onClick={onProfile} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-primary transition-all clip-corner-tl group">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-xl">account_circle</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
          <div className="fixed inset-0 bg-cyber-grid opacity-[0.03] pointer-events-none z-0"></div>
          {renderViewContent()}
        </div>
      </main>

      {/* MODAL: CREAR ARENA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-dark/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-surface-dark border border-white/10 p-1 clip-corner-tl shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="bg-bg-dark p-10 border border-white/5 relative overflow-hidden">
              <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-all group">
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
              </button>
              <h3 className="font-display font-black text-2xl text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary shadow-[0_0_10px_#A3FF00]"></span> INYECTAR_ARENA_GLOBAL
              </h3>
              <div className="space-y-6">
                <AdminInput label="TÍTULO_DE_OPERACIÓN" placeholder="Ej: Cyber Winter Cup..." value={tournamentForm.title} onChange={(v: string) => setTournamentForm({...tournamentForm, title: v})} />
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">VIRTUAL_SOFTWARE</label>
                    <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={tournamentForm.gameId} onChange={e => setTournamentForm({...tournamentForm, gameId: e.target.value})}>
                      {INITIAL_GAMES.map(g => <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <AdminInput label="PREMIO_ESTIMADO" placeholder="Ej: $5,000..." value={tournamentForm.prize} onChange={(v: string) => setTournamentForm({...tournamentForm, prize: v})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <AdminInput label="FECHA_SINCRONÍA" placeholder="15 Dic 2024" value={tournamentForm.date} onChange={(v: string) => setTournamentForm({...tournamentForm, date: v})} />
                  <AdminInput label="LÍMITE_SUJETOS" type="number" value={tournamentForm.maxParticipants} onChange={(v: string) => setTournamentForm({...tournamentForm, maxParticipants: parseInt(v)})} />
                </div>
                <button onClick={handleCreateTournament} className="w-full py-5 bg-primary text-black font-display font-black text-xs uppercase tracking-widest clip-btn hover:shadow-[0_0_25px_rgba(163,255,0,0.5)] transition-all">SINC_ARENA_DATABASE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INYECTAR SUJETO (CREATE) */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-dark/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-surface-dark border border-white/10 p-1 clip-corner-tl shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="bg-bg-dark p-10 border border-white/5 relative overflow-hidden">
              <button onClick={() => setIsAddSubjectModalOpen(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-all group">
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
              </button>
              <h3 className="font-display font-black text-2xl text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary shadow-[0_0_10px_#A3FF00]"></span> INYECTAR_SUJETO_NEURAL
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminInput label="CODENAME_TAG" placeholder="Ej: GhostWalker_X" value={subjectForm.tag} onChange={(v: string) => setSubjectForm({...subjectForm, tag: v})} />
                  <AdminInput label="DIRECCIÓN_UPLINK_NEURAL" type="email" placeholder="trace@arkadex.net" value={subjectForm.email} onChange={(v: string) => setSubjectForm({...subjectForm, email: v})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">DIVISIÓN_FACCION</label>
                    <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={subjectForm.faction} onChange={e => setSubjectForm({...subjectForm, faction: e.target.value})}>
                      {['NOXKORE', 'KRYPTAX', 'SYNTHEX', 'RAVEX'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">RANGO_TACTICO</label>
                    <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={subjectForm.rank} onChange={e => setSubjectForm({...subjectForm, rank: e.target.value})}>
                      {['IRON', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'CHALLENGER', 'OMEGA'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <AdminInput label="LETHAL_INDEX (K/D)" type="number" step="0.1" value={subjectForm.kd} onChange={(v: string) => setSubjectForm({...subjectForm, kd: parseFloat(v)})} />
                  <AdminInput label="SYNC_RATIO_INITIAL (%)" type="number" value={subjectForm.syncRatio} onChange={(v: string) => setSubjectForm({...subjectForm, syncRatio: parseInt(v)})} />
                </div>
                <button onClick={handleCreateSubject} className="w-full py-5 bg-primary text-black font-display font-black text-xs uppercase tracking-widest clip-btn hover:shadow-[0_0_25px_rgba(163,255,0,0.5)] transition-all">INYECTAR_AL_MAINFRAME</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MODIFICAR CÓDIGO NEURAL (EDIT) */}
      {isEditSubjectModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-bg-dark/95 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="relative w-full max-w-2xl bg-surface-dark border border-secondary/40 p-1 clip-hacker shadow-[0_0_100px_rgba(213,0,249,0.2)]">
            <div className="bg-bg-dark p-10 border border-secondary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
              <button onClick={() => setIsEditSubjectModalOpen(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-all group z-10">
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
              </button>
              
              <div className="flex items-center gap-6 mb-10">
                 <div className="relative">
                    <img src={subjectForm.avatar} className="w-20 h-20 clip-hacker border border-secondary/40 brightness-75 group-hover:brightness-100 transition-all" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent"></div>
                 </div>
                 <div>
                    <h3 className="font-display font-black text-2xl text-white uppercase italic tracking-tighter flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-secondary shadow-[0_0_10px_#D500F9]"></span> MODIFICACIÓN_NEURAL: {subjectForm.tag}
                    </h3>
                    <p className="font-mono text-[9px] text-secondary uppercase tracking-[0.4em] font-black italic">ALTERANDO_CÓDIGO_FUENTE_IDENTIDAD_0x{subjectForm.id?.replace('#','')}</p>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminInput label="UPDATE_CODENAME" value={subjectForm.tag} onChange={(v: string) => setSubjectForm({...subjectForm, tag: v})} />
                  <AdminInput label="REWIRE_UPLINK" type="email" value={subjectForm.email} onChange={(v: string) => setSubjectForm({...subjectForm, email: v})} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">REASSIGN_FACTION</label>
                    <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-secondary clip-btn" value={subjectForm.faction} onChange={e => setSubjectForm({...subjectForm, faction: e.target.value})}>
                      {['NOXKORE', 'KRYPTAX', 'SYNTHEX', 'RAVEX'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">TACTICAL_RANK_OVERRIDE</label>
                    <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-secondary clip-btn" value={subjectForm.rank} onChange={e => setSubjectForm({...subjectForm, rank: e.target.value})}>
                      {['IRON', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'CHALLENGER', 'OMEGA'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <AdminInput label="LETHAL_INDEX_MOD (K/D)" type="number" step="0.1" value={subjectForm.kd} onChange={(v: string) => setSubjectForm({...subjectForm, kd: parseFloat(v)})} />
                  <div className="space-y-2">
                    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">AUTH_CLEARANCE_LVL</label>
                    <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-secondary clip-btn" value={subjectForm.clearance} onChange={e => setSubjectForm({...subjectForm, clearance: e.target.value as ClearanceLevel})}>
                      {['ALPHA', 'BETA', 'GAMMA', 'OMEGA'].map(l => <option key={l} value={l}>{l}_CLEARANCE</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                   <button onClick={() => setIsEditSubjectModalOpen(false)} className="flex-1 py-5 border border-white/10 text-gray-500 font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:text-white hover:bg-white/5 transition-all">
                      ABORT_MODIFICATION
                   </button>
                   <button onClick={handleUpdateSubject} className="flex-[2] py-5 bg-secondary text-white font-display font-black text-xs uppercase tracking-widest clip-btn hover:shadow-[0_0_25px_rgba(213,0,249,0.5)] transition-all flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined text-sm">settings_input_antenna</span>
                      REWRITE_NEURAL_CODE
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HubMetricCard = ({ label, value, trend, icon, color }: any) => (
  <div className={`bg-surface-dark border-l-4 border-${color} p-6 clip-corner-br hover:bg-white/5 transition-all group relative overflow-hidden backdrop-blur-sm`}>
     <div className="absolute top-0 right-0 p-2 opacity-5">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
     </div>
     <div className="flex justify-between items-start mb-4">
        <p className="text-[9px] text-gray-500 font-display font-black uppercase tracking-[0.3em] group-hover:text-gray-300 transition-colors">{label}</p>
        <span className={`material-symbols-outlined text-xl opacity-40 text-${color} group-hover:opacity-100 transition-all`}>{icon}</span>
     </div>
     <div className="flex items-end justify-between">
        <h3 className="font-display font-black text-3xl text-white tracking-tighter italic leading-none">{value}</h3>
        <span className={`font-mono text-[9px] ${trend === 'STABLE' || trend === 'SYNCED' || trend === 'OPTIMAL' || trend.startsWith('+') ? 'text-primary' : 'text-secondary'} font-bold`}>{trend}</span>
     </div>
  </div>
);

const NavLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-3.5 transition-all group relative ${active ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-[inset_-5px_0_15px_rgba(163,255,0,0.05)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
    <span className={`material-symbols-outlined text-xl transition-all ${active ? 'text-primary scale-110' : 'text-gray-600 group-hover:text-primary'}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-display italic leading-none">{label}</span>
  </button>
);

const AdminInput = ({ label, placeholder, value, onChange, type = "text", step, min, max }: any) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em] italic group-focus-within:text-primary transition-colors">{label}</label>
    <input 
      type={type} 
      step={step} 
      min={min}
      max={max}
      placeholder={placeholder} 
      className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn transition-all focus:bg-primary/5" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

export default AdminView;
