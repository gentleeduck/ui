import { ConfirmInput, Select, Spinner, StatusMessage } from '@inkjs/ui'
import { Box, Text, useInput } from 'ink'
import React, { useContext, useEffect, useState } from 'react'
import { TerminalSizeContext, VimContext } from '../app'
import { THEME } from '../app.constants'
import { Banner } from '../components/banner'
import { StatusLine } from '../components/status-line'
import { StepIndicator } from '../components/step-indicator'
import { useAsyncTask } from '../hooks/use-async-task'
import { useRegistry } from '../hooks/use-registry'
import { install_components, install_npm_deps, resolve_install_path } from '../services/install.service'
import { read_duckui_config, read_ts_config } from '../services/preflight.service'
import { fetch_components } from '../services/registry.service'

type Step = 'loading' | 'groups' | 'browse' | 'confirm' | 'installing' | 'done' | 'error'

const COMPONENT_GROUPS = [
  { type: 'registry:ui', label: 'UI' },
  { type: 'registry:block', label: 'Block' },
  { type: 'registry:example', label: 'Example' },
  { type: 'registry:component', label: 'Component' },
  { type: 'registry:page', label: 'Page' },
] as const

// Chrome overhead: border(2) + paddingY(2) + banner(2) + step(1) + header(2) + search(2) + listMargin(1) + showingLine(1) + statusLine(2) = 15
const BROWSE_CHROME = 15

export function AddScreen({ onBack }: { onBack: () => void }) {
  const { index, loading, error: registryError, fetch } = useRegistry()
  const [step, setStep] = useState<Step>('loading')
  const [activeGroup, setActiveGroup] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [cursor, setCursor] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const installTask = useAsyncTask<void>()
  const { setEnabled: setVimEnabled } = useContext(VimContext)
  const { rows } = useContext(TerminalSizeContext)
  const visibleRows = Math.max(3, rows - BROWSE_CHROME)

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (index && step === 'loading') {
      setStep('groups')
    }
  }, [index, step])

  // Disable vim j/k during browse (so letters type into search)
  useEffect(() => {
    setVimEnabled(step !== 'browse')
  }, [step])

  // Re-enable vim on unmount
  useEffect(() => {
    return () => setVimEnabled(true)
  }, [])

  // Components for the active group
  const groupComponents = index?.filter((c) => c.type === activeGroup) ?? []
  const filtered = search
    ? groupComponents.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : groupComponents

  // Clamp cursor when filtered list changes
  useEffect(() => {
    if (filtered.length === 0) {
      setCursor(0)
      setScrollOffset(0)
    } else if (cursor >= filtered.length) {
      setCursor(filtered.length - 1)
    }
  }, [filtered.length])

  // Keep cursor in visible window
  useEffect(() => {
    if (cursor < scrollOffset) setScrollOffset(cursor)
    if (cursor >= scrollOffset + visibleRows) setScrollOffset(cursor - visibleRows + 1)
  }, [cursor])

  const cwd = process.cwd()

  useInput((input, key) => {
    // Browse step -- custom input handling (vim disabled, arrow keys navigate)
    if (step === 'browse') {
      if (key.escape) {
        setSearch('')
        setCursor(0)
        setScrollOffset(0)
        setStep('groups')
        return
      }
      if (key.upArrow) {
        setCursor((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.downArrow) {
        setCursor((prev) => Math.min(filtered.length - 1, prev + 1))
        return
      }
      if (input === ' ' && filtered.length > 0) {
        const name = filtered[cursor]?.name
        if (name) {
          const next = new Set(selected)
          if (next.has(name)) next.delete(name)
          else next.add(name)
          setSelected(next)
        }
        return
      }
      if (key.return) {
        setSearch('')
        setCursor(0)
        setScrollOffset(0)
        setStep('groups')
        return
      }
      if (key.backspace || key.delete) {
        setSearch((prev) => prev.slice(0, -1))
        setCursor(0)
        setScrollOffset(0)
        return
      }
      // Ctrl+A: select all / deselect all filtered items
      if (key.ctrl && input === 'a') {
        const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.name))
        const next = new Set(selected)
        if (allSelected) {
          filtered.forEach((c) => next.delete(c.name))
        } else {
          filtered.forEach((c) => next.add(c.name))
        }
        setSelected(next)
        return
      }
      // Printable characters go to search filter (except space)
      if (input && input.length === 1 && input > ' ' && !key.ctrl && !key.meta) {
        setSearch((prev) => prev + input)
        setCursor(0)
        setScrollOffset(0)
        return
      }
      return
    }

    // Groups step
    if (step === 'groups') {
      if (key.escape) {
        onBack()
        return
      }
    }

    // Done / error
    if (step === 'done' || step === 'error') {
      if (key.escape) {
        onBack()
        return
      }
    }
  })

  const handleConfirm = async (confirmed: boolean) => {
    if (!confirmed) {
      setStep('groups')
      return
    }

    setStep('installing')
    const componentNames = Array.from(selected)

    const result = await installTask.run(async (onProgress) => {
      onProgress('Fetching selected components...')
      const fetchResult = await fetch_components(componentNames, onProgress)
      if (!fetchResult.ok) return fetchResult

      onProgress('Reading project config...')
      const configResult = await read_duckui_config(cwd)
      if (!configResult.ok) return configResult

      const tsResult = await read_ts_config(cwd)
      if (!tsResult.ok) return tsResult

      const pathResult = resolve_install_path(configResult.data, tsResult.data)
      if (!pathResult.ok) return pathResult

      onProgress('Installing components...')
      const installResult = await install_components(
        fetchResult.data,
        configResult.data,
        pathResult.data,
        true,
        onProgress,
      )
      if (!installResult.ok) return installResult

      onProgress('Installing npm dependencies...')
      return install_npm_deps(installResult.data.dependencies, installResult.data.devDependencies, cwd, onProgress)
    })

    if (result.ok) {
      setStatusMessage(
        `Successfully installed ${componentNames.length} component${componentNames.length > 1 ? 's' : ''}.`,
      )
      setStep('done')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  // --- Render ---

  if (loading || step === 'loading') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <Box marginTop={1}>
          <Spinner label="Fetching registry..." />
        </Box>
      </Box>
    )
  }

  if (registryError) {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <StatusMessage variant="error">{registryError}</StatusMessage>
        <StatusLine items={[{ key: 'esc', label: 'back' }]} />
      </Box>
    )
  }

  if (step === 'groups') {
    const groupOptions = COMPONENT_GROUPS.map((g) => {
      const count = index?.filter((c) => c.type === g.type).length ?? 0
      const selectedCount = index?.filter((c) => c.type === g.type && selected.has(c.name)).length ?? 0
      const suffix = selectedCount > 0 ? ` -- ${selectedCount} selected` : ''
      return { label: `${g.label} (${count})${suffix}`, value: g.type, count }
    }).filter((g) => g.count > 0)

    if (selected.size > 0) {
      groupOptions.push({
        label: `>>> Install ${selected.size} component${selected.size > 1 ? 's' : ''} <<<`,
        value: '__install__',
        count: 0,
      })
    }

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={1} total={3} label="Select components" />
        <Box marginTop={1} flexDirection="column">
          <Text>Select a component category:</Text>
          <Select
            options={groupOptions.map((g) => ({ label: g.label, value: g.value }))}
            onChange={(value) => {
              if (value === '__install__') {
                setStep('confirm')
              } else {
                setActiveGroup(value)
                setSearch('')
                setCursor(0)
                setScrollOffset(0)
                setStep('browse')
              }
            }}
          />
        </Box>
        <StatusLine
          items={[
            { key: 'j/k', label: 'navigate' },
            { key: 'enter', label: 'select' },
            { key: 'esc', label: 'back' },
          ]}
        />
      </Box>
    )
  }

  if (step === 'browse') {
    const groupLabel = COMPONENT_GROUPS.find((g) => g.type === activeGroup)?.label ?? ''
    const selectedInGroup = groupComponents.filter((c) => selected.has(c.name)).length
    const maxScroll = Math.max(0, filtered.length - visibleRows)
    const clampedScroll = Math.min(scrollOffset, maxScroll)
    const visible = filtered.slice(clampedScroll, clampedScroll + visibleRows)

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={1} total={3} label={`${groupLabel} Components`} />

        <Box marginTop={1} gap={2}>
          <Text bold>
            {groupLabel} ({groupComponents.length})
          </Text>
          {selectedInGroup > 0 ? <Text color={THEME.foreground}>{selectedInGroup} selected</Text> : null}
          {selected.size > 0 ? <Text color={THEME.mutedForeground}>{selected.size} total selected</Text> : null}
        </Box>

        <Box marginTop={1}>
          <Text>Search: </Text>
          <Text color={THEME.foreground}>{search}</Text>
          <Text color={THEME.mutedForeground}>_</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          {visible.length === 0 ? (
            <Text color={THEME.mutedForeground}>No components match your search.</Text>
          ) : (
            visible.map((component, i) => {
              const actualIndex = clampedScroll + i
              const isSelected = selected.has(component.name)
              const isCursor = actualIndex === cursor
              return (
                <Box key={component.name} gap={1}>
                  <Text color={isCursor ? THEME.foreground : THEME.surfaceForeground} bold={isCursor}>
                    {isCursor ? '>' : ' '} [{isSelected ? 'x' : ' '}] {component.name}
                  </Text>
                  {component.description ? <Text color={THEME.mutedForeground}>{component.description}</Text> : null}
                </Box>
              )
            })
          )}
        </Box>

        {filtered.length > visibleRows ? (
          <Text color={THEME.mutedForeground}>
            Showing {clampedScroll + 1}-{Math.min(clampedScroll + visibleRows, filtered.length)} of {filtered.length}
          </Text>
        ) : null}

        <StatusLine
          items={[
            { key: 'arrows', label: 'navigate' },
            { key: 'space', label: 'toggle' },
            { key: 'ctrl+a', label: 'all' },
            { key: 'enter/esc', label: 'back' },
          ]}
        />
      </Box>
    )
  }

  if (step === 'confirm') {
    const componentNames = Array.from(selected)

    // Group selected components by type for display
    const grouped = COMPONENT_GROUPS.map((g) => ({
      label: g.label,
      items: index?.filter((c) => c.type === g.type && selected.has(c.name)).map((c) => c.name) ?? [],
    })).filter((g) => g.items.length > 0)

    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={2} total={3} label="Confirm installation" />
        <Box marginTop={1} flexDirection="column">
          <Text>
            Install {componentNames.length} component{componentNames.length > 1 ? 's' : ''}?
          </Text>
          <Box marginTop={1} flexDirection="column">
            {grouped.map((group) => (
              <Box key={group.label} flexDirection="column">
                <Text bold>{group.label}:</Text>
                {group.items.map((name) => (
                  <Text key={name} color={THEME.foreground}>
                    {'  '}- {name}
                  </Text>
                ))}
              </Box>
            ))}
          </Box>
          <Box marginTop={1}>
            <ConfirmInput onConfirm={handleConfirm} />
          </Box>
        </Box>
      </Box>
    )
  }

  if (step === 'installing') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <StepIndicator current={3} total={3} label="Installing" />
        <Box marginTop={1}>
          <Spinner label={installTask.state.status === 'loading' ? installTask.state.message : 'Installing...'} />
        </Box>
      </Box>
    )
  }

  if (step === 'error') {
    return (
      <Box flexDirection="column">
        <Banner compact />
        <StatusMessage variant="error">{errorMessage}</StatusMessage>
        <StatusLine items={[{ key: 'esc', label: 'back' }]} />
      </Box>
    )
  }

  // done
  return (
    <Box flexDirection="column">
      <Banner compact />
      <StatusMessage variant="success">{statusMessage}</StatusMessage>
      <StatusLine items={[{ key: 'esc', label: 'back' }]} />
    </Box>
  )
}
