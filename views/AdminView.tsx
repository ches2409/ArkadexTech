
import React, { useState, useMemo } from 'react';

interface Props {
  onLogout: () => void;
  onProfile: () => void;
}

type AdminSubView = 'DASHBOARD' | 'USERS' | 'TEAMS' | 'TOURNAMENTS' | 'GAMES' | 'ROLES' | 'SETTINGS';

// --- TIPOS DE DATOS ---

type GameStatus = 'ACTIVE' | 'ARCHIVED' | 'BETA';
interface AdminGame {
  id: string;
  name: string;
  genre: string;
  developer: string;
  status: GameStatus;
  activeTournaments: number;
  banner: string;
}

type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING' | 'SUSPENDED' | 'STAFF';
interface AdminUser {
  id: string;
  name: string;
  email: string;
  faction: string;
  status: UserStatus;
  lastLogin: string;
  level: number;
  avatar: string;
}

type TeamStatus = 'ACTIVE' | 'DISBANDED' | 'UNDER_REVIEW';
interface AdminTeam {
  id: string;
  name: string;
  tag: string;
  faction: string;
  captain: string;
  games: string[]; // IDs de juegos
  memberCount: number;
  minPlayers: number;
  maxPlayers: number;
  status: TeamStatus;
  winRate: string;
  logo: string;
}

type TournamentStatus = 'LIVE' | 'REGISTER' | 'DRAFT' | 'OPEN' | 'FINISHED';
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

// --- DATOS INICIALES ---

const INITIAL_GAMES: AdminGame[] = [
  { id: 'G-001', name: 'Valorant', genre: 'Tactical Shooter', developer: 'Riot Games', status: 'ACTIVE', activeTournaments: 12, banner: 'https://picsum.photos/seed/val/400/200' },
  { id: 'G-002', name: 'League of Legends', genre: 'MOBA', developer: 'Riot Games', status: 'ACTIVE', activeTournaments: 8, banner: 'https://picsum.photos/seed/lol/400/200' },
  { id: 'G-003', name: 'Apex Legends', genre: 'Battle Royale', developer: 'Respawn', status: 'ACTIVE', activeTournaments: 5, banner: 'https://picsum.photos/seed/apex/400/200' },
  { id: 'G-004', name: 'Counter-Strike 2', genre: 'Tactical Shooter', developer: 'Valve', status: 'BETA', activeTournaments: 3, banner: 'https://picsum.photos/seed/cs2/400/200' },
];

const INITIAL_USERS: AdminUser[] = [
  { id: 'ARK-001', name: 'KaosMaster99', email: 'kaos@arkadex.net', faction: 'Noxkore', status: 'STAFF', lastLogin: 'Hace 2h', level: 42, avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'ARK-002', name: 'VenomX_Pro', email: 'venom@arkadex.net', faction: 'Synthex', status: 'ACTIVE', lastLogin: 'Hace 5h', level: 38, avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'ARK-003', name: 'ShadowWalker', email: 'shadow@void.com', faction: 'None', status: 'BANNED', lastLogin: 'Hace 1d', level: 12, avatar: 'https://picsum.photos/seed/user3/100/100' },
];

const INITIAL_TEAMS: AdminTeam[] = [
  { id: 'TM-091', name: 'Shadow Strikers', tag: 'SHDW', faction: 'Noxkore', captain: 'KaosMaster99', games: ['G-001', 'G-004'], memberCount: 5, minPlayers: 5, maxPlayers: 12, status: 'ACTIVE', winRate: '68%', logo: 'https://picsum.photos/seed/t1/100/100' },
];

const INITIAL_TOURNAMENTS: AdminTournament[] = [
  { id: 'TRN-001', title: 'Cyber Winter Cup 2024', gameId: 'G-001', date: '2024-12-15', prize: '$5,000', status: 'LIVE', currentParticipants: 32, maxParticipants: 32, image: 'https://picsum.photos/seed/game1/400/250' },
];

const AdminView: React.FC<Props> = ({ onLogout, onProfile }) => {
  const [activeSubView, setActiveSubView] = useState<AdminSubView>('DASHBOARD');
  
  // States para Datos
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [teams, setTeams] = useState<AdminTeam[]>(INITIAL_TEAMS);
  const [tournaments, setTournaments] = useState<AdminTournament[]>(INITIAL_TOURNAMENTS);
  const [games, setGames] = useState<AdminGame[]>(INITIAL_GAMES);
  
  // Filtros Globales
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [factionFilter, setFactionFilter] = useState('ALL');
  const [genreFilter, setGenreFilter] = useState('ALL');
  const [gameFilter, setGameFilter] = useState('ALL');
  
  // --- MODALS STATES ---
  
  // Usuarios
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState<Partial<AdminUser>>({ name: '', email: '', faction: 'None' });
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userToPurge, setUserToPurge] = useState<AdminUser | null>(null);

  // Equipos
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState<Partial<AdminTeam>>({ name: '', tag: '', faction: 'None', captain: '', games: [], minPlayers: 5, maxPlayers: 10 });
  const [editingTeam, setEditingTeam] = useState<AdminTeam | null>(null);
  const [teamToPurge, setTeamToPurge] = useState<AdminTeam | null>(null);

  // Torneos
  const [isAddTrnModalOpen, setIsAddTrnModalOpen] = useState(false);
  const [isEditTrnModalOpen, setIsEditTrnModalOpen] = useState(false);
  const [isDeleteTrnModalOpen, setIsDeleteTrnModalOpen] = useState(false);
  const [trnForm, setTrnForm] = useState<Partial<AdminTournament>>({ title: '', gameId: 'G-001', prize: '', status: 'OPEN', date: '', maxParticipants: 32 });
  const [editingTrn, setEditingTrn] = useState<AdminTournament | null>(null);
  const [trnToPurge, setTrnToPurge] = useState<AdminTournament | null>(null);

  // Juegos
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
  const [isDeleteGameModalOpen, setIsDeleteGameModalOpen] = useState(false);
  const [gameForm, setGameForm] = useState<Partial<AdminGame>>({ name: '', genre: 'Tactical Shooter', developer: '', status: 'ACTIVE' });
  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);
  const [gameToPurge, setGameToPurge] = useState<AdminGame | null>(null);

  // --- LÓGICA DE FILTRADO ---

  const filteredUsers = useMemo(() => users.filter(u => 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'ALL' || u.status === statusFilter) &&
    (factionFilter === 'ALL' || u.faction === factionFilter)
  ), [users, searchTerm, statusFilter, factionFilter]);

  const filteredTeams = useMemo(() => teams.filter(t => 
    (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.tag.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'ALL' || t.status === statusFilter) &&
    (factionFilter === 'ALL' || t.faction === factionFilter)
  ), [teams, searchTerm, statusFilter, factionFilter]);

  const filteredTournaments = useMemo(() => tournaments.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || t.status === statusFilter) &&
    (gameFilter === 'ALL' || t.gameId === gameFilter)
  ), [tournaments, searchTerm, statusFilter, gameFilter]);

  const filteredGames = useMemo(() => games.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || g.status === statusFilter) &&
    (genreFilter === 'ALL' || g.genre === genreFilter)
  ), [games, searchTerm, statusFilter, genreFilter]);

  const uniqueGenres = useMemo(() => Array.from(new Set(games.map(g => g.genre))), [games]);

  // --- ACCIONES CRUD ---

  const handleCreate = (type: 'USER' | 'TEAM' | 'TRN' | 'GAME') => {
    switch(type) {
      case 'USER':
        const newUId = `ARK-${Math.floor(Math.random() * 900 + 100)}`;
        setUsers([{ id: newUId, name: userForm.name || 'Sujeto_Anonimo', email: userForm.email || 'n/a', faction: userForm.faction || 'None', status: 'ACTIVE', lastLogin: 'Justo ahora', level: 1, avatar: `https://picsum.photos/seed/${newUId}/100/100` }, ...users]);
        setIsAddUserModalOpen(false);
        setUserForm({ name: '', email: '', faction: 'None' });
        break;
      case 'TEAM':
        const newTId = `TM-${Math.floor(Math.random() * 900 + 100)}`;
        setTeams([{ id: newTId, name: teamForm.name || 'Escuadron_Delta', tag: (teamForm.tag || 'TAG').toUpperCase(), faction: teamForm.faction || 'None', captain: teamForm.captain || 'ARK-001', games: teamForm.games || [], memberCount: 1, minPlayers: teamForm.minPlayers || 5, maxPlayers: teamForm.maxPlayers || 10, status: 'ACTIVE', winRate: '0%', logo: `https://picsum.photos/seed/${newTId}/100/100` }, ...teams]);
        setIsAddTeamModalOpen(false);
        setTeamForm({ name: '', tag: '', faction: 'None', captain: '', games: [], minPlayers: 5, maxPlayers: 10 });
        break;
      case 'TRN':
        const newTrId = `TRN-${Math.floor(Math.random() * 900 + 100)}`;
        setTournaments([{ id: newTrId, title: trnForm.title || 'Arena_Nueva', gameId: trnForm.gameId || 'G-001', date: trnForm.date || 'Sin fecha', prize: trnForm.prize || '$0', status: (trnForm.status as TournamentStatus) || 'OPEN', currentParticipants: 0, maxParticipants: trnForm.maxParticipants || 32, image: `https://picsum.photos/seed/${newTrId}/400/250` }, ...tournaments]);
        setIsAddTrnModalOpen(false);
        setTrnForm({ title: '', gameId: 'G-001', prize: '', status: 'OPEN', date: '', maxParticipants: 32 });
        break;
      case 'GAME':
        const newGId = `G-${Math.floor(Math.random() * 900 + 100)}`;
        setGames([{ id: newGId, name: gameForm.name || 'Nuevo_Software', genre: gameForm.genre || 'Tactical Shooter', developer: gameForm.developer || 'Indie Dev', status: (gameForm.status as GameStatus) || 'ACTIVE', activeTournaments: 0, banner: `https://picsum.photos/seed/${newGId}/400/200` }, ...games]);
        setIsAddGameModalOpen(false);
        setGameForm({ name: '', genre: 'Tactical Shooter', developer: '', status: 'ACTIVE' });
        break;
    }
  };

  const handleUpdate = (type: 'USER' | 'TEAM' | 'TRN' | 'GAME') => {
    switch(type) {
      case 'USER':
        if (editingUser) setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setIsEditUserModalOpen(false);
        break;
      case 'TEAM':
        if (editingTeam) setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
        setIsEditTeamModalOpen(false);
        break;
      case 'TRN':
        if (editingTrn) setTournaments(tournaments.map(t => t.id === editingTrn.id ? editingTrn : t));
        setIsEditTrnModalOpen(false);
        break;
      case 'GAME':
        if (editingGame) setGames(games.map(g => g.id === editingGame.id ? editingGame : g));
        setIsEditGameModalOpen(false);
        break;
    }
  };

  const handleDelete = (type: 'USER' | 'TEAM' | 'TRN' | 'GAME') => {
    switch(type) {
      case 'USER':
        if (userToPurge) setUsers(users.filter(u => u.id !== userToPurge.id));
        setIsDeleteUserModalOpen(false);
        break;
      case 'TEAM':
        if (teamToPurge) setTeams(teams.filter(t => t.id !== teamToPurge.id));
        setIsDeleteTeamModalOpen(false);
        break;
      case 'TRN':
        if (trnToPurge) setTournaments(tournaments.filter(t => t.id !== trnToPurge.id));
        setIsDeleteTrnModalOpen(false);
        break;
      case 'GAME':
        if (gameToPurge) setGames(games.filter(g => g.id !== gameToPurge.id));
        setIsDeleteGameModalOpen(false);
        break;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': case 'LIVE': case 'STAFF': return 'text-primary border-primary/20 bg-primary/5 shadow-[0_0_8px_rgba(163,255,0,0.1)]';
      case 'BANNED': case 'DISBANDED': case 'FINISHED': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'BETA': case 'PENDING': case 'DRAFT': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
      case 'REGISTER': case 'OPEN': return 'text-secondary border-secondary/20 bg-secondary/5';
      default: return 'text-gray-500 border-white/5 bg-white/5';
    }
  };

  // --- RENDERING ---

  const renderContent = () => {
    switch (activeSubView) {
      case 'USERS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
               <div>
                  <h2 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary"></span> GESTIÓN_DE_SUJETOS
                  </h2>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-1">Directorio de Conciencias Sincronizadas</p>
               </div>
               <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <input type="text" placeholder="BUSCAR_ID_O_ALIAS..." className="flex-1 lg:w-64 bg-surface-dark border border-white/10 px-4 py-3 text-xs font-mono outline-none focus:border-primary clip-btn text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <button onClick={() => setIsAddUserModalOpen(true)} className="px-6 py-3 bg-primary text-black font-display font-black text-[10px] uppercase clip-btn hover:shadow-[0_0_15px_rgba(163,255,0,0.3)] transition-all">INYECTAR_SUJETO</button>
               </div>
            </header>
            <div className="bg-surface-dark border border-white/5 overflow-hidden clip-corner-tl backdrop-blur-md">
               <table className="w-full text-left">
                  <thead className="bg-white/5 font-display text-[10px] text-gray-400 uppercase tracking-widest">
                     <tr><th className="px-8 py-5">IDENTIDAD</th><th className="px-6 py-5">FACCIÓN</th><th className="px-6 py-5">NIVEL</th><th className="px-6 py-5">ESTADO</th><th className="px-8 py-5 text-right">ACCIONES</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filteredUsers.length > 0 ? filteredUsers.map(u => (
                        <tr key={u.id} className="group hover:bg-white/5 transition-all font-mono text-xs">
                           <td className="px-8 py-4 flex items-center gap-4">
                              <img src={u.avatar} className="w-10 h-10 border border-primary/20 clip-corner-br grayscale group-hover:grayscale-0 transition-all" alt="" />
                              <div><p className="text-white font-bold uppercase">{u.name}</p><p className="text-[10px] text-gray-500">{u.id}</p></div>
                           </td>
                           <td className="px-6 py-4 text-secondary">{u.faction}</td>
                           <td className="px-6 py-4 text-white">LVL_{u.level}</td>
                           <td className="px-6 py-4"><span className={`px-2 py-0.5 border text-[9px] font-black tracking-widest ${getStatusColorClass(u.status)}`}>{u.status}</span></td>
                           <td className="px-8 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setEditingUser({...u}); setIsEditUserModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-primary transition-colors">edit</button>
                                <button onClick={() => { setUserToPurge(u); setIsDeleteUserModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-red-500 transition-colors">delete</button>
                              </div>
                           </td>
                        </tr>
                     )) : <tr><td colSpan={5} className="py-20 text-center font-mono text-gray-600 uppercase tracking-widest">SIN_RESULTADOS_EN_BASE_DE_DATOS</td></tr>}
                  </tbody>
               </table>
            </div>
          </div>
        );
      case 'TEAMS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
               <div>
                  <h2 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="w-2 h-8 bg-secondary shadow-[0_0_10px_#D500F9]"></span> COMANDO_ESCUADRONES
                  </h2>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-1">Directorio de Unidades Tácticas Operativas</p>
               </div>
               <button onClick={() => setIsAddTeamModalOpen(true)} className="px-6 py-3 bg-secondary text-black font-display font-black text-[10px] uppercase clip-btn hover:shadow-[0_0_15px_rgba(213,0,249,0.3)] transition-all">RECLUTAR_ESCUADRA</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredTeams.length > 0 ? filteredTeams.map(team => (
                  <div key={team.id} className="bg-surface-dark/40 border border-white/10 p-6 clip-corner-tl group hover:border-secondary transition-all backdrop-blur-md relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity font-mono text-[8px] text-secondary">{team.id}</div>
                     <div className="flex items-center gap-5 mb-6">
                        <img src={team.logo} className="w-16 h-16 border-2 border-secondary/20 clip-corner-br grayscale group-hover:grayscale-0 transition-all" alt="" />
                        <div>
                           <h4 className="font-display font-black text-xl text-white uppercase italic tracking-tighter leading-tight">{team.name}</h4>
                           <p className="font-mono text-[10px] text-secondary font-bold">[{team.tag}]</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mb-6 text-[10px] font-mono">
                        <div className="bg-white/5 p-3 border-l-2 border-secondary/20"><p className="text-gray-500 uppercase mb-1">FACCIÓN_SINC</p><p className="text-white uppercase font-bold">{team.faction}</p></div>
                        <div className="bg-white/5 p-3 border-l-2 border-primary/20"><p className="text-gray-500 uppercase mb-1">WIN_RATE</p><p className="text-primary font-bold">{team.winRate}</p></div>
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[10px] text-gray-500 font-mono">CAPITÁN: <span className="text-white font-bold">{team.captain}</span></span>
                        <div className="flex gap-2">
                           <button onClick={() => { setEditingTeam({...team}); setIsEditTeamModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-secondary transition-colors">settings</button>
                           <button onClick={() => { setTeamToPurge(team); setIsDeleteTeamModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-red-500 transition-colors">delete</button>
                        </div>
                     </div>
                  </div>
               )) : <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 uppercase font-mono text-gray-600 italic tracking-[0.5em]">DATOS_NO_SINCRONIZADOS</div>}
            </div>
          </div>
        );
      case 'TOURNAMENTS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
               <div>
                  <h2 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary"></span> CENTRAL_ARENAS
                  </h2>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-1">Sincronizador de Circuitos de Combate Global</p>
               </div>
               <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <select className="bg-surface-dark border border-white/10 px-4 py-3 text-[10px] font-display font-bold uppercase text-gray-400 outline-none focus:border-primary clip-btn" value={gameFilter} onChange={e => setGameFilter(e.target.value)}>
                    <option value="ALL">JUEGO: TODOS</option>
                    {games.map(g => <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>)}
                  </select>
                  <button onClick={() => setIsAddTrnModalOpen(true)} className="px-6 py-3 bg-primary text-black font-display font-black text-[10px] uppercase clip-btn hover:shadow-[0_0_15px_rgba(163,255,0,0.3)] transition-all">GENERAR_ARENA</button>
               </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {filteredTournaments.length > 0 ? filteredTournaments.map(trn => (
                  <div key={trn.id} className="bg-surface-dark border border-white/10 group overflow-hidden clip-corner-tl flex flex-col backdrop-blur-md">
                     <div className="h-44 overflow-hidden relative">
                        <img src={trn.image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" alt="" />
                        <span className={`absolute top-4 left-4 px-3 py-1 text-[8px] font-black border uppercase tracking-widest ${getStatusColorClass(trn.status)}`}>{trn.status}</span>
                        <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 border border-white/10 font-mono text-[8px] text-primary">{trn.id}</div>
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                        <h4 className="font-display font-black text-xl text-white uppercase italic tracking-tighter mb-4 group-hover:text-primary transition-colors">{trn.title}</h4>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-white/5 p-3 border-l-2 border-primary/20">
                              <p className="text-[8px] text-gray-500 font-display font-black uppercase mb-1">PREMIO_POOL</p>
                              <p className="font-mono text-xs text-white font-bold">{trn.prize}</p>
                           </div>
                           <div className="bg-white/5 p-3 border-l-2 border-secondary/20">
                              <p className="text-[8px] text-gray-500 font-display font-black uppercase mb-1">FECHA_INICIO</p>
                              <p className="font-mono text-xs text-secondary font-bold">{trn.date}</p>
                           </div>
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-6 border-t border-white/5">
                           <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-gray-600 text-sm">sports_esports</span>
                              <span className="font-mono text-[9px] text-gray-500 uppercase">{games.find(g => g.id === trn.gameId)?.name || 'GENERIC'}</span>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => { setEditingTrn({...trn}); setIsEditTrnModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-primary transition-colors">edit</button>
                              <button onClick={() => { setTrnToPurge(trn); setIsDeleteTrnModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-red-500 transition-colors">delete</button>
                           </div>
                        </div>
                     </div>
                  </div>
               )) : <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 uppercase font-mono text-gray-600 italic tracking-[0.5em]">CIRCUITOS_NO_CARGADOS</div>}
            </div>
          </div>
        );
      case 'GAMES':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
               <div>
                  <h2 className="font-display font-black text-3xl text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="w-2 h-8 bg-secondary shadow-[0_0_10px_#D500F9]"></span> LIBRERÍA_MAINFRAME
                  </h2>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-1">Matriz de Disciplinas de Software Autorizadas</p>
               </div>
               <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <input type="text" placeholder="BUSCAR_SOFTWARE..." className="flex-1 lg:w-64 bg-surface-dark border border-white/10 px-4 py-3 text-xs font-mono outline-none focus:border-secondary clip-btn text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <select className="bg-surface-dark border border-white/10 px-4 py-3 text-[10px] font-display font-bold uppercase text-gray-400 outline-none focus:border-secondary clip-btn" value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                    <option value="ALL">GÉNERO: TODOS</option>
                    {uniqueGenres.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                  </select>
                  <button onClick={() => setIsAddGameModalOpen(true)} className="px-6 py-3 bg-secondary text-black font-display font-black text-[10px] uppercase clip-btn hover:shadow-[0_0_15px_rgba(213,0,249,0.3)] transition-all">INYECTAR_SOFTWARE</button>
               </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               {filteredGames.length > 0 ? filteredGames.map(game => (
                  <div key={game.id} className="bg-surface-dark border border-white/10 group overflow-hidden clip-btn relative flex flex-col backdrop-blur-md hover:border-secondary transition-all">
                     <div className="h-32 overflow-hidden relative">
                        <img src={game.banner} className="w-full h-full object-cover grayscale brightness-[0.25] group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 to-transparent"></div>
                        <div className="absolute top-2 right-2 font-mono text-[7px] text-secondary/40">{game.id}</div>
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-display font-black text-sm text-white uppercase italic mb-1 group-hover:text-secondary transition-colors tracking-tight">{game.name}</h4>
                        <p className="font-mono text-[8px] text-gray-600 uppercase mb-4 tracking-widest">{game.developer}</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                           <div className="bg-white/5 p-2 border-l border-secondary/20 text-[8px] font-mono">
                              <p className="text-gray-600 uppercase">GÉNERO</p>
                              <p className="text-white font-bold">{game.genre}</p>
                           </div>
                           <div className="bg-white/5 p-2 border-l border-primary/20 text-[8px] font-mono">
                              <p className="text-gray-600 uppercase">ARENAS</p>
                              <p className="text-primary font-bold">{game.activeTournaments} ACTIVAS</p>
                           </div>
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                           <span className={`px-2 py-0.5 border text-[7px] font-black tracking-[0.2em] ${getStatusColorClass(game.status)}`}>{game.status}</span>
                           <div className="flex gap-2">
                              <button onClick={() => { setEditingGame({...game}); setIsEditGameModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-secondary transition-colors text-sm">settings_input_composite</button>
                              <button onClick={() => { setGameToPurge(game); setIsDeleteGameModalOpen(true); }} className="material-symbols-outlined text-gray-600 hover:text-red-500 transition-colors text-sm">delete_sweep</button>
                           </div>
                        </div>
                     </div>
                  </div>
               )) : <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 uppercase font-mono text-gray-600 italic tracking-[0.5em]">SOFTWARE_NO_ENCONTRADO</div>}
            </div>
          </div>
        );
      case 'DASHBOARD':
      default:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <AdminStatCard label="Usuarios_Cargados" value={users.length} icon="groups" color="primary" />
               <AdminStatCard label="Escuadrones_Activos" value={teams.length} icon="shield" color="secondary" />
               <AdminStatCard label="Arenas_Sincronizadas" value={tournaments.length} icon="emoji_events" color="blue" />
               <AdminStatCard label="Software_Core" value={games.length} icon="sports_esports" color="orange" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-8">
                  <div className="bg-surface-dark border border-white/5 p-8 clip-corner-tl relative backdrop-blur-md">
                     <h3 className="font-display font-black text-lg text-white mb-8 uppercase flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary shadow-[0_0_8px_#A3FF00]"></span> LOG_GLOBAL_SISTEMA
                     </h3>
                     <div className="space-y-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                        <p className="flex gap-4 items-center group"><span className="text-primary group-hover:text-glow-primary transition-all">[OK]</span> Sincronización neural establecida con el nodo central {Math.floor(Math.random() * 9999)}.</p>
                        <p className="flex gap-4 items-center group"><span className="text-primary group-hover:text-glow-primary transition-all">[OK]</span> Base de datos de sujetos cargada correctamente ({users.length} sujetos).</p>
                        <p className="flex gap-4 items-center group"><span className="text-secondary animate-pulse">[!]</span> {teams.length} escuadrones detectados en la malla táctica operativa.</p>
                        <p className="flex gap-4 items-center group"><span className="text-primary group-hover:text-glow-primary transition-all">[OK]</span> Todas las arenas competitivas operando en latencia sub-milisegundo.</p>
                        <p className="flex gap-4 items-center group"><span className="text-orange-500 animate-pulse">[SYS]</span> Sincronización de librería de software completada ({games.length} títulos).</p>
                     </div>
                     <div className="absolute top-8 right-8 text-[10px] text-primary/20 font-mono animate-pulse">TERMINAL_ACTIVE_00x2</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-surface-dark border border-white/5 p-6 clip-btn hover:border-primary/20 transition-all">
                        <h4 className="font-display font-black text-xs text-gray-400 uppercase tracking-widest mb-6">Top_Disciplinas</h4>
                        <div className="space-y-4">
                           {games.slice(0, 3).map(g => (
                              <div key={g.id} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-display text-[9px] text-primary group-hover:text-glow-primary transition-all">{g.id.split('-')[1]}</div>
                                    <span className="font-mono text-xs text-white uppercase group-hover:text-primary transition-colors">{g.name}</span>
                                 </div>
                                 <span className="font-mono text-[10px] text-secondary">{g.activeTournaments} TRNS</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-surface-dark border border-white/5 p-6 clip-btn hover:border-secondary/20 transition-all">
                        <h4 className="font-display font-black text-xs text-gray-400 uppercase tracking-widest mb-6">Unidades_Recientes</h4>
                        <div className="space-y-4">
                           {teams.slice(0, 3).map(t => (
                              <div key={t.id} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3">
                                    <img src={t.logo} className="w-8 h-8 clip-corner-br grayscale group-hover:grayscale-0 transition-all" alt="" />
                                    <span className="font-mono text-xs text-white uppercase group-hover:text-secondary transition-colors">{t.name}</span>
                                 </div>
                                 <span className="font-mono text-[10px] text-primary font-bold">{t.tag}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 clip-corner-tl">
                     <h4 className="font-display font-black text-xs text-white uppercase mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">bolt</span> ACCIONES_RÁPIDAS
                     </h4>
                     <div className="space-y-3">
                        <button onClick={() => setIsAddTrnModalOpen(true)} className="w-full text-left p-4 bg-bg-dark border border-white/5 hover:border-primary transition-all group clip-btn flex items-center justify-between">
                           <span className="font-mono text-[10px] text-gray-500 uppercase group-hover:text-white">Nueva Arena</span>
                           <span className="material-symbols-outlined text-primary text-sm">add_circle</span>
                        </button>
                        <button onClick={() => setIsAddGameModalOpen(true)} className="w-full text-left p-4 bg-bg-dark border border-white/5 hover:border-secondary transition-all group clip-btn flex items-center justify-between">
                           <span className="font-mono text-[10px] text-gray-500 uppercase group-hover:text-white">Inyectar Software</span>
                           <span className="material-symbols-outlined text-secondary text-sm">developer_board</span>
                        </button>
                        <button className="w-full text-left p-4 bg-bg-dark border border-white/5 hover:border-blue-500 transition-all group clip-btn flex items-center justify-between">
                           <span className="font-mono text-[10px] text-gray-500 uppercase group-hover:text-white">Reportes Globales</span>
                           <span className="material-symbols-outlined text-blue-500 text-sm">analytics</span>
                        </button>
                     </div>
                  </div>
                  
                  <div className="bg-surface-dark border border-white/5 p-6 clip-btn">
                     <h4 className="font-display font-black text-[10px] text-gray-500 uppercase mb-4 tracking-widest">Estado_Del_Nodo</h4>
                     <div className="space-y-4 font-mono text-[9px] uppercase">
                        <div className="flex justify-between items-end mb-1">
                           <span className="text-gray-600">CARGA_NEURAL</span>
                           <span className="text-primary">42%</span>
                        </div>
                        <div className="h-1 bg-white/5 w-full">
                           <div className="h-full bg-primary shadow-[0_0_8px_#A3FF00] w-[42%] transition-all duration-1000"></div>
                        </div>
                        <div className="flex justify-between items-end mb-1 pt-2">
                           <span className="text-gray-600">ESTABILIDAD_CORE</span>
                           <span className="text-secondary">99.9%</span>
                        </div>
                        <div className="h-1 bg-white/5 w-full">
                           <div className="h-full bg-secondary shadow-[0_0_8px_#D500F9] w-[99.9%]"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-bg-dark text-gray-200 overflow-hidden relative selection:bg-primary selection:text-black">
      <div className="fixed inset-0 bg-cyber-grid opacity-5 pointer-events-none z-0"></div>
      
      {/* Sidebar */}
      <aside className="w-72 bg-surface-dark border-r border-surface-border flex flex-col z-20 shadow-[15px_0_50px_rgba(0,0,0,0.6)]">
         <div className="h-24 flex items-center px-8 border-b border-surface-border bg-black/20">
            <div className="w-10 h-10 border-2 border-primary flex items-center justify-center -skew-x-12 mr-4 bg-primary/5 shadow-[0_0_15px_rgba(163,255,0,0.2)]">
               <span className="font-display font-black text-2xl text-primary italic">A</span>
            </div>
            <div>
               <h1 className="font-display font-black text-xl text-white tracking-tighter leading-none italic uppercase">ARKADEX</h1>
               <span className="font-mono text-[8px] text-primary uppercase font-bold tracking-[0.3em]">ADMIN_CORE_v4.2</span>
            </div>
         </div>
         <nav className="flex-1 overflow-y-auto p-6 space-y-1 scrollbar-hide">
            <AdminNavLink icon="dashboard" label="Dashboard" active={activeSubView === 'DASHBOARD'} onClick={() => { setActiveSubView('DASHBOARD'); setSearchTerm(''); }} />
            <AdminNavLink icon="groups" label="Usuarios" active={activeSubView === 'USERS'} onClick={() => { setActiveSubView('USERS'); setSearchTerm(''); setStatusFilter('ALL'); }} />
            <AdminNavLink icon="shield_person" label="Equipos" active={activeSubView === 'TEAMS'} onClick={() => { setActiveSubView('TEAMS'); setSearchTerm(''); setStatusFilter('ALL'); }} />
            <AdminNavLink icon="emoji_events" label="Torneos" active={activeSubView === 'TOURNAMENTS'} onClick={() => { setActiveSubView('TOURNAMENTS'); setSearchTerm(''); setStatusFilter('ALL'); setGameFilter('ALL'); }} />
            <AdminNavLink icon="sports_esports" label="Juegos" active={activeSubView === 'GAMES'} onClick={() => { setActiveSubView('GAMES'); setSearchTerm(''); setStatusFilter('ALL'); setGenreFilter('ALL'); }} />
            <AdminNavLink icon="admin_panel_settings" label="Roles" active={activeSubView === 'ROLES'} onClick={() => setActiveSubView('ROLES')} />
            <AdminNavLink icon="settings" label="Config_Core" active={activeSubView === 'SETTINGS'} onClick={() => setActiveSubView('SETTINGS')} />
         </nav>
         <div className="p-6 border-t border-surface-border bg-black/40">
            <button onClick={onLogout} className="w-full flex items-center space-x-4 p-4 bg-bg-dark border border-white/5 clip-btn group hover:border-red-500 transition-all">
               <span className="material-symbols-outlined text-gray-600 group-hover:text-red-500 text-lg">logout</span>
               <span className="text-[10px] font-black text-gray-500 group-hover:text-white font-display uppercase italic tracking-widest">EXIT_CORE</span>
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
         <header className="h-20 border-b border-surface-border flex items-center justify-between px-10 bg-surface-dark/40 backdrop-blur-xl z-10">
            <div className="flex items-center text-gray-600 text-[10px] font-display font-black uppercase tracking-widest italic">
               <span className="material-symbols-outlined text-sm mr-3 text-primary animate-pulse">terminal</span>
               ARKADEX_SYSTEM / <span className="text-white ml-2 tracking-tighter shadow-primary">{activeSubView}</span>
            </div>
            <div className="flex items-center space-x-6">
               <div className="flex items-center gap-2 font-mono text-[9px] text-gray-600">
                  <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  SYNC_STATUS: OPTIMAL
               </div>
               <div className="h-8 w-px bg-white/5 mx-2"></div>
               <button onClick={onProfile} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-primary transition-all clip-corner-tl group">
                 <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-xl">account_circle</span>
               </button>
            </div>
         </header>
         <div className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
            {renderContent()}
         </div>
      </main>

      {/* --- MODALES CONSOLIDADOS --- */}
      
      {/* Usuarios */}
      {isAddUserModalOpen && (
        <AdminModal title="INYECTAR_SUJETO_NEURAL" onClose={() => setIsAddUserModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleCreate('USER'); }}>
            <AdminInput label="CODENAME_SINC" placeholder="Ej: KaosZero..." value={userForm.name} onChange={v => setUserForm({...userForm, name: v})} />
            <AdminInput label="EMAIL_PROTOCOL" placeholder="user@arkadex.net" type="email" value={userForm.email} onChange={v => setUserForm({...userForm, email: v})} />
            <div className="space-y-2">
              <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-widest italic">AFINIDAD_FACCIÓN</label>
              <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={userForm.faction} onChange={e => setUserForm({...userForm, faction: e.target.value})}>
                <option value="None">Sin Facción</option><option value="Noxkore">Noxkore</option><option value="Synthex">Synthex</option><option value="Kryptax">Kryptax</option><option value="Ravex">Ravex</option>
              </select>
            </div>
            <button className="w-full py-5 bg-primary text-black font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:shadow-[0_0_20px_rgba(163,255,0,0.4)] transition-all">SINC_SUJETO_DB</button>
          </form>
        </AdminModal>
      )}

      {isEditUserModalOpen && editingUser && (
        <AdminModal title="RECONFIGURAR_SUJETO" onClose={() => setIsEditUserModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleUpdate('USER'); }}>
            <AdminInput label="ALIAS_CORE" value={editingUser.name} onChange={v => setEditingUser({...editingUser, name: v})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-display font-black text-gray-500 uppercase">ESTADO_NEURAL</label>
                <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as UserStatus})}>
                   <option value="ACTIVE">ACTIVE</option><option value="STAFF">STAFF</option><option value="SUSPENDED">SUSPENDED</option><option value="BANNED">BANNED</option>
                </select>
              </div>
              <AdminInput label="NIVEL_SINC" type="number" value={editingUser.level} onChange={v => setEditingUser({...editingUser, level: parseInt(v)})} />
            </div>
            <button className="w-full py-5 bg-primary text-black font-display font-black text-[10px] uppercase clip-btn">APLICAR_CAMBIOS</button>
          </form>
        </AdminModal>
      )}

      {/* Equipos */}
      {isAddTeamModalOpen && (
        <AdminModal title="RECLUTAR_ESCUADRÓN_TACTICO" onClose={() => setIsAddTeamModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleCreate('TEAM'); }}>
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="ALIAS_UNIDAD" placeholder="Delta Squad..." value={teamForm.name} onChange={v => setTeamForm({...teamForm, name: v})} />
              <AdminInput label="TAG_IDENT" placeholder="TAGX" value={teamForm.tag} onChange={v => setTeamForm({...teamForm, tag: v})} />
            </div>
            <AdminInput label="ID_CAPITÁN_ASIGNADO" placeholder="ARK-001..." value={teamForm.captain} onChange={v => setTeamForm({...teamForm, captain: v})} />
            <button className="w-full py-5 bg-secondary text-black font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:shadow-[0_0_20px_rgba(213,0,249,0.4)] transition-all">REGISTRAR_UNIDAD</button>
          </form>
        </AdminModal>
      )}

      {isEditTeamModalOpen && editingTeam && (
        <AdminModal title="CONFIG_ESCUADRÓN" onClose={() => setIsEditTeamModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleUpdate('TEAM'); }}>
            <AdminInput label="ALIAS_UNIDAD" value={editingTeam.name} onChange={v => setEditingTeam({...editingTeam, name: v})} />
            <div className="grid grid-cols-2 gap-4">
               <AdminInput label="MIN_SUJETOS" type="number" value={editingTeam.minPlayers} onChange={v => setEditingTeam({...editingTeam, minPlayers: parseInt(v)})} />
               <AdminInput label="MAX_SUJETOS" type="number" value={editingTeam.maxPlayers} onChange={v => setEditingTeam({...editingTeam, maxPlayers: parseInt(v)})} />
            </div>
            <button className="w-full py-5 bg-secondary text-black font-display font-black text-[10px] uppercase clip-btn">ACTUALIZAR_PROTOCOLO</button>
          </form>
        </AdminModal>
      )}

      {/* Torneos */}
      {isAddTrnModalOpen && (
        <AdminModal title="GENERAR_ARENA_GLOBAL" onClose={() => setIsAddTrnModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleCreate('TRN'); }}>
            <AdminInput label="TÍTULO_ARENA" placeholder="Cyber Cup 2024..." value={trnForm.title} onChange={v => setTrnForm({...trnForm, title: v})} />
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-display font-black text-gray-500 uppercase">DISCIPLINA_MAINFRAME</label>
                  <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={trnForm.gameId} onChange={e => setTrnForm({...trnForm, gameId: e.target.value})}>
                    {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
               </div>
               <AdminInput label="FECHA_SINC" type="date" value={trnForm.date} onChange={v => setTrnForm({...trnForm, date: v})} />
            </div>
            <AdminInput label="PREMIO_ESTIMADO" placeholder="$5,000..." value={trnForm.prize} onChange={v => setTrnForm({...trnForm, prize: v})} />
            <button className="w-full py-5 bg-primary text-black font-display font-black text-[10px] uppercase clip-btn">ACTIVAR_CIRCUITO</button>
          </form>
        </AdminModal>
      )}

      {isEditTrnModalOpen && editingTrn && (
        <AdminModal title="RECONFIG_ARENA" onClose={() => setIsEditTrnModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleUpdate('TRN'); }}>
            <AdminInput label="TÍTULO_CIRCUITO" value={editingTrn.title} onChange={v => setEditingTrn({...editingTrn, title: v})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-display font-black text-gray-500 uppercase">ESTADO_OPERATIVO</label>
                <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn" value={editingTrn.status} onChange={e => setEditingTrn({...editingTrn, status: e.target.value as TournamentStatus})}>
                   <option value="DRAFT">DRAFT</option><option value="OPEN">OPEN</option><option value="REGISTER">REGISTER</option><option value="LIVE">LIVE</option><option value="FINISHED">FINISHED</option>
                </select>
              </div>
              <AdminInput label="MAX_SUJETOS" type="number" value={editingTrn.maxParticipants} onChange={v => setEditingTrn({...editingTrn, maxParticipants: parseInt(v)})} />
            </div>
            <button className="w-full py-5 bg-primary text-black font-display font-black text-[10px] uppercase clip-btn">SINC_CAMBIOS</button>
          </form>
        </AdminModal>
      )}

      {/* Juegos */}
      {isAddGameModalOpen && (
        <AdminModal title="INYECTAR_SOFTWARE_CORE" onClose={() => setIsAddGameModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleCreate('GAME'); }}>
            <AdminInput label="NOMBRE_SOFTWARE" placeholder="Ej: Valorant..." value={gameForm.name} onChange={v => setGameForm({...gameForm, name: v})} />
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-display font-black text-gray-500 uppercase italic">GÉNERO_DISCIPLINA</label>
                  <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-secondary clip-btn" value={gameForm.genre} onChange={e => setGameForm({...gameForm, genre: e.target.value})}>
                    <option value="Tactical Shooter">Tactical Shooter</option><option value="MOBA">MOBA</option><option value="Battle Royale">Battle Royale</option><option value="Fighting">Fighting</option><option value="RPG">RPG</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-display font-black text-gray-500 uppercase italic">ESTADO_INICIAL</label>
                  <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-secondary clip-btn" value={gameForm.status} onChange={e => setGameForm({...gameForm, status: e.target.value as GameStatus})}>
                    <option value="ACTIVE">ACTIVE</option><option value="BETA">BETA</option><option value="ARCHIVED">ARCHIVED</option>
                  </select>
               </div>
            </div>
            <AdminInput label="ESTUDIO_DESARROLLADOR" placeholder="Riot Games, Blizzard..." value={gameForm.developer} onChange={v => setGameForm({...gameForm, developer: v})} />
            <button className="w-full py-5 bg-secondary text-black font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:shadow-[0_0_20px_rgba(213,0,249,0.4)] transition-all">INYECTAR_EN_MAINFRAME</button>
          </form>
        </AdminModal>
      )}

      {isEditGameModalOpen && editingGame && (
        <AdminModal title="RECONFIG_DISCIPLINA" onClose={() => setIsEditGameModalOpen(false)}>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleUpdate('GAME'); }}>
            <AdminInput label="NOMBRE_SOFTWARE" value={editingGame.name} onChange={v => setEditingGame({...editingGame, name: v})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-display font-black text-gray-500 uppercase">ESTADO_OPERATIVO</label>
                <select className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-secondary clip-btn" value={editingGame.status} onChange={e => setEditingGame({...editingGame, status: e.target.value as GameStatus})}>
                   <option value="ACTIVE">ACTIVE</option><option value="BETA">BETA</option><option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <AdminInput label="ARENAS_LINK" type="number" value={editingGame.activeTournaments} onChange={v => setEditingGame({...editingGame, activeTournaments: parseInt(v)})} />
            </div>
            <button className="w-full py-5 bg-secondary text-black font-display font-black text-[10px] uppercase clip-btn">SINC_CORE_SOFTWARE</button>
          </form>
        </AdminModal>
      )}

      {/* Modales de Eliminación (Purgas) */}
      {isDeleteUserModalOpen && userToPurge && (
        <DeleteConfirmModal 
          title="PURGAR_SUJETO" 
          message={`¿Confirmas la eliminación permanente del sujeto ${userToPurge.name} (${userToPurge.id})? Esta acción no se puede deshacer.`} 
          onConfirm={() => handleDelete('USER')} 
          onCancel={() => setIsDeleteUserModalOpen(false)} 
        />
      )}
      {isDeleteTeamModalOpen && teamToPurge && (
        <DeleteConfirmModal 
          title="DESARTICULAR_ESCUADRÓN" 
          message={`¿Confirmas la purga de la unidad ${teamToPurge.name}? Los miembros perderán su sincronización táctica.`} 
          onConfirm={() => handleDelete('TEAM')} 
          onCancel={() => setIsDeleteTeamModalOpen(false)} 
        />
      )}
      {isDeleteTrnModalOpen && trnToPurge && (
        <DeleteConfirmModal 
          title="TERMINAR_CIRCUITO" 
          message={`¿Confirmas la purga permanente de la arena ${trnToPurge.title}? Todos los datos de brackets se perderán.`} 
          onConfirm={() => handleDelete('TRN')} 
          onCancel={() => setIsDeleteTrnModalOpen(false)} 
        />
      )}
      {isDeleteGameModalOpen && gameToPurge && (
        <DeleteConfirmModal 
          title="DESVINCULAR_SOFTWARE" 
          message={`¿Confirmas la eliminación del juego ${gameToPurge.name} del mainframe? Las arenas vinculadas quedarán huérfanas.`} 
          onConfirm={() => handleDelete('GAME')} 
          onCancel={() => setIsDeleteGameModalOpen(false)} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTES AUXILIARES ---

const AdminNavLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 transition-all group relative ${active ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-[inset_-5px_0_15px_rgba(163,255,0,0.05)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
     <span className={`material-symbols-outlined text-xl transition-all ${active ? 'text-primary scale-110' : 'text-gray-600 group-hover:text-primary'}`}>{icon}</span>
     <span className="text-[11px] font-black uppercase tracking-[0.2em] font-display italic leading-none">{label}</span>
  </button>
);

const AdminStatCard = ({ label, value, icon, color }: any) => (
  <div className={`bg-surface-dark/40 border-l-4 p-6 clip-corner-br hover:bg-white/5 transition-all border-${color} backdrop-blur-md group`}>
     <div className="flex justify-between items-start mb-4">
        <p className="text-[9px] text-gray-500 font-display font-black uppercase tracking-[0.3em] group-hover:text-gray-400 transition-colors">{label}</p>
        <span className={`material-symbols-outlined text-xl opacity-20 text-${color} group-hover:opacity-100 transition-all`}>{icon}</span>
     </div>
     <h3 className="font-display font-black text-3xl text-white tracking-tighter shadow-primary">{value}</h3>
  </div>
);

const AdminModal = ({ title, onClose, children }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-dark/95 backdrop-blur-md animate-in fade-in duration-300">
    <div className="relative w-full max-w-xl bg-surface-dark border border-white/10 p-1 clip-corner-tl animate-in zoom-in-95 duration-300 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      <div className="bg-bg-dark p-10 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none font-mono text-[8px] leading-none select-none">ARKADEX_MODAL_PROTOCOL_ARKADEX_MODAL_PROTOCOL</div>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-all group">
           <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
        </button>
        <h3 className="font-display font-black text-2xl text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
           <span className="w-1.5 h-6 bg-primary"></span> {title}
        </h3>
        {children}
      </div>
    </div>
  </div>
);

const AdminInput = ({ label, placeholder, value, onChange, type = "text" }: any) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-display font-black text-gray-500 uppercase tracking-[0.3em] italic group-focus-within:text-primary transition-colors">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full bg-surface-dark border border-white/10 p-4 text-xs font-mono text-white outline-none focus:border-primary clip-btn transition-all focus:bg-primary/5" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }: any) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-red-950/20 backdrop-blur-md animate-in fade-in duration-300">
     <div className="bg-bg-dark border border-red-500/30 p-8 max-w-sm w-full text-center clip-corner-tl relative shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
           <span className="material-symbols-outlined text-red-500 text-3xl animate-pulse">warning</span>
        </div>
        <h4 className="font-display font-black text-xl text-white uppercase italic tracking-tighter mb-4">{title}</h4>
        <p className="font-mono text-[10px] text-gray-500 uppercase leading-relaxed mb-8">{message}</p>
        <div className="space-y-3">
           <button onClick={onConfirm} className="w-full py-4 bg-red-600 text-white font-display font-black text-[10px] uppercase tracking-widest clip-btn hover:bg-red-500 transition-all">CONFIRMAR_PURGA</button>
           <button onClick={onCancel} className="w-full py-4 border border-white/10 text-gray-600 font-display font-black text-[10px] uppercase tracking-widest hover:text-white transition-all clip-btn">ABORTAR</button>
        </div>
     </div>
  </div>
);

export default AdminView;
