const boom = require('@hapi/boom');

validate = (data, schema) => {
    const { error } = schema.validate(data);
    return error;
}

validationHandler = (schema, check = 'body') =>{
    return (req, res, next) => {
        const error = validate(req[check], schema);
        error ? next(boom.badRequest(error)) : next();
        // error ? next(new Error(error)) : next();
    }
}

module.exports = validationHandler;