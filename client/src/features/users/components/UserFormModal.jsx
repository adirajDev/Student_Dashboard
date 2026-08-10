import UserForm from './UserForm';
import { createPortal } from 'react-dom';

const UserFormModal = ({
    onAdd,
    onUpdate,
    editingUser,
    onClose,
    showCourse,
    showCollegeOnly,
    title,
}) => {
    return createPortal(
        <div className="modal-overlay flex items-center justify-center p-4">
            <div className="surface-paper w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border)] relative overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h2 className="text-xl text-[var(--foreground)]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--ring)] hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <UserForm
                        editingUser={editingUser}
                        showCourse={showCourse}
                        showCollegeOnly={showCollegeOnly}
                        onAdd={async data => {
                            await onAdd(data);
                            onClose();
                        }}
                        onUpdate={async (id, data) => {
                            await onUpdate(id, data);
                            onClose();
                        }}
                        onCancelEdit={onClose}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserFormModal;
