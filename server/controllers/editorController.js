import { normalizeUserPayload, validateUserPayload } from '../utils/validationUtils.js';
import { getUsersByRole, createUserByRole, updateUserByRole, deleteUserByRole, isDuplicateKeyError } from '../utils/userManagementUtils.js';

export const getEditors = async (req, res, next) => {
    try {
        const editors = await getUsersByRole('editor');
        res.status(200).json(editors);
    } catch (err) { next(err); }
};

export const createEditor = async (req, res, next) => {
    try {
        const payload = normalizeUserPayload(req.body);
        const err = validateUserPayload(payload, 'editor'); 
        if (err) return res.status(400).json({ error: err });

        const editor = await createUserByRole(payload, 'editor');
        res.status(201).json(editor);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        if (isDuplicateKeyError(err)) return res.status(409).json({ error: 'A user with this email already exists.' });
        next(err);
    }
};

export const updateEditor = async (req, res, next) => {
    try {
        const payload = normalizeUserPayload(req.body);
        const err = validateUserPayload(payload, 'editor');
        if (err) return res.status(400).json({ error: err });

        const editor = await updateUserByRole(req.params.id, payload, 'editor');
        res.status(200).json(editor);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        if (isDuplicateKeyError(err)) return res.status(409).json({ error: 'A user with this email already exists.' });
        next(err);
    }
};

export const deleteEditor = async (req, res, next) => {
    try {
        await deleteUserByRole(req.params.id, 'editor');
        res.status(200).json({ message: 'Editor deleted successfully.' });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};