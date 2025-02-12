// import React from 'react'
// import { Button, TooltipProvider } from '@/registry/default/ui'
// import { Inbox } from 'lucide-react'
// import { useAtom } from 'jotai'
// import { buttonVarieties } from '@/hooks/use-varieties'

export default function ButtonSimpleDemo() {
  // //NOTE: that's a state in the example
  // const [variety] = useAtom(buttonVarieties)
  // //NOTE: you will use your own variables not this state in the example
  // const { size, open, label, variant, title, loading } = variety.default.variety!
  //
  return (
    <>
      <Page />
    </>
  )

  // <TooltipProvider>
  //   <Button
  //     isCollapsed={open}
  //     icon={{
  //       children: Inbox,
  //     }}
  //     title={title}
  //     variant={variant}
  //     size={size}
  //     loading={loading}
  //     label={{
  //       children: label,
  //     }}
  //   />
  // </TooltipProvider>
}

import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import React from 'react'
import { Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { codeToHast } from 'shiki/bundle/web'

async function highlight(code: string) {
  const out = await codeToHast(code, {
    lang: 'ts',
    theme: 'catppuccin-macchiato',
  })

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  })
}

function CodeBlock({ initial }: { initial?: JSX.Element }) {
  const [nodes, setNodes] = React.useState(initial)

  React.useLayoutEffect(() => {
    void highlight('console.log("Rendered on client")').then(setNodes)
  }, [])

  return nodes ?? <p>Loading...</p>
}

async function Page() {
  // `initial` is optional.
  return (
    <main>
      <CodeBlock />
    </main>
  )
}
