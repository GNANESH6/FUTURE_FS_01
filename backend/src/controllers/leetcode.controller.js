import axios from "axios";

// In-memory cache for LeetCode profile statistics
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

// Helper function to calculate streaks from submission calendar
const calculateStreaks = (submissionCalendarStr) => {
  let currentStreak = 0;
  let longestStreak = 0;
  let parsedCalendar = {};

  try {
    parsedCalendar = JSON.parse(submissionCalendarStr || "{}");
  } catch (e) {
    console.error("Failed to parse LeetCode submission calendar", e);
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get timestamps, convert to ms, and map to local/UTC date string (YYYY-MM-DD)
  const timestamps = Object.keys(parsedCalendar).map((t) => parseInt(t) * 1000);
  if (timestamps.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dates = timestamps.map((ts) => {
    const d = new Date(ts);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
      d.getUTCDate()
    ).padStart(2, "0")}`;
  });

  // Unique and sorted chronologically
  const sortedDates = Array.from(new Set(dates)).sort();

  const getDaysDiff = (d1Str, d2Str) => {
    const t1 = new Date(d1Str + "T00:00:00Z").getTime();
    const t2 = new Date(d2Str + "T00:00:00Z").getTime();
    return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
  };

  let currentRun = 1;
  longestStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = getDaysDiff(sortedDates[i - 1], sortedDates[i]);
    if (diff === 1) {
      currentRun++;
    } else if (diff > 1) {
      currentRun = 1;
    }
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
  }

  // Check if current streak is active (submission today or yesterday)
  const today = new Date();
  const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getUTCDate()).padStart(2, "0")}`;

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const yesterdayStr = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(yesterday.getUTCDate()).padStart(2, "0")}`;

  const lastSubmissionDate = sortedDates[sortedDates.length - 1];
  const diffToToday = getDaysDiff(lastSubmissionDate, todayStr);

  if (diffToToday <= 1) {
    currentStreak = 1;
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const diff = getDaysDiff(sortedDates[i - 1], sortedDates[i]);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
};

// Fallback scraper to extract profile details from public HTML
const scrapeLeetCodeProfile = async (username) => {
  const url = `https://leetcode.com/u/${username}/`;
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const html = response.data;
  const nextDataMatch = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  );
  if (!nextDataMatch) {
    throw new Error("Unable to parse Next.js data from profile page");
  }

  const nextData = JSON.parse(nextDataMatch[1]);
  const queries = nextData?.props?.pageProps?.dehydratedState?.queries || [];

  let matchedUser = null;
  let allQuestionsCount = null;
  let userContestRanking = null;

  for (const q of queries) {
    const data = q?.state?.data;
    if (!data) continue;

    if (data.allQuestionsCount) {
      allQuestionsCount = data.allQuestionsCount;
    }
    if (data.matchedUser) {
      matchedUser = data.matchedUser;
    }
    if (data.userContestRanking !== undefined) {
      userContestRanking = data.userContestRanking;
    }
  }

  if (!matchedUser) {
    throw new Error("User data not found in profile payload");
  }

  return { allQuestionsCount, matchedUser, userContestRanking };
};

export const getLeetCodeStats = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  // Check Cache
  const cachedVal = cache.get(username);
  if (cachedVal && Date.now() - cachedVal.timestamp < CACHE_DURATION) {
    return res.json(cachedVal.data);
  }

  const graphqlQuery = {
    query: `
      query getLeetCodeStats($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            reputation
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          submissionCalendar
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
        }
      }
    `,
    variables: { username },
  };

  let statsData;

  try {
    // Attempt 1: Fetch via GraphQL API
    const gqlResponse = await axios.post(LEETCODE_GRAPHQL_URL, graphqlQuery, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 8000,
    });

    const data = gqlResponse?.data?.data;
    if (data && data.matchedUser) {
      statsData = data;
    } else {
      throw new Error("User not found or empty GraphQL response");
    }
  } catch (error) {
    console.warn(
      `LeetCode GraphQL query failed for ${username}, attempting HTML scraper...`,
      error.message
    );

    try {
      // Attempt 2: Fallback to Profile Scraper
      statsData = await scrapeLeetCodeProfile(username);
    } catch (scrapeError) {
      console.error(`LeetCode scraper failed for ${username}:`, scrapeError.message);
      return res
        .status(502)
        .json({ error: "Failed to retrieve stats from LeetCode API and Scraper fallbacks" });
    }
  }

  // Process data into a standardized structure
  try {
    const matchedUser = statsData.matchedUser;
    const profile = matchedUser.profile || {};
    const submitStats = matchedUser.submitStats || {};
    const acSubmissionNum = submitStats.acSubmissionNum || [];
    const allQuestionsCount = statsData.allQuestionsCount || [];
    const userContestRanking = statsData.userContestRanking || null;

    // Helper maps
    const solvedMap = {};
    acSubmissionNum.forEach((item) => {
      solvedMap[item.difficulty.toLowerCase()] = item.count;
    });

    const totalMap = {};
    allQuestionsCount.forEach((item) => {
      totalMap[item.difficulty.toLowerCase()] = item.count;
    });

    const streaks = calculateStreaks(matchedUser.submissionCalendar);

    const formattedData = {
      username: matchedUser.username || username,
      realName: profile.realName || "",
      avatar: profile.userAvatar || "",
      ranking: profile.ranking || 0,
      reputation: profile.reputation || 0,
      contestRating: userContestRanking ? Math.round(userContestRanking.rating) : 0,
      contestRanking: userContestRanking ? userContestRanking.globalRanking : 0,
      totalSolved: solvedMap.all || 0,
      easySolved: solvedMap.easy || 0,
      mediumSolved: solvedMap.medium || 0,
      hardSolved: solvedMap.hard || 0,
      totalQuestions: totalMap.all || 0,
      easyQuestions: totalMap.easy || 0,
      mediumQuestions: totalMap.medium || 0,
      hardQuestions: totalMap.hard || 0,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      submissionCalendar: matchedUser.submissionCalendar
        ? JSON.parse(matchedUser.submissionCalendar)
        : {},
    };

    // Cache the successful formatting
    cache.set(username, {
      timestamp: Date.now(),
      data: formattedData,
    });

    return res.json(formattedData);
  } catch (formattingError) {
    console.error("Failed to parse LeetCode data format", formattingError);
    return res.status(500).json({ error: "Failed to format LeetCode user profile data" });
  }
};
