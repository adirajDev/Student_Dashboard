import { Building2, Save } from 'lucide-react';
import useEditCollegeForm from '../hooks/useEditCollegeForm';
import Loading from '../../../components/common/Loading';
import BasicInfoFields from './Form/BasicInfoFields';
import PlacementFields from './Form/PlacementFields';
import RecruiterFields from './Form/RecruiterFields';
import FacultyFields from './Form/FacultyFields';

const EditCollegeTab = ({ user }) => {
    const {
        formData,
        loading,
        error,
        submitting,
        submitError,
        successMsg,
        handleInputChange,
        handlePlacementChange,
        addRecruiter,
        updateRecruiter,
        removeRecruiter,
        addFaculty,
        updateFaculty,
        removeFaculty,
        handleSubmit,
    } = useEditCollegeForm(user);

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
                <Building2 className="w-6 h-6 text-blue-500" />
                <h3 className="text-2xl">Edit College Details</h3>
            </div>

            <p className="text-sm text-[var(--ring)] mb-8">
                Changes made here will be submitted to the administration for
                review. Once approved, they will go live.
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
                <BasicInfoFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <PlacementFields
                    placementDetails={formData.placementDetails}
                    handlePlacementChange={handlePlacementChange}
                />

                <RecruiterFields
                    recruiters={formData.recruiters}
                    addRecruiter={addRecruiter}
                    updateRecruiter={updateRecruiter}
                    removeRecruiter={removeRecruiter}
                />

                <FacultyFields
                    faculty={formData.faculty}
                    addFaculty={addFaculty}
                    updateFaculty={updateFaculty}
                    removeFaculty={removeFaculty}
                />

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full md:w-auto flex justify-center items-center gap-2"
                    >
                        {submitting ? (
                            'Submitting...'
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Submit for Approval
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCollegeTab;
