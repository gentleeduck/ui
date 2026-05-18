import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockBackend } from './mock-backend'
import { engine } from './engine'
import type { AppRole, Post, User } from './types'

export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  comments: (postId?: string) => (postId ? (['comments', postId] as const) : (['comments'] as const)),
  iam: ['iam'] as const,
}

export function usePosts() {
  return useQuery({ queryKey: queryKeys.posts, queryFn: () => mockBackend.listPosts() })
}

export function usePost(id: string) {
  return useQuery({ queryKey: queryKeys.post(id), queryFn: () => mockBackend.getPost(id), enabled: Boolean(id) })
}

export function useComments(postId?: string) {
  return useQuery({ queryKey: queryKeys.comments(postId), queryFn: () => mockBackend.listComments(postId) })
}

export function useUsers() {
  return useQuery({ queryKey: queryKeys.users, queryFn: () => mockBackend.listUsers() })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Post, 'id' | 'createdAt'>) => mockBackend.createPost(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.posts }),
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<Post, 'id' | 'createdAt'>> }) =>
      mockBackend.updatePost(id, patch),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.posts })
      qc.invalidateQueries({ queryKey: queryKeys.post(id) })
    },
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockBackend.deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.posts }),
  })
}

export function useCreateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof mockBackend.createComment>[0]) => mockBackend.createComment(input),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: queryKeys.comments(c.postId) })
      qc.invalidateQueries({ queryKey: queryKeys.comments() })
    },
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockBackend.deleteComment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.comments() })
    },
  })
}

export function useAssignRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ subjectId, roleId, scope }: { subjectId: string; roleId: AppRole; scope?: string }) =>
      engine.admin.assignRole(subjectId, roleId, scope as never),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.iam })
    },
  })
}

export function useRevokeRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ subjectId, roleId, scope }: { subjectId: string; roleId: AppRole; scope?: string }) =>
      engine.admin.revokeRole(subjectId, roleId, scope as never),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.iam })
    },
  })
}

export type { Post, User }
