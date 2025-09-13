import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n.jsx';
import LanguageSelection from './components/LanguageSelection.jsx';
import LandingPage from './components/LandingPage.jsx';
import Auth from './components/Auth.jsx';
import UploadItems from './components/UploadItems.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('selectedLanguage');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setSelectedLanguage(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedLanguage');
  };

  return (
    <Router>
      <I18nProvider lang={selectedLanguage || 'en'}>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage selectedLanguage={selectedLanguage} onLanguageSelect={handleLanguageSelect} />}
            />
            <Route 
              path="/start" 
              element={
                !selectedLanguage ? (
                  <LanguageSelection onLanguageSelect={handleLanguageSelect} />
                ) : !isAuthenticated ? (
                  <Auth 
                    selectedLanguage={selectedLanguage}
                    onAuthSuccess={handleAuthSuccess}
                  />
                ) : (
                  <Navigate to="/upload" replace />
                )
              } 
            />
            <Route 
              path="/auth" 
              element={
                !selectedLanguage ? (
                  <Navigate to="/start" replace />
                ) : !isAuthenticated ? (
                  <Auth 
                    selectedLanguage={selectedLanguage}
                    onAuthSuccess={handleAuthSuccess}
                  />
                ) : (
                  <Navigate to="/upload" replace />
                )
              } 
            />
            <Route 
              path="/upload" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <UploadItems 
                    user={user}
                    selectedLanguage={selectedLanguage}
                  />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <Dashboard 
                    user={user}
                    selectedLanguage={selectedLanguage}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
          </Routes>
        </div>
      </I18nProvider>
    </Router>
  );
}

export default App;
