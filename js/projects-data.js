/**
 * PROJECTS-DATA.JS
 * Data source for Ali Darwish's featured engineering projects & case studies
 */

const projectsData = [
  {
    id: "madar-tawakkalna",
    title: "Madar Enterprise Logistics & Tawakkalna Module",
    category: "enterprise",
    categoryLabel: "Enterprise Logistics & React",
    description: "Contributed to high-impact React modules within the national Tawakkalna platform via Madar Logistics at Obeikan Digital Solutions. Engineered B2B/B2C decoupled architecture and led modern Angular upgrades.",
    impact: [
      "Separated architecture into dedicated B2B and B2C portals, cutting coupling by 40%",
      "Reduced bundle size by 30% and accelerated initial load by 40%",
      "Led migration from Angular 15+ delivering ~25% speedup and tighter security",
      "Slashed code duplication across modules by 35% through reusable design tokens"
    ],
    tech: ["React.js", "Angular 15+", "RxJS", "TypeScript", "SCSS", "REST APIs", "Micro-frontends"],
    company: "Obeikan Digital Solutions",
    role: "Mid-Level Developer / Frontend Engineer",
    github: null, // Enterprise private
    live: null
  },
  {
    id: "pos-management",
    title: "Full-Featured POS & Warehouse Inventory System",
    category: "fullstack",
    categoryLabel: "Angular • Node.js • MySQL",
    description: "Enterprise Point of Sale (POS) application delivering real-time billing, multi-tier warehouse auditing, automated supplier restocking triggers, and financial metrics tracking.",
    impact: [
      "Interactive analytics dashboard monitoring gross margins, debts, and cashflows",
      "Automated stock control algorithms with real-time low-stock supplier dispatch",
      "Clean architecture with reactive RxJS state management and high-throughput REST APIs",
      "Robust relational database schema ensuring zero transaction discrepancies"
    ],
    tech: ["Angular", "Node.js", "Express", "MySQL", "RxJS", "JWT Auth", "REST APIs"],
    company: "Independent Enterprise Project",
    role: "Lead Full-Stack / Frontend Architect",
    github: "https://github.com/alielzoghby/pos-system",
    live: null
  },
  {
    id: "school-special-ed",
    title: "Special Education School Management Platform",
    category: "angular",
    categoryLabel: "Angular • MongoDB • WCAG AAA",
    description: "Comprehensive management and progress tracking portal designed for a French private school network supporting students with intellectual and developmental challenges.",
    impact: [
      "Built with strict WCAG accessibility guidelines ensuring universal usability",
      "Real-time daily activity review workflows, teacher reporting, and parent communication",
      "High-performance reactive UI built with Angular, RxJS, and clean component isolation",
      "End-to-end transparency in IEP (Individualized Education Program) monitoring"
    ],
    tech: ["Angular", "Node.js", "Express", "MongoDB", "RxJS", "WCAG Accessibility", "SCSS"],
    company: "French School Consortium",
    role: "Frontend Lead Developer",
    github: null,
    live: null
  },
  {
    id: "rdia-enterprise",
    title: "Research Development & Innovation Authority (RDIA) Platform",
    category: "enterprise",
    categoryLabel: "Enterprise Angular & Governance",
    description: "Internal enterprise platform built for the Saudi Arabian Research, Development and Innovation Authority (RDIA) to streamline institutional workflows and cross-departmental research pipelines.",
    impact: [
      "Participated in system architecture design within cross-functional distributed teams",
      "Aligned intricate multi-stakeholder business logic with responsive UI interfaces",
      "Constructed reusable data grid components handling complex hierarchical datasets",
      "Ensured strict enterprise security protocols and role-based permissions"
    ],
    tech: ["Angular", "TypeScript", "REST APIs", "Enterprise Architecture", "Clean Architecture"],
    company: "RDIA Saudi Arabia",
    role: "Frontend Engineer",
    github: null,
    live: null
  },
  {
    id: "nextjs-high-conversion",
    title: "Next.js High-Conversion Landing Engine",
    category: "react",
    categoryLabel: "Next.js • React • Performance",
    description: "Ultra-fast, SEO-optimized web application converting complex Figma designs into semantic, responsive, and accessible atomic React components.",
    impact: [
      "Engineered with Next.js SSR and ISR for instant page load times and 100/100 Lighthouse score",
      "Modular design system with reusable UI tokens and zero runtime CSS bloat",
      "Micro-animations and scroll-driven interactions built with GSAP and CSS transforms"
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Figma to Code"],
    company: "Client Project",
    role: "Frontend Engineer",
    github: "https://github.com/alielzoghby",
    live: null
  }
];

window.projectsData = projectsData;
