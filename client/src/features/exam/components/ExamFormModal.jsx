import { createPortal } from 'react-dom';
import {
    X,
    Calendar,
    Type,
    Link as LinkIcon,
    FileText,
    CheckSquare,
    GraduationCap,
} from 'lucide-react';
import useExamForm from '../hooks/useExamForm';

const ExamFormFields = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                    Exam Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)]" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="e.g. Joint Entrance Examination (JEE)"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                    Eligibility Requirement{' '}
                    <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <GraduationCap className="absolute left-4 top-3 w-5 h-5 text-[var(--ring)]" />
                    <textarea
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleChange}
                        required
                        rows="2"
                        className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="e.g. 10+2 with Physics, Chemistry, and Mathematics..."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Registration Start Date{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            name="regStartingDate"
                            value={formData.regStartingDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Registration End Date{' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            name="regEndingDate"
                            value={formData.regEndingDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Exam Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <CheckSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)] pointer-events-none" />
                        <select
                            name="examMode"
                            value={formData.examMode}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
                        >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Official Exam Link
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)]" />
                        <input
                            type="url"
                            name="examLink"
                            value={formData.examLink}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Exam Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            name="examDate"
                            value={formData.examDate}
                            min={formData.regEndingDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                        Start Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="time"
                            name="examTime"
                            value={formData.examTime}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>
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

            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                    Exam Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FileText className="absolute left-4 top-3 w-5 h-5 text-[var(--ring)]" />
                    <textarea
                        name="examDescription"
                        value={formData.examDescription}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Provide a detailed description of the exam..."
                    />
                </div>
            </div>
        </div>
    );
};

const ExamFormModal = ({ editingExam, title, onAdd, onUpdate, onClose }) => {
    const { formData, isSubmitting, error, handleChange, handleSubmit } =
        useExamForm({
            editingExam,
            onAdd,
            onUpdate,
            onClose,
        });

    return createPortal(
        <div className="modal-overlay flex items-center justify-center p-4" onClick={onClose}>
            <div className="surface-paper w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border)] relative overflow-hidden animate-slide-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
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
