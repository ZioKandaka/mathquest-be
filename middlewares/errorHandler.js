function findMessage(source, depth = 0) {
    if (!source || depth > 5) return null;
    if (typeof source?.message === 'string') return source.message;

    if (Array.isArray(source)) {
        for (const item of source) {
            const m = findMessage(item, depth + 1);
            if (m) return m;
        }
    } else if (typeof source === 'object') {
        for (const key of Object.keys(source)) {
            const m = findMessage(source[key], depth + 1);
            if (m) return m;
        }
    }
    return null;
}

function firstSequelizeMessage(err) {
    return err?.errors?.[0]?.message || findMessage(err) || 'Validation error';
}

export default async function errorHandler(err, req, res, next) {
    console.log(err);
    let status = 500;
    let message = 'Internal server error';

    switch (err?.name) {
        case 'NotFound':
            status = 404;
            message = 'Resource not found';
            break;

        case 'SequelizeValidationError':
            status = 400;
            message = firstSequelizeMessage(err);
            break;

        case 'SequelizeUniqueConstraintError':
            status = 400;
            message = firstSequelizeMessage(err);
            break;

        case 'AggregateError':
            status = 400;
            message = firstSequelizeMessage(err);
            break;

        case 'MissingParameter':
            status = 400;
            message = 'Required parameter are not complete';
            break;

        case 'InvalidCredential':
            status = 401;
            message = 'Wrong email or password';
            break;

        case 'emailRequired':
            status = 401;
            message = 'Please fill email';
            break;

        case 'passwordRequired':
            status = 401;
            message = 'Please fill password';
            break;

        case 'JsonWebTokenError':
            status = 401;
            message = 'Invalid token';
            break;

        case 'TokenExpiredError':
            status = 401;
            message = 'Token expired';
            break;

        default:
            // fallthrough to 500; include original message if it looks safe
            if (err?.message && status === 500) message = 'Internal server error';
            break;
    }

    res.status(status).json({ message });
}
