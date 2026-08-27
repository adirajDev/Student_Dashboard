import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import Signin from './pages/Auth/Signin';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import StudentApplications from './pages/Dashboard/StudentApplications';
import ProtectedRoute from './routes/ProtectedRoute';
import ResetOtpPassword from './pages/Auth/ResetOtpPassword';
import CollegeDashboard from './pages/Dashboard/CollegeDashboard';
import BloggerDashboard from './pages/Dashboard/BloggerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import WrongUrl from './pages/NotFound/WrongUrl';
import PublicLayout from './components/layout/PublicLayout';
import SidebarLayout from './components/layout/SidebarLayout';
import RootRedirect from './routes/RootRedirect';
import CollegeDetails from './pages/College/CollegeDetails';
import ExamDetails from './pages/Exam/ExamDetails';
import LandingPage from './pages/Landing/LandingPage';
import ExamSearchPage from './pages/Search/ExamSearchPage';
import ExamListingPage from './pages/Exam/ExamListingPage';
import CollegeListingPage from './pages/College/CollegeListingPage';
import BlogDetail from './pages/Blog/BlogDetail.jsx';
import PostListing from '@/pages/Blog/PostListing.jsx';
import BloggerProfilePage from '@/pages/Blog/BloggerProfilePage.jsx';
import NewsListingPage from '@/pages/News/NewsListingPage.jsx';
import NewsDetail from '@/pages/News/NewsDetail.jsx';

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
                        <Route
                            path="/college"
                            element={<CollegeListingPage />}
                        />
                        <Route
                            path="/exam-search"
                            element={<ExamSearchPage />}
                        />
                        <Route path="/exams" element={<ExamListingPage />} />
                        <Route path="/exam/:id" element={<ExamDetails />} />
                        <Route path="/news" element={<NewsListingPage />} />
                        <Route path="/news/:id" element={<NewsDetail />} />
                        <Route
                            path="/college/:id"
                            element={<CollegeDetails />}
                        />
                        <Route path="/blog/:slug" element={<BlogDetail />} />
                        <Route path="/blog" element={<PostListing />} />
                        <Route
                            path="/blogger/:userId"
                            element={<BloggerProfilePage />}
                        />

                        <Route
                            element={
                                <ProtectedRoute allowedRoles={['student']} />
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={<StudentDashboard />}
                            />
                            <Route
                                path="/applications"
                                element={<StudentApplications />}
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
                        <Route
                            element={
                                <ProtectedRoute allowedRoles={['blogger']} />
                            }
                        >
                            <Route
                                path="/blogger/dashboard"
                                element={<BloggerDashboard />}
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
