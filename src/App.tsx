import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import PatientSignup from './pages/PatientSignup';
import DoctorSignup from './pages/DoctorSignup';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Doctors from './pages/dashboard/Doctors';
import Documents from './pages/dashboard/Documents';
import DocumentCategory from './pages/dashboard/DocumentCategory';
import Chat from './pages/dashboard/Chat';
import Settings from './pages/dashboard/Settings';
import Help from './pages/dashboard/Help';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPatientDetails from './pages/doctor/DoctorPatientDetails';
import DoctorSettings from './pages/doctor/DoctorSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/patient" element={<PatientSignup />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />

        {/* Doctor Dashboard Routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patients/:id" element={<DoctorPatientDetails />} />
          <Route path="settings" element={<DoctorSettings />} />
        </Route>
        
        {/* Patient Dashboard Routes */}
        <Route path="/patient" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<Overview />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="documents" element={<Documents />} />
          <Route path="documents/:category" element={<DocumentCategory />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;