import { useState } from 'react';
import { Plus } from 'lucide-react';
import ExamTable from './ExamTable';
import ExamFormModal from './ExamFormModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import useExams from '../hooks/useExams';

const ExamManagementSection = ({ title }) => {
    const { exams, isLoading, error, addExam, updateExam, deleteExam } =
        useExams(true);
    const [editingExam, setEditingExam] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingExam, setDeletingExam] = useState(null);

    return (
        <div className="mt-10 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">{title}</h3>
                <button
                    onClick={() => {
                        setEditingExam(null);
                        setShowFormModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Exam
                </button>
            </div>

            <ExamTable
                exams={exams}
                isLoading={isLoading}
                error={error}
                onDelete={setDeletingExam}
                onEdit={e => {
                    setEditingExam(e);
                    setShowFormModal(true);
                }}
            />

            {showFormModal && (
                <ExamFormModal
                    editingExam={editingExam}
                    title={editingExam ? 'Edit Exam' : 'Add New Exam'}
                    onAdd={addExam}
                    onUpdate={updateExam}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingExam(null);
                    }}
                />
            )}

            {deletingExam && (
                <DeleteConfirmModal
                    studentName={deletingExam.name}
                    onConfirm={async () => {
                        await deleteExam(deletingExam._id);
                        setDeletingExam(null);
                    }}
                    onClose={() => setDeletingExam(null)}
                />
            )}
        </div>
    );
};

export default ExamManagementSection;
