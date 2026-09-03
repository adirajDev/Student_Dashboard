import Joi from 'joi';
import { FAQ_ANSWER_MAX, FAQ_QUESTION_MAX, MAX_FAQS } from './faq.constants.js';

const objectId = Joi.string().hex().length(24);
const question = Joi.string().trim().max(FAQ_QUESTION_MAX);
const answer = Joi.string().trim().max(FAQ_ANSWER_MAX);
const order = Joi.number().integer().min(0);

export const faqsArray = Joi.array()
    .items(
        Joi.object({
            _id: objectId,
            question: question.required(),
            answer: answer.required(),
            order: order.default(0),
        })
    )
    .max(MAX_FAQS);

// Delta shape — college approval flow only
export const faqsDelta = Joi.object({
    added: Joi.array()
        .items(
            Joi.object({
                question: question.required(),
                answer: answer.required(),
                order: order.default(0),
            })
        )
        .default([]),

    updated: Joi.array()
        .items(
            Joi.object({
                _id: objectId.required(),
                question,
                answer,
                order,
            }).min(2) // _id plus at least one changed field
        )
        .default([]),

    removed: Joi.array().items(objectId).default([]),
}).min(1);
