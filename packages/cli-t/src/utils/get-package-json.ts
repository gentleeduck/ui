import fs from 'fs-extra'
import path from 'path'
import { type PackageJson } from 'type-fest'

export function getPackageJson(): PackageJson {
  const packageJsonPath = path.join('package.json')

  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
}
