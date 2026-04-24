import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type {
  AriaAttribute,
  AriaAutocomplete,
  AriaCurrent,
  AriaHaspopup,
  AriaInvalid,
  AriaLive,
  AriaOrientation,
  AriaRole,
  AriaSort,
  AriaTristate,
  CompositeRole,
  LandmarkRole,
  WidgetRole,
} from '.'

// Role categories
type Test_Landmark = AssertTrue<Equal<'main' extends LandmarkRole ? true : false, true>, "'main' is a landmark">
type Test_Widget = AssertTrue<Equal<'button' extends WidgetRole ? true : false, true>, "'button' is a widget">
type Test_Composite = AssertTrue<
  Equal<'combobox' extends CompositeRole ? true : false, true>,
  "'combobox' is composite"
>

// AriaRole union
type Test_AriaRole_Menu = AssertTrue<Equal<'menu' extends AriaRole ? true : false, true>, "'menu' is an AriaRole">
type Test_AriaRole_Dialog = AssertTrue<Equal<'dialog' extends AriaRole ? true : false, true>, 'dialog is an AriaRole'>

// Enumerated values
type Test_Live = AssertTrue<Equal<'polite' extends AriaLive ? true : false, true>, "'polite' is aria-live">
type Test_Orientation = AssertTrue<
  Equal<'horizontal' extends AriaOrientation ? true : false, true>,
  'horizontal is an orientation'
>
type Test_Sort = AssertTrue<Equal<'ascending' extends AriaSort ? true : false, true>, 'ascending is a sort'>
type Test_Autocomplete = AssertTrue<
  Equal<'list' extends AriaAutocomplete ? true : false, true>,
  "'list' is an autocomplete"
>

// Tri-state values accept boolean + mixed
type Test_Tristate_Bool = AssertTrue<Equal<true extends AriaTristate ? true : false, true>, 'true is a tri-state'>
type Test_Tristate_Mixed = AssertTrue<
  Equal<'mixed' extends AriaTristate ? true : false, true>,
  "'mixed' is a tri-state"
>

// Haspopup
type Test_Haspopup = AssertTrue<Equal<'menu' extends AriaHaspopup ? true : false, true>, "'menu' is an AriaHaspopup">

// Current / Invalid
type Test_Current_Page = AssertTrue<Equal<'page' extends AriaCurrent ? true : false, true>, "'page' is an AriaCurrent">
type Test_Invalid_Grammar = AssertTrue<
  Equal<'grammar' extends AriaInvalid ? true : false, true>,
  "'grammar' is an AriaInvalid"
>

// AriaAttribute template
type Test_Attr_Label = AssertTrue<
  Equal<'aria-label' extends AriaAttribute ? true : false, true>,
  'aria-label is an AriaAttribute'
>
type Test_Attr_Controls = AssertTrue<
  Equal<'aria-controls' extends AriaAttribute ? true : false, true>,
  'aria-controls is an AriaAttribute'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Landmark,
  Test_Widget,
  Test_Composite,
  Test_AriaRole_Menu,
  Test_AriaRole_Dialog,
  Test_Live,
  Test_Orientation,
  Test_Sort,
  Test_Autocomplete,
  Test_Tristate_Bool,
  Test_Tristate_Mixed,
  Test_Haspopup,
  Test_Current_Page,
  Test_Invalid_Grammar,
  Test_Attr_Label,
  Test_Attr_Controls,
]
