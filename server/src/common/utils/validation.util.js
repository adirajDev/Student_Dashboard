const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export const normalizeUserPayload = ({ name, email, course, phone, college } = {}) => {
    const payload = {
        name: name?.trim(),
        email: email?.trim().toLowerCase(),
        phone: phone?.trim(),
    };
    if (course) payload.course = course;
    if (college) payload.college = college;
    return payload;
};

export const validateUserPayload = (payload, role) => {
    const { name, email, phone, course, college } = payload;
    
    if (!name || !email || !phone) {
        return 'Name, email, and phone number are required.';
    }
    
    if (role === 'student' && (!course || !college)) {
        return 'Course and College are required for students.';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'Invalid email format.';
    }

    if (!PHONE_REGEX.test(phone)) {
        return 'Phone number must be 7-20 characters and contain only numbers, spaces, +, -, or parentheses.';
    }

    return '';
};
