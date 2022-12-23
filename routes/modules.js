const express = require('express')
const router = express.Router()

const ModuleService = require('../app/service/ModuleService')
const ModuleController = require('../app/controller/ModuleController')

const moduleService = new ModuleService()
const moduleController = new ModuleController(moduleService)
const moduleValidator = require('../app/validator/ModuleValidator')

router.get('/', moduleController.getModule)
router.get('/:id', moduleController.getModule)

router.post('/', moduleValidator.postValidator, moduleController.createModule)
router.put('/:id', moduleController.updateModule)
router.delete('/:id', moduleController.deleteModule)

// Material module
router.use(moduleValidator.materialModuleValidator)
router.put('/:id/add-materials', moduleController.addMaterial)
router.put('/:id/remove-materials', moduleController.removeMaterial)

module.exports = router
