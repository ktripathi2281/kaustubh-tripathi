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
  lede: "I build dependable software, including language-model systems that hold their shape when the model doesn't.",
};

// One panel each, in this order. The scroll shows `type`, `name`, `summary`
// and `links`; the longer fields are kept for reference and not rendered.
export const projects = [
  {
    id: "kavach",
    name: "Kavach",
    type: "AI cybercrime support platform",
    summary: "One case file for cybercrime victims in India: ten deadline-tracked steps, 22 languages, voice or text.",
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
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/DeepResearch" }],
  },
  {
    id: "loopdetector",
    name: "Loop Detector",
    type: "Claude Code mod",
    summary: "Notices when Claude Code is stuck repeating itself, using deterministic checks and no model calls.",
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/LoopDetector" }],
  },
  {
    id: "leetcode",
    name: "LeetCode Agent Tracker",
    type: "Interview-prep agents",
    summary: "Interview prep run by three agents: a planner, a Socratic tutor and a code reviewer.",
    meta: [
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
    links: [{ label: "Source", href: "https://github.com/ktripathi2281/Tollgate" }],
  },
  {
    id: "rideradar",
    name: "Ride Radar",
    type: "Real-time group trip tracker",
    summary: "A live map for groups riding together, with battery, SOS and lost-signal handling.",
    meta: [
      ["Medium", "Socket.io, React Leaflet, OpenStreetMap; Express, MongoDB"],
      ["Dimensions", "Per-trip rooms · 1,000-point trails"],
    ],
    description:
      "A live map for groups riding together. Each rider's position, battery level and SOS alerts reach everyone in the group in real time, and a rider who loses signal fades to their last known position instead of disappearing.",
    notes: [
      "JWT is checked at the socket handshake, and every event stays inside its trip's room.",
      "Location trails are capped at 1,000 points per rider, so history stays a constant size.",
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
    meta: [
      ["Medium", "MongoDB 2dsphere, Socket.io, JWT; React, Express"],
      ["Dimensions", "Mutual & one-way matches, ranked by distance"],
    ],
    description:
      "A place to trade skills without money. It solves the double coincidence of wants: you teach what I want to learn, I teach what you want. Matches are ranked by distance, and every trade needs both people to agree.",
    notes: [
      "Real-time chat and a trade lifecycle that requires consent from both sides.",
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
