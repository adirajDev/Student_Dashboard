import Exam from './exam.model.js';
import {
    createDuplicateKeyHandler,
    createUniquenessAssertion,
} from '../../common/errors/uniqueness.js';

export const FIELD_LABELS = {
    name: 'name',
    slug: 'URL slug',
};

export const throwIfDuplicate = createDuplicateKeyHandler({
    entity: 'exam',
    labels: FIELD_LABELS,
});

export const assertUniqueFields = createUniquenessAssertion({
    model: Exam,
    entity: 'exam',
    labels: FIELD_LABELS,
});
