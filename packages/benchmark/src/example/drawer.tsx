'use client'

import { Drawer } from '@gentleduck/registry-ui-duckui/experimental/drawer'
// @ts-nocheck

export default function DrawerExample() {
  return (
    <div>
      <Drawer.Root>
        <Drawer.Trigger variant={'outline'} className='rounded-full'>
          Open Drawer
        </Drawer.Trigger>
        <Drawer.Content className='flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none'>
          <div className='p-4 bg-white rounded-t-[10px] flex-1'>
            <div className='max-w-md mx-auto'>
              <Drawer.Title className='font-medium mb-4 text-gray-900'>
                Drawer for React.
              </Drawer.Title>
              <p className='text-gray-600 mb-2'>
                This component can be used as a Dialog replacement on mobile and
                tablet devices.
              </p>
              <p className='text-gray-600 mb-2'>
                This is a simple example of how to use the drawer component.
              </p>
            </div>
          </div>
          <div className='p-4 bg-gray-100 border-t border-gray-200 mt-auto'>
            <div className='flex gap-6 justify-end max-w-md mx-auto'>
              <Drawer.Close
                className='text-xs text-gray-600 flex items-center gap-0.25'
                variant={'nothing'}
              >
                Close
              </Drawer.Close>
            </div>

            <Drawer.Root>
              <Drawer.Trigger variant={'outline'} className='rounded-full'>
                Open Drawer
              </Drawer.Trigger>
              <Drawer.Content className='flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none'>
                <div className='p-4 bg-white rounded-t-[10px] flex-1'>
                  <div className='max-w-md mx-auto'>
                    <Drawer.Title className='font-medium mb-4 text-gray-900'>
                      Drawer for React.
                    </Drawer.Title>
                  </div>
                </div>
                <div className='p-4 bg-gray-100 border-t border-gray-200 mt-auto'>
                  <div className='flex gap-6 justify-end max-w-md mx-auto'>
                    <Drawer.Close
                      className='text-xs text-gray-600 flex items-center gap-0.25'
                      variant={'nothing'}
                    >
                      Close
                    </Drawer.Close>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Root>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  )
}