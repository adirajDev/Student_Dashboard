import { useState } from 'react';
import { Plus } from 'lucide-react';
import CollegeTable from './CollegeTable';
import CollegeFormModal from './CollegeFormModal';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import useCollegeManagement from '../hooks/useCollegeManagement';

const CollegeManagementSection = ({ title }) => {
    const {
        colleges,
        isLoading,
        error,
        page,
        totalPages,
        setPage,
        searchTerm,
        setSearchTerm,
        minRating,
        setMinRating,
        addCollege,
        updateCollege,
        deleteCollege,
    } = useCollegeManagement(true);
    const [editingCollege, setEditingCollege] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingCollege, setDeletingCollege] = useState(null);

    return (
        <div className="mt-10 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">{title}</h3>
                <button
                    onClick={() => {
                        setEditingCollege(null);
                        setShowFormModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add College
                </button>
            </div>

            <CollegeTable
                colleges={colleges}
                isLoading={isLoading}
                error={error}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                minRating={minRating}
                setMinRating={setMinRating}
                onDelete={setDeletingCollege}
                onEdit={c => {
                    setEditingCollege(c);
                    setShowFormModal(true);
                }}
            />

            {showFormModal && (
                <CollegeFormModal
                    editingCollege={editingCollege}
                    title={editingCollege ? 'Edit College' : 'Add New College'}
                    onAdd={addCollege}
                    onUpdate={updateCollege}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingCollege(null);
                    }}
                />
            )}

            {deletingCollege && (
                <DeleteConfirmModal
                    studentName={deletingCollege.name}
                    onConfirm={async () => {
                        await deleteCollege(deletingCollege._id);
                        setDeletingCollege(null);
                    }}
                    onClose={() => setDeletingCollege(null)}
                />
            )}
        </div>
    );
};

export default CollegeManagementSection;
