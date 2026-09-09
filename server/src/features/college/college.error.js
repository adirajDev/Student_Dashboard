import {
    createDuplicateKeyHandler,
    createUniquenessAssertion,
} from '../../common/errors/uniqueness.js';
import College from './college.model.js';
export const UNIQUE_FIELDS = ['name', 'slug', 'collegeId'];
export const FIELD_LABELS = {
    name: 'name',
    slug: 'URL slug',
    collegeId: 'college ID',
};

export const throwIfDuplicate = createDuplicateKeyHandler({
    entity: 'college',
    labels: FIELD_LABELS,
});

export const assertUniqueFields = createUniquenessAssertion({
    model: College,
    entity: 'college',
    labels: FIELD_LABELS,
});
