// Geometry shape primitives shared by UI/canvas/physics APIs.

/** 2D point in pixel or unit-agnostic coordinate space. */
export interface Point2D {
  x: number
  y: number
}

/** 3D point. */
export interface Point3D {
  x: number
  y: number
  z: number
}

/** Size (width + height). */
export interface Size {
  width: number
  height: number
}

/** 3D size (width + height + depth). */
export interface Size3D extends Size {
  depth: number
}

/** Axis-aligned rectangle described by its top-left corner + size. */
export interface Rect extends Point2D, Size {}

/** Axis-aligned bounds described by min/max corners. */
export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** 3D axis-aligned bounds. */
export interface Bounds3D extends Bounds {
  minZ: number
  maxZ: number
}

/** 2D vector — same shape as `Point2D` but semantically a direction/offset. */
export type Vector2D = Point2D

/** 3D vector. */
export type Vector3D = Point3D

/** Homogeneous 3x3 affine transform, row-major. */
export type AffineMatrix2D = readonly [number, number, number, number, number, number, number, number, number]

/** 4x4 affine transform, row-major. */
export type AffineMatrix3D = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

/** Cardinal directions on a 2D grid. */
export type Direction = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest'

/** Origin anchor — where `(0, 0)` of a rect refers to. */
export type Origin =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/** Angle in degrees (brand). */
declare const DEG_UNIT: unique symbol
export type Degrees = number & { readonly [DEG_UNIT]: 'deg' }

/** Angle in radians (brand). */
declare const RAD_UNIT: unique symbol
export type Radians = number & { readonly [RAD_UNIT]: 'rad' }
