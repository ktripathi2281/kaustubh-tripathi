// All site content lives here. Facts are sourced from the résumé (public/resume.pdf)
// and, for each project, its README.

export const profile = {
  name: "Kaustubh Tripathi",
  role: "Software & AI Engineer",
  location: "Bangalore",
  email: "tripathikaustubh2281@gmail.com",
  github: "https://github.com/ktripathi2281",
  linkedin: "https://www.linkedin.com/in/kaustubh-tripathi",
  resume: "/resume.pdf",
  source: "https://github.com/ktripathi2281/kaustubh-tripathi",
  site: "https://kauswhynot.vercel.app",
  availability: "Open to software & AI engineering roles",
  // Public Web3Forms access key for the letter in the footer (safe to publish):
  // letters arrive in the inbox behind it.
  letterKey: "012be787-faa5-4745-90a7-27775d7a9ca8",
  // The years the selected works span, for the opening.
  since: 2024,
  lede: "I build dependable software, including language-model systems that hold their shape when the model doesn't.",
};

// One scene each, in this order. Each shows its type, name, one line and
// links; "Details" opens the stack and three points. The four older projects
// are described from the résumé; DeepResearch, Loop Detector and Tollgate
// from their READMEs (and Tollgate's docs/PROGRESS.md).
export const projects = [
  {
    id: "kavach",
    name: "Kavach",
    type: "AI cybercrime support platform",
    summary: "One case file for cybercrime victims in India: ten deadline-tracked steps, 22 languages, voice or text.",
    stack: "GPT-5, GPT-5-mini, GPT-4o-transcribe · Next.js, TypeScript, Supabase, IndexedDB",
    context: "Build What Moves India Hackathon, 2-person team",
    points: [
      "Strict JSON-schema outputs on every route, through a provider-agnostic client with no SDK lock-in.",
      "Hybrid regex and LLM extraction of transaction IDs (UTRs), phone numbers and UPI IDs.",
      "A guardrail throws out any draft that contradicts facts the citizen has confirmed.",
    ],
    links: [
      { label: "Visit", href: "https://cybercrime-assistant.vercel.app" },
      { label: "Source", href: "https://github.com/ashusnapx/hackathon" },
      { label: "Essay", href: "/essays/kavach/", internal: true },
    ],
  },
  {
    id: "deepresearch",
    name: "DeepResearch",
    type: "Research system with verified citations",
    summary: "Answers questions from a document corpus with verified citations, running locally with no paid APIs.",
    stack: "Python, FastAPI, PostgreSQL + pgvector, Ollama · Next.js, React, TypeScript",
    points: [
      "Hybrid retrieval: pgvector and BM25 fused by rank, then reranked by a local cross-encoder.",
      "Every cited claim is checked against the evidence it cites before the answer is shown.",
      "Says when evidence is missing or conflicting, instead of inventing an answer.",
    ],
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/DeepResearch" }],
  },
  {
    id: "loopdetector",
    name: "Loop Detector",
    type: "Claude Code mod",
    summary: "Notices when Claude Code is stuck repeating itself, using deterministic checks and no model calls.",
    stack: "TypeScript · a Claude Code plugin of function hooks",
    points: [
      "Turns every tool call into a record: its action, target, failure fingerprint and test results.",
      "Seven deterministic signals score the work since the last real progress: same history, same verdict.",
      "Never stops Claude on its own: Inspect, Rethink, Pause and Continue are buttons you press.",
    ],
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/LoopDetector" }],
  },
  {
    id: "leetcode",
    name: "LeetCode Agent Tracker",
    type: "Interview-prep agents",
    summary: "Interview prep run by three agents: a planner, a Socratic tutor and a code reviewer.",
    stack: "Google Gemini function calling · React, Express, MongoDB",
    points: [
      "The planner acts only through four read-only tools, for at most eight turns.",
      "Leitner-style spaced repetition, topic heatmaps and company-readiness analytics.",
      "Every call is logged with its tool calls, reasoning trace and latency.",
    ],
    links: [
      { label: "Source", href: "https://github.com/ktripathi2281/LeetCode-Tracker" },
      { label: "Essay", href: "/essays/leetcode/", internal: true },
    ],
  },
  {
    id: "tollgate",
    name: "Tollgate",
    type: "LLM gateway in Go",
    summary: "An OpenAI-compatible LLM gateway in Go with payments-grade spend control.",
    // Until docs/PROGRESS.md in its repository says the project is complete.
    inProgress: true,
    stack: "Go · an OpenAI-compatible HTTP API",
    points: [
      "Designed for per-key rate limits and hold-and-settle budgets in integer micro-USD.",
      "Built so far: chat completions streamed over SSE, with first-token, idle and total timeouts.",
      "Next: real providers, with retries, fallback and circuit breakers.",
    ],
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/Tollgate" }],
  },
  {
    id: "rideradar",
    name: "Ride Radar",
    type: "Real-time group trip tracker",
    summary: "A live map for groups riding together, with battery, SOS and lost-signal handling.",
    stack: "Socket.io, React Leaflet, OpenStreetMap · Express, MongoDB",
    points: [
      "A rider who loses signal fades to their last known position instead of vanishing.",
      "JWT is checked at the socket handshake, and every event stays inside its trip's room.",
      "Trails are capped at 1,000 points per rider, so history stays a constant size.",
    ],
    links: [
      { label: "Visit", href: "https://ride-radar-sand.vercel.app/" },
      { label: "Source", href: "https://github.com/ktripathi2281/RideRadar" },
    ],
  },
  {
    id: "skillbarter",
    name: "Skill Barter",
    type: "Peer-to-peer skill exchange",
    summary: "Trade skills without money. Matches are ranked by distance, and both sides must agree.",
    stack: "MongoDB 2dsphere, Socket.io, JWT · React, Express",
    points: [
      "Finds mutual matches and one-way interest, ranked by distance.",
      "Real-time chat, and a trade lifecycle that needs consent from both sides.",
      "Dual-token JWT with silent renewal, OTP email verification, rate limiting and CORS whitelisting.",
    ],
    links: [
      { label: "Visit", href: "https://skill-barter-psi.vercel.app/" },
      { label: "Source", href: "https://github.com/ktripathi2281/Skill-Barter" },
    ],
  },
];

// Official details from each credential's public Open Badges record on Credly.
export const certificates = [
  {
    title: "Claude Certified Architect",
    issued: "19 September 2026",
    href: "https://www.credly.com/badges/2bfa241d-e6f9-4330-8f23-37c70505c45a/public_url",
  },
  {
    title: "Claude Certified Developer",
    issued: "12 September 2026",
    href: "https://www.credly.com/badges/2e1ecb88-4f11-4f3c-b7cf-a10251856c05/public_url",
  },
];

export const chronology = [
  { year: "2025", text: "Joins Tata Consultancy Services, Bangalore, as Product Engineer" },
  { year: "2024", text: "B.Tech, Computer Science & Engineering, CGPA 7.9" },
];

// The essays, for the footer (titles match content/essays/*.md).
export const essays = [
  { slug: "kavach", title: "Confidently wrong" },
  { slug: "leetcode", title: "Show your work" },
];
