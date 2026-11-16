/* =============================================================
   portfolio.js — THE ONLY FILE YOU NEED TO EDIT
   Every string, link and card on the site is read from here.
   If a link is empty or still says "[PASTE ...]" the app
   automatically falls back to your GitHub profile, so no
   button is ever dead. Just drop real URLs in and reload.
   ============================================================= */

const FALLBACK = 'https://github.com/aswinmanoj-2004';

/** Returns the given URL, or the GitHub fallback when it is missing/placeholder. */
export function resolveUrl(url) {
  if (!url || typeof url !== 'string') return FALLBACK;
  const value = url.trim();
  if (!value || value.toUpperCase().includes('[PASTE') || value.startsWith('[PASTE')) return FALLBACK;
  return value;
}

export const profile = {
  name: 'Aswin Manoj',
  shortName: 'Aswin',
  role: 'Frontend / Full-Stack Developer with an AI focus',
  tag: 'Independent Developer',
  heroNameLine: 'Hi, I’m Aswin.',
  /** Small lead-in line the notepad card sits under. */
  heroLead: 'I am a',
  /** Full sentence, read by screen readers and search engines. */
  heroRest: 'I am a frontend developer, full-stack developer, and AI enthusiast.',
  location: 'Kalady, Ernakulam, Kerala, India',
  phone: '9744570279',
  email: 'user.aswin2004@gmail.com',
  linkedin: 'https://linkedin.com/in/aswin-manoj-acc',
  github: 'https://github.com/aswinmanoj-2004',
  resume: '/resume.pdf',
  /** Drop your cutout photo at public/aswin.png (portrait, plain background). */
  photo: '/aswin.png',
  photoFallback: '/aswin.svg',
  timezone: 'Asia/Kolkata',
  summary:
    'Dedicated and technically proficient developer with a strong foundation in frontend engineering, full-stack development, and artificial intelligence. Experienced in building responsive web applications and scalable database architectures. Passionate about leveraging modern web frameworks and AI tools to create efficient, user-centric digital solutions.',
  availability: 'Available for work. Remote-friendly, based in Kerala.',
  replyNote: 'I reply within one business day.',
};

/** Rotating word ticker in the intro. */
export const tickerWords = ['Frontend', 'Full-Stack', 'AI', 'UI/UX', 'Databases'];

/** Bottom edge strip of the hero. */
export const statusBar = {
  left: 'Available for work',
  centre: 'Remote-friendly · Based in Kerala',
  right: 'Scroll to explore',
};

/** Desktop nav. Short labels so the bar stays editorial; the overlay uses `navLinks`. */
export const topNav = [
  { label: 'Intro', to: '/#hero' },
  { label: 'Profile', to: '/#profile' },
  { label: 'Expertise', to: '/expertise' },
  { label: 'Selected Works', to: '/selected-works' },
  { label: 'Credentials', to: '/certifications' },
  { label: 'Academic Journey', to: '/story' },
  { label: "Let's Connect", to: '/contact' },
];

/** Section copy for the doors wall. */
export const doorsIntro = {
  eyebrow: 'My work, one door per skill',
  title: 'Magic happens behind the doors',
  sub: 'Swipe along the wall',
};

/** Five doors on the wall → each routes to a skill page.
 *  `paint` is the door colour, `shade` its dark edge, and `plate` the two lines
 *  stamped on the brass nameplate. */
export const doors = [
  {
    id: 'frontend',
    index: '01',
    title: 'Frontend Developer',
    blurb: 'Interfaces built clean, responsive and fast — React and Angular.',
    path: '/frontend',
    paint: '#2C3E63',
    shade: '#16213A',
    plate: ['FRONTEND', 'DEVELOPER'],
    tags: ['React', 'Angular', 'Tailwind'],
  },
  {
    id: 'full-stack',
    index: '02',
    title: 'Full-Stack Developer',
    blurb: 'Frontend to database in one piece — PHP, ASP.NET, C#.',
    path: '/full-stack',
    paint: '#4B2E45',
    shade: '#2A1727',
    plate: ['FULL-STACK', 'DEVELOPER'],
    tags: ['PHP', 'ASP.NET', 'C#'],
  },
  {
    id: 'databases',
    index: '03',
    title: 'Database Engineer',
    blurb: 'Schemas, queries and permissions that hold up under load.',
    path: '/databases',
    paint: '#6C7F5D',
    shade: '#3B4932',
    plate: ['DATABASE', 'ENGINEER'],
    tags: ['MySQL', 'MongoDB', 'SQL'],
  },
  {
    id: 'ai',
    index: '04',
    title: 'AI & Prompt Engineer',
    blurb: 'AI tooling, ML basics and prompts that actually behave.',
    path: '/ai',
    paint: '#A9512B',
    shade: '#5F2C16',
    plate: ['AI & PROMPT', 'ENGINEER'],
    tags: ['AI / ML', 'Prompt Eng.'],
  },
  {
    id: 'ui-ux',
    index: '05',
    title: 'UI/UX Designer',
    blurb: 'Wireframes, flows and design systems before a line of code.',
    path: '/ui-ux',
    paint: '#8B6A2E',
    shade: '#4E3917',
    plate: ['UI/UX', 'DESIGNER'],
    tags: ['Figma', 'Design systems'],
  },
];

/** Vertical, scroll-driven story timeline (newest first). */
export const storySection = {
  eyebrow: 'My story',
  title: 'Let’s go back in time.',
};

export const timeline = [
  {
    id: 'angular-internship',
    year: '2026',
    range: '2026 — Now',
    title: 'Frontend Web Application Developer - Internship',
    org: 'NeST Digital Academy',
    kind: 'Internship',
    points: [
      'Developed a responsive web application using Angular, enhancing user engagement by X% through modern design and efficient coding practices.',
    ],
  },
  {
    id: 'imca',
    year: '2022',
    range: '2022 — 2027',
    title: 'Integrated MCA (IMCA)',
    org: 'Depaul Institute of Science and Technology (DiST), MG University, Kottayam',
    kind: 'Education',
    points: [
      'Five-year integrated master’s programme in computer applications.',
      'Core grounding in software engineering, databases and AI.',
    ],
  },
  {
    id: 'plus-two',
    year: '2022',
    range: '2022',
    title: 'Higher Secondary (Plus 2) Science',
    org: 'Govt. Boys HSS, Aluva',
    kind: 'Education',
    points: ['Science stream — the bridge into applied computing.'],
  },
  {
    id: 'sslc',
    year: '2020',
    range: '2020',
    title: 'SSLC',
    org: 'St. Sebastian HS, Kanjoor',
    kind: 'Education',
    points: ['First exposure to computers and self-built web pages.'],
  },
  {
    id: 'highlights',
    year: 'Now',
    range: 'Key highlights',
    title: 'Frontend, Full-Stack, AI & ML',
    org: 'Where the three threads meet',
    kind: 'Focus',
    points: [
      'Responsive interfaces with modern frameworks.',
      'End-to-end apps backed by scalable data architectures.',
      'AI-assisted development and prompt engineering in daily work.',
    ],
  },
];

/** Certifications — each card is one big link that opens in a new tab. */
export const certificationsSection = {
  eyebrow: 'Certifications',
  title: 'Paper trail',
  sub: 'Seven certificates, each one a skill I had to prove.',
};

export const certifications = [
  {
    id: 'react-hackerrank',
    issuer: 'HackerRank',
    title: 'Frontend Developer (React)',
    url: 'https://drive.google.com/file/d/1Ffx-vkEWIomYRHSlvCUsdLz6FYBqnuLr/view?usp=drive_link',
  },
  {
    id: 'google-prompting',
    issuer: 'Coursera',
    title: 'Google Prompting Essentials',
    url: 'https://drive.google.com/file/d/1InJzh-xZk4Wcws-3PDjU7-LRZKl4dgxm/view?usp=drive_link',
  },
  {
    id: 'google-ai',
    issuer: 'Coursera',
    title: 'Google AI',
    url: 'https://drive.google.com/file/d/17bToeF3evyd4wez5BqfnSh-3c02MxLLK/view?usp=drive_link',
  },
  {
    id: 'ms-ai-ml',
    issuer: 'Coursera',
    title: 'Microsoft AI & ML Engineering',
    url: 'https://drive.google.com/file/d/1Mk27HAPVJrvSXRTz5u-cUiKw8m9mvKSS/view?usp=drive_link',
  },
  {
    id: 'anthropic-ai-fluency',
    issuer: 'Anthropic',
    title: 'AI Fluency Framework & Foundations',
    url: 'https://drive.google.com/file/d/1xJ9jb9S6PkpVWGZvIIPFt2edYi3bCC4P/view?usp=drive_link',
  },
  {
    id: 'simplilearn-fullstack',
    issuer: 'Simplilearn',
    title: 'Full-Stack Development 101',
    url: 'https://drive.google.com/file/d/1Ps_To2oedSkBqkYX5-Itnxj5xbtDXde4/view?usp=drive_link',
  },
  {
    id: 'simplilearn-figma',
    issuer: 'Simplilearn',
    title: 'Introduction to Figma',
    url: 'https://drive.google.com/file/d/1w6RZMVy6-D5gNnrlMCK6hQ4wLRAU2cJJ/view?usp=drive_link',
  },
];

/** Skills shown on the skill pages and in the tech-stack block. */
export const skillGroups = [
  { id: 'frontend', label: 'Frontend', items: ['Angular', 'CSS', 'HTML', 'JavaScript', 'React'] },
  { id: 'backend', label: 'Backend & Core', items: ['ASP.NET', 'C#', 'PHP'] },
  { id: 'data', label: 'Databases', items: ['MongoDB', 'MySQL', 'SQL'] },
  {
    id: 'tools',
    label: 'Tools & Concepts',
    items: ['Figma', 'Prompt Engineering', 'AI & ML Engineering', 'UI/UX Design Principles'],
  },
];

/* ---------------------------------------------------------------
   Projects. `pages` decides which skill pages a project appears on.
   Drop real screenshots into /public/projects/ and point
   `screenshot` at them (e.g. '/projects/digital-library.svg').
   The abstract SVGs shipped there are my own placeholders.
   --------------------------------------------------------------- */
export const projects = [
  {
    id: 'digital-library',
    category: 'Full-stack build · Web app',
    title: 'Digital Library & Story Publishing Platform',
    subtitle: 'PHP · MySQL',
    description:
      'A publishing platform where readers browse a managed story library and creators upload, edit and release their own digital assets.',
    bullets: [
      'Designed and developed a comprehensive digital reading and publishing platform with a secure PHP/MySQL backend to manage digital assets and story databases',
      'Implemented multi-role user authentication to differentiate and manage permissions for readers and publishers',
      'Built dynamic story upload systems for an intuitive, streamlined content-creator experience',
    ],
    tags: ['PHP', 'MySQL', 'Auth & Roles', 'REST'],
    live: '[PASTE HOSTED LINK]',
    repo: '[PASTE GITHUB REPO LINK]',
    screenshot: '/projects/digital-library.svg',
    pages: ['full-stack', 'databases'],
  },
  {
    id: 'aquarium-store',
    category: 'E-commerce build',
    title: 'Online Aquarium Store',
    subtitle: 'ASP.NET · C#',
    description:
      'A complete storefront for aquarium stock: browse the catalogue, manage inventory and check out, with an admin side for the shop.',
    bullets: [
      'Developed a fully functional e-commerce web app for an aquarium retail business using ASP.NET and C#',
      'Built a robust architecture for inventory tracking and user management, with a clean UI to optimize browsing and checkout',
    ],
    tags: ['ASP.NET', 'C#', 'E-commerce', 'Inventory'],
    live: '[PASTE HOSTED LINK]',
    repo: 'https://github.com/aswinachu1927-svg/aquarium-store',
    screenshot: '/projects/aquarium-store.svg',
    pages: ['full-stack'],
  },
  {
    id: 'frontend-lab',
    category: 'Frontend lab',
    title: 'Interface experiments',
    subtitle: 'React · Angular',
    status: 'placeholder',
    description:
      'A holding card for component work, landing pages and interaction studies. Drop the first project in here when it is ready.',
    bullets: [
      'Component libraries and page layouts built in React and Angular.',
      'Motion, responsive behaviour and accessibility passes.',
    ],
    tags: ['React', 'Angular', 'CSS', 'Motion'],
    live: '',
    repo: '',
    screenshot: '/projects/frontend-lab.svg',
    pages: ['frontend'],
  },
  {
    id: 'ui-ux-studio',
    category: 'Design work',
    title: 'Design studies',
    subtitle: 'Figma',
    status: 'placeholder',
    description:
      'Reserved for wireframes, flows and design systems. Replace this card with a real case study whenever you have one.',
    bullets: [
      'Low-fi wireframes through high-fi prototypes.',
      'Design tokens, components and UX writing.',
    ],
    tags: ['Figma', 'Wireframes', 'Prototype', 'Design system'],
    live: '',
    repo: '',
    screenshot: '/projects/ui-ux-studio.svg',
    pages: ['ui-ux'],
  },
  {
    id: 'ai-notes',
    category: 'AI practice',
    title: 'AI & prompt notes',
    subtitle: 'AI / ML · Prompt Engineering',
    status: 'placeholder',
    description:
      'A scratchpad for prompt systems, evals and small ML experiments — the place where certificate knowledge turns into practice.',
    bullets: [
      'Reusable prompt structures and system prompts.',
      'Assistants, embeddings and evaluation loops.',
    ],
    tags: ['Prompting', 'AI / ML', 'Evals'],
    live: '',
    repo: '',
    screenshot: '/projects/ai-notes.svg',
    pages: ['ai'],
  },
];

/** Copy blocks for each skill page. */
export const skillPages = {
  frontend: {
    title: 'Frontend Development',
    lede: 'Interfaces built clean, responsive and fast — semantic markup, modern frameworks, careful motion.',
    skills: skillGroups[0].items,
    accent: '#E4665A',
  },
  'full-stack': {
    title: 'Full-Stack Development',
    lede: 'Frontend to database in one piece: application logic, auth, uploads and deployment that hold together.',
    skills: [...skillGroups[1].items, ...skillGroups[0].items.slice(0, 3)],
    accent: '#E4665A',
  },
  databases: {
    title: 'Databases',
    lede: 'Schemas, queries, roles and permissions — the data layer designed before the interface is drawn.',
    skills: skillGroups[2].items,
    accent: '#E4665A',
  },
  ai: {
    title: 'AI and Prompt Engineering',
    lede: 'AI tooling, machine-learning fundamentals and prompts engineered to behave the same way twice.',
    skills: ['AI & ML Engineering', 'Prompt Engineering', 'AI Fluency'],
    accent: '#E4665A',
  },
  'ui-ux': {
    title: 'UI/UX Design',
    lede: 'Wireframes, flows and design systems — the decisions made before a single line of code.',
    skills: ['Figma', 'UI/UX Design Principles', 'Prototyping'],
    accent: '#E4665A',
  },
};

/** Menu overlay order (also drives the footer "Navigate" column). */
export const navLinks = [
  { label: 'Intro', to: '/#hero' },
  { label: 'Profile', to: '/#profile' },
  { label: 'Expertise', to: '/expertise' },
  { label: 'Selected Works', to: '/selected-works' },
  { label: 'Credentials', to: '/certifications' },
  { label: 'Academic Journey', to: '/story' },
  { label: "Let's Connect", to: '/contact' },
];

/** Footer "Work" column. */
export const workLinks = [];

export const contactSection = {
  eyebrow: 'Contact',
  title: 'Available for new work.',
  sub: 'Got a project? Let’s build it together.',
};

export const ctaSection = {
  line1: 'Available for new work.',
  line2: 'Got a project? Let’s build it together.',
};
