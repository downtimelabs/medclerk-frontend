import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import LandingPage from './components/LandingPage.jsx';
import AboutUs from './components/AboutUs.jsx';
import Services from './components/Services.jsx';
import Auth from './components/Auth.jsx';
import PatientProfile from './components/PatientProfile.jsx';
import DoctorProfile from './components/DoctorProfile.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import UploadItems from './components/UploadItems.jsx';
import Dashboard from './components/Dashboard.jsx';
import DoctorsPage from './components/DoctorsPage.jsx';
import UploadPage from './components/UploadPage.jsx';
import AppointmentsPage from './components/AppointmentsPage.jsx';
import ReportsPage from './components/ReportsPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import PatientSignup from './components/PatientSignup.jsx';
import DoctorSignup from './components/DoctorSignup.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    
    if (savedAuth === 'true' && savedUser) {
      const user = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setUser(user);
      
      // Always use role from user data
      if (user.role) {
        const role = user.role.toLowerCase();
        setSelectedRole(role);
        localStorage.setItem('selectedRole', role);
      }
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    localStorage.setItem('selectedRole', role);
  };

  const handleAuthSuccess = (userData) => {
    // Clear any old role data first
    localStorage.removeItem('selectedRole');
    
    setIsAuthenticated(true);
    setUser(userData);
    
    // Update selectedRole based on user's actual role
    let finalRole = 'patient'; // default
    if (userData?.role) {
      finalRole = userData.role.toLowerCase();
      setSelectedRole(finalRole);
      localStorage.setItem('selectedRole', finalRole);
    }
    
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
    setSelectedRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('doctorProfile');
  };

  return (
    <ThemeProvider>
      <Router>
        <I18nProvider>
          <ErrorBoundary>
            <div className="App">
            <Routes>
            <Route 
              path="/" 
              element={<LandingPage isAuthenticated={isAuthenticated} user={user} />}
            />
            <Route 
              path="/about" 
              element={<AboutUs />}
            />
            <Route 
              path="/services" 
              element={<Services />}
            />
            <Route 
              path="/start" 
              element={
                !selectedRole ? (
                  <RoleSelection 
                    onSelect={handleRoleSelect} 
                  />
                ) : !isAuthenticated ? (
                  selectedRole === 'patient' ? (
                    <PatientSignup
                      onAuthSuccess={handleAuthSuccess}
                    />
                  ) : selectedRole === 'doctor' ? (
                    <DoctorSignup
                      onAuthSuccess={handleAuthSuccess}
                    />
                  ) : (
                    <Auth 
                      selectedRole={selectedRole}
                      onAuthSuccess={handleAuthSuccess}
                      isSignUpMode={true}
                    />
                  )
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
                    onSelect={handleRoleSelect} 
                  />
                ) : !isAuthenticated ? (
                  selectedRole === 'patient' ? (
                    <PatientSignup
                      onAuthSuccess={handleAuthSuccess}
                    />
                  ) : (
                    <Auth 
                      selectedRole={selectedRole}
                      onAuthSuccess={handleAuthSuccess}
                      isSignUpMode={true}
                    />
                  )
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
                    onSelect={handleRoleSelect}
                    isSignInFlow={true}
                  />
                ) : (
                  <Auth 
                    selectedRole={selectedRole}
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
                ) : (() => {
                  // Get role from user object
                  const userRole = user?.role?.toLowerCase();
                  
                  // Doctor role routing
                  if (userRole === 'doctor') {
                    if (!user?.doctorProfile && !user?.licenseNumber) {
                      return (
                        <DoctorProfile 
                          user={user}
                          onProfileComplete={handleProfileComplete}
                        />
                      );
                    }
                    return <Navigate to="/doctor" replace />;
                  }
                  
                  // Patient role routing  
                  if (userRole === 'patient') {
                    if (!user?.patientProfile && !user?.bloodGroup) {
                      return (
                        <PatientProfile 
                          user={user}
                          onProfileComplete={handleProfileComplete}
                        />
                      );
                    }
                    return (
                      <Dashboard 
                        user={user}
                        onLogout={handleLogout}
                      />
                    );
                  }
                  
                  // Fallback: default to patient dashboard
                  return (
                    <Dashboard 
                      user={user}
                      onLogout={handleLogout}
                    />
                  );
                })()
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
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            <Route 
              path="/uploads" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <UploadPage
                    user={user}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            <Route 
              path="/appointments" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <AppointmentsPage
                    user={user}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            <Route 
              path="/reports" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <ReportsPage
                    user={user}
                    onLogout={handleLogout}
                  />
                )
              } 
            />
            <Route 
              path="/settings" 
              element={
                !isAuthenticated ? (
                  <Navigate to="/start" replace />
                ) : (
                  <SettingsPage
                    user={user}
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
