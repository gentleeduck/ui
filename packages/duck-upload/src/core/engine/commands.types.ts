/**
 * Public commands accepted by the upload store.
 *
 * Reducer/effects should treat commands as "user intent".
 */
export type UploadCommand<P extends string> =
  | { type: 'addFiles'; files: File[]; purpose: P }
  | { type: 'start'; localId: string }
  | { type: 'startAll'; purpose?: P }
  | { type: 'pause'; localId: string }
  | { type: 'pauseAll'; purpose?: P }
  | { type: 'resume'; localId: string }
  | { type: 'cancel'; localId: string }
  | { type: 'cancelAll'; purpose?: P }
  | { type: 'retry'; localId: string }
  | { type: 'rebind'; localId: string; file: File }
  | { type: 'remove'; localId: string }
