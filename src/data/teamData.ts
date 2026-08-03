import { MeetEvent, SwimGroup, VolunteerShift, TeamRecord, CoachInfo } from '../types';

export const TEAM_INFO = {
  name: 'Peters Township Swim and Dive Team',
  abbreviation: 'PT Swim & Dive',
  mascot: 'Indians',
  colors: {
    primary: '#DC2626',
    secondary: '#000000',
    accent: '#EF4444',
  },
  homePool: {
    name: 'Peters Township Middle School and High School Pool',
    address: '121 Rolling Hills Drive, McMurray, PA 15317',
    features: 'Middle School and High School Competition Pool Natatorium',
    parking: 'Free parking available on school grounds near pool entrance',
  },
  contacts: {
    general: 'alexpetersswim@gmail.com',
    headCoach: 'alexpetersswim@gmail.com',
    president: 'alexpetersswim@gmail.com',
    volunteers: 'alexpetersswim@gmail.com',
    phone: 'Email Head Coach Alex Hardwick at alexpetersswim@gmail.com',
  },
  seasonDates: {
    fallWinter: '2026–2027 Season',
    tryouts: 'Planning underway for 2026-2027 season',
    suitFitNight: 'TBA',
    registrationDeadline: 'Interest forms available online',
  },
  interestForms: {
    grades7to8: 'https://forms.gle/RfBiDsoc6bQv9KNJ6',
    grades9to12: 'https://forms.gle/wg7QSi5B6b94koBW9',
    note: 'Completing the interest form does not commit your student to participating.',
  },
  sponsors: 'Coming Soon',
  volunteerPolicy: {
    requiredShifts: 0,
    description: 'Volunteer details for the 2026–2027 season will be announced prior to meets.',
    buyoutFee: 0,
  },
  weatherPolicy: 'Follows Peters Township School District event and facility guidelines.',
};

export const SWIM_GROUPS: SwimGroup[] = [
  {
    id: 'middle-school',
    name: 'Middle School Swim & Dive',
    ageRange: 'Grades 7–8',
    level: 'Intermediate',
    description: 'Middle School competitive swim and dive program competing in interscholastic meets and Section Championship events.',
    schedule: ['Schedule details available via Head Coach Alex Hardwick'],
    poolLocation: 'Peters Township Middle School & High School Pool',
    monthlyFee: 0,
    seasonFee: 0,
    requiredGear: ['Swimsuit', 'Goggles', 'Swim Cap'],
    prerequisites: 'Interest form available for students entering grades 7–8.',
    color: 'from-red-600 to-red-800',
  },
  {
    id: 'high-school',
    name: 'High School Swim & Dive',
    ageRange: 'Grades 9–12',
    level: 'Elite',
    description: 'High School varsity swim and dive program competing in WPIAL and PIAA interscholastic competition.',
    schedule: ['Schedule details available via Head Coach Alex Hardwick'],
    poolLocation: 'Peters Township Middle School & High School Pool',
    monthlyFee: 0,
    seasonFee: 0,
    requiredGear: ['Varsity Competition Gear', 'Goggles', 'Team Cap'],
    prerequisites: 'Interest form available for students entering grades 9–12.',
    color: 'from-black to-red-700',
  },
];

export const UPCOMING_MEETS: MeetEvent[] = [
  {
    id: 'meet-ms-1',
    title: 'Peters vs. Mt. Lebanon (Away)',
    date: 'September 15, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Mt. Lebanon Pool',
    isHome: false,
    address: '155 Cochran Rd, Pittsburgh, PA 15228',
    theme: 'Away Meet',
    spectatorPolicy: 'Spectators welcome. Check host school guidelines.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-2',
    title: 'Peters vs. Baldwin (Away)',
    date: 'September 17, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Baldwin High School Pool',
    isHome: false,
    address: '4653 Clairton Blvd, Pittsburgh, PA 15236',
    theme: 'Away Meet',
    spectatorPolicy: 'Spectators welcome.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-3',
    title: 'Peters vs. Upper St. Clair (Home)',
    date: 'September 22, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Peters Township Middle School and High School Pool',
    isHome: true,
    address: '121 Rolling Hills Drive, McMurray, PA 15317',
    theme: 'Home Meet',
    spectatorPolicy: 'Spectator balcony at 121 Rolling Hills Drive.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-4',
    title: 'Peters vs. Belle Vernon (Home)',
    date: 'September 24, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Peters Township Middle School and High School Pool',
    isHome: true,
    address: '121 Rolling Hills Drive, McMurray, PA 15317',
    theme: 'Home Meet',
    spectatorPolicy: 'Home meet at Peters Township Pool.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-5',
    title: 'Peters vs. Canon-Mac (Away)',
    date: 'September 29, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Canon-Mac Pool',
    isHome: false,
    address: '25 East College Street, Canonsburg, PA 15317',
    theme: 'Away Meet',
    spectatorPolicy: 'Spectators welcome at Canon-Mac.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-6',
    title: 'Peters vs. Bethel Park & Keystone Oaks (Home)',
    date: 'October 1, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Peters Township Middle School and High School Pool',
    isHome: true,
    address: '121 Rolling Hills Drive, McMurray, PA 15317',
    theme: 'Tri-Meet Home',
    spectatorPolicy: 'Home meet at Peters Township Pool.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-7',
    title: 'Peters vs. Elizabeth Forward (Away)',
    date: 'October 6, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Elizabeth Forward Pool',
    isHome: false,
    address: '1000 Weigles Hill Road, Elizabeth, PA 15037',
    theme: 'Away Meet',
    spectatorPolicy: 'Spectators welcome.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-8',
    title: 'Section Champs - Finals (Home)',
    date: 'October 8, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Peters Township Middle School and High School Pool',
    isHome: true,
    address: '121 Rolling Hills Drive, McMurray, PA 15317',
    theme: 'Championship Finals',
    spectatorPolicy: 'Home Section Championship Finals.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
  {
    id: 'meet-ms-9',
    title: 'All-Star Showcase @ Upper St. Clair',
    date: 'October 9, 2026',
    time: 'TBA',
    warmupTime: 'TBA',
    location: 'Upper St. Clair Pool',
    isHome: false,
    address: 'Upper St. Clair, PA',
    theme: 'All-Star Showcase',
    spectatorPolicy: 'Showcase Event.',
    status: 'Upcoming',
    heatSheetAvailable: false,
    jobsOpen: 0,
  },
];

export const INITIAL_VOLUNTEER_SHIFTS: VolunteerShift[] = [];

export const TEAM_RECORDS: TeamRecord[] = [];

export const COACHES: CoachInfo[] = [
  {
    name: 'Alex Hardwick',
    role: 'Head Coach',
    bio: 'Head Coach for Peters Township Swim and Dive Team. Leading interscholastic athletic growth, technical excellence, and team spirit.',
    email: 'alexpetersswim@gmail.com',
    experience: 'Head Coach',
    favoriteStroke: 'All Strokes',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
];

export const FREQUENT_QUESTIONS = [
  {
    question: "Where is the pool located?",
    answer: "The Peters Township Middle School and High School Pool is located at 121 Rolling Hills Drive, McMurray, PA 15317."
  },
  {
    question: "Who is the Head Coach and how can I contact them?",
    answer: "The Head Coach is Alex Hardwick. You can reach Coach Alex via email at alexpetersswim@gmail.com."
  },
  {
    question: "How do I express interest in joining the team for 2026-2027?",
    answer: "Interest forms are now open for the 2026-2027 season!\n- Entering Grades 7–8: https://forms.gle/RfBiDsoc6bQv9KNJ6\n- Entering Grades 9–12: https://forms.gle/wg7QSi5B6b94koBW9\nNote: Filling out the form does not commit your student to participating."
  },
  {
    question: "Where can I view the Middle School Meet Schedule?",
    answer: "The Middle School meet schedule includes matches against Mt. Lebanon (9/15), Baldwin (9/17), Upper St. Clair (9/22), Belle Vernon (9/24), Canon-Mac (9/29), Bethel Park/Keystone Oaks (10/1), Elizabeth Forward (10/6), Section Champs (10/8), and All-Star Showcase (10/9)."
  }
];


