export interface WorkExEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  type: 'founder' | 'engineer' | 'consultant';
  bullets: string[];
  skills: string[];
  current?: boolean;
}

export const workex: WorkExEntry[] = [
  {
    id: 'powerplay-2025',
    company: 'Powerplay',
    role: 'Founding Team Member — Engineering & AI',
    period: 'Oct 2025 – Present',
    duration: '8 months',
    location: 'Bengaluru, India',
    type: 'engineer',
    current: true,
    bullets: [
      'Rejoined as Tech Generalist — working across backend, frontend, iOS, and Android.',
      'Leading AI automation initiatives, positioning Powerplay as an AI-native construction platform.',
      'Part of a team that launched India\'s first AI Workforce for Construction, serving 40,000+ contractors.',
    ],
    skills: ['AI Agents', 'Full-Stack', 'React', 'Node.js', 'iOS', 'Android'],
  },
  {
    id: 'vignam',
    company: 'Vignam',
    role: 'Founder',
    period: 'Jul 2022 – Sep 2025',
    duration: '3 years 3 months',
    location: 'Delhi, India',
    type: 'founder',
    bullets: [
      'Solo founder — scaled to a $1M valuation and a 20+ member team from zero.',
      'Built an AI-powered 3D interactive education platform using Three.js and Unity; cut TTI by 50% and bundle size by 30%.',
      'Engineered a WebRTC/Node.js live video platform handling 200+ concurrent users at <200ms latency.',
      'Built a RAG search API using LLMs and vector databases for 3D simulation recommendations.',
      'Scaled Node.js API to lakhs of users via PM2 clustering at 99.99% uptime.',
      'Orchestrated a zero-downtime 2TB+ live database migration with 100% data integrity.',
    ],
    skills: ['Three.js', 'Unity', 'React', 'Node.js', 'WebRTC', 'Python', 'LLMs', 'AWS', 'RAG'],
  },
  {
    id: 'powerplay-2020',
    company: 'Powerplay',
    role: 'Founding Engineer',
    period: 'Apr 2020 – Jul 2022',
    duration: '2 years 4 months',
    location: 'Bengaluru, India',
    type: 'engineer',
    bullets: [
      '2nd engineer hired — scaled the engineering org from 2 to 20+ members by establishing hiring, standards, and team culture.',
      'Led Android app architecture from launch to 500,000+ users using MVVM/Clean Architecture in Kotlin.',
      'Achieved 99.98% crash-free session rate through comprehensive testing and CI/CD pipelines.',
      'Mentored 5+ Android engineers; helped define the iOS architecture and CI/CD infrastructure.',
    ],
    skills: ['Android', 'Kotlin', 'MVVM', 'CI/CD', 'iOS', 'Node.js'],
  },
  {
    id: 'trucks24',
    company: 'Trucks24',
    role: 'Founder & CTO',
    period: 'Jan 2019 – Mar 2020',
    duration: '1 year 3 months',
    location: 'Delhi / Roorkee, India',
    type: 'founder',
    bullets: [
      'Built the complete Trucks24 ecosystem end-to-end: two native Android apps, a RESTful API, and a public website.',
      'Engineered real-time GPS tracking, load booking, and payment integration on Android (MVVM).',
      'Scaled the Node.js/MongoDB API to 500+ transporters and 20+ factory owners.',
    ],
    skills: ['Android', 'Kotlin', 'Node.js', 'MongoDB', 'GPS/Maps'],
  },
];
