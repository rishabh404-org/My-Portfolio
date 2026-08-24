/**
 * Portfolio Data Source
 * Contains all structured data for projects, case studies, skills, experience,
 * services, testimonials, certifications, and FAQs.
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Rishabh",
    title: "Senior Full-Stack Engineer & UI/UX Architect",
    tagline: "Crafting hyper-scalable cloud applications & award-winning digital experiences with surgical precision.",
    bio: "I am a Full-Stack Engineer and Product Designer with 5+ years of experience building high-concurrency distributed systems, resilient cloud backends, and pixel-perfect interactive frontends. I bridge the gap between deep systems engineering and world-class product design.",
    location: "Bengaluru, India (UTC+5:30) • Open to Remote Worldwide",
    availability: "Available for Senior/Lead roles & High-Impact Contracts",
    email: "rishabhkumar3800@gmail.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    calendly: "https://calendly.com",
    stats: [
      { label: "Years Experience", value: "5+", icon: "code" },
      { label: "Production Projects", value: "32+", icon: "layers" },
      { label: "Active Users Served", value: "2.4M+", icon: "users" },
      { label: "GitHub Stars & Forks", value: "1.8k+", icon: "star" },
      { label: "System Uptime Delivered", value: "99.98%", icon: "activity" }
    ]
  },

  skills: {
    categories: [
      {
        id: "frontend",
        name: "Frontend & Creative Tech",
        icon: "monitor",
        description: "Modern component architectures, micro-frontends, state management, and 60fps animations.",
        skills: [
          { name: "React / Next.js", level: 95, exp: "5 yrs", featured: true, tag: "Expert" },
          { name: "TypeScript / JavaScript ESNext", level: 96, exp: "5 yrs", featured: true, tag: "Expert" },
          { name: "Vue.js / Nuxt", level: 85, exp: "3 yrs", featured: false, tag: "Advanced" },
          { name: "Tailwind CSS / Vanilla CSS", level: 98, exp: "5 yrs", featured: true, tag: "Master" },
          { name: "Three.js / WebGL / Canvas", level: 82, exp: "2.5 yrs", featured: true, tag: "Advanced" },
          { name: "HTML5 / Semantic A11y", level: 98, exp: "5 yrs", featured: false, tag: "Master" },
          { name: "State (Zustand / Redux / TanStack)", level: 92, exp: "4 yrs", featured: false, tag: "Expert" },
          { name: "Framer Motion / GSAP", level: 90, exp: "3 yrs", featured: true, tag: "Advanced" }
        ]
      },
      {
        id: "backend",
        name: "Backend & Distributed Systems",
        icon: "server",
        description: "High-throughput microservices, robust REST & GraphQL APIs, real-time WebSockets, and event pipelines.",
        skills: [
          { name: "Node.js / Express / NestJS", level: 94, exp: "5 yrs", featured: true, tag: "Expert" },
          { name: "Go (Golang)", level: 86, exp: "3 yrs", featured: true, tag: "Advanced" },
          { name: "Python / FastAPI / Django", level: 88, exp: "4 yrs", featured: true, tag: "Advanced" },
          { name: "GraphQL / Apollo / gRPC", level: 90, exp: "3.5 yrs", featured: false, tag: "Expert" },
          { name: "RESTful API Design & OpenAPI", level: 96, exp: "5 yrs", featured: false, tag: "Master" },
          { name: "WebSockets / SSE / Kafka", level: 84, exp: "3 yrs", featured: false, tag: "Advanced" },
          { name: "Auth & Security (OAuth2 / JWT / RBAC)", level: 92, exp: "4 yrs", featured: false, tag: "Expert" }
        ]
      },
      {
        id: "databases",
        name: "Databases & Storage",
        icon: "database",
        description: "Relational data modeling, schema indexing, caching layers, and vector search infrastructure.",
        skills: [
          { name: "PostgreSQL / pgvector", level: 94, exp: "5 yrs", featured: true, tag: "Expert" },
          { name: "Redis / Upstash (Caching & PubSub)", level: 92, exp: "4 yrs", featured: true, tag: "Expert" },
          { name: "MongoDB / DocumentDB", level: 88, exp: "4 yrs", featured: false, tag: "Advanced" },
          { name: "Prisma / Drizzle ORM / SQLX", level: 90, exp: "3 yrs", featured: false, tag: "Expert" },
          { name: "Pinecone / Qdrant (Vector DBs)", level: 82, exp: "2 yrs", featured: true, tag: "Advanced" },
          { name: "Elasticsearch / OpenSearch", level: 80, exp: "2.5 yrs", featured: false, tag: "Proficient" }
        ]
      },
      {
        id: "cloud",
        name: "Cloud, DevOps & CI/CD",
        icon: "cloud",
        description: "Infrastructure as Code, container orchestration, edge deployments, and observability.",
        skills: [
          { name: "Docker & Containerization", level: 92, exp: "4.5 yrs", featured: true, tag: "Expert" },
          { name: "Kubernetes (K8s) & Helm", level: 80, exp: "2.5 yrs", featured: false, tag: "Proficient" },
          { name: "AWS (ECS, Lambda, S3, RDS, CloudFront)", level: 88, exp: "4 yrs", featured: true, tag: "Advanced" },
          { name: "Google Cloud Platform (GCP)", level: 84, exp: "3 yrs", featured: false, tag: "Advanced" },
          { name: "Terraform & IaC", level: 82, exp: "2.5 yrs", featured: false, tag: "Advanced" },
          { name: "GitHub Actions / CI/CD Pipelines", level: 92, exp: "4 yrs", featured: true, tag: "Expert" },
          { name: "Prometheus, Grafana & Sentry", level: 86, exp: "3 yrs", featured: false, tag: "Advanced" }
        ]
      },
      {
        id: "design",
        name: "UI/UX & Product Design",
        icon: "figma",
        description: "Design systems, human-centered UI/UX, user testing, wireframing, and interactive prototyping.",
        skills: [
          { name: "Figma & Design Systems", level: 95, exp: "5 yrs", featured: true, tag: "Master" },
          { name: "Design Tokens & Typography", level: 94, exp: "5 yrs", featured: true, tag: "Expert" },
          { name: "Micro-interactions & UX Physics", level: 92, exp: "4 yrs", featured: true, tag: "Expert" },
          { name: "User Journey & Wireframing", level: 90, exp: "4 yrs", featured: false, tag: "Expert" },
          { name: "Accessibility (WCAG 2.1 AA)", level: 92, exp: "4 yrs", featured: false, tag: "Expert" }
        ]
      }
    ]
  },

  projects: [
    {
      id: "nexus-ai-orchestrator",
      title: "Nexus AI: Autonomous Agent Workflow Engine",
      category: "ai",
      categoryLabel: "AI & Distributed Systems",
      featured: true,
      description: "An enterprise-grade multi-agent LLM orchestration platform with streaming DAG execution, sandboxed tool runtime, and real-time observability.",
      shortSummary: "Enterprise Multi-Agent LLM Orchestration Platform",
      image: "assets/project-nexus.svg",
      gradient: "from-indigo-500 to-cyan-400",
      tech: ["TypeScript", "Next.js 14", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "LangChain"],
      metrics: [
        { label: "Latency Reduction", value: "-42%" },
        { label: "Concurrent DAGs", value: "10,000+" },
        { label: "Token Efficiency", value: "+35%" }
      ],
      links: {
        demo: "https://nexus-ai.demo.dev",
        github: "https://github.com/rishabh-dev/nexus-ai",
        caseStudy: true
      },
      caseStudyData: {
        subtitle: "How we architected a fault-tolerant multi-agent runtime executing thousands of concurrent LLM DAGs with sub-second orchestration latency.",
        challenge: "Enterprises struggled with brittle LLM workflows that frequently crashed during multi-step reasoning loops, had zero observability into token burn rates, and lacked deterministic rollback mechanisms for automated agent actions.",
        solution: "Engineered a distributed execution engine using FastAPI and Redis Streams that treats agent prompts as nodes in a dynamic acyclic directed graph (DAG). Built a web interface in Next.js 14 with interactive visual pipeline editor, live node logs, token budgeting, and automatic sandboxed fallback mechanisms.",
        architecture: [
          "Event-driven worker pool powered by Python, Redis, and Celery",
          "Dynamic DAG compiler supporting parallel conditional execution branches",
          "Real-time WebSocket telemetry feeding a Canvas-based visual debugger",
          "PostgreSQL vector indexing via pgvector for semantic knowledge retrieval"
        ],
        results: [
          "Processed over 3.2 million automated agent tasks with 99.94% completion success rate.",
          "Cut enterprise token expenditure by 35% using intelligent semantic cache routing.",
          "Adopted by 80+ engineering teams for production automated research and CI analysis."
        ]
      }
    },
    {
      id: "pulse-cloud-monitor",
      title: "Pulse: Real-Time Cloud Infrastructure & Telemetry",
      category: "cloud",
      categoryLabel: "Cloud & DevOps",
      featured: true,
      description: "A high-frequency observability platform capturing millions of metrics/sec across multi-cloud Kubernetes clusters with sub-100ms dashboards.",
      shortSummary: "Real-Time Infrastructure Telemetry & APM Platform",
      image: "assets/project-pulse.svg",
      gradient: "from-emerald-400 to-teal-600",
      tech: ["Go (Golang)", "React", "TimescaleDB", "Prometheus", "Kafka", "TailwindCSS", "WebSockets"],
      metrics: [
        { label: "Throughput", value: "2.5M evt/s" },
        { label: "Dashboard Render", value: "<60ms" },
        { label: "Cost Savings", value: "55%" }
      ],
      links: {
        demo: "https://pulse-apm.demo.dev",
        github: "https://github.com/rishabh-dev/pulse-telemetry",
        caseStudy: true
      },
      caseStudyData: {
        subtitle: "Building a cost-effective alternative to Datadog with high-throughput Go microservices and millisecond time-series aggregation.",
        challenge: "Existing APM and logging solutions incurred unsustainable cloud egress bills and provided sluggish web dashboards when querying hundreds of millions of historical data points.",
        solution: "Designed a lean Go ingestion pipeline that buffers events using Apache Kafka and writes pre-aggregated rollups into TimescaleDB. Constructed an ultra-responsive frontend with Canvas time-series charts rendering 100k data points at 60 frames per second without stutter.",
        architecture: [
          "Go-based edge collector agents deployed as K8s DaemonSets",
          "Partitioned TimescaleDB hyper-tables with automated data retention policies",
          "Custom binary WebSocket protocol minimizing client bandwidth by 68%",
          "Adaptive threshold anomaly detection using lightweight statistical algorithms"
        ],
        results: [
          "Reduced client observability infrastructure expenses by 55% month-over-month.",
          "Maintained stable ingestion throughput of 2.5 million events per second under peak traffic spikes.",
          "Achieved p95 query latency under 85ms for 30-day cross-cluster health audits."
        ]
      }
    },
    {
      id: "hyper-fintech-core",
      title: "AuraPay: Next-Gen Global Fintech Core & Settlement",
      category: "fullstack",
      categoryLabel: "Full-Stack Web & Fintech",
      featured: true,
      description: "A PCI-DSS compliant multi-currency ledger, programmable wallet engine, and instant settlement checkout system with zero-downtime architecture.",
      shortSummary: "Multi-Currency Ledger & Instant Settlement Engine",
      image: "assets/project-aurapay.svg",
      gradient: "from-violet-600 to-indigo-700",
      tech: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Next.js", "Prisma", "Docker", "Stripe API"],
      metrics: [
        { label: "Processed Volume", value: "$180M+" },
        { label: "Ledger Accuracy", value: "100.0%" },
        { label: "P99 Response", value: "48ms" }
      ],
      links: {
        demo: "https://aurapay.demo.dev",
        github: "https://github.com/rishabh-dev/aurapay-core",
        caseStudy: true
      },
      caseStudyData: {
        subtitle: "Developing an immutable double-entry ledger handling millions in daily transactional volume with zero reconciliation discrepancy.",
        challenge: "Building a fintech checkout platform requires absolute transactional safety, strict concurrency locking to prevent double-spending, and compliance with high-tier banking security standards.",
        solution: "Built a double-entry ledger architecture backed by PostgreSQL with serializable transaction isolation, idempotent idempotency-key request queues, and automated audit trail verification. Developed a checkout UI with biometric authentication and 1-click payment handoffs.",
        architecture: [
          "Immutable double-entry book-keeping with strict cryptographic checksums",
          "Distributed Redis redlock algorithm ensuring strictly atomic balance updates",
          "Automated webhook retry pipeline with exponential backoff and dead-letter queues",
          "Comprehensive end-to-end integration test suite with synthetic fault injection"
        ],
        results: [
          "Handled over $180,000,000 in transaction volume across 14 currencies with zero double-spend occurrences.",
          "Maintained p99 API response time of 48ms during flash sales events.",
          "Passed third-party security audits with zero high-severity vulnerabilities."
        ]
      }
    },
    {
      id: "lumina-design-system",
      title: "Lumina: Accessible Design System & Component Studio",
      category: "design",
      categoryLabel: "UI/UX & Design Systems",
      featured: true,
      description: "An enterprise design system with 60+ accessible components, token compiler, dynamic theming engine, and automated visual regression testing.",
      shortSummary: "Enterprise Design System & Token Studio",
      image: "assets/project-lumina.svg",
      gradient: "from-amber-400 to-pink-500",
      tech: ["React", "TypeScript", "Tailwind CSS", "Figma API", "Storybook", "Playwright", "WCAG 2.1"],
      metrics: [
        { label: "Dev Velocity", value: "+3.2x" },
        { label: "WCAG Compliance", value: "AAA" },
        { label: "Bundle Size", value: "<18kb" }
      ],
      links: {
        demo: "https://lumina-ds.demo.dev",
        github: "https://github.com/rishabh-dev/lumina-design-system",
        caseStudy: true
      },
      caseStudyData: {
        subtitle: "Unifying multi-brand digital products under a unified token architecture with zero layout shift and 100% keyboard accessibility.",
        challenge: "Inconsistent UI patterns across multiple product lines caused developer velocity bottlenecks, frequent visual regressions, and accessibility compliance issues.",
        solution: "Engineered Lumina: a headless, token-driven component library with full keyboard navigation, screen reader ARIA mappings, dark/light/contrast themes, and automatic token synchronization directly from Figma variables.",
        architecture: [
          "Design token compiler translating JSON tokens to CSS variables, iOS Swift, and Android XML",
          "Strict WCAG 2.1 AAA accessible primitives built with zero third-party DOM dependencies",
          "Automated visual regression testing pipeline via Playwright across 12 viewport configurations",
          "Interactive documentation portal with live editable code playgrounds"
        ],
        results: [
          "Accelerated feature release velocity by 3.2x across 6 cross-functional product squads.",
          "Eliminated all WCAG accessibility violations across public customer portals.",
          "Achieved 98% code reuse across web, desktop, and mobile web platforms."
        ]
      }
    },
    {
      id: "hyper-chat-collab",
      title: "Synapse: Real-Time Collaborative Canvas & Whiteboard",
      category: "fullstack",
      categoryLabel: "Full-Stack Web & Creative",
      featured: false,
      description: "Infinite collaborative workspace featuring CRDT-based multiplayer synchronization, vector drawing tools, and audio huddles.",
      shortSummary: "Multiplayer Real-Time Canvas with CRDTs",
      image: "assets/project-synapse.svg",
      gradient: "from-cyan-400 to-blue-600",
      tech: ["TypeScript", "React", "Yjs (CRDT)", "WebRTC", "Canvas API", "Node.js", "WebSockets"],
      metrics: [
        { label: "Sync Latency", value: "<15ms" },
        { label: "Simultaneous Users", value: "500+" },
        { label: "FPS Stability", value: "60 FPS" }
      ],
      links: {
        demo: "https://synapse-collab.demo.dev",
        github: "https://github.com/rishabh-dev/synapse-canvas",
        caseStudy: false
      }
    },
    {
      id: "neural-rag-search",
      title: "Vortex: Neural Semantic Search & Document Intelligence",
      category: "ai",
      categoryLabel: "AI & Search Architecture",
      featured: false,
      description: "Sub-millisecond hybrid vector + BM25 document retrieval engine with automated chunking, reranking, and citation generation.",
      shortSummary: "Hybrid Vector Search & Neural Document Intelligence",
      image: "assets/project-vortex.svg",
      gradient: "from-purple-500 to-rose-500",
      tech: ["Python", "FastAPI", "Qdrant", "HuggingFace", "React", "TypeScript", "Docker"],
      metrics: [
        { label: "Retrieval Accuracy", value: "94.8%" },
        { label: "Search Latency", value: "22ms" },
        { label: "Docs Indexed", value: "1.5M+" }
      ],
      links: {
        demo: "https://vortex-search.demo.dev",
        github: "https://github.com/rishabh-dev/vortex-search",
        caseStudy: false
      }
    }
  ],

  experience: [
    {
      role: "Lead Full-Stack Engineer & Architect",
      company: "Cognitive Scale Labs",
      type: "Full-time",
      period: "2023 — Present",
      location: "Bengaluru / Hybrid",
      description: "Architecting cloud-native AI platforms, leading core engineering teams, and establishing design system standards across the enterprise suite.",
      achievements: [
        "Led architecture and migration of legacy monolith into event-driven microservices, reducing infrastructure costs by 38% and lowering p99 latency by 65ms.",
        "Engineered real-time collaboration engine using WebSockets and CRDTs supporting 10,000+ active enterprise sessions concurrently.",
        "Mentored a team of 12 frontend and backend engineers, instituting rigorous code review guidelines, automated testing, and CI/CD best practices."
      ],
      tech: ["Next.js", "TypeScript", "Go", "Python", "PostgreSQL", "Redis", "Kafka", "AWS", "Docker"]
    },
    {
      role: "Senior Software Engineer",
      company: "Aether Cloud Systems",
      type: "Full-time",
      period: "2021 — 2023",
      location: "Remote",
      description: "Spearheaded frontend and API development for high-throughput cloud observability and analytics tools used by Fortune 500 companies.",
      achievements: [
        "Developed custom high-performance data visualization charts capable of rendering 250k data points at 60 FPS using HTML5 Canvas and WebGL.",
        "Refactored mission-critical billing and telemetry ingestion microservices, improving throughput by 300% without additional hardware provisioning.",
        "Built enterprise single-sign-on (SSO), SAML, and granular RBAC permission matrix for enterprise clients."
      ],
      tech: ["React", "Node.js", "TypeScript", "GraphQL", "TimescaleDB", "Kubernetes", "TailwindCSS"]
    },
    {
      role: "Full-Stack Developer & UI/UX Specialist",
      company: "Hyperion Digital Agency",
      type: "Full-time",
      period: "2019 — 2021",
      location: "Bengaluru",
      description: "Delivered modern bespoke web applications, interactive e-commerce platforms, and SaaS MVPs for high-growth global startups.",
      achievements: [
        "Delivered 18+ high-profile client web applications from initial Figma wireframing to cloud production deployment.",
        "Created an internal UI component accelerator library that decreased average client turnaround time by 40%.",
        "Optimized client Core Web Vitals to achieve consistent 98+ Google Lighthouse scores across desktop and mobile."
      ],
      tech: ["JavaScript (ES6+)", "Vue.js", "React", "Node.js", "MongoDB", "Express", "Figma", "CSS3/Sass"]
    }
  ],

  services: [
    {
      id: "fullstack",
      title: "Full-Stack Web & SaaS Engineering",
      icon: "code",
      badge: "Most Requested",
      description: "End-to-end architecture and engineering of hyper-scalable web apps, SaaS platforms, and enterprise dashboards with zero tech debt.",
      deliverables: [
        "Production Next.js / React application with TypeScript",
        "High-performance REST / GraphQL / gRPC backends",
        "Relational & NoSQL database schema design & indexing",
        "Role-based access control, auth, and payment integrations"
      ],
      idealFor: "Startups launching MVPs or enterprises modernizing legacy software."
    },
    {
      id: "uiux",
      title: "UI/UX Architecture & Design Systems",
      icon: "palette",
      badge: "Design Craft",
      description: "Crafting memorable, award-winning user interfaces, seamless micro-interactions, and scalable design token systems that delight users.",
      deliverables: [
        "Comprehensive Figma design system with components & variants",
        "Accessible, high-performance HTML/CSS component library",
        "Micro-animations, page transitions, and interactive physics",
        "100% WCAG 2.1 AA accessibility audit & compliance"
      ],
      idealFor: "Products that need to stand out from generic templates and build instant credibility."
    },
    {
      id: "cloud-devops",
      title: "Cloud Architecture, DevOps & Optimization",
      icon: "cloud-lightning",
      badge: "High Performance",
      description: "Designing resilient AWS/GCP cloud environments, automated Docker/K8s pipelines, and extreme latency optimization.",
      deliverables: [
        "Infrastructure as Code (Terraform) & Dockerization",
        "Automated CI/CD pipelines with GitHub Actions / GitLab",
        "Database query tuning, Redis caching, and edge CDN distribution",
        "Full-stack observability (Sentry, Prometheus, Grafana)"
      ],
      idealFor: "Companies scaling from 10k to 1M+ active users without latency spikes."
    },
    {
      id: "ai-integration",
      title: "AI Workflows & LLM Application Engineering",
      icon: "cpu",
      badge: "Modern Edge",
      description: "Integrating intelligent LLM pipelines, autonomous agent workflows, RAG knowledge retrieval, and custom AI tools into web systems.",
      deliverables: [
        "Retrieval-Augmented Generation (RAG) with vector databases",
        "Streaming multi-agent execution graphs with LangChain/LlamaIndex",
        "Semantic search & intelligent document processing",
        "Secure token rate-limiting and prompt firewall guardrails"
      ],
      idealFor: "Businesses looking to automate workflows and add smart intelligence to products."
    }
  ],

  achievements: [
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2024",
      icon: "award",
      desc: "Validated expertise in distributed cloud architectures, high-availability setups, and cloud security."
    },
    {
      title: "1st Place Winner — Global AI Hackathon",
      issuer: "Devpost / Techstars",
      date: "2023",
      icon: "zap",
      desc: "Built an autonomous research agent graph within 48 hours, selected top out of 1,200+ global participants."
    },
    {
      title: "Meta Certified Frontend Developer",
      issuer: "Meta / Coursera",
      date: "2022",
      icon: "check-circle",
      desc: "Demonstrated advanced mastery in responsive UI architecture, UX design principles, and modern React."
    },
    {
      title: "Open Source Contributor & Maintainer",
      issuer: "GitHub Community",
      date: "Ongoing",
      icon: "git-branch",
      desc: "Active maintainer of open-source developer tooling with 1,800+ stars and 80k+ monthly downloads."
    }
  ],

  testimonials: [
    {
      quote: "Rishabh is one of those rare engineers who possesses both deep architectural knowledge and exceptional design taste. He rebuilt our core product frontend and backend, cutting our API response times in half while delivering an interface our enterprise clients rave about.",
      author: "Alex Morgan",
      role: "VP of Engineering",
      company: "Cognitive Scale Labs",
      rating: 5,
      avatar: "AM"
    },
    {
      quote: "Working with Rishabh was a game changer for our seed-stage startup. He delivered our complete SaaS MVP two weeks ahead of schedule, with clean documentation and spotless code quality. Investors specifically complimented how fast and intuitive the platform felt.",
      author: "Elena Rostova",
      role: "Founder & CEO",
      company: "AuraPay Fintech",
      rating: 5,
      avatar: "ER"
    },
    {
      quote: "The design system and component architecture Rishabh built for us boosted our team's shipping speed by over 3x. His attention to micro-interactions, accessibility, and clean code is world-class. Truly an 10x engineer.",
      author: "Marcus Chen",
      role: "Lead Product Designer",
      company: "Aether Cloud Systems",
      rating: 5,
      avatar: "MC"
    }
  ],

  faqs: [
    {
      question: "Are you available for full-time roles or freelance contracts?",
      answer: "Yes! I am actively open to high-impact Senior/Lead Full-Stack or UI/UX Engineering roles (Full-Time or Long-Term Contract), as well as selective consulting and freelance architecture projects."
    },
    {
      question: "What is your typical tech stack for new projects?",
      answer: "My go-to modern stack is Next.js 14/15 (React, TypeScript, Tailwind CSS) for the frontend, combined with Node.js/Go/Python for backend services, PostgreSQL with Prisma/Drizzle for relational data, Redis for caching, and AWS/Docker for cloud infrastructure. However, I always select the exact right tool tailored to the problem."
    },
    {
      question: "How do you approach UI/UX design and development?",
      answer: "I treat design and code as two sides of the same coin. I start by understanding the user flow and problem space in Figma, defining rigorous design tokens (typography, color spaces, spacing), and then translating them into clean, accessible, 60fps responsive code with smooth micro-interactions."
    },
    {
      question: "What timezones do you collaborate with?",
      answer: "I am based in Bengaluru, India (UTC+5:30) and regularly collaborate with teams in North America (PST/EST), Europe (GMT/CET), and APAC with substantial timezone overlap."
    },
    {
      question: "How quickly can we start on a project?",
      answer: "For freelance and consulting engagements, I can typically kick off within 3 to 7 business days following an initial discovery call. Feel free to use the contact form or schedule a direct chat via Calendly!"
    }
  ]
};
