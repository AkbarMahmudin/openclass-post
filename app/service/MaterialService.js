const { PrismaClient } = require('@prisma/client')
const NotFoundError = require('../utils/exceptions/NotFoundError')

class MaterialService {
  #prisma

  constructor () {
    this.#prisma = new PrismaClient()

    this.createMaterial = this.createMaterial.bind(this)
    this.updateMaterial = this.updateMaterial.bind(this)
    this.deleteMaterial = this.deleteMaterial.bind(this)
    this.getMaterial = this.getMaterial.bind(this)
  }

  async createMaterial (payload) {
    const material = await this.#prisma.material.create({
      data: payload
    })

    return material
  }

  async updateMaterial (materialId, payload) {
    try {
      // update
      const materialUpdated = await this.#prisma.material.update({
        where: { id: materialId },
        data: payload
      })

      return materialUpdated
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Material not found')
    }
  }

  async deleteMaterial (materialId) {
    try {
      const material = await this.#prisma.material.delete({
        where: { id: materialId }
      })

      return material
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Material not found')
    }
  }

  async getMaterial (materialId = null, query = null) {
    let material
    const filter = {}
    const select = {
      id: true,
      type: true,
      title: true,
      tags: true,
      authorId: true
    }

    if (query) {
      query.author && (
        filter.author = {
          authorId: Number(query.author)
        })
    }

    if (!materialId) {
      material = await this.#prisma.material.findMany({
        select,
        where: {
          ...filter.author
        }
      })
    } else {
      select.body = true
      material = await this.#prisma.material.findUnique({
        where: { id: materialId },
        select
      })
    }

    if (materialId && !material) {
      throw new NotFoundError('Material not found')
    }

    return material
  }
}

module.exports = MaterialService
