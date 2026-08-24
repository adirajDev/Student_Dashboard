import { useState } from 'react';
import { prepareCoverImage, getErrorMessage } from '../utils/newsUtils';

export const TITLE_MAX_LENGTH = 200;

const buildInitialState = editingNews => ({
    title: editingNews?.title || '',
    content: editingNews?.content || '',
    coverImage: editingNews?.coverImage?.data ? editingNews.coverImage : null,
});

const useNewsForm = ({ editingNews, onAdd, onUpdate, onClose }) => {
    const [formData, setFormData] = useState(() =>
        buildInitialState(editingNews)
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [coverError, setCoverError] = useState('');
    const [isReadingImage, setIsReadingImage] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCoverChange = async e => {
        const file = e.target.files?.[0];
        e.target.value = ''; // let the same file be picked again after a removal
        if (!file) return;

        setCoverError('');
        setIsReadingImage(true);

        try {
            const coverImage = await prepareCoverImage(file);
            setFormData(prev => ({ ...prev, coverImage }));
        } catch (err) {
            setCoverError(
                getErrorMessage(err, 'Could not process that image.')
            );
        } finally {
            setIsReadingImage(false);
        }
    };

    const removeCoverImage = () => {
        setCoverError('');
        setFormData(prev => ({ ...prev, coverImage: null }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const title = formData.title.trim();
        const content = formData.content.trim();

        if (!title || !content) {
            setError('Add a title and some content before saving.');
            return;
        }

        if (title.length > TITLE_MAX_LENGTH) {
            setError(`Keep the title under ${TITLE_MAX_LENGTH} characters.`);
            return;
        }

        // Omit coverImage entirely when there isn't one — sending null trips
        // the request-body validator.
        const payload = { title, content };
        if (formData.coverImage?.data) {
            payload.coverImage = formData.coverImage;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (editingNews) {
                await onUpdate(editingNews._id, payload);
            } else {
                await onAdd(payload);
            }
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, 'That did not save. Try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        isReadingImage,
        error,
        coverError,
        handleChange,
        handleCoverChange,
        removeCoverImage,
        handleSubmit,
    };
};

export default useNewsForm;