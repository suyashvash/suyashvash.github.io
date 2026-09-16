/**
 * The work.
 *
 * FRAMING: Cosmic Shaft was incorporated 01/04/2024. Several of these
 * engagements predate that, delivered by the founder and the teams he ran.
 * Copy says "led by" — never implies the firm held those contracts. This
 * survives a client's due-diligence check, which a straight "our clients"
 * would not.
 */

export const work = [
  {
    slug: 'chanakya-ai',
    name: 'Chanakya AI',
    client: 'Neurobridge Tech',
    location: 'India',
    year: '2024 — present',
    role: 'Engineering lead, product & delivery',
    summary:
      'Exam automation for schools and institutes. Teachers set papers and mark handwritten answer sheets with AI doing the reading.',
    outcomes: [
      ['+80%', 'app performance'],
      ['−70%', 'codebase size'],
      ['5+', 'engineers mentored'],
    ],
    detail:
      'An exam automation platform for schools and institutes: teachers create papers, and AI reads and marks scanned handwritten answer sheets. Took it from heavy and slow to fast and maintainable — batch and frame processing for real-time server-side event handling, an 80% performance gain against a 70% reduction in codebase, and CI/CD through AppCenter that turned releases from an event into a routine.',
    stack: ['React Native', 'TypeScript', 'CI/CD', 'AppCenter'],
    image: './assets/img/work/chanakya.png',
    logo: './assets/img/brands/chanakya.webp',
    href: './work/chanakya-ai/',
    caseStudy: true,
  },
  {
    slug: 'haulr',
    name: 'Haulr',
    client: 'Haulr Corp',
    location: 'United States',
    year: '2023 — present',
    role: 'Senior engineer',
    summary:
      'Construction logistics. Connects contractors with truck drivers, and tracks every load in real time.',
    outcomes: [
      ['Real-time', 'GPS fleet tracking'],
      ['Multi-tier', 'user architecture'],
      ['End-to-end', 'invoicing'],
    ],
    detail:
      'Built for US construction companies moving material at scale: project and job creation, driver assignment, live GPS tracking of every vehicle, and invoice management — across a permission model spanning contractors, dispatchers and drivers.',
    stack: ['React Native', 'GPS / Maps', 'REST', 'Real-time'],
    image: './assets/img/work/haulr.png',
    logo: './assets/img/brands/Haulr.webp',
    href: './work/haulr/',
    caseStudy: true,
  },
  {
    slug: 'venyou',
    name: 'Venyou',
    client: 'Venyou',
    location: 'Melbourne, Australia',
    year: '2021 — 2023',
    role: 'Lead developer, 4-person team',
    summary:
      'Find a venue, book it, and meet everyone else who is going. Event discovery for the Australian market.',
    outcomes: [
      ['4', 'engineers led'],
      ['Real-time', 'chat over sockets'],
      ['OAuth2', 'social login'],
    ],
    detail:
      'Led a four-person team building GPS-based event and venue discovery, real-time chat over sockets, OAuth2 authentication, maps with pathfinding, and an ads and notifications layer. Shipped on both stores.',
    stack: ['React Native', 'Sockets', 'OAuth2', 'Maps'],
    image: './assets/img/work/venyou.png',
    logo: './assets/img/brands/venyou.webp',
    href: './work/venyou/',
    caseStudy: true,
  },
  {
    slug: 'playnoot',
    name: 'Playnoot',
    client: 'Playnoot',
    location: 'India',
    year: '2022 — 2024',
    role: 'Mobile application developer',
    summary:
      'Search, book and pay for a sports venue near you. Slot booking and subscriptions, both sides of the marketplace.',
    outcomes: [
      ['+70%', 'user engagement'],
      ['Payments', 'gateway integrated'],
      ['Two-sided', 'marketplace'],
    ],
    detail:
      'Shipped from scratch in React Native: payment gateway, slot booking and subscriptions, GPS-based venue search, and social login — plus the venue-owner side for listing and managing bookings.',
    stack: ['React Native', 'Payments', 'GPS', 'Social login'],
    image: './assets/img/work/playnoot.png',
    logo: './assets/img/brands/playnoot.webp',
    caseStudy: false,
  },
  {
    slug: 'playwise',
    name: 'Playwise',
    client: 'Playwise Esports',
    location: 'India',
    year: '2022 — 2023',
    role: 'Mobile application developer',
    summary: 'A social platform for competitive gamers, live on iOS and Android.',
    outcomes: [
      ['iOS', '+ Android'],
      ['Real-time', 'chat'],
      ['Push', 'notifications'],
    ],
    detail:
      'A next-generation esports platform: full app from scratch, REST integration, social login flows, real-time chat, push notifications and a scalable user system.',
    stack: ['React Native', 'Expo', 'REST', 'Push'],
    image: './assets/img/work/playwise.png',
    logo: './assets/img/brands/playwise.webp',
    caseStudy: false,
  },
  {
    slug: 'ayuraid',
    name: 'AyurAid AI',
    client: 'Original',
    location: 'India',
    year: '2024',
    role: 'Product and engineering',
    summary:
      'Ayurveda meets modern healthcare — personalised well-being, driven by AI.',
    outcomes: [
      ['AI-driven', 'personalisation'],
      ['Published', 'Google Play'],
      ['Original', 'product'],
    ],
    detail:
      'An original product rather than client work: applying AI to traditional Ayurvedic practice to produce personalised well-being guidance.',
    stack: ['React Native', 'Redux', 'AI'],
    image: './assets/img/work/ayuraid.png',
    logo: null,
    caseStudy: false,
  },
  {
    slug: 'singhal-jain',
    name: 'Singhal Jain & Co.',
    client: 'Singhal Jain & Co.',
    location: 'India',
    year: '2022',
    role: 'Mobile application developer',
    summary: 'A practice management app for a chartered accountancy firm.',
    outcomes: [
      ['Published', 'both stores'],
      ['Document', 'workflows'],
      ['Client', 'portal'],
    ],
    detail:
      'Client-facing mobile app for an accountancy practice — document workflows and a client portal.',
    stack: ['React Native', 'REST'],
    image: './assets/img/work/singhaljain.png',
    logo: './assets/img/brands/singhalJain.webp',
    caseStudy: false,
  },
];

export const brands = [
  { name: 'Chanakya AI', src: './assets/img/brands/chanakya.webp' },
  { name: 'Haulr Corp',  src: './assets/img/brands/Haulr.webp' },
  { name: 'Venyou',      src: './assets/img/brands/venyou.webp' },
  { name: 'Playnoot',    src: './assets/img/brands/playnoot.webp' },
  { name: 'Playwise',    src: './assets/img/brands/playwise.webp' },
  { name: 'sariThm',     src: './assets/img/brands/sarithm.webp' },
  { name: 'Singhal Jain & Co.', src: './assets/img/brands/singhalJain.webp' },
];
