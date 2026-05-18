import { access } from './config'

export const guest = access.defineRole('guest').grant('read', 'post').build()

export const reader = access
  .defineRole('reader')
  .inherits('guest')
  .grant('read', 'comment')
  .grant('read', 'user')
  .build()

export const author = access
  .defineRole('author')
  .inherits('reader')
  .grant('create', 'post')
  .grant('comment', 'post')
  .grantWhen('update', 'post', (w) => w.isOwner())
  .grantWhen('delete', 'post', (w) => w.isOwner().attr('tier', 'eq', 'pro'))
  .build()

export const editor = access
  .defineRole('editor')
  .inherits('author')
  .grant('update', 'post')
  .grant('publish', 'post')
  .grant('delete', 'comment')
  .build()

export const admin = access.defineRole('admin').inherits('editor').grantCRUD('post').grantCRUD('comment').grantCRUD('user').build()

export const ROLES = [guest, reader, author, editor, admin]
