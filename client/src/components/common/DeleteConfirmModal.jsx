import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const DeleteConfirmModal = ({ studentName, onConfirm, onClose }) => {
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="surface-paper w-full max-w-sm rounded-[var(--radius-xl)] shadow-2xl overflow-hidden animate-fade-in border border-[var(--border)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
                    <h2 className="text-xl font-display flex items-center gap-2 text-[var(--color-danger)]">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Student
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-[var(--color-danger)]/10 text-[var(--muted)] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-[var(--foreground)] mb-1">
                        Are you sure you want to delete
                    </p>
                    <p className="font-display text-lg text-[var(--foreground)] mb-4">
                        {studentName}?
                    </p>
                    <p className="text-sm text-[var(--muted)] mb-6">
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1 rounded-[var(--radius-md)]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-5 py-2.5 bg-[var(--color-danger)] hover:bg-red-600 text-white font-medium rounded-[var(--radius-md)] transition-all shadow-sm active:scale-95"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteConfirmModal;
