const { PrismaClient } = require('@prisma/client')
const NotFoundError = require('../utils/exceptions/NotFoundError')

class ModuleService {
  #prisma

  constructor () {
    this.#prisma = new PrismaClient()

    this.createModule = this.createModule.bind(this)
    this.addMaterial = this.addMaterial.bind(this)
    this.getModule = this.getModule.bind(this)
    this.removeMaterial = this.removeMaterial.bind(this)
    this.updateModule = this.updateModule.bind(this)
    this.deleteModule = this.deleteModule.bind(this)
  }

  /**
   * Menambah/membuat module baru
   * @param title
   * @returns newModule data module baru
  */
  async createModule (payload) {
    const { title, materialId } = payload
    const newModule = this.#prisma.module.create({
      data: {
        title,
        materialId
      }
    })

    return newModule
  }

  /**
   * Menambahkan materi ke dalam module
   * berdasarkan ID module
   * @param moduleId -> ID module
   * @param material[] -> list ID materi
   */
  async addMaterial (moduleId, material) {
    const module = await this.#prisma.module.findFirst({
      where: { id: moduleId },
      select: {
        materialId: true
      }
    })

    if (!module) {
      throw new NotFoundError('Module not found')
    }

    const materialUpdated = [...new Set([...module.materialId, ...material])]

    const moduleUpdated = await this.#prisma.module.update({
      where: { id: moduleId },
      data: {
        materialId: materialUpdated
      }
    })

    return moduleUpdated
  }

  /**
   * Hapus materi yang ada di dalam module
   * berdasarkan ID module
   */
  async removeMaterial (moduleId, material) {
    const module = await this.#prisma.module.findFirst({
      where: { id: moduleId },
      select: {
        materialId: true
      }
    })

    if (!module) {
      throw new NotFoundError('Module not found')
    }

    const materials = await this.#prisma.material.findMany({
      where: {
        id: {
          in: material
        }
      }
    })
    if (materials.length !== material.length) {
      throw new NotFoundError('Material not found')
    }

    const materialUpdated = module.materialId.filter((m) => {
      return material.indexOf(m) <= -1
    })

    const moduleUpdated = await this.#prisma.module.update({
      where: { id: moduleId },
      data: {
        materialId: materialUpdated
      }
    })

    return moduleUpdated
  }

  /**
   * Menampilkan seluruh atau satu (berdasarkan ID) data module
   * @param moduleId -> default null
   * @returns 1 OR N data module
   */
  async getModule (moduleId = null, query = null) {
    let module
    const filter = {
      select: {
        id: true,
        title: true,
        material: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      }
    }

    // Filter berdasarkan module ID
    if (query !== null) {
      const { modules } = query
      filter.where = {
        id: {
          in: modules
        }
      }
    }

    if (moduleId) {
      module = await this.#prisma.module.findUnique({
        where: { id: moduleId },
        select: {
          ...filter.select
        }
      })
    } else {
      module = await this.#prisma.module.findMany(filter)
    }

    if (moduleId && !module) {
      throw new NotFoundError('Module not found')
    }

    return module
  }

  /**
   * Update -> rename title pada module
   * @param moduleId
   * @param title
   * @returns
   */
  async updateModule (moduleId, title) {
    try {
      const moduleUpdated = await this.#prisma.module.update({
        where: { id: moduleId },
        data: { title }
      })

      return moduleUpdated
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Module not found')
    }
  }

  /**
   * Delete module berdasarkan ID
   * @param moduleId
   * @returns
   */
  async deleteModule (moduleId) {
    try {
      const moduleDeleted = await this.#prisma.module.delete({
        where: { id: moduleId }
      })

      return moduleDeleted
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Module not found')
    }
  }
}

module.exports = ModuleService
