import { useState } from 'react';
import { Plus } from 'lucide-react';
import PromotionTable from './PromotionTable';
import PromotionFormModal from './PromotionFormModal';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import usePromotions from '../hooks/usePromotions';

const PromotionManagementSection = ({ title }) => {
    const {
        promotions,
        isLoading,
        error,
        addPromotion,
        updatePromotion,
        deletePromotion,
    } = usePromotions(true);

    const [editing, setEditing] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deleting, setDeleting] = useState(null);

    return (
        <div className="mt-10 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl">{title}</h3>
                <button
                    onClick={() => {
                        setEditing(null);
                        setShowFormModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Placement
                </button>
            </div>

            <p className="mb-6 text-sm text-[var(--muted)]">
                Banners shown on public pages. Each one targets a single
                placement; only active placements inside their date window
                render.
            </p>

            <PromotionTable
                promotions={promotions}
                isLoading={isLoading}
                error={error}
                onDelete={setDeleting}
                onEdit={item => {
                    setEditing(item);
                    setShowFormModal(true);
                }}
            />

            {showFormModal && (
                <PromotionFormModal
                    editing={editing}
                    title={editing ? 'Edit Placement' : 'Add Placement'}
                    onAdd={addPromotion}
                    onUpdate={updatePromotion}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditing(null);
                    }}
                />
            )}

            {deleting && (
                <DeleteConfirmModal
                    studentName={deleting.label}
                    onConfirm={async () => {
                        await deletePromotion(deleting._id);
                        setDeleting(null);
                    }}
                    onClose={() => setDeleting(null)}
                />
            )}
        </div>
    );
};

export default PromotionManagementSection;
