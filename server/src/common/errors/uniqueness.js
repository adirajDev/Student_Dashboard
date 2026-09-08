import AppError from './AppError.js';

const article = noun => (/^[aeiou]/i.test(noun) ? 'An' : 'A');

/**
 * Turns a driver E11000 into a 409 that names the field in human terms.
 *
 * `labels` maps a schema path to how it should read in a sentence. `messages`
 * is the escape hatch for indexes whose violation doesn't describe well as
 * "already uses X" — key it by the index's fields joined with '+', e.g.
 * 'student+college'.
 */
export const createDuplicateKeyHandler =
    ({ entity, labels = {}, messages = {} }) =>
        err => {
            if (err.code !== 11000) throw err;

            const keys = Object.keys(err.keyPattern ?? {});

            const custom = messages[keys.join('+')];
            if (custom) throw new AppError(custom, 409);

            const field = keys[0];
            const label = labels[field];

            if (!label) {
                throw new AppError(
                    `${article(entity)} ${entity} with these details already exists`,
                    409
                );
            }

            throw new AppError(
                `${article(entity)} ${entity} with the ${label} "${err.keyValue?.[field]}" already exists`,
                409
            );
        };

/**
 * Pre-flight uniqueness check. Reads better than waiting for the write to
 * fail because it can name the record already holding the value — but it does
 * not replace the handler above, which is what catches the race between this
 * query and the save.
 *
 * The checked fields are the keys of `labels`, so there is one list to keep in
 * step with the schema rather than two.
 */
export const createUniquenessAssertion = ({
                                              model,
                                              entity,
                                              labels,
                                              displayField = 'name',
                                          }) => {
    const fields = Object.keys(labels);
    const projection = [...new Set([displayField, ...fields])].join(' ');

    return async (data, excludeId = null) => {
        const conditions = fields
            .filter(
                f =>
                    data[f] !== undefined && data[f] !== null && data[f] !== ''
            )
            .map(f => ({ [f]: data[f] }));

        if (conditions.length === 0) return;

        const query = { $or: conditions };
        if (excludeId) query._id = { $ne: excludeId };

        const clash = await model.findOne(query).select(projection).lean();
        if (!clash) return;

        const field = fields.find(
            f => data[f] !== undefined && clash[f] === data[f]
        );

        if (!field) {
            throw new AppError(
                `${article(entity)} ${entity} with these details already exists`,
                409
            );
        }

        throw new AppError(
            `"${clash[displayField]}" already uses the ${labels[field]} "${data[field]}"`,
            409
        );
    };
};