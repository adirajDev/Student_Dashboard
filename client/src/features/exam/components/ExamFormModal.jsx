import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useExamForm from '../hooks/useExamForm';
import ExamFormFields from './ExamForm/ExamFormFields';

const ExamFormModal = ({ editingExam, title, onAdd, onUpdate, onClose }) => {
    const {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        setFaqs,
        handleNameChange,
        handleSlugChange,
    } = useExamForm({
        editingExam,
        onAdd,
        onUpdate,
        onClose,
    });

    return createPortal(
        <div
            className="modal-overlay flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="surface-paper w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border)] relative overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
                    <h2 className="text-xl">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form id="exam-form" onSubmit={handleSubmit}>
                        <ExamFormFields
                            formData={formData}
                            handleChange={handleChange}
                            handleNameChange={handleNameChange}
                            handleSlugChange={handleSlugChange}
                            setFaqs={setFaqs}
                            editingExam={editingExam}
                        />
                    </form>
                </div>

                <div className="p-6 pt-2 flex gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary flex-1"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="exam-form"
                        className="btn-primary flex-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : editingExam
                              ? 'Update Exam'
                              : 'Create Exam'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExamFormModal;
