import { Upload, X } from 'lucide-react';

const ProfileImageField = ({ profileImage, onImageChange, onRemove }) => {
    const previewSrc = profileImage
        ? `data:${profileImage.mimeType};base64,${profileImage.data}`
        : null;

    return (
        <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-3">
                Profile Image
            </label>

            <div className="flex items-center gap-4">
                {previewSrc ? (
                    <img
                        src={previewSrc}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border border-[var(--border)]"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--ring)] text-xs">
                        No image
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="btn-secondary flex items-center gap-2 cursor-pointer w-fit">
                        <Upload className="w-4 h-4" />
                        {previewSrc ? 'Change Image' : 'Upload Image'}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={e =>
                                onImageChange(e.target.files?.[0] ?? null)
                            }
                            className="hidden"
                        />
                    </label>

                    {previewSrc && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 w-fit"
                        >
                            <X className="w-4 h-4" /> Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileImageField;
