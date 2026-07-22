const PlacementFields = ({ placementDetails, handlePlacementChange }) => {
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-medium border-b border-[var(--border)] pb-2">
                Placement Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Average Package
                    </label>
                    <input
                        type="text"
                        name="averagePackage"
                        value={placementDetails?.averagePackage || ''}
                        onChange={handlePlacementChange}
                        className="input-field"
                        placeholder="e.g. 8 LPA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Highest Package
                    </label>
                    <input
                        type="text"
                        name="highestPackage"
                        value={placementDetails?.highestPackage || ''}
                        onChange={handlePlacementChange}
                        className="input-field"
                        placeholder="e.g. 42 LPA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Placement %
                    </label>
                    <input
                        type="number"
                        name="placementPercentage"
                        value={placementDetails?.placementPercentage || ''}
                        onChange={handlePlacementChange}
                        className="input-field"
                        placeholder="e.g. 95"
                        min="0"
                        max="100"
                    />
                </div>
            </div>
        </div>
    );
};

export default PlacementFields;
