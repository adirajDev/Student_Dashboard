import UserForm from './UserForm';
import { createPortal } from 'react-dom';

const UserFormModal = ({ onAdd, onUpdate, editingUser, onClose, showCourse, title }) => {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[var(--card)] rounded-xl shadow-2xl overflow-hidden animate-slide-up">
                
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h2 className="text-xl text-[var(--foreground)]">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <UserForm
                        editingUser={editingUser}
                        showCourse={showCourse}
                        onAdd={async (data) => {
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
