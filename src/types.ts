export interface MeetEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  warmupTime: string;
  location: string;
  isHome: boolean;
  address: string;
  theme: string;
  spectatorPolicy: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  heatSheetAvailable: boolean;
  jobsOpen: number;
}

export interface SwimGroup {
  id: string;
  name: string;
  ageRange: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Elite';
  description: string;
  schedule: string[];
  poolLocation: string;
  monthlyFee: number;
  seasonFee: number;
  requiredGear: string[];
  prerequisites: string;
  color: string;
}

export interface VolunteerShift {
  id: string;
  meetId: string;
  meetTitle: string;
  date: string;
  role: 'Lane Timer' | 'Head Timer' | 'Stroke & Turn Official' | 'Hospitality' | 'Concessions' | 'Scorekeeper / Console' | 'Clerk of Course';
  timeSlot: string;
  credits: number; // shifts count towards 3 requirement
  totalSpots: number;
  filledSpots: number;
  claimedBy: string[]; // parent names
}

export interface TeamRecord {
  event: string;
  ageGroup: string;
  swimmer: string;
  time: string;
  year: string;
  gender: 'Boys' | 'Girls';
}

export interface CoachInfo {
  name: string;
  role: string;
  bio: string;
  email: string;
  experience: string;
  favoriteStroke: string;
  image: string;
}

export interface SplashChatMessage {
  id: string;
  sender: 'user' | 'splash';
  text: string;
  timestamp: string;
  suggestedFollowups?: string[];
  referenceCategory?: string;
}

export interface SwimmerGroupQuizResult {
  recommendedGroup: string;
  reason: string;
}
