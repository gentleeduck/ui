import { Spinner } from '@inkjs/ui'
import { Box, Text, useInput } from 'ink'
import React, { useContext, useEffect, useState } from 'react'
import { TerminalSizeContext } from '../app'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { StatusLine } from '../components/status-line'
import { useRegistry } from '../hooks/use-registry'

const TYPE_FILTERS = ['all', 'ui', 'block', 'example'] as const
type TypeFilter = (typeof TYPE_FILTERS)[number]

// Chrome overhead: border(2) + paddingY(2) + banner(2) + filterTabs(2) + listMargin(1) + showingLine(1) + statusLine(2) = 12
const LIST_CHROME = 12

export function ListScreen({ onBack }: { onBack: () => void }) {
  const { index, loading, error, fetch } = useRegistry()
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [scrollOffset, setScrollOffset] = useState(0)
  const { rows } = useContext(TerminalSizeContext)
  const visibleRows = Math.max(3, rows - LIST_CHROME)

  useEffect(() => {
    fetch()
  }, [])

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onBack()
      return
    }

    if (key.tab || input === 'l') {
      const current = TYPE_FILTERS.indexOf(typeFilter)
      const next = (current + 1) % TYPE_FILTERS.length
      setTypeFilter(TYPE_FILTERS[next])
      setScrollOffset(0)
      return
    }

    if (input === 'h') {
      const current = TYPE_FILTERS.indexOf(typeFilter)
      const prev = (current - 1 + TYPE_FILTERS.length) % TYPE_FILTERS.length
      setTypeFilter(TYPE_FILTERS[prev])
      setScrollOffset(0)
      return
    }

    if (key.upArrow) {
      setScrollOffset((prev) => Math.max(0, prev - 1))
    }
    if (key.downArrow) {
      setScrollOffset((prev) => prev + 1)
    }
  })

  if (loading) {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <Box marginTop={1}>
          <Spinner label="Fetching registry..." />
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <Box marginTop={1}>
          <Text color={THEME.destructive}>Error: {error}</Text>
        </Box>
        <StatusLine items={[{ key: 'esc', label: 'back' }]} />
      </Box>
    )
  }

  const filtered = !index ? [] : typeFilter === 'all' ? index : index.filter((c) => c.type === `registry:${typeFilter}`)

  const maxOffset = Math.max(0, filtered.length - visibleRows)
  const clampedOffset = Math.min(scrollOffset, maxOffset)
  const visible = filtered.slice(clampedOffset, clampedOffset + visibleRows)

  return (
    <Box flexDirection="column">
      <Banner compact />

      <Box marginTop={1} gap={1}>
        <Text bold color={THEME.foreground}>
          Components ({filtered.length})
        </Text>
        <Text color={THEME.ring}>|</Text>
        {TYPE_FILTERS.map((t) => (
          <Text key={t} bold={t === typeFilter} color={t === typeFilter ? THEME.foreground : THEME.mutedForeground}>
            [{t}]
          </Text>
        ))}
      </Box>

      <Box flexDirection="column" marginTop={1}>
        {visible.map((component) => {
          const type = component.type.split(':').pop()
          return (
            <Box key={component.name} gap={1}>
              <Text color={THEME.foreground}>{component.name.padEnd(25)}</Text>
              <Text color={THEME.mutedForeground}>[{type}]</Text>
              {component.description ? <Text color={THEME.surfaceForeground}> {component.description}</Text> : null}
            </Box>
          )
        })}
      </Box>

      {filtered.length > visibleRows ? (
        <Text color={THEME.mutedForeground}>
          Showing {clampedOffset + 1}-{Math.min(clampedOffset + visibleRows, filtered.length)} of {filtered.length}
        </Text>
      ) : null}

      <StatusLine
        items={[
          { key: 'j/k', label: 'scroll' },
          { key: 'h/l', label: 'filter' },
          { key: 'esc', label: 'back' },
        ]}
      />
    </Box>
  )
}
