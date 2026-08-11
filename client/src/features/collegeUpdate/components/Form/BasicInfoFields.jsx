import { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const BasicInfoFields = ({ formData, handleInputChange }) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(formData.logo || '');

    useEffect(() => {
        if (formData.logo && formData.logo !== previewUrl) {
            setPreviewUrl(formData.logo);
        }
    }, [formData.logo]);

    const handleLogoUpload = e => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a safe preview using URL.createObjectURL (solves file:/// issue)
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Convert file to Base64 to save securely in DB as a Data URI string
        const reader = new FileReader();
        reader.onloadend = () => {
            handleInputChange({
                target: {
                    name: 'logo',
                    value: reader.result,
                },
            });
        };
        reader.readAsDataURL(file);
    };

    const clearLogo = () => {
        setPreviewUrl('');
        handleInputChange({
            target: { name: 'logo', value: '' },
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg border-b border-[var(--border)] pb-2">
                Basic Information
            </h4>
            <div>
                <label className="block text-sm font-medium mb-1">
                    College Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        College Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="input-field"
                    >
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                        <option value="Deemed">Deemed</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        College ID (Unique Code)
                    </label>
                    <input
                        type="text"
                        name="collegeId"
                        value={formData.collegeId}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        College Logo
                    </label>

                    <div className="flex items-center gap-4 mt-2">
                        {previewUrl ? (
                            <div className="relative w-24 h-24 rounded-2xl bg-white p-2 shadow-md border border-slate-100 shrink-0 flex items-center justify-center overflow-visible">
                                <img
                                    src={previewUrl}
                                    alt="Logo preview"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={clearLogo}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl hover:bg-slate-50 hover:border-indigo-400 transition-colors cursor-pointer text-slate-500">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                    Upload
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                />
                            </label>
                        )}
                        <div className="flex-1 text-xs text-slate-500">
                            Upload a clear logo image for your college. Safe
                            preview is generated automatically.
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Short Description (Excerpt)
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field min-h-[80px]"
                    placeholder="A brief 1-2 sentence summary of the college."
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Detailed Overview
                </label>
                <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    className="input-field min-h-[150px]"
                    placeholder="Comprehensive details about the college, its history, facilities, etc."
                />
            </div>
        </div>
    );
};

export default BasicInfoFields;
