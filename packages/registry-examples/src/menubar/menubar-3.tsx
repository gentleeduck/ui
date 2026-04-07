'use client'

import {
  Menubar,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MotionMenubarContent,
  MotionMenubarMenu,
} from '@gentleduck/registry-ui/menubar'

export default function Demo() {
  return (
    <Menubar>
      <MotionMenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MotionMenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MotionMenubarContent>
      </MotionMenubarMenu>
      <MotionMenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MotionMenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MotionMenubarContent>
      </MotionMenubarMenu>
    </Menubar>
  )
}
