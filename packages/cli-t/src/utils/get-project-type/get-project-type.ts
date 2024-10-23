import fs from 'fs-extra'
import fg from 'fast-glob'
import { IGNORED_DIRECTORIES } from '../get-project-info'
import path from 'path'
export async function get_project_type(cwd: string) {
  const files = await fg.glob('**/*', {
    cwd,
    deep: 3,
    ignore: IGNORED_DIRECTORIES
  })

  const is_nextjs = files.find((file) => file.includes('next.config.js'))
  if (is_nextjs) {
    return 'nextjs'
  }

  const is_using_src_dir = await fs.pathExists(path.resolve(cwd, 'src'))
  const is_using_app_dir = await fs.pathExists(
    path.resolve(cwd, `${is_using_src_dir ? 'src/' : ''}app`)
  )

  if (is_using_app_dir) {
    return is_using_src_dir ? 'next-app-src' : 'nextjs-app'
  }

  return is_using_src_dir ? 'next-pages-src' : 'next-pages'
}
