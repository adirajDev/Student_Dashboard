const BasicInfoFields = ({ formData, handleInputChange }) => {
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-medium border-b border-[var(--border)] pb-2">
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
            <div>
                <label className="block text-sm font-medium mb-1">
                    Overview / Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field min-h-[100px]"
                />
            </div>
        </div>
    );
};

export default BasicInfoFields;
