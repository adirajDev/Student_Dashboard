import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import FormField from '../../../components/common/FormField';

const CollegeFormModal = ({
    onAdd,
    onUpdate,
    editingCollege,
    onClose,
    title,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        collegeId: '',
        type: 'Private',
        location: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingCollege) {
            setFormData({
                name: editingCollege.name || '',
                collegeId: editingCollege.collegeId || '',
                type: editingCollege.type || 'Private',
                location: editingCollege.location || '',
                description: editingCollege.description || '',
            });
        }
    }, [editingCollege]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let res;
        if (editingCollege) {
            res = await onUpdate(editingCollege._id, formData);
        } else {
            res = await onAdd(formData);
        }

        if (res?.success) {
            onClose();
        } else {
            setError(res?.error || 'Failed to save college');
            setLoading(false);
        }
    };

    return createPortal(
        <div className="modal-overlay flex items-center justify-center p-4">
            <div className="surface-paper w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border)] relative overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
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

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form
                        id="college-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                                label="College Name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Stanford University"
                            />
                            <FormField
                                label="College ID (Optional)"
                                id="collegeId"
                                value={formData.collegeId}
                                onChange={handleChange}
                                placeholder="e.g. STANFORD"
                                required={false}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-medium text-[var(--foreground)] mb-1"
                                >
                                    Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="Government">
                                        Government
                                    </option>
                                    <option value="Private">Private</option>
                                    <option value="Deemed">Deemed</option>
                                </select>
                            </div>
                            <FormField
                                label="Location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Stanford, California"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-[var(--foreground)] mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description about the college..."
                                rows={3}
                                className="input-field resize-none"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-[var(--border)] shrink-0 flex justify-end gap-3 bg-[var(--card)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-[var(--border)] hover:bg-slate-100 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="college-form"
                        disabled={loading}
                        className="btn-primary px-8 py-2.5 flex items-center gap-2"
                    >
                        {loading && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {editingCollege ? 'Save Changes' : 'Create College'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CollegeFormModal;
