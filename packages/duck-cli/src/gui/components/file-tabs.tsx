import { Box, Text } from 'ink'
import { memo } from 'react'
import { THEME } from '../app.constants'

type FileTabsProps = {
  files: string[]
  activeIndex: number
}

/** Horizontal file tab bar with the active file shown bold and underlined. */
export const FileTabs = memo(function FileTabs({ files, activeIndex }: FileTabsProps) {
  if (files.length <= 1) return null

  return (
    <Box gap={1}>
      <Text color={THEME.mutedForeground}>Files:</Text>
      {files.map((file, i) => (
        <Text
          key={file}
          bold={i === activeIndex}
          color={i === activeIndex ? THEME.foreground : THEME.mutedForeground}
          underline={i === activeIndex}>
          {file}
        </Text>
      ))}
    </Box>
  )
})
