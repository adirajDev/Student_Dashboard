import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import FormField from '../../../components/common/FormField';

const CourseFormModal = ({ onAdd, onUpdate, editingCourse, onClose, title }) => {
    const [formData, setFormData] = useState({
        name: '',
        level: 'bachelors'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingCourse) {
            setFormData({
                name: editingCourse.name || '',
                level: editingCourse.level || 'bachelors'
            });
        }
    }, [editingCourse]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let res;
        if (editingCourse) {
            res = await onUpdate(editingCourse._id, formData);
        } else {
            res = await onAdd(formData);
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
                    <h2 className="text-xl text-[var(--foreground)]">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                        
                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-[var(--foreground)] mb-1">
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
                                <option value="diploma">Diploma</option>
                                <option value="bachelors">Bachelors</option>
                                <option value="masters">Masters</option>
                            </select>
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
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingCourse ? 'Save Changes' : 'Create Course'}
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
