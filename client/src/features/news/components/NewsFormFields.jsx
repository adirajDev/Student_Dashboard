import { useRef } from 'react';
import { Type, FileText, ImagePlus, X } from 'lucide-react';
import { TITLE_MAX_LENGTH } from '../hooks/useNewsForm';
import {
    getImageSrc,
    formatBytes,
    ACCEPTED_FILE_TYPES,
    IMAGE_SIZE_LIMIT_BYTES,
} from '../utils/newsUtils';
import FaqFields from '@/components/common/FaqFields';

const NewsFormFields = ({
                            formData,
                            isReadingImage,
                            coverError,
                            handleChange,
                            handleCoverChange,
                            removeCoverImage,
                            setFaqs,
                        }) => {
    const coverInputRef = useRef(null);
    const previewSrc = getImageSrc(formData.coverImage);

    const handleCoverPick = () => coverInputRef.current?.click();

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                    Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)]" />
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={TITLE_MAX_LENGTH}
                        className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        placeholder="e.g. Admissions open for the 2026 session"
                    />
                </div>
                <p className="mt-2 text-xs text-[var(--muted)] text-right">
                    {formData.title.length}/{TITLE_MAX_LENGTH}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                    Cover Image
                </label>

                {previewSrc ? (
                    <div className="relative inline-block">
                        <img
                            src={previewSrc}
                            alt="Cover"
                            className="max-h-40 rounded-[var(--radius-md)] border border-[var(--border)]"
                        />
                        <button
                            type="button"
                            onClick={removeCoverImage}
                            className="absolute -top-2 -right-2 p-1 bg-[var(--color-danger)] text-white rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleCoverPick}
                        disabled={isReadingImage}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <ImagePlus className="w-4 h-4" />
                        {isReadingImage
                            ? 'Processing...'
                            : 'Upload Cover Image'}
                    </button>
                )}

                <input
                    ref={coverInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    className="hidden"
                    onChange={handleCoverChange}
                />

                {formData.coverImage?.sizeBytes ? (
                    <p className="mt-2 text-xs text-[var(--muted)]">
                        {formData.coverImage.mimeType} ·{' '}
                        {formatBytes(formData.coverImage.sizeBytes)} of{' '}
                        {formatBytes(IMAGE_SIZE_LIMIT_BYTES)}
                    </p>
                ) : null}

                {coverError && (
                    <p className="mt-2 text-xs text-[var(--color-danger)]">
                        {coverError}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
                    Content <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FileText className="absolute left-4 top-3 w-5 h-5 text-[var(--ring)]" />
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows="10"
                        className="w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Write the full story..."
                    />
                </div>
            </div>

            <FaqFields value={formData.faqs} onChange={setFaqs} />
        </div>
    );
};

export default NewsFormFields;