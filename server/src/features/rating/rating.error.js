import { createDuplicateKeyHandler } from '../../common/errors/uniqueness.js';

export const throwIfDuplicate = createDuplicateKeyHandler({
    entity: 'rating',
    messages: {
        'student+college': 'You have already rated this college!',
    },
});