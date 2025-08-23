// helpers/validation.helper.js
import Joi from 'joi';

export function validateSubmitPayload(body) {
    const answer = Joi.object({
        problem_id: Joi.number().integer().min(1).required(),
        selected_option_id: Joi.number().integer().min(1),
        input_value: Joi.string().trim().min(1),
    })
        .xor('selected_option_id', 'input_value')
        .unknown(false);

    const schema = Joi.object({
        user_id: Joi.number().integer().min(1).required(),
        attempt_id: Joi.string()
            .guid({ version: ['uuidv4', 'uuidv1', 'uuidv3', 'uuidv5'] })
            .required(),
        answers: Joi.array().items(answer).min(1).unique('problem_id').required(),
    }).unknown(false);

    const { value, error } = schema.validate(body, {
        abortEarly: true,
        convert: true,
    });

    if (error) {
        const e = new Error(error.details?.[0]?.message || 'Invalid payload');
        e.name = 'ValidationError';
        throw e;
    }
    return value;
}
