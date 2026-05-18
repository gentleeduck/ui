import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common'
import type { Request } from 'express'
import { Authorize } from '../access/authorize'
import type { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll() {
    return this.posts.findAll()
  }

  @Post()
  @Authorize({ action: 'create', resource: 'post' })
  create(@Req() req: Request, @Body() body: { title: string; body: string }) {
    const userId = req.headers['x-user-id'] as string
    return this.posts.create(userId, body)
  }

  @Put(':id')
  @Authorize({ action: 'update', resource: 'post' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { title?: string; body?: string }) {
    return this.posts.update(id, body)
  }

  @Delete(':id')
  @Authorize({ action: 'delete', resource: 'post' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.posts.remove(id)
  }
}
