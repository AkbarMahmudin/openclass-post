const Joi = require('joi')
const InvariantError = require('../utils/exceptions/InvariantError')

const postValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      materialId: Joi.array().items(Joi.string().max(25)).required()
    })
    const validateResult = schema.validate(req.body)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

const materialModuleValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      materialId: Joi.array().items(Joi.string().max(25)).min(1).required()
    })
    const validateResult = schema.validate(req.body)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postValidator, materialModuleValidator
}
