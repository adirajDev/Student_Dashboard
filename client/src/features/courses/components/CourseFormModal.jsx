import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import FormField from '../../../components/common/FormField';

const CourseFormModal = ({
    onAdd,
    onUpdate,
    editingCourse,
    onClose,
    title,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        shortName: '',
        specialization: '',
        level: "Bachelor's",
        durationYears: '',
        durationMonths: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingCourse) {
            setFormData({
                name: editingCourse.name || '',
                shortName: editingCourse.shortName || '',
                specialization: editingCourse.specialization || '',
                level: editingCourse.level || "Bachelor's",
                durationYears: editingCourse.duration ? Math.floor(editingCourse.duration / 12) : '',
                durationMonths: editingCourse.duration ? editingCourse.duration % 12 : '',
            });
        }
    }, [editingCourse]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...formData,
            duration: (parseInt(formData.durationYears || 0) * 12) + parseInt(formData.durationMonths || 0)
        };
        // Clean up UI-only fields
        delete payload.durationYears;
        delete payload.durationMonths;

        if (payload.duration <= 0) {
            setError('Duration must be greater than 0');
            setLoading(false);
            return;
        }

        let res;
        if (editingCourse) {
            res = await onUpdate(editingCourse._id, payload);
        } else {
            res = await onAdd(payload);
        }

        if (res?.success) {
            onClose();
        } else {
            setError(res?.error || 'Failed to save course');
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h2 className="text-xl text-[var(--foreground)]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
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
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField
                            label="Course Name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                        />

                        <FormField
                            label="Short Name"
                            id="shortName"
                            value={formData.shortName}
                            onChange={handleChange}
                            placeholder="e.g. B.Tech"
                        />
                        
                        <FormField
                            label="Specialization (Optional)"
                            id="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science and Engineering"
                        />

                        <div>
                            <label
                                htmlFor="level"
                                className="block text-sm font-medium text-[var(--foreground)] mb-1"
                            >
                                Level
                            </label>
                            <select
                                id="level"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="Certificate">Certificate</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Advanced Diploma">Advanced Diploma</option>
                                <option value="Bachelor's">Bachelor's</option>
                                <option value="Master's">Master's</option>
                                <option value="Doctorate">Doctorate</option>
                                <option value="Post Doctorate">Post Doctorate</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Duration
                            </label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        id="durationYears"
                                        name="durationYears"
                                        min="0"
                                        value={formData.durationYears}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Years"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        id="durationMonths"
                                        name="durationMonths"
                                        min="0"
                                        max="11"
                                        value={formData.durationMonths}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Months"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-full border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary px-8 py-2.5 flex items-center gap-2"
                            >
                                {loading && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                {editingCourse
                                    ? 'Save Changes'
                                    : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CourseFormModal;
