import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import { extractText } from "unpdf";
import { PORTFOLIO_DATA, TECH_STACK_CATEGORIES } from "../src/data/portfolio";
import { ContentFrontmatterSchema } from "../src/lib/chat/schema";
import { getCollections, getMongoClient, type PassageDoc, type SourceDoc } from "../src/lib/db";
import { embedTexts, getEmbeddingConfig } from "../src/lib/embeddings";

type RawSource = {
  sourceId: string;
  sourceType: string;
  title: string;
  citationUrl?: string;
  sections: { heading: string; body: string }[];
};

type RawPassage = {
  sourceId: string;
  sourceType: string;
  title: string;
  section: string;
  text: string;
  citationUrl?: string;
  chunkIndex: number;
  contentHash: string;
};

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const fullPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;
    const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = val;
      }
    }
  }
}

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function splitIntoChunks(text: string, maxChars = 1100, overlapChars = 120): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];
  if (cleaned.length <= maxChars) return [cleaned];

  const sentences = cleaned.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [cleaned];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const s = sentence.trim();
    if (!s) continue;

    if ((current + " " + s).trim().length <= maxChars) {
      current = (current + " " + s).trim();
    } else {
      if (current) {
        chunks.push(current);
        const tail = current.slice(-overlapChars).trim();
        current = tail ? `${tail} ${s}`.trim() : s;
      } else {
        chunks.push(s.slice(0, maxChars));
        current = s.slice(maxChars).trim();
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function buildPortfolioSources(): RawSource[] {
  const sources: RawSource[] = [];

  // 1. Profile, availability & contact
  sources.push({
    sourceId: "portfolio:profile",
    sourceType: "about",
    title: `${PORTFOLIO_DATA.name} (${PORTFOLIO_DATA.title}) — Profile & Availability`,
    citationUrl: "https://debprix.in/about",
    sections: [
      {
        heading: "Overview",
        body: `${PORTFOLIO_DATA.name} (${PORTFOLIO_DATA.title}) is a ${PORTFOLIO_DATA.role} based in ${PORTFOLIO_DATA.location}. ${PORTFOLIO_DATA.tagline} ${PORTFOLIO_DATA.about.description}`,
      },
      {
        heading: "Availability & Contact",
        body: `Status: ${PORTFOLIO_DATA.status} (${PORTFOLIO_DATA.statusDescription.join(", ")}). Typical response time: ${PORTFOLIO_DATA.responseTime}. Email: ${PORTFOLIO_DATA.email}. Anonymous inbox (TellWeb): ${PORTFOLIO_DATA.tellwebUrl}. Resume: https://debprix.in${PORTFOLIO_DATA.resumeUrl}. Roles: ${PORTFOLIO_DATA.roles.join(", ")}.`,
      },
      {
        heading: "Hobbies & Interests",
        body: `Outside of work and engineering, Debpratim's hobbies and personal interests include: ${PORTFOLIO_DATA.hobbies.join(", ")}.`,
      },
    ],
  });

  // 2. Tech Stack
  sources.push({
    sourceId: "portfolio:skills",
    sourceType: "skill",
    title: "Technical Stack & Skills",
    citationUrl: "https://debprix.in/#what-i-do",
    sections: TECH_STACK_CATEGORIES.map((cat) => ({
      heading: cat.title,
      body: `${cat.title}: ${cat.items.join(", ")}.`,
    })),
  });

  // 3. Projects
  for (const project of PORTFOLIO_DATA.projects) {
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    sources.push({
      sourceId: `project:${slug}`,
      sourceType: "project",
      title: project.title,
      citationUrl: project.link || project.github || "https://debprix.in/#projects",
      sections: [
        {
          heading: "Summary",
          body: `${project.title} (${project.category}): ${project.description} Tech stack: ${project.tech.join(", ")}.${project.award ? ` Recognition: ${project.award}.` : ""}${project.github ? ` GitHub: ${project.github}.` : ""}`,
        },
        {
          heading: "Architecture & Engineering Details",
          body: `Problem: ${project.details.problem} Role: ${project.details.role} Architecture: ${project.details.architecture.join("; ")}. Challenges: ${project.details.challenges.join("; ")}. Impact: ${project.details.impact}`,
        },
      ],
    });
  }

  // 4. Experience
  for (const exp of PORTFOLIO_DATA.experience) {
    const slug = `${exp.role}-${exp.organisation}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 48);
    sources.push({
      sourceId: `experience:${slug}`,
      sourceType: "experience",
      title: `${exp.role} at ${exp.organisation}`,
      citationUrl: exp.link || "https://debprix.in/#experience",
      sections: [
        {
          heading: `${exp.period} (${exp.location})`,
          body: `${exp.role} at ${exp.organisation} (${exp.type}, ${exp.period}, ${exp.location}). ${exp.summary} Key contributions: ${exp.contributions.join(" ")} Focus areas: ${exp.focus.join(", ")}. Tech stack: ${exp.techStack.join(", ")}.`,
        },
      ],
    });
  }

  // 5. Case Studies (engineering deep-dives)
  for (const cs of PORTFOLIO_DATA.caseStudies.items) {
    sources.push({
      sourceId: `case-study:${cs.id}`,
      sourceType: "case_study",
      title: `${cs.title} (${cs.project})`,
      citationUrl: cs.projectUrl || "https://debprix.in/#projects",
      sections: [
        {
          heading: "Problem & Solution",
          body: `${cs.title} for ${cs.project}: ${cs.shortDesc} Problem: ${cs.problem} Solution: ${cs.solution} Tags: ${cs.tags.join(", ")}.`,
        },
        {
          heading: "Highlights",
          body: cs.highlights.map((h) => `${h.metric}: ${h.desc}`).join(" "),
        },
      ],
    });
  }

  return sources;
}

function loadMarkdownSources(contentDir: string): RawSource[] {
  if (!fs.existsSync(contentDir)) return [];
  const sources: RawSource[] = [];

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const raw = fs.readFileSync(fullPath, "utf8");
        const parsed = matter(raw);
        const fm = ContentFrontmatterSchema.parse(parsed.data);

        // Default to NOT ingesting anything not explicitly public (§4.4)
        if (fm.visibility !== "public") {
          continue;
        }

        const rel = path
          .relative(contentDir, fullPath)
          .replace(/\\/g, "/")
          .replace(/\.md$/, "");

        const sections: { heading: string; body: string }[] = [];
        const parts = parsed.content.split(/^##\s+/m);
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim();
          if (!part) continue;
          if (i === 0) {
            sections.push({ heading: fm.title, body: part });
          } else {
            const newlineIdx = part.indexOf("\n");
            const heading =
              newlineIdx === -1 ? part : part.slice(0, newlineIdx).trim();
            const body =
              newlineIdx === -1 ? "" : part.slice(newlineIdx + 1).trim();
            if (body) sections.push({ heading, body });
          }
        }

        sources.push({
          sourceId: `content:${rel}`,
          sourceType: fm.type,
          title: fm.title,
          citationUrl: fm.url || fm.repo,
          sections,
        });
      }
    }
  };

  walk(contentDir);
  return sources;
}

async function loadResumePdfSource(): Promise<RawSource | null> {
  const relResume = PORTFOLIO_DATA.resumeUrl.replace(/^\/+/, "");
  const pdfPath = path.resolve(process.cwd(), "public", relResume);
  if (!fs.existsSync(pdfPath)) return null;

  try {
    const buffer = new Uint8Array(fs.readFileSync(pdfPath));
    const { text } = await extractText(buffer, { mergePages: true });
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (!cleaned) return null;

    return {
      sourceId: "resume:pdf",
      sourceType: "resume",
      title: `${PORTFOLIO_DATA.name} — Resume (PDF)`,
      citationUrl: `https://debprix.in${PORTFOLIO_DATA.resumeUrl}`,
      sections: [
        {
          heading: "Resume Content (Extracted from PDF)",
          body: cleaned,
        },
      ],
    };
  } catch (err) {
    console.warn("[ingest] Failed to extract text from resume PDF:", err);
    return null;
  }
}

function getGithubUsername(): string {
  const ghSocial = PORTFOLIO_DATA.socials.find(
    (s) => s.label.toLowerCase() === "github"
  );
  const match = ghSocial?.href.match(/github\.com\/([^/]+)/i);
  return match?.[1] || "DebpratimSharma";
}

function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-ingest",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchGithubActivitySource(): Promise<RawSource | null> {
  const username = getGithubUsername();
  const headers = getGithubHeaders();

  try {
    const [reposRes, eventsRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=10&type=owner`,
        { headers }
      ),
      fetch(
        `https://api.github.com/users/${username}/events/public?per_page=50`,
        { headers }
      ),
    ]);

    const sections: { heading: string; body: string }[] = [];

    if (reposRes.ok) {
      const repos = (await reposRes.json()) as {
        name: string;
        description: string | null;
        html_url: string;
        language: string | null;
        pushed_at: string;
        fork: boolean;
      }[];

      const ownRepos = repos.filter((r) => !r.fork).slice(0, 8);
      if (ownRepos.length > 0) {
        const repoLines = ownRepos.map((r, idx) => {
          const pushedDate = r.pushed_at.slice(0, 10);
          const lang = r.language ? ` [${r.language}]` : "";
          const desc = r.description ? ` — ${r.description}` : "";
          return `${idx + 1}. ${r.name}${lang} (last pushed ${pushedDate})${desc}`;
        });

        sections.push({
          heading: "Recently Pushed Repositories (Latest First)",
          body: `As of ${new Date().toISOString().slice(0, 10)}, Debpratim's most recently pushed public GitHub repositories are: ${repoLines.join(" | ")}.`,
        });
      }
    }

    if (eventsRes.ok) {
      const events = (await eventsRes.json()) as {
        type: string;
        created_at: string;
        repo: { name: string };
        payload?: {
          size?: number;
          commits?: { message: string }[];
        };
      }[];

      const pushEvents = events.filter((e) => e.type === "PushEvent");
      if (pushEvents.length > 0) {
        const freq = new Map<string, { pushes: number; commits: number; latestDate: string }>();
        const recentCommits: string[] = [];

        for (const ev of pushEvents) {
          const repoName = ev.repo.name.replace(`${username}/`, "");
          const date = ev.created_at.slice(0, 10);
          const commitCount = ev.payload?.size ?? ev.payload?.commits?.length ?? 1;

          const prev = freq.get(repoName);
          if (prev) {
            prev.pushes += 1;
            prev.commits += commitCount;
          } else {
            freq.set(repoName, { pushes: 1, commits: commitCount, latestDate: date });
          }

          if (recentCommits.length < 8 && ev.payload?.commits) {
            for (const c of ev.payload.commits) {
              if (recentCommits.length >= 8) break;
              const msg = c.message.split("\n")[0].trim().slice(0, 120);
              recentCommits.push(`${repoName} (${date}): "${msg}"`);
            }
          }
        }

        const topActive = Array.from(freq.entries())
          .sort((a, b) => b[1].commits - a[1].commits)
          .slice(0, 5)
          .map(
            ([name, stats]) =>
              `${name} (${stats.commits} commits across ${stats.pushes} pushes, latest ${stats.latestDate})`
          );

        sections.push({
          heading: "Recent Commit Frequency & Latest Commits",
          body: `Most frequently committed repositories recently: ${topActive.join("; ")}.${
            recentCommits.length > 0
              ? ` Latest commit messages: ${recentCommits.join(" | ")}.`
              : ""
          }`,
        });
      }
    }

    if (sections.length === 0) return null;

    return {
      sourceId: "github:recent-activity",
      sourceType: "project",
      title: "Recent GitHub Activity & Latest Projects",
      citationUrl: `https://github.com/${username}`,
      sections,
    };
  } catch {
    return null;
  }
}

async function fetchGithubReadmeSources(): Promise<RawSource[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const headers = getGithubHeaders();

  const sources: RawSource[] = [];
  const seenRepos = new Set<string>();

  for (const project of PORTFOLIO_DATA.projects) {
    if (!project.github) continue;
    const match = project.github.match(/github\.com\/([^/]+)\/([^/]+)/i);
    if (!match) continue;
    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");
    const key = `${owner}/${repo}`;
    if (seenRepos.has(key)) continue;
    seenRepos.add(key);

    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        { headers }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { content?: string; encoding?: string };
      if (!data.content || data.encoding !== "base64") continue;

      const readme = Buffer.from(data.content, "base64")
        .toString("utf8")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // strip images
        .slice(0, 6000);

      sources.push({
        sourceId: `github:${key}`,
        sourceType: "project",
        title: `${project.title} (GitHub README)`,
        citationUrl: project.github,
        sections: [{ heading: "README", body: readme }],
      });
    } catch {
      // Non-fatal: continue with repo sources
    }
  }

  return sources;
}

function buildPassages(sources: RawSource[]): RawPassage[] {
  const passages: RawPassage[] = [];

  for (const src of sources) {
    let chunkIndex = 0;
    for (const sec of src.sections) {
      const chunks = splitIntoChunks(sec.body);
      for (const chunk of chunks) {
        const contextualText = `${src.title} — ${sec.heading}\n${chunk}`;
        passages.push({
          sourceId: src.sourceId,
          sourceType: src.sourceType,
          title: src.title,
          section: sec.heading,
          text: contextualText,
          citationUrl: src.citationUrl,
          chunkIndex,
          contentHash: sha256(contextualText),
        });
        chunkIndex += 1;
      }
    }
  }

  return passages;
}

async function main() {
  loadEnvFiles();

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const sourceArg = args.find((a) => a.startsWith("--source="));
  const sourceFilter = sourceArg ? sourceArg.split("=")[1] : undefined;

  const [activitySource, resumeSource] = await Promise.all([
    fetchGithubActivitySource(),
    loadResumePdfSource(),
  ]);
  let allSources = [
    ...buildPortfolioSources(),
    ...loadMarkdownSources(path.resolve(process.cwd(), "content")),
    ...(resumeSource ? [resumeSource] : []),
    ...(activitySource ? [activitySource] : []),
    ...(await fetchGithubReadmeSources()),
  ];

  if (sourceFilter) {
    allSources = allSources.filter(
      (s) => s.sourceId === sourceFilter || s.sourceId.includes(sourceFilter)
    );
  }

  const rawPassages = buildPassages(allSources);

  console.log(
    `[ingest] Sources: ${allSources.length}, Passages: ${rawPassages.length}`
  );

  if (dryRun) {
    for (const s of allSources) {
      const count = rawPassages.filter((p) => p.sourceId === s.sourceId).length;
      console.log(`  - ${s.sourceId} (${s.sourceType}): ${count} passage(s)`);
    }
    console.log("[ingest] Dry run complete. No database writes performed.");
    return;
  }

  const embeddingCfg = getEmbeddingConfig();
  const { passages, sources, meta } = await getCollections();

  const activeMeta = await meta.findOne({ _id: "active" });
  const prevVersion = activeMeta?.activeVersion ?? 0;
  const newVersion = prevVersion + 1;

  // Reuse embeddings for unchanged contentHash when embeddingModel matches
  const reusableEmbeddings = new Map<string, number[]>();
  if (
    prevVersion > 0 &&
    activeMeta?.embeddingModel === embeddingCfg.model
  ) {
    const prevDocs = await passages
      .find({ version: prevVersion })
      .project({ contentHash: 1, embedding: 1 })
      .toArray();
    for (const doc of prevDocs) {
      if (doc.contentHash && Array.isArray(doc.embedding)) {
        reusableEmbeddings.set(doc.contentHash, doc.embedding);
      }
    }
  }

  const toEmbed: { index: number; text: string }[] = [];
  const embeddings: number[][] = new Array(rawPassages.length);

  for (let i = 0; i < rawPassages.length; i++) {
    const cached = reusableEmbeddings.get(rawPassages[i].contentHash);
    if (cached) {
      embeddings[i] = cached;
    } else {
      toEmbed.push({ index: i, text: rawPassages[i].text });
    }
  }

  const BATCH_SIZE = 32;
  let totalCharsEmbedded = 0;
  for (let i = 0; i < toEmbed.length; i += BATCH_SIZE) {
    const batch = toEmbed.slice(i, i + BATCH_SIZE);
    const vectors = await embedTexts(batch.map((b) => b.text));
    for (let j = 0; j < batch.length; j++) {
      embeddings[batch[j].index] = vectors[j];
      totalCharsEmbedded += batch[j].text.length;
    }
  }

  const now = new Date();
  let passageDocs: PassageDoc[] = rawPassages.map((p, i) => ({
    _id: `v${newVersion}:${p.sourceId}:${p.chunkIndex}`,
    version: newVersion,
    sourceId: p.sourceId,
    sourceType: p.sourceType,
    title: p.title,
    section: p.section,
    text: p.text,
    embedding: embeddings[i],
    citationUrl: p.citationUrl,
    contentHash: p.contentHash,
    visibility: "public",
    chunkIndex: p.chunkIndex,
    createdAt: now,
  }));

  let sourceDocs: SourceDoc[] = allSources.map((s) => ({
    _id: `v${newVersion}:${s.sourceId}`,
    sourceId: s.sourceId,
    type: s.sourceType,
    title: s.title,
    url: s.citationUrl,
    lastSyncedAt: now,
    version: newVersion,
  }));

  // When --source=<name> is used, carry forward untouched sources from prevVersion
  if (sourceFilter && prevVersion > 0) {
    const refreshedIds = new Set(allSources.map((s) => s.sourceId));
    const [carriedPassages, carriedSources] = await Promise.all([
      passages
        .find({ version: prevVersion, sourceId: { $nin: Array.from(refreshedIds) } })
        .toArray(),
      sources
        .find({ version: prevVersion, sourceId: { $nin: Array.from(refreshedIds) } })
        .toArray(),
    ]);

    passageDocs = [
      ...carriedPassages.map((p) => ({
        ...p,
        _id: `v${newVersion}:${p.sourceId}:${p.chunkIndex}`,
        version: newVersion,
      })),
      ...passageDocs,
    ];
    sourceDocs = [
      ...carriedSources.map((s) => ({
        ...s,
        _id: `v${newVersion}:${s.sourceId}`,
        version: newVersion,
      })),
      ...sourceDocs,
    ];
  }

  if (passageDocs.length > 0) {
    await passages.insertMany(passageDocs, { ordered: true });
  }
  if (sourceDocs.length > 0) {
    await sources.insertMany(sourceDocs, { ordered: true });
  }

  // Flip active version pointer ONLY after all writes succeed
  const embeddingDim = embeddings[0]?.length ?? 0;
  await meta.updateOne(
    { _id: "active" },
    {
      $set: {
        activeVersion: newVersion,
        embeddingModel: embeddingCfg.model,
        embeddingDim,
        lastIngestAt: now,
      },
    },
    { upsert: true }
  );

  // Keep only the current and previous version to bound Atlas free-tier storage
  if (newVersion > 2) {
    const pruneBefore = newVersion - 1;
    await Promise.all([
      passages.deleteMany({ version: { $lt: pruneBefore } }),
      sources.deleteMany({ version: { $lt: pruneBefore } }),
    ]);
  }

  console.log(
    `[ingest] Success! New active version: ${newVersion} | Reused: ${
      rawPassages.length - toEmbed.length
    } | Newly embedded: ${toEmbed.length} (~${Math.round(
      totalCharsEmbedded / 4
    )} tokens)`
  );
}

main()
  .catch((err) => {
    console.error("[ingest] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      const client = await getMongoClient();
      await client.close();
    } catch {
      // Ignore if client was never connected
    }
  });
