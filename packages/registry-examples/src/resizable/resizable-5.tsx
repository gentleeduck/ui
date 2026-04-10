import {
  MotionResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@gentleduck/registry-ui/resizable'

export default function Demo() {
  return (
    <MotionResizablePanelGroup className="max-w-md rounded-lg border md:min-w-[450px]" orientation="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </MotionResizablePanelGroup>
  )
}
