const { BVH, Circle, Polygon, Point, Result, SAT } = require('./modules')

/**
 * A collision system used to track bodies in order to improve collision detection performance
 * @class
 */
class Collisions {
  /**
   * @constructor
   */
  constructor () {
    /** @private */
    this._bvh = new BVH()

    /** @private */
    this._id2Body = new Map()
  }

  /**
   * 插入body到树中
   * 
   * @param {String} [i = 0] unique id
   * @param {Object} body
   * @param {Boolean} boolean Set to true if insert to bvh tree to speed up search
   */
  _insertBody(id, body, enable_cache) {
    if(!enable_cache) {
      return;
    }

    if(this._id2Body.has(id)) {
      let body = this._id2Body.get(id);
      this._bvh.remove(body);
    }

    if(body instanceof Array) {
      body.forEach(line => {
        this._bvh.insert(line);
      });
    } else{
      this._bvh.insert(body);
    }
    this._id2Body.set(id, body);
  }

  /**
   * Creates a {@link Circle} and inserts it into the collision system
   * @param {String} [i = 0] unique id
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Boolean} [enable_cache = false] Set to true if insert to bvh tree to speed up search
   * @param {Number} [radius = 0] The radius
   * @param {Number} [scale = 1] The scale
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   * @returns {Circle}
   */
  createCircle (id, x = 0, y = 0, enable_cache = false, radius = 0, scale = 1, padding = 0) {
    const body = new Circle(id, x, y, radius, scale, padding)
    this._insertBody(id, body, enable_cache)
    return body
  }

  /**
   * Creates a {@link Polygon} and inserts it into the collision system
   * @param {String} [i = 0] unique id
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
   * @param {Boolean} [enable_cache = false] Set to true if insert to bvh tree to speed up search
   * @param {Number} [angle = 0] The starting rotation in radians
   * @param {Number} [scale_x = 1] The starting scale along the X axis
   * @param {Number} [scale_y = 1] The starting scale long the Y axis
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   * @returns {Polygon}
   */
  createRelativePolygon (id, x = 0, y = 0, points = [[0, 0]], enable_cache = false, angle = 0, scale_x = 1, scale_y = 1, padding = 0) {
    const body = new Polygon(id, x, y, points, angle, scale_x, scale_y, padding)
    this._insertBody(id, body, enable_cache)
    return body
  }

  /**
   * Creates a {@link Polygon} and inserts it into the collision system
   * 
   * @param {String} [i = 0] unique id
   * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
   * @param {Boolean} [enable_cache = false] Set to true if insert to bvh tree to speed up search
   * @param {Number} [angle = 0] The starting rotation in radians
   * @param {Number} [scale_x = 1] The starting scale along the X axis
   * @param {Number} [scale_y = 1] The starting scale long the Y axis
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   * @returns {Polygon}
   */
  createAbsolutePolygon (id, points = [[0, 0]], enable_cache = false, angle = 0, scale_x = 1, scale_y = 1, padding = 0) {
    const startPointX = points[0][0];
    const startPointY = points[0][1];
    let relativePoints = [];
    points.forEach(point => {            
      let _point = [];
      _point[0] = point[0] - startPointX;
      _point[1] = point[1] - startPointY;
      relativePoints.push(_point);
    });
    
    return this.createRelativePolygon(id, startPointX, startPointY, relativePoints, enable_cache, angle, scale_x, scale_y, padding);
  }

  /**
   * Creates a {@link Point} and inserts it into the collision system
   * 
   * @param {String} [i = 0] unique id
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Boolean} [enable_cache = false] Set to true if insert to bvh tree to speed up search
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   * @returns {Point}
   */
  createPoint (id, x = 0, y = 0, enable_cache = false, padding = 0) {
    const body = new Point(id, x, y, padding)
    this._insertBody(id, body, enable_cache)
    return body
  }

  /**
   * Create lines
   * @param {String} [i = 0] unique id
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
   * @param {Boolean} [enable_cache = false] Set to true if insert to bvh tree to speed up search
   * @param {Number} [angle = 0] The starting rotation in radians
   * @param {Number} [scale_x = 1] The starting scale along the X axis
   * @param {Number} [scale_y = 1] The starting scale long the Y axis
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   * @returns {Polygon}
   */
  createRelativeLines (id, x = 0, y = 0, points = [[0, 0]], enable_cache = false, angle = 0, scale_x = 1, scale_y = 1, padding = 0) {
    // 这里如果points的长度为1，说明是一个点
    if(points.length == 1) {      
      const point = new Point(x + points[0][0], y + points[0][1]);
      return point;
    }

    let lines = new Array();
    for(let i = 1; i < points.length; i++) {
      let tempPoints = [points[i], points[i - 1]];
      const polygon = new Polygon(id, x, y, tempPoints, angle, scale_x, scale_y, padding);
      lines.push(polygon);
    }

    this._insertBody(id, lines, enable_cache)
    return lines
  }

  /**
   * Create lines
   * 
   * @param {String} [i = 0] unique id
   * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
   * @param {Boolean} [enable_cache = false] Set to true if insert to bvh tree to speed up search
   * @param {Number} [angle = 0] The starting rotation in radians
   * @param {Number} [scale_x = 1] The starting scale along the X axis
   * @param {Number} [scale_y = 1] The starting scale long the Y axis
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   * @returns {Polygon}
   */
  createAbsoluteLines (id, points = [[0, 0]], enable_cache = false, angle = 0, scale_x = 1, scale_y = 1, padding = 0) {
    const startPointX = points[0][0];
    const startPointY = points[0][1];
    let relativePoints = [];
    points.forEach(point => {            
      let _point = [];
      _point[0] = point[0] - startPointX;
      _point[1] = point[1] - startPointY;
      relativePoints.push(_point);
    });
    
    return this.createRelativeLines(id, startPointX, startPointY, relativePoints, enable_cache, angle, scale_x, scale_y, padding);
  }


  /**
   * 删除id对的body
   * 
   * @param {String} id 
   */
  remove(id) {
    let body = this._id2Body.get(id);
    this._id2Body.delete(id);
    if (body instanceof Array) {
      body.forEach(line => {
        this._bvh.remove(line);
      });
    } else{
      this._bvh.remove(body);
    }

    return body;
  }

  /**
   * Creates a {@link Result} used to collect the detailed results of a collision test
   */
  createResult () {
    return new Result()
  }

  /**
   * Creates a Result used to collect the detailed results of a collision test
   */
  static createResult () {
    return new Result()
  }

  /**
   * Updates the collision system. This should be called before any collisions are tested.
   */
  update () {
    this._bvh.update()

    return this
  }

  /**
   * Draws the bodies within the system to a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The context to draw to
   */
  draw (context) {
    return this._bvh.draw(context)
  }

  /**
   * Draws the system's BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
   * @param {CanvasRenderingContext2D} context The context to draw to
   */
  drawBVH (context) {
    return this._bvh.drawBVH(context)
  }

  /**
   * Returns a list of potential collisions for a body
   * @param {Circle|Polygon|Point} body The body to test for potential collisions against
   * @returns {Array<Body>}
   */
  potentials (body) {
    return this._bvh.potentials(body)
  }

  /**
   * Determines if two bodies are colliding
   * @param {Circle|Polygon|Point} target The target body to test against
   * @param {Result} [result = null] A Result object on which to store information about the collision
   * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
   * @returns {Boolean}
   */
  collides (source, target, result = null, aabb = true) {
    let sourceArray = source instanceof Array ? source : [source];
    let targetArray = target instanceof Array ? target : [target];
    for(let i = 0; i < sourceArray.length; i++) {
      for(let j = 0; j < targetArray.length; j++) {
        if (SAT(sourceArray[i], targetArray[j], result, aabb)) {
          return true;
        }
      }
    }

    return false;
  }
};

const collisions = new Collisions();

function getCollidesIds(body) {
  let resultSet = new Set();
  const potentials = body.potentials();
  for (const wall of potentials) {  
    if (body.collides(wall)) {
          resultSet.add(wall.id);
    }
  }

  return set;
}

module.exports = {
  collisions, getCollidesIds, Collisions, BVH, Circle, Polygon, Point, Result, SAT
}
