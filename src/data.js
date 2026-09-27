// All site content lives here. Facts are sourced from the résumé (public/resume.pdf).

export const profile = {
  name: "Kaustubh Tripathi",
  first: "Kaustubh",
  last: "Tripathi",
  role: "Software & AI Engineer",
  location: "Bangalore",
  email: "tripathikaustubh2281@gmail.com",
  github: "https://github.com/ktripathi2281",
  linkedin: "https://www.linkedin.com/in/kaustubh-tripathi",
  resume: "/resume.pdf",
  source: "https://github.com/ktripathi2281/kaustubh-tripathi",
  availability: "Open to software & AI engineering roles",
  lede: "I build dependable software, including language-model systems that hold their shape when the model doesn't.",
};

export const frontispiece = {
  plate: "Plate 0",
  title: "Model, contained",
  caption:
    "A single line wanders for 4,000 random steps and never leaves its boundary. The red line is the only way out, through a gate. This is how I build with AI.",
  hint: "Hover over or tap any part of a drawing to read it.",
};

export const statement = {
  pull: "The model is the least reliable part of the system. Everything I build around it is designed to hold.",
  body: [
    "I am a software engineer first. At Tata Consultancy Services I work on Java and Spring Boot services for a banking product, where the job is keeping legacy systems fast, correct and debuggable in production. Lately I’ve been bringing the same instincts to language models.",
    "In practice that means typed, schema-validated outputs, guardrails that reject answers contradicting what a user has already confirmed, a deterministic fallback behind every model route, and a log entry for every decision an agent makes. The drawings on this page are made the same way: generated in code, but held inside rules.",
  ],
};

export const projects = [
  {
    id: "kavach",
    plate: "I",
    name: "Kavach",
    kicker: "AI cybercrime support platform",
    meta: [
      ["Context", "Build What Moves India Hackathon, 2-person team"],
      ["Medium", "GPT-5, GPT-5-mini, GPT-4o-transcribe; Next.js, TypeScript, Supabase, IndexedDB"],
      ["Dimensions", "6 model routes · 22 languages · 10 action steps"],
    ],
    description:
      "Reporting cybercrime in India means dealing with several portals, helplines and banks, each with its own deadlines. Kavach replaces all of that with a single case file of ten ordered, deadline-tracked steps, in any of the 22 scheduled Indian languages, by voice or text.",
    notes: [
      "Strict JSON-schema outputs on every route, sent through a provider-agnostic HTTP client with no SDK lock-in.",
      "Hybrid regex + LLM extraction of transaction IDs (UTRs), phone numbers and UPI IDs.",
      "A contradiction guardrail throws out any draft that conflicts with facts the citizen has confirmed.",
    ],
    drawing:
      "Six lines, one per model route, converge into one case file of ten steps. The red line is the rules engine, running alongside the whole way so the app still works with no API key.",
    links: [
      { label: "Visit", href: "https://cybercrime-assistant.vercel.app" },
      { label: "Source", href: "https://github.com/ashusnapx/hackathon" },
    ],
  },
  {
    id: "leetcode",
    plate: "II",
    name: "LeetCode Agent Tracker",
    kicker: "Autonomous interview-prep platform",
    meta: [
      ["Context", "Independent project"],
      ["Medium", "Google Gemini function calling; React, Express, MongoDB"],
      ["Dimensions", "3 agents · 4 tools · up to 8 iterations"],
    ],
    description:
      "An interview-prep platform with three agents: a planner that builds each week's study plan on its own, a Socratic tutor that hints instead of answering, and a post-mortem reviewer that flags suboptimal complexity in solved code.",
    notes: [
      "The planner can act only through four database tools, which keeps it bounded and reviewable.",
      "Leitner-style spaced repetition, topic heatmaps and company-readiness analytics.",
      "Every call is logged with its tool calls, reasoning trace and latency.",
    ],
    drawing:
      "Each loop is one iteration of the planning agent, reaching out to one of its four tools and returning. The red line is the audit log, with one mark per iteration.",
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/LeetCode-Tracker" }],
  },
  {
    id: "skillbarter",
    plate: "III",
    name: "Skill Barter",
    kicker: "Peer-to-peer skill exchange",
    meta: [
      ["Context", "Independent project"],
      ["Medium", "MongoDB 2dsphere, Socket.io, JWT; React, Express"],
      ["Dimensions", "Mutual & one-way matches, ranked by distance"],
    ],
    description:
      "A place to trade skills without money. It solves the double coincidence of wants: you teach what I want to learn, I teach what you want. Matches are ranked by distance, and every trade needs both people to agree.",
    notes: [
      "Real-time chat and a trade lifecycle that requires consent from both sides.",
      "Dual-token JWT with silent renewal, OTP email verification, rate limiting and CORS whitelisting.",
    ],
    drawing:
      "Lens shapes are mutual matches and single arcs are one-way interest. The rings measure distance from you, and your nearest mutual match is drawn in red.",
    links: [
      { label: "Visit", href: "https://skill-barter-psi.vercel.app/" },
      { label: "Source", href: "https://github.com/ktripathi2281/Skill-Barter" },
    ],
  },
  {
    id: "rideradar",
    plate: "IV",
    name: "Ride Radar",
    kicker: "Real-time group trip tracker",
    meta: [
      ["Context", "Independent project"],
      ["Medium", "Socket.io, React Leaflet, OpenStreetMap; Express, MongoDB"],
      ["Dimensions", "Per-trip rooms · 1,000-point trails"],
    ],
    description:
      "A live map for groups riding together. Each rider's position, battery level and SOS alerts reach everyone in the group in real time, and a rider who loses signal fades to their last known position instead of disappearing.",
    notes: [
      "JWT is checked at the socket handshake, and every event stays inside its trip's room.",
      "Location trails are capped at 1,000 points per rider, so history stays a constant size.",
    ],
    drawing:
      "Five riders make their way to a shared checkpoint across a map grid. One stops, and the group sees it at once.",
    links: [
      { label: "Visit", href: "https://ride-radar-sand.vercel.app/" },
      { label: "Source", href: "https://github.com/ktripathi2281/RideRadar" },
    ],
  },
];

// Official details from each credential's public Open Badges record on Credly.
export const certificates = {
  lead: "Two proctored exams from Anthropic on building production systems with Claude, passed a week apart in September 2026.",
  items: [
    {
      id: "architect",
      numeral: "I",
      title: "Claude Certified Architect",
      level: "Foundations",
      description:
        "For solution architects: designing and building production-grade applications on Claude with Claude Code, the Agent SDK, the Claude API and MCP.",
      issued: "19 September 2026",
      validThrough: "September 2027",
      covers: "AI system design, multi-agent orchestration, context management, tool & MCP design, production reliability",
      href: "https://www.credly.com/badges/2bfa241d-e6f9-4330-8f23-37c70505c45a/public_url",
      badge: "/images/badges/claude-architect.png",
      inscription: "Claude Certified Architect · Foundations · MMXXVI · ",
      // An even, regular lattice: structure first.
      pattern: { r0: 76, amp: 12, waves: 16, copies: 5 },
    },
    {
      id: "developer",
      numeral: "II",
      title: "Claude Certified Developer",
      level: "Foundations",
      description:
        "For developers: building, integrating and shipping production applications and agents on Claude with the Claude API, Claude Code, custom tools and MCP servers.",
      issued: "12 September 2026",
      validThrough: "September 2027",
      covers: "Agent development, Claude API integration, MCP server development, evals & debugging, application security",
      href: "https://www.credly.com/badges/2e1ecb88-4f11-4f3c-b7cf-a10251856c05/public_url",
      badge: "/images/badges/claude-developer.png",
      inscription: "Claude Certified Developer · Foundations · MMXXVI · ",
      // A looser weave with a slow swell running through it.
      pattern: { r0: 76, amp: 10, waves: 13, copies: 7, amp2: 4, waves2: 5 },
    },
  ],
};

export const chronology = [
  {
    year: "2025",
    entries: [
      {
        text: "Joins Tata Consultancy Services, Bangalore, as Product Engineer",
        detail:
          "Backend modules in Java and Spring Boot for a fintech/banking product. SQL tuning and indexing on critical processes, production debugging, code review, and Jenkins build automation.",
      },
    ],
  },
  {
    year: "2024",
    entries: [{ text: "B.Tech, Computer Science & Engineering, CGPA 7.9" }],
  },
  {
    year: "2020",
    entries: [{ text: "Begins at Madan Mohan Malaviya University of Technology, Gorakhpur" }],
  },
];

export const materials = [
  ["Models", "OpenAI GPT-5 family, Google Gemini"],
  ["Methods", "Tool calling, agentic workflows, structured outputs, multi-model routing, guardrails, fallbacks, audit logging"],
  ["Languages", "Java, TypeScript, JavaScript, SQL, C++"],
  ["Frameworks", "Spring Boot, Spring Security, Node.js, Express, React, Next.js"],
  ["Data", "PostgreSQL, MongoDB, Redis, MySQL, Supabase"],
  ["Tools", "Docker, GitHub Actions, Jenkins, Git, Linux, Vitest"],
];
