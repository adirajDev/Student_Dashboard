import News from './news.model.js';
import {
    createDuplicateKeyHandler,
    createUniquenessAssertion,
} from '../../common/errors/uniqueness.js';

export const FIELD_LABELS = {
    title: 'title',
    slug: 'URL slug',
};

export const throwIfDuplicate = createDuplicateKeyHandler({
    entity: 'news article',
    labels: FIELD_LABELS,
});

// News has no `name` path, so the factory's default displayField would render
// the clashing record as undefined.
export const assertUniqueFields = createUniquenessAssertion({
    model: News,
    entity: 'news article',
    labels: FIELD_LABELS,
    displayField: 'title',
});
