import { Box, Text } from 'ink'
import { memo } from 'react'
import { THEME } from '../app.constants'

type FileTabsProps = {
  files: string[]
  active_index: number
}

/** Horizontal file tab bar with the active file shown bold and underlined. */
export const FileTabs = memo(function FileTabs({ files, active_index }: FileTabsProps) {
  if (files.length <= 1) return null

  return (
    <Box gap={1}>
      <Text color={THEME.mutedForeground}>Files:</Text>
      {files.map((file, i) => (
        <Text
          key={file}
          bold={i === active_index}
          color={i === active_index ? THEME.foreground : THEME.mutedForeground}
          underline={i === active_index}>
          {file}
        </Text>
      ))}
    </Box>
  )
})
