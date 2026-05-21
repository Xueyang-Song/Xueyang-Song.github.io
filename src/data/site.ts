import type { ReleaseAssetPatterns } from "../lib/download";

export type ProfileLink = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  location: string;
  tagline: string;
  summary: string;
  avatarUrl: string;
  metrics: Array<{ label: string; value: string }>;
  links: ProfileLink[];
  researchThemes: Array<{
    title: string;
    summary: string;
    tags: string[];
  }>;
};

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  citations: number;
  url: string;
  tags: string[];
  featured: boolean;
};

export type AppConfig = {
  slug: string;
  name: string;
  repo: string;
  versionStatus: "coming-soon" | "available";
  shortDescription: string;
  audience: string;
  positioning: string;
  features: string[];
  workflow: string[];
  platforms: string[];
  releaseAssets: ReleaseAssetPatterns;
  primaryCta: string;
  secondaryCta: string;
  accent: "sage" | "sea" | "amber";
};

export type Project = {
  name: string;
  description: string;
  href: string;
  tags: string[];
};

export type AtlasLayer = "research" | "software" | "publication" | "project";

export type AtlasNode = {
  id: string;
  label: string;
  kind: AtlasLayer;
  x: number;
  y: number;
  summary: string;
  href?: string;
};

export type AtlasLink = {
  source: string;
  target: string;
  label: string;
  strength: "primary" | "secondary";
};

export const profile: Profile = {
  name: "Xueyang Song",
  location: "Canada",
  tagline: "I research batteries and build ML/software tools.",
  summary:
    "I work at the intersection of electrochemical materials, atomic-layer deposition, and applied machine learning. I also build research tools that keep scientific workflows local, inspectable, and reproducible.",
  avatarUrl: "https://avatars.githubusercontent.com/u/60683632?v=4",
  metrics: [
    { label: "Scholar citations", value: "672" },
    { label: "Scholar h-index", value: "6" },
    { label: "Public GitHub repos", value: "16" },
  ],
  links: [
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=4FvfgxkAAAAJ&hl=en",
    },
    { label: "GitHub", href: "https://github.com/Xueyang-Song" },
  ],
  researchThemes: [
    {
      title: "Aqueous zinc batteries",
      summary:
        "I study interfacial stability, dendrite suppression, water-in-salt electrolytes, and practical screening of zinc-ion battery materials.",
      tags: ["Zn metal", "electrolytes", "interfaces"],
    },
    {
      title: "ALD and materials coatings",
      summary:
        "I use atomic and molecular layer deposition to think about protective coatings, anode stabilization, and surface-controlled battery behavior.",
      tags: ["ALD", "MLD", "surface chemistry"],
    },
    {
      title: "Scientific ML software",
      summary:
        "I build around small-data modeling, literature curation, notebook workflows, and local-first desktop tools for research teams.",
      tags: ["ML", "Electron", "local-first"],
    },
  ],
};

export const publications: Publication[] = [
  {
    title:
      "Highly stable Zn metal anodes enabled by atomic layer deposited Al2O3 coating for aqueous zinc-ion batteries",
    authors: "H. He, H. Tong, X. Song, X. Song, J. Liu",
    venue: "Journal of Materials Chemistry A",
    year: "2020",
    citations: 509,
    url: "https://doi.org/10.1039/D0TA00748J",
    tags: ["Zn anode", "ALD", "battery"],
    featured: true,
  },
  {
    title:
      "Enhanced reversibility and electrochemical window of Zn-ion batteries with an acetonitrile/water-in-salt electrolyte",
    authors: "X. Song, H. He, M. H. A. Shiraz, H. Zhu, A. Khosrozadeh, J. Liu",
    venue: "Chemical Communications",
    year: "2021",
    citations: 90,
    url: "https://doi.org/10.1039/D0CC06076C",
    tags: ["Zn-ion", "water-in-salt", "electrolyte"],
    featured: true,
  },
  {
    title: "Electronic Metal-Support Interactions between Pt Nanoparticles and Co(OH)2 Flakes for CO Oxidation",
    authors: "X. Song, L. Huang, W. He, C. Liu, F. Hu, Y. Jiang, Z. Sun, S. Wei",
    venue: "The Journal of Physical Chemistry C",
    year: "2019",
    citations: 31,
    url: "https://doi.org/10.1021/acs.jpcc.8b12518",
    tags: ["catalysis", "interfaces", "nanomaterials"],
    featured: true,
  },
  {
    title: "In situ observations of the structural dynamics of platinum-cobalt-hydroxide nanocatalysts under CO oxidation",
    authors: "L. Huang, X. Song, Y. Lin, C. Liu, W. He, S. Wang, Z. Long, Z. Sun",
    venue: "Nanoscale",
    year: "2020",
    citations: 18,
    url: "https://doi.org/10.1039/C9NR10950A",
    tags: ["in situ", "catalysis", "structure"],
    featured: true,
  },
  {
    title: "Molecular-layer-deposited tincone: a new hybrid organic-inorganic anode material for three-dimensional microbatteries",
    authors: "H. Zhu, M. H. Aboonasr Shiraz, L. Yao, K. Adair, Z. Wang, H. Tong, X. Song, T. K. Sham, M. Arjmand, X. Song, J. Liu",
    venue: "Chemical Communications",
    year: "2020",
    citations: 14,
    url: "https://doi.org/10.1039/D0CC03869E",
    tags: ["MLD", "microbatteries", "anode"],
    featured: true,
  },
  {
    title:
      "Machine Learning-Driven Optimization of ALD Coatings for Enhanced Interfacial Stability in Advanced Battery Materials",
    authors: "X. Song",
    venue: "ChemRxiv",
    year: "2026",
    citations: 0,
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=4FvfgxkAAAAJ",
    tags: ["machine learning", "ALD", "battery materials"],
    featured: false,
  },
  {
    title:
      "Transfer Learning from Lithium-Ion to Zinc-Ion Batteries: Cross-Chemistry Capacity Prediction with Limited Target Data",
    authors: "X. Song",
    venue: "ChemRxiv",
    year: "2026",
    citations: 0,
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=4FvfgxkAAAAJ",
    tags: ["transfer learning", "capacity prediction", "small data"],
    featured: false,
  },
];

export const apps: AppConfig[] = [
  {
    slug: "paper-pilot",
    name: "Paper Pilot",
    repo: "https://github.com/Xueyang-Song/paper-pilot",
    versionStatus: "coming-soon",
    shortDescription:
      "I'm building Paper Pilot as a local-first Electron research assistant for crawling papers, organizing artifacts, and generating AI-backed scientific briefs.",
    audience:
      "I'm building this for scientists who need a transparent desktop workflow for literature discovery, full-text collection, and project-scoped synthesis.",
    positioning:
      "With Paper Pilot, I'm bringing academic source crawlers, local SQLite storage, open-access PDF handling, search, and AI synthesis into one desktop workspace.",
    features: [
      "Project workspaces for chat, crawl jobs, papers, artifacts, and reports.",
      "API-first source registry for OpenAlex, Crossref, Semantic Scholar, PubMed, arXiv, Europe PMC, CORE, and Unpaywall.",
      "Local FTS and vector search over imported papers and generated artifacts.",
      "Approval-gated Python, browser, and research-agent workflows.",
    ],
    workflow: [
      "Create a research project.",
      "Launch a crawl or ask a research question.",
      "Approve source, script, or browser jobs when policy requires it.",
      "Review papers, PDFs, logs, and generated briefs in the artifact panel.",
    ],
    platforms: ["Windows build path ready", "macOS planned", "Linux planned"],
    releaseAssets: {
      windows: [".exe", "Setup"],
      mac: [".dmg"],
      linux: [".AppImage", ".deb"],
    },
    primaryCta: "Download Paper Pilot",
    secondaryCta: "View source",
    accent: "sea",
  },
  {
    slug: "academia-ml",
    name: "AcademiaML",
    repo: "https://github.com/Xueyang-Song/academia-ml",
    versionStatus: "coming-soon",
    shortDescription:
      "I'm building AcademiaML as a notebook-first Electron desktop tool for researchers with tabular data who need help selecting and running ML workflows.",
    audience:
      "I'm building this for researchers who want Jupyter-style notebooks, local Python environments, and advisor chat without giving up project ownership.",
    positioning:
      "I'm shaping AcademiaML like a research workstation: real folders, real notebooks, local kernels, data summaries, and approval-based agent help.",
    features: [
      "Readable project folders with notebooks, raw data, derived data, artifacts, and logs.",
      "Per-project Python runtime bootstrapping and local Jupyter kernel execution.",
      "Advisor chat for OpenAI-compatible providers using only approved data context.",
      "Agent queue and approvals for local Copilot-assisted workflow steps.",
    ],
    workflow: [
      "Create or open a project folder.",
      "Import tabular data and inspect inferred schema, column types, and summaries.",
      "Work in notebooks while the advisor suggests modeling paths.",
      "Approve broader agent actions only when the research context is ready.",
    ],
    platforms: ["Windows packaging planned", "macOS planned", "Linux planned"],
    releaseAssets: {
      windows: [".exe", "Setup"],
      mac: [".dmg"],
      linux: [".AppImage", ".deb"],
    },
    primaryCta: "Download AcademiaML",
    secondaryCta: "View source",
    accent: "sage",
  },
];

export const projects: Project[] = [
  {
    name: "Water-in-Salt Zn Electrolyte Atlas",
    description:
      "An interactive research companion for organic co-solvents in water-in-salt zinc-ion battery electrolytes.",
    href: "https://github.com/Xueyang-Song/wis-zn-electrolyte",
    tags: ["battery", "ML", "interactive atlas"],
  },
  {
    name: "Machine Learning for ALD-Coated Zinc Anodes",
    description:
      "A reproducible workflow for small-data lifespan prediction across ALD, MLD, and PEALD coatings.",
    href: "https://github.com/Xueyang-Song/machine-learning-ald-zinc-battery",
    tags: ["ALD", "Zn anodes", "small data"],
  },
  {
    name: "Battery Paper Crawler",
    description:
      "A targeted, auditable Scholar-based literature harvesting workflow for battery and electrochemistry research.",
    href: "https://github.com/Xueyang-Song/battery-paper-crawler",
    tags: ["literature", "Python", "crawler"],
  },
  {
    name: "Radiative Cooling Workspace",
    description:
      "A machine-learning-assisted workflow that links candidate proposal, model comparison, and physics re-verification.",
    href: "https://github.com/Xueyang-Song/radia-cooling",
    tags: ["materials ML", "verification", "React"],
  },
];

export const atlasNodes: AtlasNode[] = [
  {
    id: "zn-anode",
    label: "Zn anode",
    kind: "research",
    x: 30,
    y: 40,
    summary: "Interfacial stability, coating behavior, and lifespan signals.",
  },
  {
    id: "electrolyte",
    label: "Electrolyte",
    kind: "research",
    x: 48,
    y: 24,
    summary: "Water-in-salt formulations, solvents, windows, and conductivity.",
  },
  {
    id: "ald-coating",
    label: "ALD coating",
    kind: "research",
    x: 62,
    y: 48,
    summary: "Protective surface layers for battery interfaces.",
  },
  {
    id: "ml-models",
    label: "ML models",
    kind: "software",
    x: 47,
    y: 66,
    summary: "Small-data modeling, leakage checks, interpretation, and transfer.",
  },
  {
    id: "literature-corpus",
    label: "Literature corpus",
    kind: "publication",
    x: 74,
    y: 30,
    summary: "Papers, metadata, open-access artifacts, and citation trails.",
  },
  {
    id: "desktop-tools",
    label: "Desktop tools",
    kind: "software",
    x: 70,
    y: 72,
    summary: "Paper Pilot and AcademiaML as local-first research workspaces.",
  },
  {
    id: "dataset-atlas",
    label: "Dataset atlas",
    kind: "project",
    x: 24,
    y: 72,
    summary: "Curated tables, descriptors, plots, and reproducible outputs.",
  },
];

export const atlasLinks: AtlasLink[] = [
  { source: "zn-anode", target: "ald-coating", label: "interface", strength: "primary" },
  { source: "zn-anode", target: "electrolyte", label: "compatibility", strength: "primary" },
  { source: "electrolyte", target: "literature-corpus", label: "source evidence", strength: "secondary" },
  { source: "ald-coating", target: "ml-models", label: "descriptors", strength: "primary" },
  { source: "ml-models", target: "desktop-tools", label: "workflow", strength: "primary" },
  { source: "dataset-atlas", target: "ml-models", label: "training data", strength: "secondary" },
  { source: "literature-corpus", target: "desktop-tools", label: "crawl and synthesize", strength: "secondary" },
  { source: "dataset-atlas", target: "zn-anode", label: "curated observations", strength: "secondary" },
];

export function getApp(slug: string) {
  return apps.find((app) => app.slug === slug);
}
