/**
 * Helper utility to extract standard pagination options from a request
 * @param {Object} req - Express request object
 * @returns {Object} { page, limit, skip }
 */
export const getPaginationOptions = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Helper utility to format paginated responses consistently
 * @param {Array} data - The array of retrieved documents
 * @param {Number} totalCount - Total number of documents matching the query
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of items per page
 * @returns {Object} Formatted paginated response object
 */
export const formatPaginatedResponse = (data, totalCount, page, limit) => {
    return {
        data,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 1,
    };
};
