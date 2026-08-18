import { useOutletContext, Link } from 'react-router-dom';
import useApplications from '@/features/student/hooks/useApplications';
import { Loader2, X, GraduationCap, Building2 } from 'lucide-react';

const StudentApplications = () => {
    const { user, setUser } = useOutletContext();
    const {
        error,
        success,
        loadingMap,
        deleteApplication,
        updateApplicationCourse,
        setError,
        setSuccess,
    } = useApplications(user, setUser);

    const applications = user?.applications || [];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Applications
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage your college applications and selected courses.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex justify-between items-center shadow-sm">
                    <span>{error}</span>
                    <button
                        onClick={() => setError('')}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-2xl flex justify-between items-center shadow-sm">
                    <span>{success}</span>
                    <button
                        onClick={() => setSuccess('')}
                        className="p-1 hover:bg-green-100 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {applications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700">
                        No applications yet
                    </h3>
                    <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">
                        You haven't applied to any colleges yet. Start exploring
                        colleges to apply.
                    </p>
                    <Link to="/college" className="btn-primary">
                        Explore Colleges
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map(app => {
                        const college = app.college || {};
                        const isLoading = loadingMap[app._id];

                        return (
                            <div
                                key={app._id}
                                className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                            >
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                                                {college.logo ? (
                                                    <img
                                                        src={college.logo}
                                                        alt={college.name}
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                ) : (
                                                    <Building2 className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h3
                                                    className="font-bold text-slate-900 line-clamp-1 text-lg"
                                                    title={
                                                        college.name ||
                                                        'Unknown College'
                                                    }
                                                >
                                                    {college.name ||
                                                        'Unknown College'}
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5 uppercase tracking-wide">
                                                    Application Active
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                Selected Course
                                            </label>
                                            <select
                                                className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all shadow-sm"
                                                value={
                                                    app.course?._id ||
                                                    app.course ||
                                                    ''
                                                }
                                                onChange={e =>
                                                    updateApplicationCourse(
                                                        app._id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select a course
                                                </option>
                                                {college.availableCourses?.map(
                                                    ac => (
                                                        <option
                                                            key={
                                                                ac.course
                                                                    ?._id ||
                                                                ac.course
                                                            }
                                                            value={
                                                                ac.course
                                                                    ?._id ||
                                                                ac.course
                                                            }
                                                        >
                                                            {ac.course?.name ||
                                                                'Course'}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                                            <Link
                                                to={`/college/${college._id || college}`}
                                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline px-2 py-1 -ml-2 rounded-lg transition-colors"
                                            >
                                                View College
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            'Are you sure you want to withdraw this application?'
                                                        )
                                                    ) {
                                                        deleteApplication(
                                                            app._id
                                                        );
                                                    }
                                                }}
                                                className="text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 -mr-3 rounded-lg transition-colors"
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentApplications;
