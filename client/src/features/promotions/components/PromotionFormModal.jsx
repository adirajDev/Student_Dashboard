import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import PromotionFormFields from './PromotionFormFields';
import usePromotionForm from '../hooks/usePromotionForm';

const PromotionFormModal = ({ editing, title, onAdd, onUpdate, onClose }) => {
    const {
        formData,
        hasExistingImage,
        isSubmitting,
        isReadingImage,
        error,
        imageError,
        handleChange,
        handleImageChange,
        removeImage,
        handleSubmit,
    } = usePromotionForm({ editing, onAdd, onUpdate, onClose });

    return createPortal(
        <div
            className="modal-overlay flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="surface-paper w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl border border-[var(--border)] relative overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
                    <h2 className="text-xl">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form id="promotion-form" onSubmit={handleSubmit}>
                        <PromotionFormFields
                            formData={formData}
                            editing={editing}
                            hasExistingImage={hasExistingImage}
                            isReadingImage={isReadingImage}
                            imageError={imageError}
                            handleChange={handleChange}
                            handleImageChange={handleImageChange}
                            removeImage={removeImage}
                        />
                    </form>
                </div>

                <div className="p-6 pt-2 flex gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary flex-1"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="promotion-form"
                        className="btn-primary flex-1"
                        disabled={isSubmitting || isReadingImage}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : editing
                                ? 'Update Placement'
                                : 'Create Placement'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PromotionFormModal;