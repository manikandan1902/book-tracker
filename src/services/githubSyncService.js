const CONFIG_KEY = 'bookshelf_github_sync_v1';
const DEFAULT_CONFIG = {
  owner: 'manikandan1902',
  repo: 'book-tracker',
  branch: 'main',
  path: 'data/books.json',
  token: ''
};

const getConfig = () => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
};

const saveConfig = (config) => {
  const nextConfig = { ...DEFAULT_CONFIG, ...config };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(nextConfig));
  return nextConfig;
};

const getRawUrl = ({ owner, repo, branch, path }) =>
  `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${path.split('/').map(encodeURIComponent).join('/')}`;

const getApiUrl = ({ owner, repo, path }) =>
  `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;

const getHeaders = (token) => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

const encodeContent = (content) => btoa(unescape(encodeURIComponent(content)));

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('GitHub did not respond within 15 seconds. Check your connection and try again.');
    }
    throw new Error('Could not connect to GitHub. Check your connection and try again.');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const githubSyncService = {
  getConfig,
  saveConfig,

  loadBooks: async (config = getConfig()) => {
    if (!config.owner || !config.repo || !config.branch || !config.path) {
      return null;
    }

    const response = await fetchWithTimeout(`${getRawUrl(config)}?t=${Date.now()}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`GitHub read failed (${response.status}).`);

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.books)) return data.books;
    throw new Error('The GitHub data file must contain a books array.');
  },

  saveBooks: async (books, config = getConfig()) => {
    if (!config.token) {
      throw new Error('Add a GitHub fine-grained token before saving.');
    }

    const apiUrl = getApiUrl(config);
    const currentResponse = await fetchWithTimeout(apiUrl, { headers: getHeaders(config.token) });
    let sha;

    if (currentResponse.ok) {
      sha = (await currentResponse.json()).sha;
    } else if (currentResponse.status !== 404) {
      throw new Error(`GitHub file lookup failed (${currentResponse.status}).`);
    }

    const response = await fetchWithTimeout(apiUrl, {
      method: 'PUT',
      headers: { ...getHeaders(config.token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update BookShelf library',
        content: encodeContent(JSON.stringify(books, null, 2)),
        branch: config.branch,
        ...(sha ? { sha } : {})
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GitHub save failed (${response.status}).`);
    }
  }
};