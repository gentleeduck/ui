import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  CSSAlignItems,
  CSSColor,
  CSSCursor,
  CSSCustomProp,
  CSSDisplay,
  CSSFlexDirection,
  CSSGlobal,
  CSSJustifyContent,
  CSSLength,
  CSSLineStyle,
  CSSNamedColor,
  CSSPosition,
  CSSSystemColor,
  CSSVar,
} from '.'

// CSSGlobal
type Test_Global_Inherit = AssertTrue<Equal<'inherit' extends CSSGlobal ? true : false, true>, "'inherit' is a global">

// CSSNamedColor
type Test_Named_Red = AssertTrue<Equal<'red' extends CSSNamedColor ? true : false, true>, "'red' is a named color">
type Test_Named_Rebecca = AssertTrue<
  Equal<'rebeccapurple' extends CSSNamedColor ? true : false, true>,
  "'rebeccapurple' is a named color"
>

// CSSSystemColor
type Test_System_Canvas = AssertTrue<
  Equal<'Canvas' extends CSSSystemColor ? true : false, true>,
  "'Canvas' is a system color"
>

// CSSColor accepts named, hex, rgb, transparent
type Test_Color_Named = AssertTrue<Equal<'red' extends CSSColor ? true : false, true>, 'named color ok'>
type Test_Color_Hex = AssertTrue<Equal<'#ff00aa' extends CSSColor ? true : false, true>, 'hex color ok'>
type Test_Color_Rgb = AssertTrue<Equal<'rgb(255, 0, 128)' extends CSSColor ? true : false, true>, 'rgb() ok'>
type Test_Color_Transparent = AssertTrue<Equal<'transparent' extends CSSColor ? true : false, true>, 'transparent ok'>

// CSSDisplay / CSSPosition / CSSFlexDirection
type Test_Display = AssertTrue<Equal<'flex' extends CSSDisplay ? true : false, true>, 'flex is a display'>
type Test_Position = AssertTrue<Equal<'sticky' extends CSSPosition ? true : false, true>, 'sticky is a position'>
type Test_FlexDir = AssertTrue<
  Equal<'row-reverse' extends CSSFlexDirection ? true : false, true>,
  'row-reverse is a flex-direction'
>

// CSSAlignItems / CSSJustifyContent
type Test_Align = AssertTrue<Equal<'stretch' extends CSSAlignItems ? true : false, true>, 'stretch is align-items'>
type Test_Justify = AssertTrue<
  Equal<'space-between' extends CSSJustifyContent ? true : false, true>,
  'space-between is justify-content'
>

// CSSCursor / CSSLineStyle
type Test_Cursor = AssertTrue<Equal<'pointer' extends CSSCursor ? true : false, true>, 'pointer is a cursor'>
type Test_LineStyle = AssertTrue<Equal<'dashed' extends CSSLineStyle ? true : false, true>, 'dashed is a line-style'>

// CSSLength accepts number+unit + '0'
type Test_Length_Num = AssertTrue<Equal<'10px' extends CSSLength ? true : false, true>, '10px is a length'>
type Test_Length_Zero = AssertTrue<Equal<'0' extends CSSLength ? true : false, true>, "'0' is a length">

// CSSVar / CSSCustomProp
type Test_Var = AssertTrue<Equal<'var(--primary)' extends CSSVar ? true : false, true>, 'var(--primary) is a CSSVar'>
type Test_Var_Fallback = AssertTrue<
  Equal<'var(--primary, red)' extends CSSVar ? true : false, true>,
  'CSSVar allows fallback'
>
type Test_CustomProp = AssertTrue<
  Equal<'--theme' extends CSSCustomProp ? true : false, true>,
  '--theme is a custom prop name'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Global_Inherit,
  Test_Named_Red,
  Test_Named_Rebecca,
  Test_System_Canvas,
  Test_Color_Named,
  Test_Color_Hex,
  Test_Color_Rgb,
  Test_Color_Transparent,
  Test_Display,
  Test_Position,
  Test_FlexDir,
  Test_Align,
  Test_Justify,
  Test_Cursor,
  Test_LineStyle,
  Test_Length_Num,
  Test_Length_Zero,
  Test_Var,
  Test_Var_Fallback,
  Test_CustomProp,
]
