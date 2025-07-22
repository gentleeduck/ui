// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import React from 'react'

export default function TooltipDemo() {
  // const [open, setOpen] = React.useState(false)
  //
  // React.useEffect(() => {
  //   document.addEventListener('scroll', () => {
  //     setOpen(!open)
  //   })
  //
  //   return () => {
  //     document.removeEventListener('scroll', () => {
  //       setOpen(!open)
  //     })
  //   }
  // }, [])

  return (
    <div className="h-[2000px] mt-[400px]">
      <Tooltip>
        <TooltipTrigger className="bg-transparent p-0 shadow-none rounded-border">
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent placement={'left'}>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </div>
    // <TooltipProvider delayDuration={0}>
    // </TooltipProvider>
  )
}
