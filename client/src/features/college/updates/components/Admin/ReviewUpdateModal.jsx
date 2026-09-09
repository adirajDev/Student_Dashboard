import { X, Check, XCircle } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { buildChangeSections } from '../changes/index.js';

const ReviewUpdateModal = ({ update, onClose, onApprove, onReject }) => {
    const [feedback, setFeedback] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    if (!update) return null;

    const sections = buildChangeSections(update);

    return createPortal(
        <div className="modal-overlay z-[9999] flex justify-center items-center p-4 sm:p-6">
            <div className="surface-paper rounded-[var(--radius-xl)] w-full max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl border border-[var(--border)] overflow-hidden mt-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h3 className="text-xl">
                        Review: {update.college?.name || 'Unknown College'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (diff view) */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-sm border border-blue-200">
                        Requested by <strong>{update.requestedBy?.name}</strong>{' '}
                        ({update.requestedBy?.email}) on{' '}
                        {new Date(update.createdAt).toLocaleDateString()}
                    </div>

                    {sections.length === 0 ? (
                        <div className="py-10 text-center text-[var(--ring)] border border-dashed border-[var(--border)] rounded-2xl">
                            <p className="font-medium">
                                No effective changes in this request.
                            </p>
                            <p className="text-xs mt-1">
                                Every submitted value matches the current
                                record. Approving is a no-op.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">{sections}</div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border)] bg-slate-50">
                    {isRejecting ? (
                        <div className="animate-fade-in space-y-3">
                            <label className="block text-sm font-medium text-[var(--foreground)]">
                                Reason for Rejection
                            </label>
                            <textarea
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                className="input-field min-h-[80px]"
                                placeholder="Explain why these changes are being rejected..."
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setIsRejecting(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        onReject(update._id, feedback)
                                    }
                                    disabled={!feedback.trim()}
                                    className="btn-primary bg-red-500 hover:bg-red-600 border-none"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsRejecting(true)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
                            >
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                            <button
                                onClick={() => onApprove(update._id)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                            >
                                <Check className="w-4 h-4" /> Approve Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReviewUpdateModal;
