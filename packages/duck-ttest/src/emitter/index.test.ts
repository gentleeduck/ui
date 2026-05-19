import type { AssertTrue } from '~/assert'
import type { Equal } from '~/equality'
import type { EmitArgs, Emitter, EventAction, EventNames, EventPayload, Handlers } from '.'

type Events = {
  click: { x: number; y: number }
  keypress: { key: string }
  close: undefined
}

// EventPayload / EventNames
type Test_Payload = AssertTrue<
  Equal<EventPayload<Events, 'click'>, { x: number; y: number }>,
  'EventPayload extracts payload type'
>
type Test_Names = AssertTrue<
  Equal<EventNames<Events>, 'click' | 'keypress' | 'close'>,
  'EventNames is the union of event names'
>

// EmitArgs
type Test_EmitArgs_Click = AssertTrue<
  Equal<EmitArgs<Events, 'click'>, [payload: { x: number; y: number }]>,
  'EmitArgs requires payload for non-void events'
>
type Test_EmitArgs_Close = AssertTrue<Equal<EmitArgs<Events, 'close'>, []>, 'EmitArgs is empty for void events'>

// Emitter assignability
declare const emitter: Emitter<Events>
// biome-ignore lint/correctness/noUnusedVariables: type-level usage
const _check = () => {
  const _unsub = emitter.on('click', (p) => p.x)
  emitter.emit('click', { x: 1, y: 2 })
  emitter.emit('close')
}

// Handlers
type Test_Handlers = AssertTrue<
  Equal<Handlers<Events, string>['click'], (payload: { x: number; y: number }) => string>,
  'Handlers per event map'
>

// EventAction
type Action = EventAction<Events>
type Test_Action_Click = AssertTrue<
  Equal<Extract<Action, { type: 'click' }>, { type: 'click'; payload: { x: number; y: number } }>,
  'EventAction yields discriminated variants'
>

/* @__IGNORED__@ */ type _IGNORE = [
  Test_Payload,
  Test_Names,
  Test_EmitArgs_Click,
  Test_EmitArgs_Close,
  Test_Handlers,
  Test_Action_Click,
]
