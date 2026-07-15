import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import WrongUrl from './pages/WrongUrl';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          <Route path="*" element={<WrongUrl />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
