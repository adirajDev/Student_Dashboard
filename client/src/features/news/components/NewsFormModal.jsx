import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import NewsFormFields from './NewsFormFields';
import useNewsForm from '../hooks/useNewsForm';

const NewsFormModal = ({ editingNews, title, onAdd, onUpdate, onClose }) => {
    const {
        formData,
        isSubmitting,
        isReadingImage,
        error,
        coverError,
        handleChange,
        handleCoverChange,
        removeCoverImage,
        handleSubmit,
    } = useNewsForm({
        editingNews,
        onAdd,
        onUpdate,
        onClose,
    });

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

                    <form id="news-form" onSubmit={handleSubmit}>
                        <NewsFormFields
                            formData={formData}
                            isReadingImage={isReadingImage}
                            coverError={coverError}
                            handleChange={handleChange}
                            handleCoverChange={handleCoverChange}
                            removeCoverImage={removeCoverImage}
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
                        form="news-form"
                        className="btn-primary flex-1"
                        disabled={isSubmitting || isReadingImage}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : editingNews
                                ? 'Update News'
                                : 'Publish News'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NewsFormModal;