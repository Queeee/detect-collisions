/**
 * The base class for bodies used to detect collisions
 * @export
 * @abstract
 * @class Body
 */
export abstract class Body {
    x: number;
    y: number;
    padding: number;

    /**
     * Determines if the body is colliding with another body
     * @param {Circle|Polygon|Point} target The target body to test against
     * @param {Result} [result = null] A Result object on which to store information about the collision
     * @param {boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
     * @returns {boolean}
     */
    collides(target: Body, result?: Result, aabb?: boolean): boolean;

    /**
     * Returns a list of potential collisions
     * @returns {Body[]}
     */
    potentials(): Body[];

    /**
     * Removes the body from its current collision system
     */
    remove(): void;

    /**
     * Draws the bodies within the system to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D): void;
}

/**
 * A circle used to detect collisions
 * @export
 * @class Circle
 * @extends {Body}
 */
export class Circle extends Body {
    /**
     * @constructor
     * @param {String} [i = 0] unique id
     * @param {number} [x = 0] The starting X coordinate
     * @param {number} [y = 0] The starting Y coordinate
     * @param {number} [radius = 0] The radius
     * @param {number} [scale = 1] The scale
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(id?: string, x?: number, y?: number, radius?: number, scale?: number, padding?: number);
    radius: number;
    scale: number;
}

/**
 * A polygon used to detect collisions
 * @export
 * @class Polygon
 * @extends {Body}
 */
export class Polygon extends Body {
    /**
     * @constructor
     * @param {number} [x = 0] The starting X coordinate
     * @param {number} [y = 0] The starting Y coordinate
     * @param {number[][]} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {number} [angle = 0] The starting rotation in radians
     * @param {number} [scale_x = 1] The starting scale along the X axis
     * @param {number} [scale_y = 1] The starting scale long the Y axis
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x?: number, y?: number, points?: number[][], angle?: number, scale_x?: number, scale_y?: number, padding?: number);
    angle: number;
    scale_x: number;
    scale_y: number;
}

/**
 * A point used to detect collisions
 * @export
 * @class Point
 * @extends {Body}
 */
export class Point extends Body {
    constructor(id?: string, x?: number, y?: number, padding?: number);
}

/**
 * An object used to collect the detailed results of a collision test
 *
 * > **Note:** It is highly recommended you recycle the same Result object if possible in order to avoid wasting memory
 * @export
 * @class Result
 */
export class Result {
    collision: boolean;
    a: Body;
    b: Body;
    a_in_b: boolean;
    b_in_a: boolean;
    overlap: number;
    overlap_x: number;
    overlap_y: number;
}

/**
 * A collision system used to track bodies in order to improve collision detection performance
 * @export
 * @class Collisions
 */
export class Collisions {
    /**
     * Creates a {@link Circle} and inserts it into the collision system
     * @param {string} [i = 0] unique id
     * @param {number} [x = 0] The starting X coordinate
     * @param {number} [y = 0] The starting Y coordinate
     * @param {boolean} [enable_cache = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     * @param {number} [radius = 0] The radius
     * @param {number} [scale = 1] The scale
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {Circle}
     */
    createCircle(id: string, x?: number, y?: number, enable_cache?: boolean, radius?: number, scale?: number, padding?: number): Circle;

    /**
     * Creates a {@link Polygon} and inserts it into the collision system
     * 
     * @param {string} [i = 0] unique id
     * @param {number} [x = 0] The starting X coordinate
     * @param {number} [y = 0] The starting Y coordinate
     * @param {number[][]} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {boolean} [enable_cache = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     * @param {number} [angle = 0] The starting rotation in radians
     * @param {number} [scale_x = 1] The starting scale along the X axis
     * @param {number} [scale_y = 1] The starting scale long the Y axis
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {Polygon}
     */
    createRelativePolygon(id: string, x?: number, y?: number, points?: number[][], enable_cache?: boolean, angle?: number, scale_x?: number, scale_y?: number, padding?: number): Polygon;

    /**
     * Creates a {@link Polygon} and inserts it into the collision system
     * 
     * @param {string} [i = 0] unique id
     * @param {number[][]} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {boolean} [enable_cache = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     * @param {number} [angle = 0] The starting rotation in radians
     * @param {number} [scale_x = 1] The starting scale along the X axis
     * @param {number} [scale_y = 1] The starting scale long the Y axis
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {Polygon}
     */
    createAbsolutePolygon(id: string, points?: number[][], enable_cache?: boolean, angle?: number, scale_x?: number, scale_y?: number, padding?: number): Polygon;

    /**
     * Create lines
     * 
     * @param {string} [i = 0] unique id
     * @param {number} [x = 0] The starting X coordinate
     * @param {number} [y = 0] The starting Y coordinate
     * @param {number[][]} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {boolean} [enable_cache = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     * @param {number} [angle = 0] The starting rotation in radians
     * @param {number} [scale_x = 1] The starting scale along the X axis
     * @param {number} [scale_y = 1] The starting scale long the Y axis
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {Polygon}
     */
    createRelativeLines(id: string, x?: number, y?: number, points?: number[][], enable_cache?: boolean, angle?: number, scale_x?: number, scale_y?: number, padding?: number): Polygon;

    /**
     * create lines
     * 
     * @param {string} [i = 0] unique id
     * @param {number[][]} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {boolean} [enable_cache = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     * @param {number} [angle = 0] The starting rotation in radians
     * @param {number} [scale_x = 1] The starting scale along the X axis
     * @param {number} [scale_y = 1] The starting scale long the Y axis
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {Polygon}
     */
    createAbsoluteLines(id: string, points?: number[][], enable_cache?: boolean, angle?: number, scale_x?: number, scale_y?: number, padding?: number): Polygon;

    /**
     * Creates a {@link Point} and inserts it into the collision system
     * @param {number} [x = 0] The starting X coordinate
     * @param {number} [y = 0] The starting Y coordinate
     * @param {boolean} [enable_cache = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     * @param {number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {Point}
     */
    createPoint(id: string, x?: number, y?: number, enable_cache?: boolean, padding?: number): Point;

    /**
     * Creates a {@link Result} used to collect the detailed results of a collision test
     * @returns {Result}
     */
    createResult(): Result;

   /**
   * 删除id对的body
   * 
   * @param {String} id 
   * @returns {Collisions}
   */
    remove(id: string): Collisions;

    /**
     * Updates the collision system. This should be called before any collisions are tested.
     * @returns {Collisions}
     */
    update(): Collisions;

    /**
     * Returns a list of potential collisions for a body
     * @param {Body} [body]
     * @returns {Body[]}
     */
    potentials(body?: Body): Body[];

    /**
     * Determines if two bodies are colliding
     * @param {Body} source
     * @param {Body} target
     * @param {Result} [result]
     * @param {boolean} [aabb]
     * @returns {boolean}
     */
    collides(source: Body, target: Body, result?: Result, aabb?: boolean): boolean;

    /**
     * Draws the bodies within the system to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D): void;

    /**
     * Draws the system's BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
     * @param {CanvasRenderingContext2D} context
     */
    drawBVH(context: CanvasRenderingContext2D): void;
}

export const collisions: Collisions
export const getCollidesIds: Function