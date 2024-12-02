'use client'

import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { html } from '@codemirror/lang-html';
import { dracula } from '@uiw/codemirror-theme-dracula';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { useState } from "react";
import Display from './components/Display';
import EditorControls from './components/EditorControls';

const extension = [
  html({
    autoCloseTags: true,
    selfClosingTags: true,
    matchClosingTags: true,
  })
]


export default function Home() {

  const [drawerOpen, toggleDrawerOpen] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  

  return (
    <main className="flex">
      <section>
        <CodeMirror
          value={htmlContent}
          extensions={extension}
          theme={dracula}
          onChange={(value: string, viewUpdate: ViewUpdate) => setHtmlContent(value)}
          height="85vh"
          width='100vw'
          className=""
        />
        <EditorControls
          onSave={() => {}}
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