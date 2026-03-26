import fs from 'node:fs/promises'
import path from 'node:path'

const cwd = process.cwd()
const manifestPath = path.join(cwd, '.next/required-server-files.json')

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

const fixRelativeAppDir = async () => {
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

const fixStandaloneStructure = async () => {
  const standaloneDotNext = path.join(cwd, '.next/standalone/.next')
  try {
    await fs.access(standaloneDotNext)
    return
  } catch {}

  const raw = await fs.readFile(manifestPath, 'utf8').catch(() => null)
  if (!raw) return

  const manifest = JSON.parse(raw)
  const relativeAppDir = manifest.relativeAppDir || ''
  if (!relativeAppDir) return

  const nestedDotNext = path.join(cwd, '.next/standalone', relativeAppDir, '.next')
  try {
    await fs.access(nestedDotNext)
  } catch {
    return
  }

  await fs.cp(nestedDotNext, standaloneDotNext, { recursive: true })

  const standaloneManifest = path.join(standaloneDotNext, 'required-server-files.json')
  const standaloneRaw = await fs.readFile(standaloneManifest, 'utf8').catch(() => null)
  if (standaloneRaw) {
    const standaloneJson = JSON.parse(standaloneRaw)
    standaloneJson.relativeAppDir = ''
    await fs.writeFile(standaloneManifest, `${JSON.stringify(standaloneJson, null, 2)}\n`, 'utf8')
  }

  console.log(
    `[fix-required-server-files] Copied standalone .next from ${relativeAppDir}/.next to .next/standalone/.next for Netlify compatibility.`,
  )
}

await fixStandaloneStructure()
await fixRelativeAppDir()
