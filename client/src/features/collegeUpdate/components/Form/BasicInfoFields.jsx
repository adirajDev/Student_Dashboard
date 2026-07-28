const BasicInfoFields = ({ formData, handleInputChange }) => {
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
                        Logo URL
                    </label>
                    <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={handleInputChange}
                        className="input-field"
                    />
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
