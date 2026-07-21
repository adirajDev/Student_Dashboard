import { X, Check, XCircle, Building2, TrendingUp, Users, Presentation } from 'lucide-react';
import { useState } from 'react';

const ReviewUpdateModal = ({ update, onClose, onApprove, onReject }) => {
    const [feedback, setFeedback] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    if (!update) return null;

    const changes = update.proposedChanges;

    const renderDiff = (label, currentVal, proposedVal) => {
        if (proposedVal === undefined || proposedVal === currentVal) return null;
        return (
            <div className="mb-4">
                <span className="block text-xs font-semibold text-[var(--ring)] uppercase mb-1">{label}</span>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div className="flex-1 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 p-3 rounded-xl line-through text-red-800 dark:text-red-300 opacity-60">
                        {currentVal || <span className="italic text-xs">Empty</span>}
                    </div>
                    <div className="flex-1 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-3 rounded-xl text-green-800 dark:text-green-300">
                        {proposedVal}
                    </div>
                </div>
            </div>
        );
    };

    const renderJsonDiff = (label, proposedVal) => {
        if (!proposedVal) return null;
        return (
            <div className="mb-4">
                <span className="block text-xs font-semibold text-[var(--ring)] uppercase mb-1">{label} (Proposed)</span>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                    <pre className="text-xs overflow-x-auto text-[var(--foreground)]">{JSON.stringify(proposedVal, null, 2)}</pre>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[var(--card)] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[var(--border)] overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h3 className="text-xl font-semibold">Review: {update.college?.name}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Diff view) */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-2xl text-sm border border-blue-200 dark:border-blue-800">
                        Requested by <strong>{update.requestedBy?.name}</strong> ({update.requestedBy?.email}) on {new Date(update.createdAt).toLocaleDateString()}
                    </div>

                    <div className="space-y-6">
                        {changes.name && renderDiff('College Name', update.college?.name, changes.name)}
                        {changes.description && renderDiff('Description', 'Current Description Hidden (See DB)', changes.description)}
                        
                        {changes.placementDetails && (
                            <div className="border border-[var(--border)] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-4 text-[var(--foreground)] font-medium">
                                    <TrendingUp className="w-4 h-4 text-blue-500" /> Placements
                                </div>
                                {renderJsonDiff('Placement Details', changes.placementDetails)}
                            </div>
                        )}

                        {changes.recruiters && (
                            <div className="border border-[var(--border)] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-4 text-[var(--foreground)] font-medium">
                                    <Building2 className="w-4 h-4 text-purple-500" /> Top Recruiters
                                </div>
                                {renderJsonDiff('Recruiters List', changes.recruiters)}
                            </div>
                        )}

                        {changes.faculty && (
                            <div className="border border-[var(--border)] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-4 text-[var(--foreground)] font-medium">
                                    <Users className="w-4 h-4 text-orange-500" /> Faculty Roster
                                </div>
                                {renderJsonDiff('Faculty List', changes.faculty)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border)] bg-slate-50 dark:bg-slate-900/50">
                    {isRejecting ? (
                        <div className="animate-fade-in space-y-3">
                            <label className="block text-sm font-medium text-[var(--foreground)]">Reason for Rejection</label>
                            <textarea 
                                value={feedback} 
                                onChange={e => setFeedback(e.target.value)} 
                                className="input-field min-h-[80px]" 
                                placeholder="Explain why these changes are being rejected..."
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setIsRejecting(false)} className="btn-secondary">Cancel</button>
                                <button onClick={() => onReject(update._id, feedback)} disabled={!feedback.trim()} className="btn-primary bg-red-500 hover:bg-red-600 border-none">
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsRejecting(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                            <button onClick={() => onApprove(update._id)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors">
                                <Check className="w-4 h-4" /> Approve Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewUpdateModal;
