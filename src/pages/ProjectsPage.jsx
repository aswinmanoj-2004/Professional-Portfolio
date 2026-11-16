import { useEffect, useMemo, useState } from 'react';
import { fetchGitHubProfile, fetchGitHubRepos, categorize, USERNAME } from '../lib/github';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const CATEGORIES = ['All Projects', 'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI / Machine Learning', 'Mini Projects', 'Other'];

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function RepoCard({ repo }) {
  const lang = repo.language || 'Unknown';
  const tags = (repo.topics || []).slice(0, 4);
  const cat = categorize(repo);
  return (
    <article className="group flex h-full flex-col justify-between overflow-hidden rounded-card border border-line bg-panel p-6 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:border-ember/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="display text-[clamp(1.15rem,1.8vw,1.5rem)]">{repo.name}</h3>
          <span className="font-mono text-[0.625rem] uppercase tracking-label text-faint">{cat}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {repo.description || 'No description provided.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="chip !py-1 !px-3 text-[0.6875rem]">{t}</span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
          <span>{lang}</span>
          <span>★ {repo.stargazers_count ?? 0}</span>
          <span>⑂ {repo.forks_count ?? 0}</span>
          <span>Updated {formatDate(repo.updated_at)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--solid !py-2 !px-4 text-[0.8125rem]"
          >
            View Repository ↗
          </a>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-card border border-line bg-panel p-6">
      <div className="h-6 w-2/3 animate-pulse rounded bg-fg/10" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-fg/10" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-fg/10" />
      <div className="mt-6 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-fg/10" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-fg/10" />
      </div>
    </div>
  );
}

export default function ProjectsPage({ onContact }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Projects');
  const [language, setLanguage] = useState('All');
  const [sort, setSort] = useState('updated');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, r] = await Promise.all([fetchGitHubProfile(), fetchGitHubRepos()]);
        if (!active) return;
        setProfile(p);
        setRepos(r);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load repositories');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    let list = repos.filter((r) => !r.fork);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q),
      );
    }
    if (category !== 'All Projects') {
      list = list.filter((r) => categorize(r) === category);
    }
    if (language !== 'All') {
      list = list.filter((r) => r.language === language);
    }
    if (sort === 'updated') {
      list = [...list].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (sort === 'stars') {
      list = [...list].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
    }
    return list;
  }, [repos, query, category, language, sort]);

  return (
    <PageTransition reduced={false} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <p className="label">Projects</p>
          <h1 className="display h1 mt-4 max-w-[13ch]">My Projects</h1>
          <p className="lede mt-6 max-w-[50ch]">Things I've built, explored and experimented with.</p>
          {!loading && !error && (
            <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
              {repos.length} public repositories · {profile?.login || USERNAME}
            </p>
          )}
        </div>
      </section>

      {/* Profile card */}
      {profile && (
        <section className="section pt-0">
          <div className="shell">
            <div className="flex flex-wrap items-center gap-6 rounded-card border border-line bg-panel p-6">
              <img src={profile.avatar_url} alt={profile.login} className="h-16 w-16 rounded-full border border-line" />
              <div className="flex-1">
                <p className="display text-xl">{profile.name || profile.login}</p>
                <p className="mt-1 text-sm text-muted">{profile.bio || ''}</p>
                <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-label text-faint">
                  {profile.public_repos} repos · {profile.followers} followers · {profile.following} following
                </p>
              </div>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--solid !py-2.5 !px-4 text-[0.8125rem]"
              >
                Visit My GitHub ↗
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="section pt-0">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories..."
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-fg placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-ember/40"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-line bg-panel px-3 py-2 text-sm text-fg"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-line bg-panel px-3 py-2 text-sm text-fg"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-line bg-panel px-3 py-2 text-sm text-fg"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
            </select>
          </div>
        </div>
      </section>

      {/* Repos */}
      <section className="section pt-0">
        <div className="shell">
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-card border border-dashed border-line bg-panel/50 p-8 text-center text-sm text-muted">
              {error}. Please try again later.
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="rounded-card border border-dashed border-line bg-panel/50 p-8 text-center text-sm text-muted">
              No repositories match your filters.
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="shell pb-12">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
        >
          ← Back to Portfolio
        </button>
      </div>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
