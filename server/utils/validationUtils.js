const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export const normalizeUserPayload = ({ name, email, course, phone } = {}) => {
    const payload = {
        name: name?.trim(),
        email: email?.trim().toLowerCase(),
        // course: course?.trim(),
        phone: phone?.trim(),
    };
    if (course) payload.course = course.trim()
    return payload;
};

export const validateUserPayload = ({ name, email, phone }, course, role) => {
    if (!name || !email || !phone) {
        return 'Name, email, course, and phone number are required.';
    }
    if (role == 'student' && !course) {
        return 'Course is required.';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'Invalid email format.';
    }

    if (!PHONE_REGEX.test(phone)) {
        return 'Phone number must be 7-20 characters and contain only numbers, spaces, +, -, or parentheses.';
    }

    return '';
};