
import { Player, Tournament, Match } from './types';

export const MOCK_PLAYER: Player = {
  id: '#8291',
  tag: 'KaosMaster99',
  level: 42,
  rank: 'Diamond II',
  wins: 1248,
  reputation: 98,
  faction: 'Noxkore',
  kd: 2.84,
  hours: 842,
  tournamentsWon: 14,
  avatar: 'https://picsum.photos/seed/arkadex-user/200/200'
};

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    title: 'Cyber Winter Cup 2024',
    game: 'Valorant 5v5',
    date: '12 Nov - 15 Nov',
    prize: '$5,000',
    status: 'LIVE',
    participants: '32/32',
    image: 'https://picsum.photos/seed/game1/400/250'
  },
  {
    id: '2',
    title: 'Neon Blitz Series',
    game: 'Apex Legends Trios',
    date: '22 Nov',
    prize: '15,000 Pts',
    status: 'REGISTER',
    participants: 'Roster Completo',
    image: 'https://picsum.photos/seed/game2/400/250'
  },
  {
    id: '3',
    title: 'Midnight Showdown',
    game: 'CS:GO',
    date: '01 Dic',
    prize: '$1,000',
    status: 'OPEN',
    participants: '12/32',
    image: 'https://picsum.photos/seed/game3/400/250'
  }
];

export const MOCK_MATCHES: Match[] = [
  { id: 'm1', result: 'VICTORY', game: 'Valorant', mode: 'Competitive 5v5', kda: '18 / 6 / 4', date: 'Hace 2 horas', points: 24 },
  { id: 'm2', result: 'DEFEAT', game: 'Valorant', mode: 'Competitive 5v5', kda: '12 / 14 / 8', date: 'Ayer', points: -18 },
  { id: 'm3', result: 'VICTORY', game: 'Apex Legends', mode: 'Trios Ranked', kda: '5 Kills', date: '10 Nov', points: 120 },
];
