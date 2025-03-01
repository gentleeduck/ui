// @ts-noCheck
import { useOptimistic, useState } from 'react'
import { Post } from '../types/post'
import { createNewPost } from '../actions/createNewPost'
import PostList from './PostList'
import { posts as defaultPosts } from '../data/posts'

export default function AddPost() {
  const [posts, setPosts] = useState<Post[]>(defaultPosts)

  // Add a pending state to track which posts are being added
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state: Post[], newPost: Post) => {
      return state.some((post) => post.id === newPost.id)
        ? state
        : [...state, newPost]
    },
  )

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto border p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
        <form action={PostsClass.addPost}>
          <input
            type="text"
            name="title"
            placeholder="Enter post title"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors"
          >
            Add Post
          </button>
        </form>

        <PostList posts={optimisticPosts} />
      </div>
    </div>
  )
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Posts {
  public static async addPost(formData: FormData) {
    const title = formData.get('title') as string
    const newPost: Post = {
      id: new Date().getTime().toString(),
      title: title,
    }
    addOptimisticPost(newPost) // Add the new post to the optimistic state
    try {
      await createNewPost()
      setPosts((prev) => {
        // Only add if not already present
        return prev.some((post) => post.id === newPost.id)
          ? prev
          : [...prev, newPost]
      })
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }
}
