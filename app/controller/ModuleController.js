class ModuleController {
  #service

  constructor (service) {
    this.#service = service

    this.createModule = this.createModule.bind(this)
    this.addMaterial = this.addMaterial.bind(this)
    this.getModule = this.getModule.bind(this)
    this.removeMaterial = this.removeMaterial.bind(this)
    this.updateModule = this.updateModule.bind(this)
    this.deleteModule = this.deleteModule.bind(this)
  }

  async createModule (req, res, next) {
    try {
      const { title, materialId } = req.body
      const newModule = await this.#service.createModule({ title, materialId })

      return res.json(201, {
        status: 'success',
        message: 'Module created successfully',
        data: {
          id: newModule.id
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async addMaterial (req, res, next) {
    try {
      const { id: moduleId } = req.params
      const { materialId } = req.body
      await this.#service.addMaterial(moduleId, materialId)

      return res.json({
        status: 'success',
        message: 'Add material to module successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async removeMaterial (req, res, next) {
    try {
      const { id: moduleId } = req.params
      const { materialId } = req.body
      await this.#service.removeMaterial(moduleId, materialId)

      return res.json({
        status: 'success',
        message: 'Remove material from module successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async getModule (req, res, next) {
    try {
      const { id: moduleId } = req.params
      let module

      if (moduleId) {
        module = await this.#service.getModule(moduleId)
      } else {
        module = await this.#service.getModule(null, req.query)
      }

      return res.json({
        status: 'success',
        data: (moduleId ? { module } : { modules: module })
      })
    } catch (err) {
      next(err)
    }
  }

  async updateModule (req, res, next) {
    try {
      const { id: moduleId } = req.params
      const moduleUpdated = await this.#service.updateModule(moduleId, req.body.title)

      return res.json({
        status: 'success',
        message: 'Module updated successfully',
        data: {
          module: { id: moduleUpdated.id }
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteModule (req, res, next) {
    try {
      const { id: moduleId } = req.params
      await this.#service.deleteModule(moduleId)

      return res.json({
        status: 'success',
        message: 'Module deleted successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ModuleController
