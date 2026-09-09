import { createPortal } from 'react-dom';
import {
    X,
    Type,
    Link as LinkIcon,
    FileText,
    CheckSquare,
    GraduationCap,
} from 'lucide-react';
import useExamForm from '../hooks/useExamForm';
import FaqFields from '@/components/common/FaqFields.jsx';
import ExamField from '@/features/exam/components/ExamForn/ExamField.jsx';

const ExamFormFields = ({
                            formData,
                            handleChange,
                            handleNameChange,
                            handleSlugChange,
                            setFaqs,
                            editingExam,
                        }) => {
    return (
        <div className="space-y-6">
            <ExamField
                label="Exam Name"
                name="name"
                icon={Type}
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Joint Entrance Examination (JEE)"
            />

            <ExamField
                label="URL Slug"
                name="slug"
                icon={LinkIcon}
                required
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="e.g. joint-entrance-examination-jee"
                hint={
                    <>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                            Public page:{' '}
                            <span className="font-mono">
                                /exam/{formData.slug || '…'}
                            </span>
                        </p>
                        {editingExam && formData.slug !== editingExam.slug && (
                            <p className="mt-1 text-xs text-amber-700">
                                Changing the slug moves the public URL. Existing
                                links to{' '}
                                <span className="font-mono">
                                    /exam/{editingExam.slug}
                                </span>{' '}
                                will stop working.
                            </p>
                        )}
                    </>
                }
            />

            <ExamField
                label="Eligibility Requirement"
                name="requirement"
                icon={GraduationCap}
                as="textarea"
                rows="2"
                required
                value={formData.requirement}
                onChange={handleChange}
                placeholder="e.g. 10+2 with Physics, Chemistry, and Mathematics..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExamField
                    label="Registration Start Date"
                    name="regStartingDate"
                    type="date"
                    required
                    value={formData.regStartingDate}
                    onChange={handleChange}
                />
                <ExamField
                    label="Registration End Date"
                    name="regEndingDate"
                    type="date"
                    required
                    value={formData.regEndingDate}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExamField
                    label="Exam Mode"
                    name="examMode"
                    icon={CheckSquare}
                    as="select"
                    required
                    value={formData.examMode}
                    onChange={handleChange}
                >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                </ExamField>

                <ExamField
                    label="Official Exam Link"
                    name="examLink"
                    icon={LinkIcon}
                    type="url"
                    value={formData.examLink}
                    onChange={handleChange}
                    placeholder="https://example.com"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ExamField
                    label="Exam Date"
                    name="examDate"
                    type="date"
                    required
                    value={formData.examDate}
                    min={formData.regEndingDate}
                    onChange={handleChange}
                />
                <ExamField
                    label="Start Time"
                    name="examTime"
                    type="time"
                    required
                    value={formData.examTime}
                    onChange={handleChange}
                />

                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="number"
                                name="examDurationHours"
                                value={formData.examDurationHours}
                                onChange={handleChange}
                                min="0"
                                placeholder="Hrs"
                                required={!formData.examDurationMinutes}
                                className="w-full px-3 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="number"
                                name="examDurationMinutes"
                                value={formData.examDurationMinutes}
                                onChange={handleChange}
                                min="0"
                                max="59"
                                placeholder="Min"
                                required={!formData.examDurationHours}
                                className="w-full px-3 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ExamField
                label="Exam Description"
                name="examDescription"
                icon={FileText}
                as="textarea"
                rows="4"
                required
                value={formData.examDescription}
                onChange={handleChange}
                placeholder="Provide a detailed description of the exam..."
            />

            <FaqFields value={formData.faqs} onChange={setFaqs} />
        </div>
    );
};

const ExamFormModal = ({ editingExam, title, onAdd, onUpdate, onClose }) => {
    const {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        setFaqs,
        handleNameChange,
        handleSlugChange
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
