import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import PatientSignup from './pages/PatientSignup';
import DoctorSignup from './pages/DoctorSignup';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Doctors from './pages/dashboard/Doctors';
import Chat from './pages/dashboard/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/patient" element={<PatientSignup />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;