// WAI-ARIA 1.2 role and attribute types.

/** ARIA landmark roles — major page regions. */
export type LandmarkRole =
  | 'banner'
  | 'complementary'
  | 'contentinfo'
  | 'form'
  | 'main'
  | 'navigation'
  | 'region'
  | 'search'

/** ARIA widget roles — interactive components. */
export type WidgetRole =
  | 'button'
  | 'checkbox'
  | 'gridcell'
  | 'link'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'option'
  | 'progressbar'
  | 'radio'
  | 'scrollbar'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'switch'
  | 'tab'
  | 'tabpanel'
  | 'textbox'
  | 'treeitem'

/** ARIA composite widget roles. */
export type CompositeRole =
  | 'combobox'
  | 'grid'
  | 'listbox'
  | 'menu'
  | 'menubar'
  | 'radiogroup'
  | 'tablist'
  | 'tree'
  | 'treegrid'

/** ARIA document-structure roles. */
export type DocumentStructureRole =
  | 'application'
  | 'article'
  | 'blockquote'
  | 'caption'
  | 'cell'
  | 'code'
  | 'columnheader'
  | 'definition'
  | 'deletion'
  | 'directory'
  | 'document'
  | 'emphasis'
  | 'feed'
  | 'figure'
  | 'generic'
  | 'group'
  | 'heading'
  | 'img'
  | 'insertion'
  | 'list'
  | 'listitem'
  | 'math'
  | 'meter'
  | 'none'
  | 'note'
  | 'paragraph'
  | 'presentation'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'separator'
  | 'strong'
  | 'subscript'
  | 'superscript'
  | 'table'
  | 'term'
  | 'time'
  | 'toolbar'
  | 'tooltip'

/** ARIA live-region roles. */
export type LiveRegionRole = 'alert' | 'log' | 'marquee' | 'status' | 'timer'

/** ARIA window roles. */
export type WindowRole = 'alertdialog' | 'dialog'

/** Union of every `role` value recognized by this module. */
export type AriaRole = LandmarkRole | WidgetRole | CompositeRole | DocumentStructureRole | LiveRegionRole | WindowRole

/** Values for `aria-live`. */
export type AriaLive = 'off' | 'polite' | 'assertive'

/** Values for `aria-haspopup`. */
export type AriaHaspopup = boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

/** Values for `aria-orientation`. */
export type AriaOrientation = 'horizontal' | 'vertical'

/** Values for `aria-sort`. */
export type AriaSort = 'ascending' | 'descending' | 'none' | 'other'

/** Values for `aria-checked` / `aria-pressed`. */
export type AriaTristate = boolean | 'false' | 'mixed' | 'true'

/** Values for `aria-autocomplete`. */
export type AriaAutocomplete = 'none' | 'inline' | 'list' | 'both'

/** Values for `aria-relevant`. */
export type AriaRelevant =
  | 'additions'
  | 'additions text'
  | 'all'
  | 'removals'
  | 'removals additions'
  | 'removals text'
  | 'text'
  | 'text additions'
  | 'text removals'

/** Values for `aria-current`. */
export type AriaCurrent = boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time'

/** Values for `aria-dropeffect`. */
export type AriaDropEffect = 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'

/** Values for `aria-invalid`. */
export type AriaInvalid = boolean | 'false' | 'true' | 'grammar' | 'spelling'

/** Every state or property name accepted by ARIA (without the `aria-` prefix). */
export type AriaAttributeName =
  | 'activedescendant'
  | 'atomic'
  | 'autocomplete'
  | 'busy'
  | 'checked'
  | 'colcount'
  | 'colindex'
  | 'colspan'
  | 'controls'
  | 'current'
  | 'describedby'
  | 'details'
  | 'disabled'
  | 'dropeffect'
  | 'errormessage'
  | 'expanded'
  | 'flowto'
  | 'grabbed'
  | 'haspopup'
  | 'hidden'
  | 'invalid'
  | 'keyshortcuts'
  | 'label'
  | 'labelledby'
  | 'level'
  | 'live'
  | 'modal'
  | 'multiline'
  | 'multiselectable'
  | 'orientation'
  | 'owns'
  | 'placeholder'
  | 'posinset'
  | 'pressed'
  | 'readonly'
  | 'relevant'
  | 'required'
  | 'roledescription'
  | 'rowcount'
  | 'rowindex'
  | 'rowspan'
  | 'selected'
  | 'setsize'
  | 'sort'
  | 'valuemax'
  | 'valuemin'
  | 'valuenow'
  | 'valuetext'

/** A full `aria-*` attribute name template literal. */
export type AriaAttribute = `aria-${AriaAttributeName}`
