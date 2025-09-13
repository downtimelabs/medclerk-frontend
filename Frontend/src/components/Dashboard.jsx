import React from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-300">
      <div className="flex justify-between items-center p-5 bg-white bg-opacity-5 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="text-2xl font-bold text-dark-300">{t('app_brand')}</div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 text-dark-300 font-medium">
            <FaUser className="text-base" />
            <span>{user?.name}</span>
          </div>
          <button className="btn btn-secondary flex items-center gap-2 px-4 py-2 text-sm" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 text-white">
              {t('dashboard_welcome')}
            </h1>
            <p className="text-lg text-dark-400">
              Manage your medical reports and health information
            </p>
          </div>

          <div className="flex flex-col gap-5 mb-10 max-w-md mx-auto">
            {dashboardFeatures.map((feature) => (
              <div key={feature.id} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-6 text-center backdrop-blur-md transition-all duration-300 flex flex-col items-center gap-4 hover:-translate-y-1 hover:shadow-2xl hover:bg-white hover:bg-opacity-10">
                <div className="text-4xl mb-0">{feature.icon}</div>
                <h3 className="text-white mb-0 text-xl font-semibold">
                  {feature.name}
                </h3>
                <p className="text-dark-400 mb-0 leading-relaxed text-sm">
                  {feature.description}
                </p>
                {feature.showButton && (
                  <button className="btn btn-primary w-30 py-2.5 text-sm mt-auto">
                    {t('access')}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p className="text-dark-500 text-sm bg-white bg-opacity-5 px-4 py-2 rounded-full inline-block">
              Language: {selectedLanguage?.toUpperCase()} | Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
