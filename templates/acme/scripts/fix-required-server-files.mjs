import fs from 'node:fs/promises'
import path from 'node:path'

const manifestPath = path.join(process.cwd(), '.next/required-server-files.json')

const getPathSegments = (input) => path.normalize(input).split(path.sep).filter(Boolean)

const endsWithSegments = (fullPath, suffixPath) => {
  const fullSegments = getPathSegments(fullPath)
  const suffixSegments = getPathSegments(suffixPath)

  if (suffixSegments.length === 0 || suffixSegments.length > fullSegments.length) {
    return false
  }

  const offset = fullSegments.length - suffixSegments.length

  for (let index = 0; index < suffixSegments.length; index += 1) {
    if (fullSegments[offset + index] !== suffixSegments[index]) {
      return false
    }
  }

  return true
}

const main = async () => {
  try {
    const raw = await fs.readFile(manifestPath, 'utf8')
    const manifest = JSON.parse(raw)

    if (
      typeof manifest.appDir !== 'string' ||
      typeof manifest.relativeAppDir !== 'string' ||
      manifest.relativeAppDir.length === 0
    ) {
      return
    }

    if (!endsWithSegments(manifest.appDir, manifest.relativeAppDir)) {
      return
    }

    manifest.relativeAppDir = ''
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

    console.log(
      `[fix-required-server-files] Updated ${manifestPath}: cleared relativeAppDir to avoid duplicated project path resolution in Vercel build.`,
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return
    }

    throw error
  }
}

await main()
