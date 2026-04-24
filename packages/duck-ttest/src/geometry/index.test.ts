import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  AffineMatrix2D,
  Bounds,
  Degrees,
  Direction,
  Origin,
  Point2D,
  Point3D,
  Radians,
  Rect,
  Size3D,
  Vector2D,
} from '.'

// Point2D / Point3D shapes
type Test_Point2D = AssertTrue<Equal<Point2D, { x: number; y: number }>, 'Point2D is {x, y}'>
type Test_Point3D_Extends_2D = AssertTrue<Equal<Point3D extends Point2D ? true : false, true>, 'Point3D is-a Point2D'>

// Size / Size3D
type Test_Size3D = AssertTrue<Equal<keyof Size3D, 'width' | 'height' | 'depth'>, 'Size3D extends Size with depth'>

// Rect has all four keys
type Test_Rect = AssertTrue<Equal<keyof Rect, 'x' | 'y' | 'width' | 'height'>, 'Rect = Point2D + Size'>

// Bounds
type Test_Bounds = AssertTrue<Equal<keyof Bounds, 'minX' | 'minY' | 'maxX' | 'maxY'>, 'Bounds has min/max x/y'>

// Vector2D aliases Point2D
type Test_Vector2D = AssertTrue<Equal<Vector2D, Point2D>, 'Vector2D aliases Point2D'>

// AffineMatrix2D is a 9-length tuple
type Test_Matrix2D_Length = AssertTrue<Equal<AffineMatrix2D['length'], 9>, 'AffineMatrix2D has 9 entries'>

// Direction / Origin unions exist
type Test_Direction = AssertTrue<Equal<'north' extends Direction ? true : false, true>, 'north is a Direction'>
type Test_Origin = AssertTrue<Equal<'top-left' extends Origin ? true : false, true>, 'top-left is an Origin'>

// Degrees / Radians brands are distinct
type Test_Deg_Rad_Distinct = AssertTrue<
  Equal<Degrees extends Radians ? true : false, false>,
  'Degrees and Radians are nominally distinct'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Point2D,
  Test_Point3D_Extends_2D,
  Test_Size3D,
  Test_Rect,
  Test_Bounds,
  Test_Vector2D,
  Test_Matrix2D_Length,
  Test_Direction,
  Test_Origin,
  Test_Deg_Rad_Distinct,
]
