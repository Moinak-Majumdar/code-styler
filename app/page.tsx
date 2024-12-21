'use client'

import { IconCSS, IconHTML } from '@/components/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCssContent, setHtmlContent } from '@/redux/slice/content';
import { getEditorTheme } from '@/utils/ThemeList';
import { autocompletion } from '@codemirror/autocomplete';
import { css as cssLang } from '@codemirror/lang-css';
import { html as htmlLang } from '@codemirror/lang-html';
import { less as lessLang } from '@codemirror/lang-less';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { Eye } from 'lucide-react';
import { useTheme } from 'next-themes';
import Display from './components/Display';
import EditorControls from './components/EditorControls';



export default function Home() {

    const dispatch = useAppDispatch()
    const { css, html } = useAppSelector((state) => state.contentSlice)
    const { selectedTheme } = useAppSelector((state) => state.editorThemeSlice)

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
                            value={html}
                            extensions={extension1}
                            theme={getEditorTheme(resolvedTheme ?? 'light', selectedTheme?.label)}
                            onChange={(value: string, viewUpdate: ViewUpdate) => dispatch(setHtmlContent(value))}
                            height="76vh"
                            width='full'
                            className="w-full"
                        />
                    </TabsContent>
                    <TabsContent value="css">
                        <CodeMirror
                            value={css}
                            extensions={extension2}
                            theme={getEditorTheme(resolvedTheme ?? 'light', selectedTheme?.label)}
                            onChange={(value: string, viewUpdate: ViewUpdate) => dispatch(setCssContent(value))}
                            height="76vh"
                            width='full'
                            className="w-full"
                        />
                    </TabsContent>
                    <TabsContent value="view">
                        <div className='h-[76vh] w-full overflow-y-auto'>
                            <Display htmlContent={html} cssContent={css} />
                        </div>
                    </TabsContent>
                    <EditorControls />
                </Tabs>
            </section>
        </main>
    );
}

const extension1 = [
    htmlLang({
        autoCloseTags: true,
        matchClosingTags: true,
        selfClosingTags: true
    }),
    autocompletion()
]

const extension2 = [
    cssLang(),
    lessLang(),
    autocompletion(),
]