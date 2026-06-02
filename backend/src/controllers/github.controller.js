import axios from "axios";

// In-memory cache
const githubCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getGithubStats = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "GitHub username is required" });
  }

  // Check cache
  const cached = githubCache.get(username);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[GitHub] Returning cached data for ${username}`);
    return res.json(cached.data);
  }

  try {
    console.log(`[GitHub] Fetching data for ${username}...`);

    // Fetch user profile stats
    const profileResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "Portfolio-App",
      }
    });

    const profile = profileResponse.data;

    // Fetch contributions heatmap data
    const contributionsResponse = await axios.get(`https://github-contributions-api.deno.dev/${username}.json`);
    const contribData = contributionsResponse.data;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Flatten contributions array (it's returned as an array of weeks containing day objects)
    // Actually the Deno API returns: { totalContributions: number, contributions: [[{date, contributionCount, color}]] }
    // Let's flatten it and sort by date ascending
    const days = [];
    contribData.contributions.forEach(week => {
      week.forEach(day => {
        days.push(day);
      });
    });

    days.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate streaks
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

    // Determine current streak by looking backwards from today
    let currentTempStreak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const dayDate = new Date(days[i].date);
      // Skip future dates if any
      if (dayDate > today) continue;

      if (days[i].contributionCount > 0) {
        currentTempStreak++;
      } else {
        // If it's today and 0, we check yesterday. If yesterday is also 0, streak is broken.
        if (dayDate.getTime() === today.getTime()) {
           continue; // Streak might not be broken if they just haven't contributed yet today
        }
        break; // Broken streak
      }
    }
    currentStreak = currentTempStreak;

    // Format final response object
    const finalData = {
      username: profile.login,
      avatar: profile.avatar_url,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      totalContributions: contribData.totalContributions,
      currentStreak,
      longestStreak,
      contributions: days,
    };

    // Cache the result
    githubCache.set(username, {
      timestamp: Date.now(),
      data: finalData
    });

    res.json(finalData);
  } catch (error) {
    console.error(`[GitHub] Error fetching data for ${username}:`, error.message);
    res.status(500).json({ error: "Failed to fetch GitHub statistics" });
  }
};
