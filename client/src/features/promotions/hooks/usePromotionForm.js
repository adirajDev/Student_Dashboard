import { useState } from 'react';
import {
    preparePromotionImage,
    getErrorMessage,
    toDateTimeLocal,
    fromDateTimeLocal,
} from '../utils/promotionUtils';

export const LABEL_MAX_LENGTH = 120;

const buildInitialState = editing => ({
    label: editing?.label || '',
    slot: editing?.slot || '',
    targetUrl: editing?.targetUrl || '',
    status: editing?.status || 'active',
    priority: editing?.priority ?? 0,
    startsAt: toDateTimeLocal(editing?.startsAt),
    endsAt: toDateTimeLocal(editing?.endsAt),
    // Never prefilled: the server strips image bytes from every read, so an
    // existing image cannot be round-tripped. Null here means "keep whatever
    // is already stored" and the payload simply omits the field.
    image: null,
});

const usePromotionForm = ({ editing, onAdd, onUpdate, onClose }) => {
    const [formData, setFormData] = useState(() => buildInitialState(editing));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState('');
    const [isReadingImage, setIsReadingImage] = useState(false);

    const hasExistingImage = Boolean(editing?.image?.mimeType);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async e => {
        const file = e.target.files?.[0];
        e.target.value = ''; // allow re-picking the same file after removal
        if (!file) return;

        setImageError('');
        setIsReadingImage(true);

        try {
            const image = await preparePromotionImage(file);
            setFormData(prev => ({ ...prev, image }));
        } catch (err) {
            setImageError(
                getErrorMessage(err, 'Could not process that image.')
            );
        } finally {
            setIsReadingImage(false);
        }
    };

    const removeImage = () => {
        setImageError('');
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const label = formData.label.trim();
        const targetUrl = formData.targetUrl.trim();

        if (!label || !formData.slot || !targetUrl) {
            setError('Label, placement and destination URL are all required.');
            return;
        }

        // Mirrors the server's Joi scheme restriction. Checking here too turns
        // a 400 round trip into an instant inline message.
        if (!/^https?:\/\//i.test(targetUrl)) {
            setError('The destination URL must start with http:// or https://');
            return;
        }

        if (!formData.image && !hasExistingImage) {
            setError('Upload a banner image.');
            return;
        }

        const startsAt = fromDateTimeLocal(formData.startsAt);
        const endsAt = fromDateTimeLocal(formData.endsAt);

        if (startsAt && endsAt && new Date(endsAt) < new Date(startsAt)) {
            setError('The end date has to come after the start date.');
            return;
        }

        const payload = {
            label,
            slot: formData.slot,
            targetUrl,
            status: formData.status,
            priority: Number(formData.priority) || 0,
            startsAt,
            endsAt,
        };

        // Only send the image when a new one was picked. Omitting it leaves
        // the stored one untouched.
        if (formData.image?.data) {
            payload.image = formData.image;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (editing) {
                await onUpdate(editing._id, payload);
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
        hasExistingImage,
        isSubmitting,
        isReadingImage,
        error,
        imageError,
        handleChange,
        handleImageChange,
        removeImage,
        handleSubmit,
    };
};

export default usePromotionForm;
