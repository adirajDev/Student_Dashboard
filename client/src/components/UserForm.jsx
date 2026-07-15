import useUserForm from '../hooks/useUserForm';
import FormField from '../utils/FormField';

const UserForm = ({ onAdd, onUpdate, editingUser, onCancelEdit, showCourse }) => {
    const { formData, validationError, handleChange, handleSubmit } = useUserForm(editingUser);

    return (
        <form onSubmit={(e) => handleSubmit(e, onAdd, onUpdate, showCourse)} className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-[var(--border)]">
            <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">
                {editingUser ? 'Edit User' : 'Add New User'}
            </h3>

            {validationError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-400">{validationError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe"
                />

                <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                />

                {showCourse && (
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Course
                        </label>
                        <select
                            id="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="" disabled>Select a course</option>
                            <option value="BTech">BTech</option>
                            <option value="BBA">BBA</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Management">Management</option>
                            <option value="Designing">Designing</option>
                        </select>
                    </div>
                )}

                <FormField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                />
            </div>

            <div className="mt-8 flex gap-3 justify-end">
                {editingUser && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="px-5 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                    {editingUser ? 'Save Changes' : 'Add User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
