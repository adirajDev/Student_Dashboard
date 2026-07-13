import { X, UserPlus, Pencil } from 'lucide-react';
import StudentForm from './StudentForm';

const StudentFormModal = ({ editingStudent, onAdd, onUpdate, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--card)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-[var(--border)]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {editingStudent ? (
                            <><Pencil className="w-5 h-5 text-blue-500" /> Edit Student</>
                        ) : (
                            <><UserPlus className="w-5 h-5 text-blue-500" /> Add New Student</>
                        )}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <StudentForm
                        key={editingStudent?._id || 'new-student'}
                        editingStudent={editingStudent}
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
        </div>
    );
};

export default StudentFormModal;
