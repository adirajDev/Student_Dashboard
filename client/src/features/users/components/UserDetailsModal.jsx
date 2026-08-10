import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    User,
    Mail,
    Phone,
    GraduationCap,
    Building2,
    Calendar,
    FileText,
    Trash2,
    Plus,
    Loader2,
} from 'lucide-react';
import useUserDetails from '../hooks/useUserDetails';
import useAdminStudentApplications from '../hooks/useAdminStudentApplications';

const UserDetailsModal = ({ user, onClose, onUserApplicationsUpdate }) => {
    const { formattedData } = useUserDetails(user);
    const {
        applications,
        colleges,
        isLoadingColleges,
        loadingMap,
        error,
        success,
        isAdding,
        setIsAdding,
        addApplication,
        updateApplicationCourse,
        deleteApplication,
        setError,
        setSuccess,
    } = useAdminStudentApplications(user, onUserApplicationsUpdate);

    const [newCollegeId, setNewCollegeId] = useState('');
    const [newCourseId, setNewCourseId] = useState('');

    if (!formattedData) return null;

    const collegesList = Array.isArray(colleges) ? colleges : [];
    const selectedCollegeObj = collegesList.find(
        c => (c._id || c.id) === newCollegeId
    );
    const availableCoursesForSelectedCollege =
        selectedCollegeObj?.availableCourses || [];
    const handleAddSubmit = async e => {
        e.preventDefault();
        if (!newCollegeId) return;
        const ok = await addApplication(newCollegeId, newCourseId);
        if (ok) {
            setNewCollegeId('');
            setNewCourseId('');
        }
    };
    return createPortal(
        <div className="modal-overlay flex items-center justify-center p-4">
            <div className="surface-paper w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border)] relative overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--foreground)]">
                                User Details
                            </h2>
                            <p className="text-xs text-[var(--ring)]">
                                {formattedData.roleDisplay} Profile Information
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--ring)] hover:bg-slate-200/60 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Content */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Banners */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm flex justify-between items-center">
                            <span>{error}</span>
                            <button
                                onClick={() => setError('')}
                                className="p-1 hover:bg-red-100 rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-sm flex justify-between items-center">
                            <span>{success}</span>
                            <button
                                onClick={() => setSuccess('')}
                                className="p-1 hover:bg-green-100 rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {/* Basic Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <User className="w-5 h-5 text-indigo-500 shrink-0" />
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                                    Full Name
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {formattedData.name}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="truncate">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                                    Email Address
                                </span>
                                <span className="font-semibold text-slate-800 truncate block">
                                    {formattedData.email}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                                    Phone Number
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {formattedData.phone}
                                </span>
                            </div>
                        </div>
                        {formattedData.createdAt && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                                        Joined Date
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {formattedData.createdAt}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Applications Section for Students */}
                    {formattedData.role === 'student' && (
                        <div className="space-y-4 pt-2 border-t border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                    College Applications ({applications.length}
                                    /3)
                                </h3>
                                {applications.length < 3 && !isAdding && (
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Application
                                    </button>
                                )}
                            </div>
                            {/* Inline Add Application Form */}
                            {isAdding && (
                                <form
                                    onSubmit={handleAddSubmit}
                                    className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3 animate-fade-in"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                                            New Application
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                setNewCollegeId('');
                                                setNewCourseId('');
                                            }}
                                            className="text-slate-400 hover:text-slate-600 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                College
                                            </label>
                                            <select
                                                required
                                                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={newCollegeId}
                                                onChange={e => {
                                                    setNewCollegeId(
                                                        e.target.value
                                                    );
                                                    setNewCourseId('');
                                                }}
                                            >
                                                <option value="" disabled>
                                                    {isLoadingColleges
                                                        ? 'Loading colleges...'
                                                        : 'Select College'}
                                                </option>
                                                {collegesList.map(c => (
                                                    <option
                                                        key={c._id || c.id}
                                                        value={c._id || c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Course (Optional)
                                            </label>
                                            <select
                                                disabled={!newCollegeId}
                                                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                                value={newCourseId}
                                                onChange={e =>
                                                    setNewCourseId(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    No Course (Pending)
                                                </option>
                                                {availableCoursesForSelectedCollege.map(
                                                    ac => {
                                                        const courseObj =
                                                            ac.course || ac;
                                                        return (
                                                            <option
                                                                key={
                                                                    courseObj._id ||
                                                                    courseObj
                                                                }
                                                                value={
                                                                    courseObj._id ||
                                                                    courseObj
                                                                }
                                                            >
                                                                {courseObj.name ||
                                                                    'Course'}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsAdding(false)}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                loadingMap.add || !newCollegeId
                                            }
                                            className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
                                        >
                                            {loadingMap.add ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                'Add Application'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {/* Application Cards List */}
                            {applications.length > 0 ? (
                                <div className="space-y-3">
                                    {applications.map(app => {
                                        const college = app.college || {};
                                        const isLoading = loadingMap[app._id];
                                        return (
                                            <div
                                                key={app._id}
                                                className={`p-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all relative ${
                                                    isLoading
                                                        ? 'opacity-60 pointer-events-none'
                                                        : ''
                                                }`}
                                            >
                                                {isLoading && (
                                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center">
                                                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-indigo-600" />
                                                        <h4 className="font-bold text-slate-800 text-sm">
                                                            {college.name ||
                                                                'Unknown College'}
                                                        </h4>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    'Are you sure you want to remove this application?'
                                                                )
                                                            ) {
                                                                deleteApplication(
                                                                    app._id
                                                                );
                                                            }
                                                        }}
                                                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Application"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        Selected Course:
                                                    </span>
                                                    <select
                                                        className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 max-w-[260px] font-medium text-slate-800"
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
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Select a course
                                                        </option>
                                                        {college.availableCourses?.map(
                                                            ac => {
                                                                const courseObj =
                                                                    ac.course ||
                                                                    ac;
                                                                return (
                                                                    <option
                                                                        key={
                                                                            courseObj._id ||
                                                                            courseObj
                                                                        }
                                                                        value={
                                                                            courseObj._id ||
                                                                            courseObj
                                                                        }
                                                                    >
                                                                        {courseObj.name ||
                                                                            'Course'}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 font-medium">
                                        No college applications submitted yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-[var(--border)] bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-secondary text-sm px-6"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
export default UserDetailsModal;
