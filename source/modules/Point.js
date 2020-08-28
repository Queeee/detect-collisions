const Polygon = require('./Polygon')

/**
 * A point used to detect collisions
 * @class
 */
class Point extends Polygon {
  /**
   * @constructor
   * @param {String} [id = 0] The id of element
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  constructor (id = 0, x = 0, y = 0, padding = 0) {
    super(id, x, y, [[0, 0]], 0, 1, 1, padding)

    /** @private */
    this._point = true
  }
};

Point.prototype.setPoints = undefined

module.exports = Point

module.exports.default = module.exports
