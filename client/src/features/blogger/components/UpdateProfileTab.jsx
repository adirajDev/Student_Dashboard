import { UserCircle, Save } from 'lucide-react';
import Loading from '../../../components/common/Loading.jsx'; // adjust path to match your project
import { useEditBloggerForm } from '../hooks/useEditBloggerForm';
import ArrayListField from './ProfileEditFields/ArrayListField';
import ProfileImageField from './ProfileEditFields/ProfileImageField';

const UpdateProfileTab = ({user}) => {
    const {
        formData,
        loading,
        error,
        submitting,
        submitError,
        successMsg,
        handleInputChange,
        addArrayItem,
        updateArrayItem,
        removeArrayItem,
        handleImageChange,
        removeImage,
        handleSubmit,
    } = useEditBloggerForm(user);

    if (loading) return <Loading />;
    if (error)
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-2xl">
                {error}
            </div>
        );

    return (
        <div className="animate-fade-in bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <UserCircle className="w-6 h-6 text-blue-500" />
                <h3 className="text-2xl">Edit Blogger Profile</h3>
            </div>
            <p className="text-sm text-[var(--ring)] mb-8">
                Update your public blogger profile. Changes are applied
                immediately.
            </p>

            {submitError && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
                    {submitError}
                </div>
            )}
            {successMsg && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <ProfileImageField
                    profileImage={formData.profileImage}
                    onImageChange={handleImageChange}
                    onRemove={removeImage}
                />

                <div>
                    <label
                        htmlFor="about"
                        className="text-sm font-medium text-[var(--foreground)] block mb-2"
                    >
                        About
                    </label>
                    <textarea
                        id="about"
                        name="about"
                        rows={5}
                        maxLength={2000}
                        value={formData.about}
                        onChange={handleInputChange}
                        placeholder="Tell readers about yourself..."
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none"
                    />
                    <p className="text-xs text-[var(--ring)] mt-1 text-right">
                        {formData.about.length}/2000
                    </p>
                </div>

                <ArrayListField
                    label="Specializations"
                    field="specializations"
                    items={formData.specializations}
                    placeholder="e.g. System Design"
                    onAdd={addArrayItem}
                    onUpdate={updateArrayItem}
                    onRemove={removeArrayItem}
                />

                <ArrayListField
                    label="Achievements"
                    field="achievements"
                    items={formData.achievements}
                    placeholder="e.g. Speaker at NodeConf 2024"
                    onAdd={addArrayItem}
                    onUpdate={updateArrayItem}
                    onRemove={removeArrayItem}
                />

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full md:w-auto flex justify-center items-center gap-2"
                    >
                        {submitting ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfileTab;
