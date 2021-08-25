import Polygon from '@/utility/PolygonClass'

export default class DatasTransformer {
  constructor(datas) {
    this.datas = datas
    this.transformedDatas = null
    this.grid = null
    this.neighboursPosition = {
      topLeft: [-1, -1],
      top: [0, -2],
      topRight: [1, -1],
      bottomLeft: [-1, 1],
      bottom: [0, 2],
      bottomRight: [1, 1],
    }
    this.updatePolygonDatas()
  }

  hasValidChildren = (polygon) => polygon.children && Array.isArray(polygon.children) && polygon.children.length > 0

  isPolygonClass = (polygon) => polygon instanceof Polygon

  updateDatas(datas) {
    this.datas = datas
    this.updatePolygonDatas()
  }

  updatePolygonDatas() {
    if (!this.getDatasValidity()) {
      throw new Error('The data is not correct')
    }

    if (this.transformedDatas instanceof Polygon) {
      this.clearTransformedDatas()
    }

    this.initTransformedDatas()
  }

  getDatasValidity() {
    return typeof this.datas === 'object'
  }

  clearTransformedDatas() {
    this.transformedDatas = null
  }

  initTransformedDatas() {
    this.transformedDatas = this.datas

    this.transformedDatas = this.transformDataToPolygon(this.transformedDatas)
  }

  transformDataToPolygon(polygon, parentPolygon) {
    let currentPolygon = polygon

    if (!this.isPolygonClass(currentPolygon)) {
      currentPolygon = new Polygon(polygon)
    }

    if (parentPolygon
      && this.isPolygonClass(parentPolygon)
      && this.isPolygonClass(currentPolygon)) {
      currentPolygon.setParent(parentPolygon)
    }

    if (this.hasValidChildren(currentPolygon)) {
      currentPolygon.children.forEach((child, index) => {
        currentPolygon.children[index] = this.transformDataToPolygon(child, currentPolygon)
      })
    }

    return currentPolygon
  }
}
