'use client'

import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { html } from '@codemirror/lang-html';
import { andromeda } from '@uiw/codemirror-theme-andromeda';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useState } from "react";
import Display from './components/Display';
import EditorControls from './components/EditorControls';


const extension = [
  html({
    autoCloseTags: true,
    matchClosingTags: true,
    selfClosingTags: true
  })
]


export default function Home() {

  const [drawerOpen, toggleDrawerOpen] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>('');

  const { resolvedTheme } = useTheme()

  return (
    <main className="flex">
      <section className='w-full'>
        <CodeMirror
          value={htmlContent}
          extensions={extension}
          theme={resolvedTheme === 'dark' ? andromeda : xcodeLight}
          onChange={(value: string, viewUpdate: ViewUpdate) => setHtmlContent(value)}
          height="85vh"
          width='100vw'
          className="w-full"
        />
        <EditorControls
          onSave={() => { }}
          onView={() => toggleDrawerOpen(true)}
          editorContent={htmlContent}
          setEditorContent={setHtmlContent}
        />
      </section>
      <Drawer open={drawerOpen} onClose={() => toggleDrawerOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>View content</DrawerTitle>
            <DrawerDescription>Make it beautiful</DrawerDescription>
          </DrawerHeader>
          <div className='p-4'>
            <Display htmlContent={htmlContent} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}