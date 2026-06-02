import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiAlertTriangle, FiGithub, FiUsers, FiBook } from "react-icons/fi";
import { FaFire } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://future-fs-01-yky5.onrender.com/api";

export default function GithubStreakPanel({ username: propUsername }) {
  const [username, setUsername] = useState(propUsername || "");
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
          if (res.data && res.data.githubUsername) {
            setUsername(res.data.githubUsername);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed to load settings", err);
          setLoading(false);
        });
    } else {
      setUsername(propUsername);
    }
  }, [propUsername]);

  const fetchStats = useCallback((abortController) => {
    if (!username) return;
    setLoading(true);
    setError(null);

    const config = abortController ? { signal: abortController.signal } : {};

    axios
      .get(`${API_BASE_URL}/github/${username}`, config)
      .then((res) => {
        if (res.data && res.data.success) {
          setData(res.data.data);
        } else {
          // Fallback if backend hasn't updated yet
          setData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return; // Request was aborted
        }
        console.error("Failed to fetch GitHub statistics", err);
        setError(err.response?.data?.message || err.response?.data?.error || "Failed to retrieve statistics.");
        setLoading(false);
      });
  }, [username]);

  useEffect(() => {
    let abortController = null;
    if (username) {
      abortController = new AbortController();
      fetchStats(abortController);
    }
    return () => {
      if (abortController) abortController.abort();
    };
  }, [fetchStats, refreshKey, username]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Heatmap helper cells
  const heatmapData = useMemo(() => {
    if (!data || !data.contributions) return [];
    
    // The Deno API returns an array of day objects. 
    // We need to pad the beginning so it aligns with Sunday if the first day isn't Sunday.
    const days = data.contributions;
    if (days.length === 0) return [];

    const firstDate = new Date(days[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday
    const padding = Array(firstDayOfWeek).fill(null);
    
    return [
      ...padding,
      ...days.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    ];
  }, [data]);

  const monthLabels = useMemo(() => {
    if (!data || !data.contributions || data.contributions.length === 0) return [];
    
    const days = data.contributions;
    const labels = [];
    let currentMonth = null;
    const firstDate = new Date(days[0].date);
    const firstDayOfWeek = firstDate.getDay(); 
    
    days.forEach((day, index) => {
      // Create a local date to avoid timezone shift on just "YYYY-MM-DD"
      const dateParts = day.date.split('-');
      // new Date(year, monthIndex, day)
      const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const monthStr = dateObj.toLocaleString("default", { month: "short" });
      
      if (monthStr !== currentMonth) {
        currentMonth = monthStr;
        const weekIndex = Math.floor((index + firstDayOfWeek) / 7);
        if (!labels.some(l => l.week === weekIndex)) {
          labels.push({ label: currentMonth, week: weekIndex });
        }
      }
    });
    
    return labels;
  }, [data]);

  // Color intensities matching GitHub green neon dark mode
  const getIntensityColor = (count) => {
    if (count === 0) return "var(--heatmap-bg, rgba(255, 255, 255, 0.04))";
    if (count <= 2) return "rgba(14, 68, 41, 0.8)"; // Dark Green
    if (count <= 5) return "rgba(0, 109, 50, 0.9)"; // Medium Green
    if (count <= 9) return "rgba(38, 166, 65, 0.95)";  // Lighter Green
    return "rgba(57, 211, 83, 1)"; // Neon Bright Green
  };

  const getIntensityShadow = (count) => {
    if (count > 5) {
      return "0 0 8px rgba(57, 211, 83, 0.5)";
    }
    return "none";
  };

  if (!username && !loading) {
    return null;
  }

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
        <h3>GitHub Fetch Error</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => setRefreshKey((k) => k + 1)}>
          <FiRefreshCw /> Retry Connection
        </button>
      </div>
    );
  }

  const {
    avatar,
    publicRepos,
    followers,
    following,
    totalContributions,
    currentStreak,
    longestStreak,
  } = data;

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
          <img src={avatar || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"} alt={username} className="user-avatar" />
          <div>
            <h2 className="user-name">{username}</h2>
            <div className="ranking-badges">
              <span className="badge">
                <FiGithub /> GitHub Profile
              </span>
            </div>
          </div>
        </div>

        <button className="refresh-btn" onClick={() => setRefreshKey((k) => k + 1)} title="Refresh data">
          <FiRefreshCw />
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        {/* Total Contributions Card */}
        <div className="stat-card solved">
          <div className="circular-progress">
            <div className="circular-text" style={{ position: 'relative', transform: 'none', top: 0, left: 0, margin: '20px 0' }}>
              <span className="num" style={{ fontSize: '28px', color: '#39d353' }}>{totalContributions}</span>
            </div>
          </div>
          <span className="stat-title">Yearly Contributions</span>
        </div>

        {/* Streaks Card */}
        <div className="stat-card streak">
          <div className="streak-stats">
            <div className="streak-row active">
              <FaFire className="streak-icon active-icon" style={{ color: '#39d353' }} />
              <div>
                <span className="streak-value">{currentStreak} days</span>
                <span className="streak-label">Active Streak</span>
              </div>
            </div>
            <div className="streak-row longest">
              <FaFire className="streak-icon longest-icon" style={{ color: '#26a641' }} />
              <div>
                <span className="streak-value">{longestStreak} days</span>
                <span className="streak-label">Longest Streak</span>
              </div>
            </div>
          </div>
          <span className="stat-title">Consistency Streak</span>
        </div>

        {/* Repos & Followers Card */}
        <div className="stat-card levels">
          <div className="level-bar-group" style={{ gap: '15px' }}>
            <div className="level-row">
              <div className="level-info">
                <span className="level-lbl easy" style={{ color: '#fff' }}><FiBook style={{ marginRight: '5px' }}/> Repositories</span>
                <span className="level-nums" style={{ color: '#39d353' }}>{publicRepos}</span>
              </div>
            </div>

            <div className="level-row">
              <div className="level-info">
                <span className="level-lbl medium" style={{ color: '#fff' }}><FiUsers style={{ marginRight: '5px' }}/> Followers</span>
                <span className="level-nums" style={{ color: '#39d353' }}>{followers}</span>
              </div>
            </div>
            
            <div className="level-row">
              <div className="level-info">
                <span className="level-lbl hard" style={{ color: '#fff' }}><FiUsers style={{ marginRight: '5px' }}/> Following</span>
                <span className="level-nums" style={{ color: '#39d353' }}>{following}</span>
              </div>
            </div>
          </div>
          <span className="stat-title">Profile Stats</span>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="heatmap-section">
        <h3 className="section-subtitle">Contribution Heatmap</h3>
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
                <strong>{hoveredCell.count} contributions</strong> on {new Date(hoveredCell.date).toLocaleDateString(undefined, {
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
