
export enum View {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN'
}

export interface Player {
  id: string;
  tag: string;
  level: number;
  rank: string;
  wins: number;
  reputation: number;
  faction: string;
  kd: number;
  hours: number;
  tournamentsWon: number;
  avatar: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  status: 'LIVE' | 'REGISTER' | 'DRAFT' | 'OPEN';
  participants: string;
  image: string;
}

export interface Match {
  id: string;
  result: 'VICTORY' | 'DEFEAT';
  game: string;
  mode: string;
  kda: string;
  date: string;
  points: number;
}
