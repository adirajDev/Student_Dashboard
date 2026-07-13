const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export const normalizeStudentPayload = ({ name, email, course, phone } = {}) => ({
    name: name?.trim(),
    email: email?.trim().toLowerCase(),
    course: course?.trim(),
    phone: phone?.trim(),
});

export const validateStudentPayload = ({ name, email, course, phone }) => {
    if (!name || !email || !course || !phone) {
        return 'Name, email, course, and phone number are required.';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'Invalid email format.';
    }

    if (!PHONE_REGEX.test(phone)) {
        return 'Phone number must be 7-20 characters and contain only numbers, spaces, +, -, or parentheses.';
    }

    return '';
};