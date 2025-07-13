// public getCurrentVersion(): number {
//   return this.history[this.currentVersionIndex]?.version ?? 0
// }
//
// public getTotalVersions(): number {
//   return this.history.length
// }
//
// public getSnapshotIds(version: number): string[] | undefined {
//   return this.history.find((h) => h.version === version)?.ids
// }
//
// public jumpToVersion(version: number): void {
//   const entry = this.history.find((h) => h.version === version)
//   if (!entry) throw new Error(`Version ${version} not found`)
//   this.viewRows = this.resolveIdsToRows(entry.ids)
//   this.currentVersionIndex = this.history.indexOf(entry)
//   this.emitChange('jump', { version })
// }
//
// public undo(): void {
//   if (this.currentVersionIndex > 0) {
//     this.currentVersionIndex--
//     const e = this.history[this.currentVersionIndex]
//     this.viewRows = this.resolveIdsToRows(e.ids)
//     this.emitChange('undo', { version: e.version })
//   }
// }
//
// public redo(): void {
//   if (this.currentVersionIndex < this.history.length - 1) {
//     this.currentVersionIndex++
//     const e = this.history[this.currentVersionIndex]
//     this.viewRows = this.resolveIdsToRows(e.ids)
//     this.emitChange('redo', { version: e.version })
//   }
// }
//
// private isBrowser(): boolean {
//   return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
// }
//
// private saveToStorage(): void {
//   if (!this.isBrowser() || !this.storageKey) return
//   try {
//     localStorage.setItem(this.storageKey, JSON.stringify(this.history))
//   } catch {
//     /* ignore */
//   }
// }
//
// public loadFromStorage(): void {
//   if (!this.isBrowser() || !this.storageKey) return
//
//   try {
//     const raw = localStorage.getItem(this.storageKey)
//     if (!raw) return
//
//     const saved = JSON.parse(raw) as HistoryDelta[]
//     this.history = saved
//     this.currentVersionIndex = saved.length - 1
//
//     const last = saved[this.currentVersionIndex]
//     if (!last) return
//
//     this.viewRows = this.resolveIdsToRows(last.ids)
//     this.lastStorageUpdate = last.timestamp
//
//     // Apply query from meta if present
//     if (last.meta && 'query' in last.meta) {
//       this.query = last.meta.query
//     }
//
//     // Apply pagination if present
//     if (last.meta && 'page' in last.meta) {
//       this.currentPage = last.meta.page
//     }
//
//     if (last.meta && 'pageSize' in last.meta) {
//       this.pageSize = last.meta.pageSize
//     }
//
//     // Apply sort config if present
//     if (last.meta && 'sortConfig' in last.meta) {
//       this.sortConfig = last.meta.sortConfig
//     }
//   } catch (err) {
//     console.warn('[DuckTable] Failed to load from storage:', err)
//     this.history = []
//   }
// }
//
// private watchStorageChanges(): void {
//   if (!this.storageKey || !this.isBrowser()) return
//   window.addEventListener('storage', (e) => {
//     if (e.key !== this.storageKey || !e.newValue) return
//     try {
//       const parsed = JSON.parse(e.newValue) as HistoryDelta[]
//       const last = parsed.at(-1)
//       if (!last || last.timestamp <= this.lastStorageUpdate) return
//       const rows = this.resolveIdsToRows(last.ids)
//       if (rows.length !== last.ids.length) return
//       this.history = parsed
//       this.viewRows = rows
//       this.currentVersionIndex = parsed.length - 1
//       this.lastStorageUpdate = last.timestamp
//       this.emitChange('storage-sync', { version: last.version })
//     } catch {
//       /* ignore */
//     }
//   })
// }
//
// private pushHistory<T extends DuckTableEventType>(
//   type: T,
//   meta: DuckTableEventMeta<T, THeader>,
//   rows: DuckTableOptions<THeader>['data'],
// ): void {
//   const ids = rows.map((r) => r.id)
//   const delta: HistoryDelta = {
//     version: ++this.versionCounter,
//     type,
//     timestamp: Date.now(),
//     ids,
//     meta,
//   }
//   this.history.push(delta)
//
//   if (this.history.length > this.maxHistory) {
//     const removed = this.history.splice(0, this.history.length - this.maxHistory)
//     this.versionCounter = this.history[this.history.length - 1].version
//     this.currentVersionIndex = this.history.length - 1
//     this.emitChange('compress', { removed })
//   } else {
//     this.currentVersionIndex = this.history.length - 1
//   }
//
//   this.lastStorageUpdate = delta.timestamp
//   this.saveToStorage()
//   this.emitChange(type, meta)
// }
//
// public setMaxHistory(limit: number): void {
//   this.maxHistory = limit
// }
//
// public getHistory(): HistoryDelta[] {
//   return [...this.history]
// }
//
// private resolveIdsToRows(ids: string[]): DuckTableOptions<THeader>['data'] {
//   const map = new Map(this.rawData.map((r) => [r.id, r]))
//   return ids.map((id) => map.get(id)!).filter(Boolean)
// }
