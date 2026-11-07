export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export type CyclePhase = 'planejamento' | 'execucao' | 'conclusao';

export interface CycleTask {
  label: string;
  done: boolean;
}

export interface CycleInfo {
  phase: CyclePhase;
  phaseLabel: string;
  daysInPhase: number;
  totalDaysPlanned: number;
  description: string;
  tasks: CycleTask[];
}

export interface Story {
  id: string;
  user: User;
  hasNewUpdate: boolean;
  storyImage: string;
  milestone: string;
  journeyTitle: string;
  progress: number;
  timestamp: string;
  cycle: CycleInfo;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  user: User;
  category: string;
  image: string;
  milestone: string;
  journeyTitle: string;
  progress: number;
  goal: string;
  caption: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  timeAgo: string;
  comments: Comment[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  id: string;
  user: User;
  supportPoints: number;
  journeysCompleted: number;
  activeJourneys: number;
}
