const USERNAME = 'aswinmanoj-2004';
const CACHE_KEY = 'am-gh-cache';
const CACHE_TTL = 5 * 60 * 1000;

function cacheGet() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function cacheSet(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* ignore */
  }
}

export async function fetchGitHubProfile() {
  const cached = cacheGet();
  if (cached?.profile) return cached.profile;
  const res = await fetch(`https://api.github.com/users/${USERNAME}`);
  if (!res.ok) throw new Error(`GitHub profile: ${res.status}`);
  const data = await res.json();
  const current = cacheGet() || {};
  cacheSet({ ...current, profile: data });
  return data;
}

export async function fetchGitHubRepos() {
  const cached = cacheGet();
  if (cached?.repos) return cached.repos;

  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
    );
    if (!res.ok) throw new Error(`GitHub repos: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
    page++;
  }

  const current = cacheGet() || {};
  cacheSet({ ...current, repos: all });
  return all;
}

export function categorize(repo) {
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const lang = (repo.language || '').toLowerCase();
  const text = `${repo.name} ${repo.description || ''} ${topics.join(' ')}`.toLowerCase();

  if (topics.includes('frontend') || /react|angular|vue|html|css|tailwind/.test(text)) {
    if (topics.includes('backend') || /node|express|php|aspnet|c#/.test(text)) return 'Full Stack';
    return 'Frontend';
  }
  if (topics.includes('backend') || /node|express|php|aspnet|c#|python|java/.test(text)) return 'Backend';
  if (topics.includes('fullstack') || topics.includes('full-stack')) return 'Full Stack';
  if (topics.includes('ui') || topics.includes('ux') || topics.includes('design') || topics.includes('figma')) return 'UI/UX';
  if (topics.includes('mini') || /mini project|mini-project|mini/.test(text)) return 'Mini Projects';
  if (topics.includes('ai') || topics.includes('ml') || topics.includes('machine-learning') || /ai|ml|machine learning/.test(text)) return 'AI / Machine Learning';
  if (lang === 'javascript' || lang === 'typescript' || lang === 'html' || lang === 'css') return 'Frontend';
  if (lang === 'php' || lang === 'c#' || lang === 'python' || lang === 'java') return 'Backend';
  return 'Other';
}

export { USERNAME };
