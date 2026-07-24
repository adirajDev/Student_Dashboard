import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import Signin from './pages/Auth/Signin';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import ResetOtpPassword from './pages/Auth/ResetOtpPassword';
import CollegeDashboard from './pages/Dashboard/CollegeDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import WrongUrl from './pages/NotFound/WrongUrl';
import PublicLayout from './components/layout/PublicLayout';
import SidebarLayout from './components/layout/SidebarLayout';
import RootRedirect from './routes/RootRedirect';
import CollegeDetails from './pages/College/CollegeDetails';
import ExamDetails from './pages/Exam/ExamDetails';
import LandingPage from './pages/Landing/LandingPage';
import SearchPage from './pages/Search/SearchPage';
import ExamSearchPage from './pages/Search/ExamSearchPage';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
                <Routes>
                    {/* Default Route */}
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/dashboard-redirect"
                        element={<RootRedirect />}
                    />

                    {/* Auth Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route
                        path="/reset-otp-password"
                        element={<ResetOtpPassword />}
                    />

                    {/* Public Routes and Student Dashboard with Topbar */}
                    <Route element={<PublicLayout />}>
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/exams" element={<ExamSearchPage />} />
                        <Route
                            path="/college/:id"
                            element={<CollegeDetails />}
                        />
                        <Route path="/exam/:id" element={<ExamDetails />} />

                        <Route
                            element={
                                <ProtectedRoute allowedRoles={['student']} />
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={<StudentDashboard />}
                            />
                        </Route>
                    </Route>

                    {/* Management Dashboards with Sidebar */}
                    <Route element={<SidebarLayout />}>
                        <Route
                            element={
                                <ProtectedRoute allowedRoles={['college']} />
                            }
                        >
                            <Route
                                path="/college/dashboard"
                                element={<CollegeDashboard />}
                            />
                        </Route>
                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={['admin', 'editor']}
                                />
                            }
                        >
                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />
                        </Route>
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<WrongUrl />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
// Triggering HMR rebuild
