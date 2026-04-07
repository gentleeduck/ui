'use client'

import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MotionMenubarContent,
  MotionMenubarItem,
} from '@gentleduck/registry-ui/menubar'

export default function Demo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MotionMenubarContent>
          <MotionMenubarItem index={0}>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MotionMenubarItem>
          <MotionMenubarItem index={1}>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MotionMenubarItem>
          <MotionMenubarItem index={2} disabled>
            New Incognito Window
          </MotionMenubarItem>
          <MenubarSeparator />
          <MotionMenubarItem index={3}>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </MotionMenubarItem>
        </MotionMenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MotionMenubarContent>
          <MotionMenubarItem index={0}>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MotionMenubarItem>
          <MotionMenubarItem index={1}>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MotionMenubarItem>
          <MenubarSeparator />
          <MotionMenubarItem index={2}>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MotionMenubarItem>
          <MotionMenubarItem index={3}>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MotionMenubarItem>
          <MotionMenubarItem index={4}>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MotionMenubarItem>
        </MotionMenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
