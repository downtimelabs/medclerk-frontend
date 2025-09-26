import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import LandingPage from './components/LandingPage.jsx';
import Auth from './components/Auth.jsx';
import PatientProfile from './components/PatientProfile.jsx';
import DoctorProfile from './components/DoctorProfile.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import UploadItems from './components/UploadItems.jsx';
import Dashboard from './components/Dashboard.jsx';
import DoctorsPage from './components/DoctorsPage.jsx';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedRole = localStorage.getItem('selectedRole');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleProfileComplete = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSelectedLanguage(null);
    setSelectedRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('selectedRole');
  };

  return (
    <ThemeProvider>
      <Router>
        <I18nProvider lang={selectedLanguage || 'en'}>
          <ErrorBoundary>
            <div className="App">
            <Routes>
            <Route 
              path="/" 
              element={<LandingPage selectedLanguage={selectedLanguage} onLanguageSelect={handleLanguageSelect} />}
            />
            <Route 
              path="/start" 
              element={
                !selectedRole ? (
                  <RoleSelection 
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onSelect={handleRoleSelect} 
                  />
                ) : !isAuthenticated ? (
                  <Auth 
                    selectedLanguage={selectedLanguage}
                    selectedRole={selectedRole}
                    onLanguageSelect={handleLanguageSelect}
                    onAuthSuccess={handleAuthSuccess}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/auth" 
              element={
                !selectedRole ? (
                  <RoleSelection 
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onSelect={handleRoleSelect} 
                  />
                ) : !isAuthenticated ? (
                  <Auth 
                    selectedLanguage={selectedLanguage}
                    selectedRole={selectedRole}
                    onLanguageSelect={handleLanguageSelect}
                    onAuthSuccess={handleAuthSuccess}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/signin" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : !selectedRole ? (
                  <RoleSelection 
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onSelect={handleRoleSelect}
                    isSignInFlow={true}
                  />
                ) : (
                  <Auth 
                    selectedLanguage={selectedLanguage}
                    selectedRole={selectedRole}
                    onLanguageSelect={handleLanguageSelect}
                    onAuthSuccess={handleAuthSuccess}
                    isSignInMode={true}
                  />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : user?.role === 'doctor' && !user?.doctorProfile ? (
                  <DoctorProfile 
                    user={user}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onProfileComplete={handleProfileComplete}
                  />
                ) : user?.role === 'patient' && !user?.patientProfile ? (
                  <PatientProfile 
                    user={user}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onProfileComplete={handleProfileComplete}
                  />
                ) : user?.role === 'doctor' ? (
                  <Navigate to="/doctor" replace />
                ) : (
                  <Dashboard 
                    user={user}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            <Route 
              path="/doctor" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <DoctorDashboard
                    user={user}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            <Route 
              path="/doctors" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <DoctorsPage
                    user={user}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            </Routes>
            </div>
          </ErrorBoundary>
        </I18nProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
