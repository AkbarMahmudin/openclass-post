const Joi = require('joi')
const InvariantError = require('../utils/exceptions/InvariantError')

module.exports = (req, res, next) => {
  try {
    let opt

    if (req.method === 'POST') {
      opt = {
        title: Joi.string().required(),
        type: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
        authorId: Joi.number().required()
      }
    }

    if (req.method === 'PUT') {
      opt = {
        title: Joi.string(),
        type: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
        authorId: Joi.number()
      }
    }

    const schema = Joi.object(opt)
    const validateResult = schema.validate(req.body)
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}
