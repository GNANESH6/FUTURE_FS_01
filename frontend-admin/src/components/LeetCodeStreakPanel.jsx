import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiTrendingUp, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { FaFire } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api";

export default function LeetCodeStreakPanel({ username: propUsername }) {
  const [username, setUsername] = useState(propUsername || "GNANESHSANGATI");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch settings to get admin's username if not passed as prop
  useEffect(() => {
    if (!propUsername) {
      axios
        .get(`${API_BASE_URL}/settings`)
        .then((res) => {
          if (res.data && res.data.leetcodeUsername) {
            setUsername(res.data.leetcodeUsername);
          }
        })
        .catch((err) => {
          console.error("Failed to load settings, using fallback", err);
        });
    } else {
      setUsername(propUsername);
    }
  }, [propUsername]);

  // Fetch statistics from backend proxy
  const fetchStats = useCallback(() => {
    if (!username) return;
    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE_URL}/leetcode/${username}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch LeetCode statistics", err);
        setError(err.response?.data?.error || "Failed to retrieve statistics.");
        setLoading(false);
      });
  }, [username]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Generate 365 days list for the contribution heatmap
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);

    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const dateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      result.push({
        date: dateStr,
        dayOfWeek: currentDate.getDay(), // 0 = Sunday, 1 = Monday, etc.
        month: currentDate.toLocaleString("default", { month: "short" }),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }, []);

  // Map dates to LeetCode submission counts
  const dateCountMap = useMemo(() => {
    const map = {};
    if (data && data.submissionCalendar) {
      Object.entries(data.submissionCalendar).forEach(([timestampStr, count]) => {
        const ts = parseInt(timestampStr) * 1000;
        const d = new Date(ts);
        const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getUTCDate()).padStart(2, "0")}`;
        map[dateStr] = (map[dateStr] || 0) + count;
      });
    }
    return map;
  }, [data]);

  // Heatmap helper cells
  const heatmapData = useMemo(() => {
    if (days.length === 0) return [];
    
    // Add empty cells for alignment to start on the correct day of the week
    const firstDayOfWeek = days[0].dayOfWeek;
    const padding = Array(firstDayOfWeek).fill(null);
    
    return [
      ...padding,
      ...days.map((day) => ({
        ...day,
        count: dateCountMap[day.date] || 0,
      })),
    ];
  }, [days, dateCountMap]);

  const monthLabels = useMemo(() => {
    if (days.length === 0) return [];
    
    const labels = [];
    let currentMonth = null;
    const firstDayOfWeek = days[0].dayOfWeek; 
    
    days.forEach((day, index) => {
      if (day.month !== currentMonth) {
        currentMonth = day.month;
        const weekIndex = Math.floor((index + firstDayOfWeek) / 7);
        // Only add if we don't already have a label for this week to prevent overlapping
        if (!labels.some(l => l.week === weekIndex)) {
          labels.push({ label: currentMonth, week: weekIndex });
        }
      }
    });
    
    return labels;
  }, [days]);

  // Color intensities matching high-end neon dark mode
  const getIntensityColor = (count) => {
    if (count === 0) return "var(--heatmap-bg, rgba(255, 255, 255, 0.04))";
    if (count <= 2) return "rgba(34, 211, 238, 0.25)"; // Pale Cyan
    if (count <= 5) return "rgba(34, 211, 238, 0.45)"; // Medium Cyan
    if (count <= 9) return "rgba(34, 211, 238, 0.7)";  // Darker Cyan
    return "rgba(34, 211, 238, 0.95)"; // Neon Glowing Cyan
  };

  const getIntensityShadow = (count) => {
    if (count > 5) {
      return "0 0 8px rgba(34, 211, 238, 0.6)";
    }
    return "none";
  };

  if (loading) {
    return (
      <div className="leetcode-panel glass-card loading">
        <div className="skeleton header-skeleton">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-info">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
        <div className="skeleton-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
        <div className="skeleton-heatmap"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leetcode-panel glass-card error-card">
        <FiAlertTriangle className="error-icon" />
        <h3>LeetCode Fetch Error</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => setRefreshKey((k) => k + 1)}>
          <FiRefreshCw /> Retry Connection
        </button>
      </div>
    );
  }

  const {
    avatar,
    ranking,
    contestRating,
    contestRanking,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalQuestions,
    easyQuestions,
    mediumQuestions,
    hardQuestions,
    currentStreak,
    longestStreak,
  } = data;

  const easyPercent = Math.min(100, Math.round((easySolved / (easyQuestions || 1)) * 100));
  const mediumPercent = Math.min(100, Math.round((mediumSolved / (mediumQuestions || 1)) * 100));
  const hardPercent = Math.min(100, Math.round((hardSolved / (hardQuestions || 1)) * 100));
  const totalPercent = Math.min(100, Math.round((totalSolved / (totalQuestions || 1)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="leetcode-panel glass-card"
    >
      {/* Profile Header */}
      <div className="panel-header">
        <div className="user-profile">
          <img src={avatar || "https://assets.leetcode.com/users/default_avatar.jpg"} alt={username} className="user-avatar" />
          <div>
            <h2 className="user-name">{username}</h2>
            <div className="ranking-badges">
              {ranking > 0 && (
                <span className="badge">
                  <FiAward /> Rank #{ranking.toLocaleString()}
                </span>
              )}
              {contestRating > 0 && (
                <span className="badge rating">
                  <FiTrendingUp /> Rating {contestRating}
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="refresh-btn" onClick={() => setRefreshKey((k) => k + 1)} title="Refresh data">
          <FiRefreshCw />
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        {/* Total Solved Card */}
        <div className="stat-card solved">
          <div className="circular-progress">
            <svg viewBox="0 0 36 36" className="circular-svg">
              <path
                className="ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="ring-bar total"
                strokeDasharray={`${totalPercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="circular-text">
              <span className="num">{totalSolved}</span>
              <span className="lbl">/ {totalQuestions}</span>
            </div>
          </div>
          <span className="stat-title">Solved Problems</span>
        </div>

        {/* Streaks Card */}
        <div className="stat-card streak">
          <div className="streak-stats">
            <div className="streak-row active">
              <FaFire className="streak-icon active-icon" />
              <div>
                <span className="streak-value">{currentStreak} days</span>
                <span className="streak-label">Active Streak</span>
              </div>
            </div>
            <div className="streak-row longest">
              <FaFire className="streak-icon longest-icon" />
              <div>
                <span className="streak-value">{longestStreak} days</span>
                <span className="streak-label">Longest Streak</span>
              </div>
            </div>
          </div>
          <span className="stat-title">Consistency Streak</span>
        </div>

        {/* Level Breakdown Card */}
        <div className="stat-card levels">
          <div className="level-bar-group">
            <div className="level-row">
              <div className="level-info">
                <span className="level-lbl easy">Easy</span>
                <span className="level-nums">{easySolved}/{easyQuestions}</span>
              </div>
              <div className="level-bar-container">
                <div className="level-bar easy-bar" style={{ width: `${easyPercent}%` }}></div>
              </div>
            </div>

            <div className="level-row">
              <div className="level-info">
                <span className="level-lbl medium">Medium</span>
                <span className="level-nums">{mediumSolved}/{mediumQuestions}</span>
              </div>
              <div className="level-bar-container">
                <div className="level-bar medium-bar" style={{ width: `${mediumPercent}%` }}></div>
              </div>
            </div>

            <div className="level-row">
              <div className="level-info">
                <span className="level-lbl hard">Hard</span>
                <span className="level-nums">{hardSolved}/{hardQuestions}</span>
              </div>
              <div className="level-bar-container">
                <div className="level-bar hard-bar" style={{ width: `${hardPercent}%` }}></div>
              </div>
            </div>
          </div>
          <span className="stat-title">Difficulty Breakdown</span>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="heatmap-section">
        <h3 className="section-subtitle">Activity Heatmap</h3>
        <div className="heatmap-container">
          <div className="heatmap-scroll">
            <div className="heatmap-wrapper">
              <div className="heatmap-months">
                {monthLabels.map((m, i) => (
                  <span key={i} className="month-label" style={{ gridColumn: m.week + 1 }}>
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="heatmap-grid">
                {heatmapData.map((cell, idx) => {
                  if (cell === null) {
                    return <div key={`pad-${idx}`} className="heatmap-cell pad" />;
                  }

                  return (
                    <div
                      key={cell.date}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: getIntensityColor(cell.count),
                        boxShadow: getIntensityShadow(cell.count),
                      }}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="heatmap-tooltip"
              >
                <strong>{hoveredCell.count} submissions</strong> on {new Date(hoveredCell.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
