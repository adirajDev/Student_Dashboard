import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Type, Link as LinkIcon, FileText, CheckSquare, GraduationCap } from 'lucide-react';

const ExamFormModal = ({ editingExam, title, onAdd, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        requirement: '',
        regStartingDate: '',
        regEndingDate: '',
        examMode: 'Offline',
        examDescription: '',
        examLink: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Format date for datetime-local input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        // Needs to be in YYYY-MM-DD format for date inputs
        return d.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (editingExam) {
            setFormData({
                name: editingExam.name || '',
                requirement: editingExam.requirement || '',
                regStartingDate: formatDateForInput(editingExam.regStartingDate),
                regEndingDate: formatDateForInput(editingExam.regEndingDate),
                examMode: editingExam.examMode || 'Offline',
                examDescription: editingExam.examDescription || '',
                examLink: editingExam.examLink || '',
            });
        }
    }, [editingExam]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            let res;
            if (editingExam) {
                res = await onUpdate(editingExam._id, formData);
            } else {
                res = await onAdd(formData);
            }

            if (res.success) {
                onClose();
            } else {
                setError(res.error || 'Operation failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--card)] w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form id="exam-form" onSubmit={handleSubmit} className="space-y-6">
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
                                Eligibility Requirement <span className="text-red-500">*</span>
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
                                    Registration Start Date <span className="text-red-500">*</span>
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
                                    Registration End Date <span className="text-red-500">*</span>
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
                    </form>
                </div>

                <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-medium border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="exam-form"
                        className="btn-primary px-8 py-2.5"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : editingExam ? 'Update Exam' : 'Create Exam'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExamFormModal;
