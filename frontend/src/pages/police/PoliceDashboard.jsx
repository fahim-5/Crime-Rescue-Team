import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PoliceDashboard.css';

const PoliceDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      pendingCases: 0,
      solvedCases: 0,
      activeInvestigations: 0
    },
    recentReports: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsResponse, reportsResponse] = await Promise.all([
          axios.get('/api/police/stats'),
          axios.get('/api/police/recent-reports')
        ]);

        // Validate and normalize API responses
        const normalizedStats = {
          pendingCases: Number(statsResponse.data?.pendingCases) || 0,
          solvedCases: Number(statsResponse.data?.solvedCases) || 0,
          activeInvestigations: Number(statsResponse.data?.activeInvestigations) || 0
        };

        const normalizedReports = Array.isArray(reportsResponse.data) 
          ? reportsResponse.data.map(report => ({
              id: report.id || 0,
              type: report.type || 'Unknown',
              location: report.location || 'Unknown',
              status: report.status || 'pending',
              reportedAt: report.reportedAt || new Date().toISOString()
            }))
          : [];

        setDashboardData({
          stats: normalizedStats,
          recentReports: normalizedReports
        });
      } catch (err) {
        console.error('Dashboard data error:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setDashboardData({
          stats: {
            pendingCases: 0,
            solvedCases: 0,
            activeInvestigations: 0
          },
          recentReports: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleReportClick = (reportId) => {
    navigate(`/police/reports/${reportId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="police-dashboard-container">
      <header className="dashboard-header">
        <h1>Law Enforcement Dashboard</h1>
        <p className="welcome-message">
          Welcome back, Officer. Here's your activity overview.
        </p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Cases</h3>
          <p className="stat-value">{dashboardData.stats.pendingCases}</p>
          <p className="stat-description">Require immediate attention</p>
        </div>

        <div className="stat-card">
          <h3>Solved Cases</h3>
          <p className="stat-value">{dashboardData.stats.solvedCases}</p>
          <p className="stat-description">Successful resolutions</p>
        </div>

        <div className="stat-card">
          <h3>Active Investigations</h3>
          <p className="stat-value">{dashboardData.stats.activeInvestigations}</p>
          <p className="stat-description">Currently in progress</p>
        </div>
      </div>

      <section className="recent-reports">
        <div className="section-header">
          <h2>Recent Crime Reports</h2>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/police/reports')}
          >
            View All Reports
          </button>
        </div>

        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentReports.length > 0 ? (
                dashboardData.recentReports.map(report => (
                  <tr key={report.id}>
                    <td>CR-{report.id.toString().padStart(4, '0')}</td>
                    <td>{report.type}</td>
                    <td>{report.location}</td>
                    <td>
                      <span className={`status-badge ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{new Date(report.reportedAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => handleReportClick(report.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-reports">
                    No recent reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PoliceDashboard;