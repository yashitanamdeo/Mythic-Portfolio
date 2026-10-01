export const SITE = {
  name: "Dhruv Parmar",
  title: "Dhruv Parmar — Full-Stack Developer | Indore, India",
  email: "letsconnectdhruv@gmail.com",
  phone: "+919826270420",
  github: "https://github.com/dhruvjsx",
  linkedin: "https://www.linkedin.com/in/dhruvjs/",
  resume: "/Dhruv_Parmar_Resume.pdf",
  location: "Indore, India",
  version: "v2.0.0-mythic",
};

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#upskilling", label: "Upskilling" },
  { href: "#contact", label: "Contact" },
] as const;

export const HERO = {
  tagline:
    "Full-Stack Engineer with over 2 years of experience spanning Front-end Architecture, React/Next.js Development, REST API Development, LLM Integration, Mobile Application Development and Production-Grade SaaS Engineering",
  title: "FULL-STACK · REACT / NEXT.JS · NODE.JS",
  dwg: "DHRUV-2026-001",
  rev: "2.0",
};

export const ABOUT = {
  headline: "Who is Dhruv Parmar?",
  eyebrow: "background & focus",
  body: `Dhruv Parmar is a full-stack developer who ships production apps across web and mobile, working with React, Next.js and React Native on the frontend and Node.js, Express.js and Strapi on the backend. He most recently built SaaS tooling at Deuex Solutions, where his work spanned a browser extension for the Collate platform, AI-powered features built on top of LLM APIs, and a React Native app for real-time cricket scoring. Before that, he owned frontend architecture for four production products at Retvens Technologies. Outside his day-to-day role, he's made 100+ open source commits to OpenMetadata and shipped a freelance e-commerce build solo, end to end. He leans on AI coding assistants as part of his regular workflow to move faster without cutting corners, and he's currently open to joining a team that ships fast.`,
  highlights: [
    "React, Next.js and React Native",
    "Node.js, Express.js and Strapi",
    "Deuex Solutions",
    "four production products",
    "100+ open source commits to OpenMetadata",
  ],
  stats: [
    { value: "2+", label: "years in production systems" },
    { value: "4", label: "enterprise products delivered" },
    { value: "100+", label: "commits to OpenMetadata (OSS)" },
    { value: "100+", label: "LeetCode problems solved" },
  ],
};

export const CAPABILITIES = [
  {
    id: "01",
    title: "Front-end Architecture",
    blurb: "owned architecture for four enterprise-grade products end to end",
    body: "Owned end-to-end frontend architecture for four enterprise-grade production products at Retvens Technologies — building scalable, latency-sensitive systems used by hospitality businesses across multiple regions, from component structure to state and data flow.",
    tags: ["React", "Next.js", "Architecture", "Design Systems"],
  },
  {
    id: "02",
    title: "Full-Stack Development",
    blurb: "requirements to launch, front end to back end",
    body: "Took Hustle With Kai from requirements gathering through architecture decisions to a production launch as sole engineer — a full-featured e-commerce and blog platform spanning UI, APIs, and data, with performance and SEO built in from the start.",
    tags: ["Next.js", "Node.js", "E-commerce", "Full-Stack"],
  },
  {
    id: "03",
    title: "React & Next.js Development",
    blurb: "led the React-to-Next.js migration for SSR/SSG performance",
    body: "Led the migration from React to Next.js at Retvens Technologies, leveraging SSR/SSG to improve performance and cross-browser reliability across four production products used by hospitality businesses.",
    tags: ["React", "Next.js", "SSR/SSG", "Performance"],
  },
  {
    id: "04",
    title: "REST API Development",
    blurb: "backend-integrated features wired into shared REST APIs",
    body: "Built and consumed REST APIs across the Collate browser extension and its core platform backend — powering content scripts, contextual UI, and real-time in-page data visualization for enterprise clients on a shared data layer.",
    tags: ["REST APIs", "Node.js", "Backend Integration"],
  },
  {
    id: "05",
    title: "LLM API Integration",
    blurb: "LLM APIs wired in to prototype AI-powered features",
    body: "Integrated LLM APIs into the Collate extension to prototype AI-powered features that genuinely improve customer experience — moving from proof-of-concept to production-ready UI backed by real model calls.",
    tags: ["LLM APIs", "AI Features", "Prototyping"],
  },
  {
    id: "06",
    title: "AI-Assisted Development",
    blurb: "AI coding assistants folded into daily workflow, used to ship faster",
    body: "AI coding assistants — Claude, GitHub Copilot, Cursor — folded into daily workflow to move faster without cutting corners, from scaffolding features to debugging edge cases across web and mobile codebases.",
    tags: ["Claude", "GitHub Copilot", "Cursor", "AI Workflow"],
  },
  {
    id: "07",
    title: "Performance Optimization",
    blurb: "rendering bottlenecks found and fixed, load times cut",
    body: "Monitored and improved component-level performance metrics on OpenMetadata's core frontend — identifying rendering bottlenecks and reducing load times for a public-facing interface used by global teams.",
    tags: ["Performance", "Profiling", "React", "DX"],
  },
  {
    id: "08",
    title: "Authentication & Authorization",
    blurb: "secure, role-based access control for premium vs. free tiers",
    body: "Redesigned authentication and authorization flows for premium vs. free tiers on the Collate extension, enforcing secure, role-based access control across the extension and its shared backend.",
    tags: ["OAuth 2.0", "RBAC", "Secure Auth"],
  },
  {
    id: "09",
    title: "Responsive Web Application Development",
    blurb: "web apps and extensions that hold up on every screen",
    body: "Built responsive, cross-browser interfaces for the Collate extension and Hustle With Kai alike — contextual popups, right-click menus, and full storefronts that behave consistently from a phone to a widescreen monitor.",
    tags: ["Responsive Design", "Cross-Browser", "React"],
  },
  {
    id: "10",
    title: "Cross-Functional Product Delivery",
    blurb: "coordinating engineers, designers, and KPIs to ship on time",
    body: "Drove cross-functional delivery of client-facing features at Retvens Technologies, coordinating with backend engineers and designers and tracking KPIs to keep four production products moving toward release.",
    tags: ["Cross-Functional", "Delivery", "Stakeholder Comms"],
  },
  {
    id: "11",
    title: "Open-Source Development",
    blurb: "100+ commits to a global-scale open-source data platform",
    body: "Delivered 100+ commits to OpenMetadata's core frontend, an enterprise data platform, contributing features and performance improvements to public-facing interfaces used by global teams.",
    tags: ["Open Source", "React", "OpenMetadata"],
  },
] as const;

export const EXPERIENCE = [
  {
    hex: "0x00",
    range: "[2025–26]",
    meta: "Remote · Jan 2025 — May 2026",
    role: "Frontend Engineer",
    company: "Deuex Solutions",
    summary:
      "Engineered contextual UI components, including right-click menus and in-page popups, enabling real-time data visualization within active user work-flows for 1,000+ enterprise clients.",
    bullets: [
      "Architected a Browser Extension for the Collate SaaS Platform, integrating content scripts with the production back-end to surface real-time insights across 10+ supported websites and reduce enterprise user context-switching",
      "Integrated OpenAI and Anthropic LLM APIs to prototype 4 AI-powered features within the Collate platform, translating generative AI capabilities into functional product experiences.",
      "Leveraged Claude, GitHub Copilot, and Cursor across daily engineering work-flows, accelerating feature development through AI-assisted implementation and iteration.",
      "Redesigned authentication and authorization flows for premium vs. free tiers, enforcing secure, role-based access control.",
      "Built 12thMen, a React Native mobile application for real-time cricket scoring, translating live-score requirements into responsive mobile interfaces.",
    ],
    tags: [
      "React.js",
      "React Native",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "REST APIs",
      "LLM API Integration",
      "OpenAI APIs",
      "Anthropic APIs",
      "AI-Assisted Development",
      "Claude",
      "GitHub Copilot",
      "Cursor",
      "Browser Extension Development",
    ],
  },
  {
    hex: "0x01",
    range: "[2024–25]",
    meta: "On Site · Feb 2024 — Jan 2025",
    role: "Junior Frontend Developer",
    company: "Retvens Technologies",
    summary:
      "Owned end-to-end frontend architecture for four enterprise-grade production products, building scalable, latency-sensitive systems used by hospitality businesses across multiple regions.",
    bullets: [
      "Owned end-to-end frontend architecture for four enterprise-grade production products.",
      "Drove cross-functional delivery of client-facing features, coordinating with backend engineers and designers and tracking KPIs.",
      "Led migration from React to Next.js, leveraging SSR/SSG to improve performance and cross-browser reliability.",
    ],
    tags: [
      "Next.js",
      "Redux",
      "RTK",
      "HTML",
      "CSS",
      "Storybook",
      "SQL",
      "NoSQL",
      "MongoDB",
      "Figma",
      "Responsive UI Development",
      "Data Structures & Algorithms",
      "System Design",
    ],
  },
  {
    hex: "0x02",
    range: "[2025]",
    meta: "Remote · Since Feb 2025",
    role: "Open Source Contributor",
    company: "OpenMetadata",
    summary:
      "100+ commits to OpenMetadata, an enterprise data platform — contributing to core frontend modules and improving system scalability and developer experience across public-facing interfaces used by global teams.",
    bullets: [
      "Delivered 100+ commits to core frontend modules of an enterprise data platform.",
      "Monitored and improved component-level performance metrics, identifying rendering bottlenecks and reducing load times.",
    ],
    tags: [
      "Node.js",
      "Express.js",
      "GraphQL",
      "Microservices",
      "Elasticsearch",
      "AWS",
      "Docker",
      "CI/CD",
      "Git",
      "GitHub",
      "Jest",
      "Testing Library",
      "Python",
    ],
  },
] as const;

export const PROJECTS = [
  {
    num: "01",
    category: "Frontend / Browser Extension",
    org: "Deuex Solutions",
    year: "2025",
    title: "Collate Browser Extension",
    tagline: "Bringing Collate's data insights directly into the browser.",
    body: "A browser extension for the Collate SaaS platform, integrated with the same backend to surface Collate insights directly on supported websites via content scripts. Contextual UI — right-click menus and popups — enables real-time in-page data visualization for enterprise clients, with auth flows redesigned for premium vs. free tiers.",
    bullets: [
      "Built content scripts that deliver Collate insights directly on supported websites.",
      "Built contextual right-click menus and popups for real-time in-page data visualization.",
      "Redesigned authentication and authorization for premium vs. free tiers with role-based access control.",
      "Integrated LLM APIs to prototype AI-powered features improving customer experience.",
    ],
    outcome: "Real-time data visualization, in-page, for enterprise clients",
    tags: ["React", "Chrome Extensions", "Content Scripts", "LLM APIs"],
  },
  {
    num: "02",
    category: "Mobile / React Native",
    org: "Deuex Solutions",
    year: "2025",
    title: "12thMen",
    tagline: "Real-time cricket scoring in your pocket.",
    body: "A React Native mobile application focused on real-time cricket scoring, developed and maintained alongside the Collate extension work at Deuex Solutions.",
    bullets: [
      "Developed and contributed to a cross-platform React Native app for live cricket scoring.",
      "Shipped features and fixes across the app without sacrificing code quality.",
    ],
    outcome: "Real-time scoring, shipped cross-platform",
    tags: ["React Native", "Real-time Data", "Mobile"],
  },
  {
    num: "03",
    category: "Full-Stack / Freelance",
    org: "Freelance",
    year: "2025",
    title: "Hustle With Kai",
    tagline: "A full-featured e-commerce and blog platform, built solo.",
    body: "A full-featured e-commerce and blog platform with a modern UI, optimized performance, and seamless navigation — built as the sole engineer, from requirements gathering through architecture decisions to a production launch, with comprehensive SEO optimization.",
    bullets: [
      "Developed a full-featured e-commerce and blog platform with a modern UI.",
      "Implemented comprehensive SEO optimization, improving visibility, indexing and organic reach.",
      "Worked directly with the client as sole engineer — requirements, architecture and delivery.",
    ],
    outcome: "Solo-engineered, production e-commerce platform",
    tags: ["Next.js", "E-commerce", "SEO", "Blog Platform"],
  },
] as const;

export const SKILL_GROUPS = [
  {
    key: "A",
    title: "Front-end Engineering",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "//",
      "JavaScript",
      "Redux · RTK",
      "React Native",
      "0x",
      "Tailwind CSS",
      "HTML · CSS",
      "Storybook",
    ],
  },
  {
    key: "B",
    title: "Back-end & APIs",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "0x",
      "Microservices",
      "SQL · NoSQL",
      "MongoDB",
      "Elasticsearch",
    ],
  },
  {
    key: "C",
    title: "AI & LLM",
    items: [
      "LLM API Integration",
      "OpenAI APIs",
      "Anthropic APIs",
      "::",
      "AI-Assisted Development",
      "Claude",
      "GitHub Copilot",
      "Cursor",
    ],
  },
  {
    key: "D",
    title: "Cloud & DevOps",
    items: ["AWS", "Docker", "CI/CD", "Git · GitHub"],
  },
  {
    key: "E",
    title: "Testing & Engineering",
    items: [
      "Jest · Testing Library",
      "Data Structures & Algorithms",
      "System Design",
    ],
  },
  {
    key: "F",
    title: "Design & Development",
    items: [
      "Figma",
      "Responsive UI Development",
      "Browser Extension Development",
    ],
  },
  {
    key: "G",
    title: "Programming",
    items: ["Python"],
  },
] as const;

export const UPSKILLING_PREVIEW = [
  {
    slug: "dsa-dynamic-programming-03-frog-jump",
    id: "dsa-dynamic-programming-03",
    status: "Solved",
    title: "Frog Jump",
    topic: "Dynamic Programming",
    difficulty: "Medium",
  },
  {
    slug: "dsa-dynamic-programming-02-climbing-stairs",
    id: "dsa-dynamic-programming-02",
    status: "Solved",
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    difficulty: "Medium",
  },
  {
    slug: "dsa-dynamic-programming-01-dynamic-programming-introduction",
    id: "dsa-dynamic-programming-01",
    status: "Solved",
    title: "Dynamic Programming Introduction",
    topic: "Dynamic Programming",
    difficulty: "Medium",
  },
] as const;

export const UPSKILLING_STATS = {
  closed: 82,
  writeups: 83,
  hours: 41,
};
