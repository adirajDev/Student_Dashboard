import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, GraduationCap, Building2, Calendar, FileText } from 'lucide-react';
import useUserDetails from '../hooks/useUserDetails';

const UserDetailsModal = ({ user, onClose }) => {
    const { formattedData } = useUserDetails(user);

    if (!formattedData) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)] animate-slide-up">
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
                    {/* Basic Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <User className="w-5 h-5 text-indigo-500 shrink-0" />
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</span>
                                <span className="font-semibold text-slate-800">{formattedData.name}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="truncate">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                                <span className="font-semibold text-slate-800 truncate block">{formattedData.email}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                                <span className="font-semibold text-slate-800">{formattedData.phone}</span>
                            </div>
                        </div>

                        {formattedData.createdAt && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Joined Date</span>
                                    <span className="font-semibold text-slate-800">{formattedData.createdAt}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary Course & College if present */}
                    {(formattedData.primaryCollege !== 'Not Assigned' || formattedData.primaryCourse !== 'Not Assigned') && (
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">Primary Institution</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-slate-500">College: </span>
                                    <span className="font-semibold text-slate-800">{formattedData.primaryCollege}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Course: </span>
                                    <span className="font-semibold text-slate-800">{formattedData.primaryCourse}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Applications Section for Students */}
                    {formattedData.role === 'student' && (
                        <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                    College Applications ({formattedData.applications.length})
                                </h3>
                            </div>

                            {formattedData.hasApplications ? (
                                <div className="space-y-3">
                                    {formattedData.applications.map((app, index) => (
                                        <div
                                            key={app.id || index}
                                            className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <h4 className="font-bold text-slate-800">{app.collegeName}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    <span>Selected Course: <strong className="text-slate-800">{app.courseName}</strong></span>
                                                </div>
                                            </div>
                                            <span className="self-start sm:self-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                                    <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 font-medium">No college applications submitted yet.</p>
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
