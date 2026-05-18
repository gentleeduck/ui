import { db, posts } from '@blogduck/shared'
import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'

@Injectable()
export class PostsService {
  findAll() {
    return db.select().from(posts)
  }

  findOne(id: number) {
    return db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .then((rows) => rows[0] ?? null)
  }

  create(authorId: string, data: { title: string; body: string }) {
    return db
      .insert(posts)
      .values({ ...data, authorId })
      .returning()
      .then((rows) => rows[0])
  }

  update(id: number, data: { title?: string; body?: string }) {
    return db
      .update(posts)
      .set(data)
      .where(eq(posts.id, id))
      .returning()
      .then((rows) => rows[0])
  }

  remove(id: number) {
    return db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()
      .then((rows) => rows[0])
  }
}
