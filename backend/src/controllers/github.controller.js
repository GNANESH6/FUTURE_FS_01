import axios from "axios";

// In-memory cache for fallback and fast responses
// Stores objects like: { [username]: { timestamp, data } }
const githubCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Deduplication map for in-flight requests
const pendingRequests = new Map();

/**
 * Helper to fetch with exponential backoff retry
 */
const fetchWithRetry = async (url, config, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await axios.get(url, config);
    } catch (error) {
      attempt++;
      // Don't retry if it's a 404 (Not Found)
      if (error.response && error.response.status === 404) {
        throw error;
      }
      if (attempt >= retries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s
      console.log(`[GitHub] Attempt ${attempt} failed for ${url}. Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

const fetchGitHubData = async (username) => {
  console.log(`[GitHub] Fetching fresh data for ${username}...`);
  
  const headers = {
    "User-Agent": "Portfolio-App",
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Fetch user profile stats
  const profileResponse = await fetchWithRetry(`https://api.github.com/users/${username}`, { headers });
  const profile = profileResponse.data;

  // Fetch contributions heatmap data (external API, doesn't use PAT)
  const contributionsResponse = await fetchWithRetry(`https://github-contributions-api.deno.dev/${username}.json`, {});
  const contribData = contributionsResponse.data;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  if (contribData.contributions) {
    contribData.contributions.forEach(week => {
      week.forEach(day => {
        days.push(day);
      });
    });
  }

  days.sort((a, b) => new Date(a.date) - new Date(b.date));

  days.forEach(day => {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  let currentTempStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const dayDate = new Date(days[i].date);
    if (dayDate > today) continue;

    if (days[i].contributionCount > 0) {
      currentTempStreak++;
    } else {
      if (dayDate.getTime() === today.getTime()) {
         continue; 
      }
      break; 
    }
  }
  currentStreak = currentTempStreak;

  const finalData = {
    username: profile.login,
    avatar: profile.avatar_url,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    totalContributions: contribData.totalContributions || 0,
    currentStreak,
    longestStreak,
    contributions: days,
  };

  return finalData;
};

export const getGithubStats = async (req, res) => {
  const { username } = req.params;

  // Security: Validate username input
  const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  if (!username || !usernameRegex.test(username)) {
    return res.status(400).json({ success: false, message: "Invalid GitHub username provided." });
  }

  // Check cache first
  const cached = githubCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[GitHub] Cache hit for ${username}`);
    return res.json({ success: true, source: "cache", data: cached.data });
  }

  // Request Deduplication: If already fetching, wait for that promise
  if (pendingRequests.has(username)) {
    console.log(`[GitHub] Request deduplicated for ${username}, waiting for pending fetch...`);
    try {
      const data = await pendingRequests.get(username);
      return res.json({ success: true, source: "github", data });
    } catch (error) {
      // If the pending request fails, we fall through to the cache fallback logic below
    }
  }

  // Create a new fetch promise
  const fetchPromise = fetchGitHubData(username)
    .then((data) => {
      console.log(`[GitHub] Fetch success for ${username}. Caching...`);
      githubCache.set(username, {
        timestamp: Date.now(),
        data: data
      });
      pendingRequests.delete(username);
      return data;
    })
    .catch((error) => {
      pendingRequests.delete(username);
      
      const status = error.response?.status;
      const rateLimitHeaders = error.response?.headers && {
        limit: error.response.headers['x-ratelimit-limit'],
        remaining: error.response.headers['x-ratelimit-remaining'],
        reset: error.response.headers['x-ratelimit-reset']
      };
      
      console.error(`[GitHub] Fetch failure for ${username}:`);
      console.error(`Status: ${status}`);
      console.error(`Message: ${error.message}`);
      if (rateLimitHeaders?.limit) {
        console.error(`Rate Limit: ${JSON.stringify(rateLimitHeaders)}`);
      }
      
      throw error; // Rethrow to be caught below
    });

  pendingRequests.set(username, fetchPromise);

  try {
    const data = await fetchPromise;
    return res.json({ success: true, source: "github", data });
  } catch (error) {
    // Fallback to stale cache if it exists
    if (cached) {
      console.log(`[GitHub] Falling back to stale cache for ${username} after fetch failure.`);
      return res.json({ success: true, source: "cache", data: cached.data });
    }

    // No cache exists, return an error
    return res.status(500).json({ success: false, message: "Unable to fetch GitHub statistics at this time." });
  }
};
