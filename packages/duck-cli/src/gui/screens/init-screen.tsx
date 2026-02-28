import React, { useContext, useEffect, useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { ConfirmInput, MultiSelect, Select, Spinner, StatusMessage, TextInput } from '@inkjs/ui'
import { Banner } from '../components/banner'
import { StatusLine } from '../components/status-line'
import { StepIndicator } from '../components/step-indicator'
import { THEME } from '../app.constants'
import { VimContext } from '../app'
import { useAsyncTask } from '../hooks/use-async-task'
import { useRegistry } from '../hooks/use-registry'
import { BASE_COLORS, PROJECT_TYPE } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.constants'
import {
  check_typescript_installed,
  run_install_typescript,
  check_tailwind_installed,
  run_install_tailwindcss,
  check_duckui_config_exists,
  run_init_duckui_config,
  read_duckui_config,
  read_ts_config,
} from '../services/preflight.service'
import { fetch_components } from '../services/registry.service'
import { install_components, install_npm_deps, resolve_install_path } from '../services/install.service'
import type { DuckuiPrompts } from '~/utils/preflight-configs/preflight-duckui/preflight-duckui.dto'

type InitStep =
  | 'check-ts'
  | 'prompt-ts'
  | 'install-ts'
  | 'check-tailwind'
  | 'prompt-tailwind'
  | 'config-tailwind'
  | 'install-tailwind'
  | 'check-duckui'
  | 'prompt-duckui'
  | 'config-duckui-project'
  | 'config-duckui-color'
  | 'config-duckui-alias'
  | 'config-duckui-monorepo'
  | 'config-duckui-css'
  | 'config-duckui-cssvars'
  | 'config-duckui-prefix'
  | 'install-duckui'
  | 'prompt-components'
  | 'select-components'
  | 'install-components'
  | 'done'
  | 'error'

const TOTAL_PHASES = 5

function getPhase(step: InitStep): number {
  if (step.startsWith('check-ts') || step.startsWith('prompt-ts') || step.startsWith('install-ts')) return 1
  if (step.startsWith('check-tailwind') || step.startsWith('prompt-tailwind') || step.includes('tailwind')) return 2
  if (step.startsWith('check-duckui') || step.startsWith('prompt-duckui') || step.includes('duckui')) return 3
  if (step.startsWith('prompt-components') || step.startsWith('select-components')) return 4
  if (step.startsWith('install-components') || step === 'done') return 5
  return 1
}

function getPhaseLabel(phase: number): string {
  switch (phase) {
    case 1:
      return 'TypeScript'
    case 2:
      return 'TailwindCSS'
    case 3:
      return 'Duck UI Config'
    case 4:
      return 'Component Selection'
    case 5:
      return 'Installation'
    default:
      return ''
  }
}

export function InitScreen({ onBack }: { onBack: () => void }) {
  const cwd = process.cwd()
  const [step, setStep] = useState<InitStep>('check-ts')
  const [statusMessages, setStatusMessages] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [projectType, setProjectType] = useState('')
  const [cssPath, setCssPath] = useState('./src/styles.css')
  const [duckuiConfig, setDuckuiConfig] = useState<Partial<DuckuiPrompts>>({})
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const { index, fetch } = useRegistry()
  const task = useAsyncTask<void>()

  const { setEnabled: setVimEnabled } = useContext(VimContext)

  const addStatus = (msg: string) => setStatusMessages((prev) => [...prev, msg])

  // Disable vim j/k mapping when text input fields are active
  const TEXT_INPUT_STEPS: InitStep[] = ['config-duckui-alias', 'config-duckui-css', 'config-duckui-prefix']
  useEffect(() => {
    setVimEnabled(!TEXT_INPUT_STEPS.includes(step))
  }, [step])

  useEffect(() => {
    if (step === 'check-ts') {
      check_typescript_installed(cwd).then((installed) => {
        if (installed) {
          addStatus('TypeScript: already installed')
          setStep('check-tailwind')
        } else {
          setStep('prompt-ts')
        }
      })
    }
  }, [step])

  useEffect(() => {
    if (step === 'check-tailwind') {
      check_tailwind_installed(cwd).then((installed) => {
        if (installed) {
          addStatus('TailwindCSS: already installed')
          setStep('check-duckui')
        } else {
          setStep('prompt-tailwind')
        }
      })
    }
  }, [step])

  useEffect(() => {
    if (step === 'check-duckui') {
      const exists = check_duckui_config_exists(cwd)
      if (exists) {
        addStatus('Duck UI config: found')
        setStep('prompt-components')
      } else {
        setStep('prompt-duckui')
      }
    }
  }, [step])

  useEffect(() => {
    if (step === 'prompt-components') {
      fetch()
    }
  }, [step])

  useInput((input, key) => {
    if (key.escape && (step === 'done' || step === 'error')) {
      onBack()
    }
  })

  const runInstallTs = async () => {
    setStep('install-ts')
    const result = await run_install_typescript(cwd, projectType || undefined, (msg) => addStatus(msg))
    if (result.ok) {
      addStatus('TypeScript: installed')
      setStep('check-tailwind')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  const runInstallTailwind = async () => {
    setStep('install-tailwind')
    const result = await run_install_tailwindcss(cwd, projectType, cssPath, (msg) => addStatus(msg))
    if (result.ok) {
      addStatus('TailwindCSS: installed')
      setStep('check-duckui')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  const runInstallDuckui = async () => {
    setStep('install-duckui')
    const config = duckuiConfig as DuckuiPrompts
    const result = await run_init_duckui_config(cwd, config, (msg) => addStatus(msg))
    if (result.ok) {
      addStatus('Duck UI config: created')
      setStep('prompt-components')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  const runInstallComponents = async () => {
    setStep('install-components')
    const result = await task.run(async (onProgress) => {
      const fetchResult = await fetch_components(selectedComponents, onProgress)
      if (!fetchResult.ok) return fetchResult

      const configResult = await read_duckui_config(cwd)
      if (!configResult.ok) return configResult

      const tsResult = await read_ts_config(cwd)
      if (!tsResult.ok) return tsResult

      const pathResult = resolve_install_path(configResult.data, tsResult.data)
      if (!pathResult.ok) return pathResult

      onProgress('Installing components...')
      const installResult = await install_components(fetchResult.data, configResult.data, pathResult.data, true, onProgress)
      if (!installResult.ok) return installResult

      onProgress('Installing npm dependencies...')
      return install_npm_deps(installResult.data.dependencies, installResult.data.devDependencies, cwd, onProgress)
    })

    if (result.ok) {
      setStep('done')
    } else {
      setErrorMessage(result.error)
      setStep('error')
    }
  }

  const phase = getPhase(step)
  const phaseLabel = getPhaseLabel(phase)

  // Render recent status messages (last 3)
  const recentStatus = statusMessages.slice(-3)

  return (
    <Box flexDirection="column">
      <Banner compact />
      {step !== 'done' && step !== 'error' ? <StepIndicator current={phase} total={TOTAL_PHASES} label={phaseLabel} /> : null}

      {/* Status history */}
      {recentStatus.length > 0 ? (
        <Box flexDirection="column" marginTop={1}>
          {recentStatus.map((msg, i) => (
            <Text key={i} color={THEME.mutedForeground}>
              {msg}
            </Text>
          ))}
        </Box>
      ) : null}

      <Box marginTop={1} flexDirection="column">
        {/* TypeScript prompts */}
        {step === 'prompt-ts' ? (
          <Box flexDirection="column">
            <Text>TypeScript is not installed. Install it?</Text>
            <ConfirmInput
              onConfirm={(yes) => {
                if (yes) runInstallTs()
                else {
                  addStatus('TypeScript: skipped')
                  setStep('check-tailwind')
                }
              }}
            />
          </Box>
        ) : null}

        {step === 'install-ts' ? <Spinner label="Installing TypeScript..." /> : null}

        {/* TailwindCSS prompts */}
        {step === 'prompt-tailwind' ? (
          <Box flexDirection="column">
            <Text>TailwindCSS is not installed. Install it?</Text>
            <ConfirmInput
              onConfirm={(yes) => {
                if (yes) setStep('config-tailwind')
                else {
                  addStatus('TailwindCSS: skipped')
                  setStep('check-duckui')
                }
              }}
            />
          </Box>
        ) : null}

        {step === 'config-tailwind' ? (
          <Box flexDirection="column">
            <Text>Select your project type:</Text>
            <Select
              options={PROJECT_TYPE.map((p) => ({ label: p, value: p }))}
              onChange={(value) => {
                setProjectType(value)
                setCssPath('./src/styles.css')
                runInstallTailwind()
              }}
            />
          </Box>
        ) : null}

        {step === 'install-tailwind' ? <Spinner label="Installing TailwindCSS..." /> : null}

        {/* Duck-UI config prompts */}
        {step === 'prompt-duckui' ? (
          <Box flexDirection="column">
            <Text>Duck UI config not found. Create it?</Text>
            <ConfirmInput
              onConfirm={(yes) => {
                if (yes) setStep('config-duckui-project')
                else {
                  addStatus('Duck UI config: skipped')
                  setStep('prompt-components')
                }
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-project' ? (
          <Box flexDirection="column">
            <Text>Select your project type:</Text>
            <Select
              options={PROJECT_TYPE.map((p) => ({ label: p, value: p }))}
              onChange={(value) => {
                setDuckuiConfig((prev) => ({ ...prev, project_type: value as any }))
                setProjectType(value)
                setStep('config-duckui-color')
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-color' ? (
          <Box flexDirection="column">
            <Text>Select a base color:</Text>
            <Select
              options={BASE_COLORS.map((c) => ({ label: c, value: c }))}
              onChange={(value) => {
                setDuckuiConfig((prev) => ({ ...prev, base_color: value as any }))
                setStep('config-duckui-alias')
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-alias' ? (
          <Box flexDirection="column">
            <Text>Import alias (default: ~):</Text>
            <TextInput
              defaultValue="~"
              onSubmit={(value) => {
                setDuckuiConfig((prev) => ({ ...prev, alias: value || '~' }))
                setStep('config-duckui-monorepo')
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-monorepo' ? (
          <Box flexDirection="column">
            <Text>Is this a monorepo?</Text>
            <ConfirmInput
              onConfirm={(yes) => {
                setDuckuiConfig((prev) => ({ ...prev, monorepo: yes }))
                setStep('config-duckui-css')
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-css' ? (
          <Box flexDirection="column">
            <Text>CSS file path (default: ./src/styles.css):</Text>
            <TextInput
              defaultValue="./src/styles.css"
              onSubmit={(value) => {
                setDuckuiConfig((prev) => ({ ...prev, css: value || './src/styles.css' }))
                setStep('config-duckui-cssvars')
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-cssvars' ? (
          <Box flexDirection="column">
            <Text>Use CSS variables?</Text>
            <ConfirmInput
              defaultChoice="confirm"
              onConfirm={(yes) => {
                setDuckuiConfig((prev) => ({ ...prev, css_variables: yes }))
                setStep('config-duckui-prefix')
              }}
            />
          </Box>
        ) : null}

        {step === 'config-duckui-prefix' ? (
          <Box flexDirection="column">
            <Text>Tailwind prefix (Enter for none):</Text>
            <TextInput
              defaultValue=""
              onSubmit={(value) => {
                setDuckuiConfig((prev) => ({ ...prev, prefix: value }))
                runInstallDuckui()
              }}
            />
          </Box>
        ) : null}

        {step === 'install-duckui' ? <Spinner label="Creating Duck UI config..." /> : null}

        {/* Component selection */}
        {step === 'prompt-components' ? (
          <Box flexDirection="column">
            <Text>Would you like to install components?</Text>
            <ConfirmInput
              onConfirm={(yes) => {
                if (yes) {
                  fetch()
                  setStep('select-components')
                } else {
                  setStep('done')
                }
              }}
            />
          </Box>
        ) : null}

        {step === 'select-components' ? (
          <Box flexDirection="column">
            {!index ? (
              <Spinner label="Fetching component list..." />
            ) : (
              <>
                <Text>Select components to install:</Text>
                <MultiSelect
                  options={index.filter((c) => c.type === 'registry:ui').map((c) => ({ label: c.name, value: c.name }))}
                  onSubmit={(values) => {
                    if (values.length === 0) {
                      setStep('done')
                    } else {
                      setSelectedComponents(values)
                      runInstallComponents()
                    }
                  }}
                />
              </>
            )}
          </Box>
        ) : null}

        {step === 'install-components' ? (
          <Spinner label={task.state.status === 'loading' ? task.state.message : 'Installing components...'} />
        ) : null}

        {/* Done / Error */}
        {step === 'done' ? <StatusMessage variant="success">Done. Project initialized successfully.</StatusMessage> : null}

        {step === 'error' ? <StatusMessage variant="error">Error: {errorMessage}</StatusMessage> : null}
      </Box>

      {step === 'done' || step === 'error' ? <StatusLine items={[{ key: 'esc', label: 'back to menu' }]} /> : null}
    </Box>
  )
}
