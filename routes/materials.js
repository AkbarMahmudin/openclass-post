const express = require('express')
const router = express.Router()

const MaterialService = require('../app/service/MaterialService')
const MaterialController = require('../app/controller/MaterialController')

const materialService = new MaterialService()
const materialController = new MaterialController(materialService)
const materialValidator = require('../app/validator/MaterialValidator')

router.get('/:id', materialController.getMaterial)
router.get('/', materialController.getMaterial)
router.post('/', materialValidator, materialController.createMaterial)
router.put('/:id', materialValidator, materialController.updateMaterial)
router.delete('/:id', materialController.deleteMaterial)

module.exports = router
