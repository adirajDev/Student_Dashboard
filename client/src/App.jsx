import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import Signin from './pages/Auth/Signin';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import StudentApplications from './pages/Dashboard/StudentApplications';
import ProtectedRoute from './routes/ProtectedRoute';
import ResetOtpPassword from './pages/Auth/ResetOtpPassword';
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

// Management dashboards. Split out of the main bundle - they sit behind
// ProtectedRoute and pull in the TipTap editor, which no public page needs.
const CollegeDashboard = lazy(
    () => import('./pages/Dashboard/CollegeDashboard')
);
const BloggerDashboard = lazy(
    () => import('./pages/Dashboard/BloggerDashboard')
);
const AdminDashboard = lazy(() => import('./pages/Dashboard/AdminDashboard'));

const RouteFallback = () => (
    <div className="flex min-h-screen items-center justify-center p-8 text-[var(--muted-foreground)]">
        Loading...
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
                <Suspense fallback={<RouteFallback />}>
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
                            <Route path="/exam/:slug" element={<ExamDetails />} />
                            <Route path="/news" element={<NewsListingPage />} />
                            <Route path="/news/:slug" element={<NewsDetail />} />
                            <Route
                                path="/college/:slug"
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
                </Suspense>
            </div>
        </BrowserRouter>
    );
}

export default App;
