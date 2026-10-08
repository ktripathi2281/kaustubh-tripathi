// All site content lives here. Facts are sourced from the résumé (public/resume.pdf)
// and, for each project, its repository's README.

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
  // Public Web3Forms access key for the letter (safe to publish). Empty: letters open in the visitor's mail app.
  letterKey: "012be787-faa5-4745-90a7-27775d7a9ca8",
  source: "https://github.com/ktripathi2281/kaustubh-tripathi",
  site: "https://kauswhynot.vercel.app",
  availability: "Open to software & AI engineering roles",
  lede: "I build dependable software, including language-model systems that hold their shape when the model doesn't.",
};

export const statement = {
  pull: "The model is the least reliable part of the system. Everything I build around it is designed to hold.",
  body: [
    "I am a software engineer first. At Tata Consultancy Services I work on Java and Spring Boot services for a banking product, where the job is keeping legacy systems fast, correct and debuggable in production. Lately I’ve been bringing the same instincts to language models.",
    "In practice that means typed, schema-validated outputs, guardrails that reject answers contradicting what a user has already confirmed, a deterministic fallback behind every model route, and a log entry for every decision an agent makes.",
  ],
};

// Each project renders as one datasheet section, in this order.
// `meta` rows become the Parameters table. `diagram` drives the block diagram:
// `steps` run in order (a string, or { label, note, link: "both", loop, accent }),
// a step with `split` branches into parallel rows, and `rail` runs under the
// whole flow. Exactly one element per diagram is the accent.
export const projects = [
  {
    id: "kavach",
    name: "Kavach",
    kicker: "AI cybercrime support platform",
    meta: [
      ["Context", "Build What Moves India Hackathon, 2-person team"],
      ["Stack", "GPT-5, GPT-5-mini, GPT-4o-transcribe; Next.js, TypeScript, Supabase, IndexedDB"],
      ["Model routes", "6"],
      ["Languages", "22"],
      ["Action steps", "10"],
    ],
    description:
      "Reporting cybercrime in India means dealing with several portals, helplines and banks, each with its own deadlines. Kavach replaces all of that with a single case file of ten ordered, deadline-tracked steps, in any of the 22 scheduled Indian languages, by voice or text.",
    notes: [
      "Strict JSON-schema outputs on every route, sent through a provider-agnostic HTTP client with no SDK lock-in.",
      "Hybrid regex + LLM extraction of transaction IDs (UTRs), phone numbers and UPI IDs.",
      "A contradiction guardrail throws out any draft that conflicts with facts the citizen has confirmed.",
    ],
    breaks:
      "The model drafts something that contradicts what the citizen confirmed, or no model is reachable at all.",
    holds:
      "A contradiction guardrail throws the draft out, and a rules engine runs alongside so the app still works with no API key.",
    diagram: {
      steps: [
        "voice or text",
        "triage",
        "regex + LLM extraction",
        "citizen confirms",
        "draft",
        "contradiction guardrail",
        { label: "case file", note: "10 steps" },
      ],
      rail: "rules engine · works with no API key",
    },
    links: [
      { label: "Essay", href: "/essays/kavach/", internal: true },
      { label: "Visit", href: "https://cybercrime-assistant.vercel.app" },
      { label: "Source", href: "https://github.com/ashusnapx/hackathon" },
    ],
  },
  {
    id: "deepresearch",
    name: "DeepResearch",
    kicker: "Local-first research system with verified citations",
    meta: [
      ["Stack", "Python, FastAPI; Next.js, TypeScript; PostgreSQL + pgvector; Ollama qwen3:4b"],
      ["Answer outcomes", "4"],
      ["Agent tools", "3, read-only"],
      ["Tests", "429 backend + 46 frontend"],
    ],
    description:
      "Investigates complex questions across a document corpus and returns evidence-backed answers with citations, running locally with no paid APIs. It retrieves with vector and keyword search, answers only from that evidence, verifies each cited claim, and says so explicitly when evidence is missing or sources conflict.",
    notes: [
      "Hybrid retrieval: pgvector plus BM25, fused with Reciprocal Rank Fusion, then a local cross-encoder reranker (top 20 to top 5).",
      "A bounded agent: 8 iterations, 12 tool calls, 60 seconds, read-only tools only.",
      "An adversarial test suite covering prompt injection, tool abuse, malformed output and log leakage.",
    ],
    breaks: "The evidence does not support an answer, or two sources disagree.",
    holds:
      "It abstains or flags the conflict instead of inventing an answer, and an empty verifier response fails the job closed.",
    diagram: {
      steps: [
        "question",
        "hybrid retrieval",
        "rerank",
        "grounded answer",
        "cite",
        "verify",
        {
          label: "outcome",
          split: [["answered"], [{ label: "insufficient or conflicting evidence → say so", accent: true }]],
        },
      ],
    },
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/DeepResearch" }],
  },
  {
    id: "loopdetector",
    name: "Loop Detector",
    kicker: "Claude Code mod that catches agent loops",
    meta: [
      ["Stack", "TypeScript; Claude Code Mods API (function hooks)"],
      ["Signals", "7"],
      ["Score bands", "3"],
      ["Actions", "4"],
    ],
    description:
      "A Claude Code mod that notices when Claude is stuck repeating the same approach and helps it out before it burns time and tokens. Detection is deterministic: plain heuristics over the tool calls Claude makes and what they return, with no model calls and no network.",
    notes: [
      "Seven signals, each scored 0 to 100, combine into one loop score; repetition by itself tops out at 25.",
      "A loop warns once, and again only when its band rises, its repetitions double, or it returns after 15 quiet tool calls.",
      "Nothing stops Claude on its own: every intervention is a button the user presses.",
    ],
    breaks: "A coding agent repeats the same edit, test, failure cycle and makes no progress.",
    holds:
      "Deterministic heuristics flag the loop and a Rethink prompt asks Claude for a different approach. Nothing reaches Claude without the user pressing a button.",
    diagram: {
      steps: [
        "tool call",
        "record",
        "seven signals",
        "loop score",
        "warning card",
        { label: "Rethink · the user presses the button", accent: true },
      ],
    },
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/LoopDetector" }],
  },
  {
    id: "leetcode",
    name: "LeetCode Agent Tracker",
    kicker: "Autonomous interview-prep platform",
    meta: [
      ["Stack", "Google Gemini function calling; React, Express, MongoDB"],
      ["Agents", "3"],
      ["Tools", "4"],
      ["Iterations", "Up to 8"],
    ],
    description:
      "An interview-prep platform with three agents: a planner that builds each week's study plan on its own, a Socratic tutor that hints instead of answering, and a post-mortem reviewer that flags suboptimal complexity in solved code.",
    notes: [
      "The planner can act only through four database tools, which keeps it bounded and reviewable.",
      "Leitner-style spaced repetition, topic heatmaps and company-readiness analytics.",
      "Every call is logged with its tool calls, reasoning trace and latency.",
    ],
    breaks: "A planning agent left to act on its own drifts, loops, or does something nobody can review.",
    holds:
      "It can act only through four database tools, stops at eight iterations, and every call is logged with its tool calls, reasoning trace and latency.",
    diagram: {
      steps: [
        "planner",
        { label: "4 read-only database tools", link: "both", loop: "up to 8 iterations" },
        "plan checked: shape, then facts",
        "weekly plan",
      ],
      rail: "audit log · one entry per run",
    },
    links: [
      { label: "Essay", href: "/essays/leetcode/", internal: true },
      { label: "Source", href: "https://github.com/ktripathi2281/LeetCode-Tracker" },
    ],
  },
  {
    id: "tollgate",
    name: "Tollgate",
    kicker: "LLM gateway in Go with spend control · in progress",
    status: "In progress",
    meta: [["Stack", "Go; OpenAI-compatible API"]],
    // Only what docs/PROGRESS.md marks as built (milestones M0 and M1).
    description:
      "An OpenAI-compatible LLM gateway in Go, designed for payments-grade spend control. Built so far: non-streaming chat completions and a model list through a mock provider, strict request validation, model aliases and prices in config, request IDs, an access log, panic recovery, and an in-flight cap that sheds excess requests with a 503.",
    breaks: "A retried request is charged twice, or a key spends past its budget.",
    holds:
      "The design holds budgets before the call and settles them after it in integer micro-USD, with idempotency keys and a reconcile command. This part is planned, not yet built.",
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/Tollgate" }],
  },
  {
    id: "rideradar",
    name: "Ride Radar",
    kicker: "Real-time group trip tracker",
    meta: [
      ["Stack", "Socket.io, React Leaflet, OpenStreetMap; Express, MongoDB"],
      ["Rooms", "One per trip"],
      ["Trails", "1,000 points per rider"],
    ],
    description:
      "A live map for groups riding together. Each rider's position, battery level and SOS alerts reach everyone in the group in real time, and a rider who loses signal fades to their last known position instead of disappearing.",
    notes: [
      "JWT is checked at the socket handshake, and every event stays inside its trip's room.",
      "Location trails are capped at 1,000 points per rider, so history stays a constant size.",
    ],
    breaks: "A rider loses signal in the middle of a trip.",
    holds:
      "They fade to their last known position instead of disappearing, and trails are capped at 1,000 points so history stays a constant size.",
    diagram: {
      steps: [
        "rider",
        "JWT at socket handshake",
        "trip room",
        "group map",
        { label: "signal lost → last known position", accent: true },
      ],
    },
    links: [
      { label: "Visit", href: "https://ride-radar-sand.vercel.app/" },
      { label: "Source", href: "https://github.com/ktripathi2281/RideRadar" },
    ],
  },
  {
    id: "skillbarter",
    name: "Skill Barter",
    kicker: "Peer-to-peer skill exchange",
    meta: [
      ["Stack", "MongoDB 2dsphere, Socket.io, JWT; React, Express"],
      ["Matches", "Mutual & one-way, ranked by distance"],
    ],
    description:
      "A place to trade skills without money. It solves the double coincidence of wants: you teach what I want to learn, I teach what you want. Matches are ranked by distance, and every trade needs both people to agree.",
    notes: [
      "Real-time chat and a trade lifecycle that requires consent from both sides.",
      "Dual-token JWT with silent renewal, OTP email verification, rate limiting and CORS whitelisting.",
    ],
    breaks: "A match that only works for one side.",
    holds: "Every trade needs both people to agree before it moves forward.",
    diagram: {
      steps: [
        "you",
        { label: "match", link: "both", note: "ranked by distance" },
        { split: [["mutual match", { label: "both agree → trade", accent: true }], ["one-way interest"]] },
      ],
    },
    links: [
      { label: "Visit", href: "https://skill-barter-psi.vercel.app/" },
      { label: "Source", href: "https://github.com/ktripathi2281/Skill-Barter" },
    ],
  },
];

// Official details from each credential's public Open Badges record on Credly.
export const certificates = {
  lead: "Two proctored exams from Anthropic on building production systems with Claude, passed a week apart in September 2026.",
  items: [
    {
      id: "architect",
      title: "Claude Certified Architect",
      level: "Foundations",
      description:
        "For solution architects: designing and building production-grade applications on Claude with Claude Code, the Agent SDK, the Claude API and MCP.",
      issued: "19 September 2026",
      validThrough: "September 2027",
      covers: "AI system design, multi-agent orchestration, context management, tool & MCP design, production reliability",
      href: "https://www.credly.com/badges/2bfa241d-e6f9-4330-8f23-37c70505c45a/public_url",
    },
    {
      id: "developer",
      title: "Claude Certified Developer",
      level: "Foundations",
      description:
        "For developers: building, integrating and shipping production applications and agents on Claude with the Claude API, Claude Code, custom tools and MCP servers.",
      issued: "12 September 2026",
      validThrough: "September 2027",
      covers: "Agent development, Claude API integration, MCP server development, evals & debugging, application security",
      href: "https://www.credly.com/badges/2e1ecb88-4f11-4f3c-b7cf-a10251856c05/public_url",
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
  ["Models", "OpenAI GPT-5 family, Google Gemini, Ollama (local models)"],
  ["Methods", "Tool calling, agentic workflows, structured outputs, multi-model routing, guardrails, fallbacks, audit logging"],
  ["Languages", "Java, TypeScript, JavaScript, Python, Go, SQL, C++"],
  ["Frameworks", "Spring Boot, Spring Security, Node.js, Express, React, Next.js, FastAPI"],
  ["Data", "PostgreSQL, pgvector, MongoDB, Redis, MySQL, Supabase"],
  ["Tools", "Docker, GitHub Actions, Jenkins, Git, Linux, Vitest"],
];

// The essays, listed as application notes (titles match content/essays/*.md).
export const essays = [
  { slug: "kavach", title: "Confidently wrong" },
  { slug: "leetcode", title: "Show your work" },
];

// "AN-01" for the first essay, and so on.
export const noteNumber = (slug) => `AN-${String(essays.findIndex((e) => e.slug === slug) + 1).padStart(2, "0")}`;
