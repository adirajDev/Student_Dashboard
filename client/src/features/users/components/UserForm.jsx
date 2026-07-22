import useUserForm from '../hooks/useUserForm';
import FormField from '../../../components/common/FormField';
import SearchableSelect from '../../search/components/SearchableSelect';

const UserForm = ({
    onAdd,
    onUpdate,
    editingUser,
    onCancelEdit,
    showCourse,
    showCollegeOnly,
}) => {
    const {
        formData,
        validationError,
        handleChange,
        handleSubmit,
        colleges,
        courses,
    } = useUserForm(editingUser);

    return (
        <form
            onSubmit={e => handleSubmit(e, onAdd, onUpdate, showCourse)}
            className="bg-[var(--card)] p-6 rounded-3xl shadow-sm border border-[var(--border)]"
        >
            <h3 className="text-xl mb-6 text-[var(--foreground)]">
                {editingUser ? 'Edit User' : 'Add New User'}
            </h3>

            {validationError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-400">
                        {validationError}
                    </p>
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
                    <>
                        <div>
                            <label
                                htmlFor="course"
                                className="block text-sm font-medium text-[var(--foreground)] mb-1"
                            >
                                Course
                            </label>
                            <select
                                id="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="" disabled>
                                    Select a course
                                </option>
                                {courses.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="college"
                                className="block text-sm font-medium text-[var(--foreground)] mb-1"
                            >
                                College
                            </label>
                            <SearchableSelect
                                name="college"
                                options={colleges}
                                value={formData.college}
                                onChange={handleChange}
                                placeholder="Search for a college..."
                            />
                        </div>

                        {formData.college === 'others' && (
                            <div className="animate-fade-in md:col-span-2 mt-2">
                                <label
                                    htmlFor="customCollege"
                                    className="block text-sm font-medium mb-1 text-blue-600 dark:text-blue-400"
                                >
                                    College Name
                                </label>
                                <input
                                    type="text"
                                    id="customCollege"
                                    name="customCollege"
                                    required
                                    value={formData.customCollege}
                                    onChange={handleChange}
                                    className="input-field border-blue-300 dark:border-blue-700 focus:ring-blue-500"
                                    placeholder="Enter the college name"
                                />
                            </div>
                        )}
                    </>
                )}

                {showCollegeOnly && !showCourse && (
                    <div className="md:col-span-2">
                        <label
                            htmlFor="college"
                            className="block text-sm font-medium text-[var(--foreground)] mb-1"
                        >
                            Assigned College
                        </label>
                        <SearchableSelect
                            name="college"
                            options={colleges}
                            value={formData.college}
                            onChange={handleChange}
                            placeholder="Search for a college to assign..."
                        />
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
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn-primary">
                    {editingUser ? 'Save Changes' : 'Add User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
