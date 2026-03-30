import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import SeekerDashboard from './pages/seeker/Dashboard';
import EmployerDashboard from './pages/employer/Dashboard';
import CreateJob from './pages/employer/CreateJob';
import Applicants from './pages/employer/Applicants';

const AdminDashboard = () => <div>Admin Dashboard</div>;

function App() {
  return (
    // BrowserRouter = aktifkan routing di seluruh app
    // AuthProvider = semua halaman bisa akses data user global
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes — siapa saja bisa akses */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Seeker routes — hanya role seeker */}
          <Route path="/seeker/dashboard" element={
            <PrivateRoute role="seeker">
              <SeekerDashboard />
            </PrivateRoute>
          } />

          {/* Employer routes — hanya role employer */}
          <Route path="/employer/dashboard" element={
            <PrivateRoute role="employer">
              <EmployerDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/employer/jobs/create" element={
            <PrivateRoute role="employer">
              <CreateJob />
            </PrivateRoute>
          } />
          
          <Route path="/employer/jobs/:id/applicants" element={
            <PrivateRoute role="employer">
              <Applicants />
            </PrivateRoute>
          } />

          {/* Admin routes — hanya role admin */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;