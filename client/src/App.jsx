import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import HealthVault from './pages/HealthVault';
import HealthPredictionPage from './pages/HealthPredictionPage';
import DoctorAssistant from "./pages/DoctorAssistant";
import AccessCodeEntryPage from "./pages/AccessCodeEntryPage";
import About from "./pages/About";
import OAuthSuccess from './pages/OAuthSuccess'; // ✅ Ensure this import exists
import ShopNow from './pages/ShopNow';
import HealthRecords from './pages/HealthRecords';
import VideoConsultation from './pages/VideoConsultation';
import AIPredictions from './pages/AIPredictions';
import HealthAssistant from './pages/HealthAssistant';
import Careers from './pages/careers';
import Press from './pages/Press';
import Blog from './pages/Blog';
import HIPAACompliance from './pages/HIPAACompliance';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import TermsOfService from './pages/TermsOfService';

function AppWrapper() {
  const location = useLocation();

  // Routes where Navbar should NOT be displayed
  const noNavbarPaths = [
    '/', '/login', '/register', '/patient', '/doctor', '/predict',
    '/doctor-assistant', '/paymentsuccess', '/access', '/about', '/oauth-success','/shop','/records','/video'
    ,'/ai','/conv','/careers','/press','/blog','/hipaa','/privacy','/contact','/terms'
  ];

  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/oauth-success' element={<OAuthSuccess />} />
        <Route path="/shop" element={<ShopNow />} />
        <Route path='/records' element={<HealthRecords/>}/>
        <Route path='/video' element={<VideoConsultation/>}/>
        <Route path='/ai' element={<AIPredictions/>}/>
        <Route path='/conv' element={<HealthAssistant/>}/>
        <Route path='/careers' element={<Careers/>}/>
        <Route path='/press' element={<Press/>}/>
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/hipaa' element={<HIPAACompliance/>}/>
        <Route path='/privacy' element={<PrivacyPolicy/>}/>
        <Route path='/contact' element={<ContactUs/>}/>
        <Route path='/terms' element={<TermsOfService/>}/>
        
        
        


        <Route
          path='/admin'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/doctor'
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/patient'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/vault'
          element={
            <ProtectedRoute>
              <HealthVault />
            </ProtectedRoute>
          }
        />
        <Route
          path='/doctor-assistant'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <DoctorAssistant />
            </ProtectedRoute>
          }
        />
        <Route path='/predict' element={<HealthPredictionPage />} />
        <Route path='/access' element={<AccessCodeEntryPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
