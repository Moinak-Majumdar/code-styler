'use client'

import { IconCSS, IconHTML } from '@/components/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { autocompletion } from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { less } from '@codemirror/lang-less';
import { andromeda } from '@uiw/codemirror-theme-andromeda';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { Eye } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import Display from './components/Display';
import EditorControls from './components/EditorControls';


export default function Home() {

    const [htmlContent, setHtmlContent] = useState<string>("")
    const [cssContent, setCssContent] = useState<string>("")

    const { resolvedTheme } = useTheme()

    return (
        <main className="flex">
            <section className='w-full'>
                <Tabs defaultValue="html" className='max-w-[100vw]'>
                    <TabsList className="grid w-full grid-cols-3 h-fit">
                        <TabsTrigger value="html"><IconHTML size={24} /></TabsTrigger>
                        <TabsTrigger value="css"><IconCSS size={24} /></TabsTrigger>
                        <TabsTrigger value="view"><Eye className='text-primary' /></TabsTrigger>
                    </TabsList>
                    <TabsContent value="html">
                        <CodeMirror
                            value={htmlContent}
                            extensions={extension1}
                            theme={resolvedTheme === 'dark' ? andromeda : xcodeLight}
                            onChange={(value: string, viewUpdate: ViewUpdate) => setHtmlContent(value)}
                            height="80vh"
                            width='full'
                            className="w-full"
                        />
                    </TabsContent>
                    <TabsContent value="css">
                        <CodeMirror
                            value={cssContent}
                            extensions={extension2}
                            theme={resolvedTheme === 'dark' ? andromeda : xcodeLight}
                            onChange={(value: string, viewUpdate: ViewUpdate) => setCssContent(value)}
                            height="80vh"
                            width='full'
                            className="w-full"
                        />
                    </TabsContent>
                    <TabsContent value="view">
                        <div className='min-h-[80vh] w-full'>
                            <Display htmlContent={htmlContent} cssContent={cssContent} />
                        </div>
                    </TabsContent>
                    <EditorControls
                        editorContent={{ html: htmlContent, css: cssContent }}
                        setEditorContent={(content) => {
                            setHtmlContent(content.html)
                            setCssContent(content.css)
                        }}
                    />
                </Tabs>
            </section>
        </main>
    );
}

const extension1 = [
    html({
        autoCloseTags: true,
        matchClosingTags: true,
        selfClosingTags: true
    }),
    autocompletion()
]

const extension2 = [
    css(),
    less(),
    autocompletion(),
]