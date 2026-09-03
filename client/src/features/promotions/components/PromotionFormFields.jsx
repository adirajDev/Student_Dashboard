import { useRef } from 'react';
import { Tag, Link2, ImagePlus, X, LayoutTemplate } from 'lucide-react';
import { LABEL_MAX_LENGTH } from '../hooks/usePromotionForm';
import {
    PROMOTION_SLOTS,
    PROMOTION_STATUSES,
    getSlotPageLabel,
} from '../constants/promotionSlots';
import {
    getLocalPreviewSrc,
    getPromotionImageUrl,
    formatBytes,
    ACCEPTED_FILE_TYPES,
    IMAGE_SIZE_LIMIT_BYTES,
} from '../utils/promotionUtils';

const inputClass =
    'w-full pl-12 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none';

const labelClass = 'block text-sm font-medium mb-2 text-[var(--foreground)]';

// One optgroup per page, built from the `page:position` prefix.
const groupedSlots = PROMOTION_SLOTS.reduce((groups, slot) => {
    const page = getSlotPageLabel(slot.id);
    (groups[page] = groups[page] || []).push(slot);
    return groups;
}, {});

const PromotionFormFields = ({
    formData,
    editing,
    hasExistingImage,
    isReadingImage,
    imageError,
    handleChange,
    handleImageChange,
    removeImage,
}) => {
    const fileInputRef = useRef(null);

    // A freshly picked file previews from local base64; an already-saved one
    // previews from the image route, since the bytes are never sent in JSON.
    const previewSrc =
        getLocalPreviewSrc(formData.image) ||
        (hasExistingImage ? getPromotionImageUrl(editing) : null);

    const isNewUpload = Boolean(formData.image?.data);

    return (
        <div className="space-y-6">
            <div>
                <label className={labelClass}>
                    Label <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)]" />
                    <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        required
                        maxLength={LABEL_MAX_LENGTH}
                        className={inputClass}
                        placeholder="e.g. Acme Coaching — JEE crash course"
                    />
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                    Shown to screen readers and if the image fails to load, so
                    write it as the advertiser would — not as a filename.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>
                        Placement <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <LayoutTemplate className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)]" />
                        <select
                            name="slot"
                            value={formData.slot}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">Choose a placement…</option>
                            {Object.entries(groupedSlots).map(
                                ([page, slots]) => (
                                    <optgroup key={page} label={page}>
                                        {slots.map(slot => (
                                            <option
                                                key={slot.id}
                                                value={slot.id}
                                            >
                                                {slot.label
                                                    .split('—')[1]
                                                    ?.trim() || slot.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                )
                            )}
                        </select>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Status</label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`${inputClass} pl-4`}
                        >
                            {PROMOTION_STATUSES.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                        Only <strong>Active</strong> placements render, and only
                        inside their date window.
                    </p>
                </div>
            </div>

            <div>
                <label className={labelClass}>
                    Destination URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ring)]" />
                    <input
                        type="url"
                        name="targetUrl"
                        value={formData.targetUrl}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="https://example.com/landing-page"
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>
                    Banner Image{' '}
                    {!hasExistingImage && (
                        <span className="text-red-500">*</span>
                    )}
                </label>

                {previewSrc ? (
                    <div className="relative inline-block">
                        <img
                            src={previewSrc}
                            alt=""
                            className="max-h-40 rounded-[var(--radius-md)] border border-[var(--border)]"
                        />
                        {isNewUpload && (
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 p-1 bg-[var(--color-danger)] text-white rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : null}

                <div className="mt-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isReadingImage}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <ImagePlus className="w-4 h-4" />
                        {isReadingImage
                            ? 'Processing...'
                            : previewSrc
                              ? 'Replace Image'
                              : 'Upload Image'}
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    className="hidden"
                    onChange={handleImageChange}
                />

                {formData.image?.sizeBytes ? (
                    <p className="mt-2 text-xs text-[var(--muted)]">
                        {formData.image.mimeType} ·{' '}
                        {formatBytes(formData.image.sizeBytes)} of{' '}
                        {formatBytes(IMAGE_SIZE_LIMIT_BYTES)}
                    </p>
                ) : null}

                {imageError && (
                    <p className="mt-2 text-xs text-[var(--color-danger)]">
                        {imageError}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                    <label className={labelClass}>Starts</label>
                    <input
                        type="datetime-local"
                        name="startsAt"
                        value={formData.startsAt}
                        onChange={handleChange}
                        className={`${inputClass} pl-4`}
                    />
                </div>
                <div>
                    <label className={labelClass}>Ends</label>
                    <input
                        type="datetime-local"
                        name="endsAt"
                        value={formData.endsAt}
                        onChange={handleChange}
                        className={`${inputClass} pl-4`}
                    />
                </div>
                <div>
                    <label className={labelClass}>Priority</label>
                    <input
                        type="number"
                        name="priority"
                        min="0"
                        max="100"
                        value={formData.priority}
                        onChange={handleChange}
                        className={`${inputClass} pl-4`}
                    />
                </div>
            </div>

            <p className="text-xs text-[var(--muted)]">
                Leave both dates blank to run indefinitely. When several
                placements share a slot, the highest priority wins and ties
                rotate at random.
            </p>
        </div>
    );
};

export default PromotionFormFields;
