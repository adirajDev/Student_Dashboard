import { createPortal } from 'react-dom';
import { X, Briefcase, Users } from 'lucide-react';

const ListModal = ({ isOpen, onClose, title, type, data }) => {
    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] flex items-center">
                        {type === 'recruiters' ? (
                            <Briefcase className="w-6 h-6 mr-3 text-blue-500" />
                        ) : (
                            <Users className="w-6 h-6 mr-3 text-blue-500" />
                        )}
                        {title}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {type === 'recruiters' ? (
                        <div className="flex flex-wrap gap-2">
                            {data.map((recruiter, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                                >
                                    {recruiter}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.map((member, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 hover:bg-slate-100/50 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-500 shrink-0">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[var(--foreground)] font-semibold truncate">
                                            {member.name}
                                        </h4>
                                        {member.department && (
                                            <p className="text-sm text-slate-600 font-medium truncate">
                                                {member.department}
                                            </p>
                                        )}
                                        {member.role && (
                                            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider truncate">
                                                {member.role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ListModal;
