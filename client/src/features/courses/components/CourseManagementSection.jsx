import { useState } from 'react';
import { Plus } from 'lucide-react';
import CourseTable from './CourseTable';
import CourseFormModal from './CourseFormModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import useCourseManagement from '../hooks/useCourseManagement';

const CourseManagementSection = ({ title }) => {
    const {
        courses,
        isLoading,
        error,
        page,
        totalPages,
        setPage,
        searchTerm,
        setSearchTerm,
        filterLevel,
        setFilterLevel,
        addCourse,
        updateCourse,
        deleteCourse,
    } = useCourseManagement(true);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState(null);

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">{title}</h3>
                <button
                    onClick={() => {
                        setEditingCourse(null);
                        setShowFormModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Course
                </button>
            </div>

            <CourseTable
                courses={courses}
                isLoading={isLoading}
                error={error}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterLevel={filterLevel}
                setFilterLevel={setFilterLevel}
                onDelete={setDeletingCourse}
                onEdit={c => {
                    setEditingCourse(c);
                    setShowFormModal(true);
                }}
            />

            {showFormModal && (
                <CourseFormModal
                    editingCourse={editingCourse}
                    title={editingCourse ? 'Edit Course' : 'Add New Course'}
                    onAdd={addCourse}
                    onUpdate={updateCourse}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingCourse(null);
                    }}
                />
            )}

            {deletingCourse && (
                <DeleteConfirmModal
                    studentName={deletingCourse.name}
                    onConfirm={async () => {
                        await deleteCourse(
                            deletingCourse._id || deletingCourse.id
                        );
                        setDeletingCourse(null);
                    }}
                    onClose={() => setDeletingCourse(null)}
                />
            )}
        </div>
    );
};

export default CourseManagementSection;
