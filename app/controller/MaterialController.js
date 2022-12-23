const UserService = require('../service/UserService')

class MaterialController {
  #service
  #userService = new UserService()

  constructor (service) {
    this.#service = service

    this.createMaterial = this.createMaterial.bind(this)
    this.updateMaterial = this.updateMaterial.bind(this)
    this.deleteMaterial = this.deleteMaterial.bind(this)
    this.getMaterial = this.getMaterial.bind(this)
  }

  async createMaterial (req, res, next) {
    try {
      const { title, type, body, tags, authorId } = req.body

      // Cek authorId
      await this.#userService.getUser(authorId)

      const { id: newMaterial } = await this.#service.createMaterial({
        title, type, body, tags, authorId
      })

      return res.json(201, {
        status: 'success',
        message: 'Material created suscessfully',
        data: {
          material: {
            id: newMaterial
          }
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async updateMaterial (req, res, next) {
    try {
      const { id: materialId } = req.params

      // Cek authorId
      if (req.body.authorId) {
        await this.#userService.getUser(req.body.authorId)
      }

      const { id: materialUpdated } = await this.#service.updateMaterial(materialId, req.body)

      return res.json({
        status: 'success',
        message: 'Material updated successfully',
        data: {
          material: {
            id: materialUpdated
          }
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteMaterial (req, res, next) {
    try {
      const { id: materialId } = req.params
      await this.#service.deleteMaterial(materialId)

      return res.json({
        status: 'success',
        message: 'Material deleted successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async getMaterial (req, res, next) {
    try {
      const { id: materialId } = req.params
      let material

      if (materialId) {
        material = await this.#service.getMaterial(materialId)
      } else {
        material = await this.#service.getMaterial(null, req.query || null)
      }

      return res.json({
        status: 'success',
        data: (materialId ? { material } : { materials: material })
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = MaterialController
