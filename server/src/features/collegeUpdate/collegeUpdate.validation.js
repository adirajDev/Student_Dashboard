import Joi from 'joi';
import { COLLEGE_TYPE } from '../college/college.constants.js';

const objectId = Joi.string().hex().length(24);

export const proposedChangesSchema = Joi.object({
    name: Joi.string().trim(),
    type: Joi.string().valid(...COLLEGE_TYPE),
    location: Joi.string().trim(),
    collegeId: Joi.string().trim().allow(''),
    description: Joi.string().trim().allow(''),
    overview: Joi.string().trim().allow(''),
    logo: Joi.string().trim().allow(''),

    availableCourses: Joi.array().items(
        Joi.object({
            course: objectId.required(),
            fee: Joi.number().min(0).required(),
        })
    ),
    
    courseUpdates: Joi.object({
        added: Joi.array().items(
            Joi.object({
                course: objectId.required(),
                fee: Joi.number().min(0).required(),
            })
        ).default([]),
        updated: Joi.array().items(
            Joi.object({
                course: objectId.required(),
                fee: Joi.number().min(0).required(),
            })
        ).default([]),
        removed: Joi.array().items(objectId).default([])
    }),

    placementDetails: Joi.object({
        averagePackage: Joi.string().trim().allow(''),
        highestPackage: Joi.string().trim().allow(''),
        placementPercentage: Joi.number().min(0).max(100).allow(null, ''),
    }),

    recruiters: Joi.array().items(Joi.string().trim()),

    faculty: Joi.array().items(
        Joi.object({
            name: Joi.string().trim().required(),
            department: Joi.string().trim().allow(''),
            role: Joi.string().trim().allow(''),
        })
    )
}).min(1)          // reject a request that proposes nothing

console.log('Joi.object type:', typeof Joi.object);
console.log('Joi.object({}).min type:', typeof Joi.object({}).min);

// small helper so both service functions validate the same way
export const validateProposedChanges = (data) => {
    const { error, value } = proposedChangesSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        return { error: message, value: null };
    }
    return { error: null, value };
};