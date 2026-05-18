export interface IFlowEntry {
  id: number
  ts: number
  subjectId: string
  action: string
  resource: string
  resourceId?: string
  scope?: string
  allowed: boolean
  durationMs?: number
  reason?: string
  decidingPolicy?: string
  decidingRule?: string
  environment?: Record<string, unknown>
}

type IFlowRecordInput = Omit<IFlowEntry, 'id' | 'ts'> & { ts?: number }

export interface IFlowRecorder {
  record(entry: IFlowRecordInput): IFlowEntry
  list(): readonly IFlowEntry[]
  get(id: number): IFlowEntry | undefined
  clear(): void
  subscribe(listener: () => void): () => void
}

export interface IFlowRecorderOptions {
  bufferSize?: number
}

const DEFAULT_BUFFER = 250

export function createFlowRecorder(options: IFlowRecorderOptions = {}): IFlowRecorder {
  const bufferSize = options.bufferSize ?? DEFAULT_BUFFER
  let nextId = 1
  let buffer: IFlowEntry[] = []
  const listeners = new Set<() => void>()

  function notify() {
    for (const fn of listeners) {
      try {
        fn()
      } catch {}
    }
  }

  return {
    record(input) {
      const entry: IFlowEntry = {
        id: nextId++,
        ts: input.ts ?? Date.now(),
        subjectId: input.subjectId,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        scope: input.scope,
        allowed: input.allowed,
        durationMs: input.durationMs,
        reason: input.reason,
        decidingPolicy: input.decidingPolicy,
        decidingRule: input.decidingRule,
        environment: input.environment,
      }
      buffer.unshift(entry)
      if (buffer.length > bufferSize) buffer.length = bufferSize
      notify()
      return entry
    },
    list() {
      return buffer
    },
    get(id) {
      return buffer.find((e) => e.id === id)
    },
    clear() {
      buffer = []
      notify()
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
  }
}
