// @ts-nocheck
// FIX:
'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  NestedDrawerProvider,
} from '@gentleduck/registry-ui-duckui/drawer'

export default function DrawerExample() {
  return (
    <div>
      <Drawer>
        <DrawerTrigger className="rounded-full" variant={'outline'}>
          Open Drawer
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="max-w-md mx-auto">
              <DrawerTitle className="font-medium mb-4 text-gray-900">Drawer for React.</DrawerTitle>
              <p className="text-gray-600 mb-2">
                This component can be used as a Dialog replacement on mobile and tablet devices.
              </p>
              <p className="text-gray-600 mb-2">This is a simple example of how to use the drawer component.</p>
            </div>
          </div>
          <div className="p-4 bg-gray-100 border-t border-gray-200 mt-auto">
            <div className="flex gap-6 justify-end max-w-md mx-auto">
              <DrawerClose className="text-xs text-gray-600 flex items-center gap-0.25" variant={'nothing'}>
                Close
              </DrawerClose>
            </div>

            <Drawer>
              <NestedDrawerProvider>
                <DrawerTrigger className="rounded-full" variant={'outline'}>
                  Open Drawer
                </DrawerTrigger>
                <DrawerContent>
                  <div className="p-4 bg-white rounded-t-[10px] flex-1">
                    <div className="max-w-md mx-auto">
                      <DrawerTitle className="font-medium mb-4 text-gray-900">Drawer for React.</DrawerTitle>
                      <p className="text-gray-600 mb-2">
                        This component can be used as a Dialog replacement on mobile and tablet devices.
                      </p>
                      <p className="text-gray-600 mb-2">This is a simple example of how to use the drawer component.</p>
                    </div>
                  </div>
                </DrawerContent>
              </NestedDrawerProvider>
            </Drawer>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
