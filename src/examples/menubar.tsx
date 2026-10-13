import * as React from 'react';
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';

export default function MenubarDemo() {
  const [grid, setGrid] = React.useState(true);
  const [autosave, setAutosave] = React.useState(false);
  return (
    <div className="flex min-h-64 w-full justify-center">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New file <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
            <MenubarItem>Open <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem checked={autosave} onCheckedChange={setAutosave}>Autosave</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem destructive>Delete project</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
            <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={grid} onCheckedChange={setGrid}>Show grid</MenubarCheckboxItem>
            <MenubarItem>Zoom in <MenubarShortcut>⌘+</MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
