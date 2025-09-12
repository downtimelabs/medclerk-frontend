import React from 'react';
import { FaUser, FaSignOutAlt, FaUpload, FaChartLine, FaBell, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useI18n } from '../i18n';

const Dashboard = ({ user, selectedLanguage, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const dashboardFeatures = [
    { id: 1, name: 'Report Vault', icon: '📁', description: 'View all your uploaded reports', showButton: true },
    { id: 2, name: 'AI Chat Bot', icon: '🤖', description: 'Ask questions about your reports', showButton: true },
    { id: 3, name: 'Profile Section', icon: '👤', description: 'Manage your account settings', showButton: true },
    { id: 4, name: 'Notifications', icon: '🔔', description: 'New prescriptions and check-ups', showButton: true },
    { id: 5, name: "Doctor's Info", icon: '👨‍⚕️', description: 'Your healthcare providers', showButton: false }
  ];

  return (
    <div className="dashboard">
      <div className="navigation">
        <div className="nav-brand">{t('app_brand')}</div>
        <div className="nav-actions">
          <div className="user-info">
            <FaUser className="user-icon" />
            <span>{user?.name}</span>
          </div>
          <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="header">
            <h1>{t('dashboard_welcome')}</h1>
            <p>Manage your medical reports and health information</p>
          </div>

          <div className="dashboard-grid">
            {dashboardFeatures.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                {feature.showButton && (
                  <button className="btn btn-primary feature-btn">
                    {t('access')}
                  </button>
                )}
              </div>
            ))}
          </div>


          <div className="footer-info">
            <p>Language: {selectedLanguage?.toUpperCase()} | Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
