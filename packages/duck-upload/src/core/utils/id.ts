export function generateId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`
}
