'use client'

import { IconCSS, IconHTML } from '@/components/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { autocompletion } from '@codemirror/autocomplete';
import { css as cssLang } from '@codemirror/lang-css';
import { html as htmlLang } from '@codemirror/lang-html';
import { less as lessLang } from '@codemirror/lang-less';
import { andromeda } from '@uiw/codemirror-theme-andromeda';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { Eye } from 'lucide-react';
import { useTheme } from 'next-themes';
import Display from './components/Display';
import EditorControls from './components/EditorControls';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setCssContent, setHtmlContent } from './redux/slice/content';
import { useEffect } from 'react';


export default function Home() {

    const dispatch = useAppDispatch()
    const { css, html,token } = useAppSelector((state) => state.contentSlice)

    const { resolvedTheme } = useTheme()


    useEffect(() => {
        console.table([{ html, css, token }])
    }, [html, css, token])

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
                            theme={resolvedTheme === 'dark' ? andromeda : xcodeLight}
                            onChange={(value: string, viewUpdate: ViewUpdate) => dispatch(setHtmlContent(value))}
                            height="78vh"
                            width='full'
                            className="w-full"
                        />
                    </TabsContent>
                    <TabsContent value="css">
                        <CodeMirror
                            value={css}
                            extensions={extension2}
                            theme={resolvedTheme === 'dark' ? andromeda : xcodeLight}
                            onChange={(value: string, viewUpdate: ViewUpdate) => dispatch(setCssContent(value))}
                            height="78vh"
                            width='full'
                            className="w-full"
                        />
                    </TabsContent>
                    <TabsContent value="view">
                        <div className='min-h-[80vh] w-full'>
                            <Display htmlContent={html} cssContent={css} />
                        </div>
                    </TabsContent>
                    <EditorControls/>
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