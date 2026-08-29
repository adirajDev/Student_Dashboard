/**
 * Placement figures are free-text strings, so they arrive in every shape:
 * "12", "12 LPA", "₹12 LPA", "Rs 12 lakh". Normalise for display without
 * mangling values that are already formatted.
 */
export const formatPackage = pkg => {
    if (!pkg) return null;
    const str = String(pkg).trim();
    const hasLetters = /[a-zA-Z]/.test(str);
    const hasCurrency = str.includes('₹') || str.toLowerCase().includes('rs');

    let result = str;
    if (!hasCurrency) result = `₹${result}`;
    if (!hasLetters) result = `${result} LPA`;
    return result;
};

/** Course duration is stored in months. 66 -> "5 Yrs 6 Mos". */
export const formatDuration = months => {
    if (!months) return 'N/A';
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return `${years > 0 ? `${years} Yrs ` : ''}${rest > 0 ? `${rest} Mos` : ''}`.trim();
};
