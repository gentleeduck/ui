import { access } from './config'

/**
 * Per-workspace gate: every action runs only when the requester's workspace
 * matches the resource workspace. Demonstrates `resourceAttr` per-resource
 * narrowing on the post shape.
 */
const workspaceGate = access
  .defineRule('workspace-gate')
  .allow()
  .on('read', 'update', 'delete', 'publish', 'comment')
  .of('post')
  .when((w) => w.resourceAttr('workspaceId', 'eq', '$subject.attributes.workspaceId'))
  .priority(100)
  .build()

/**
 * Draft posts visible only to owner or editor+.
 */
const denyDraftRead = access
  .defineRule('post.deny-draft-read')
  .deny()
  .on('read')
  .of('post')
  .when((w) =>
    w
      .resourceAttr('published', 'eq', false)
      .not((n) => n.resourceAttr('ownerId', 'eq', '$subject.id'))
      .not((n) => n.roles('editor', 'admin')),
  )
  .priority(80)
  .build()

/**
 * Publishing window: editors can only publish between 09:00 and 23:59
 * (business hours). Admins bypass. Demonstrates env() + or().
 */
const publishWindow = access
  .defineRule('post.publish-window')
  .allow()
  .on('publish')
  .of('post')
  .when((w) =>
    w
      .env('hour', 'gte', 9)
      .or((o) => o.role('admin').attr('tier', 'eq', 'pro')),
  )
  .priority(50)
  .build()

/**
 * Comments are deletable by owner OR by editor+. Demonstrates nested `or` +
 * role() check.
 */
const commentDelete = access
  .defineRule('comment.delete')
  .allow()
  .on('delete')
  .of('comment')
  .when((w) => w.or((o) => o.resourceAttr('ownerId', 'eq', '$subject.id').role('editor').role('admin')))
  .build()

export const blogPolicy = access
  .policy('blog')
  .addRule(workspaceGate)
  .addRule(denyDraftRead)
  .addRule(publishWindow)
  .addRule(commentDelete)
  .build()

export const POLICIES = [blogPolicy]
