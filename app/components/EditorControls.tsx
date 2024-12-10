'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, LetterText, ListRestart, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import cssFormatter from '../utils/CssFormatter'
import htmlFormatter from '../utils/HtmlFormatter'
import ContentProps from '../utils/Interface/ContentProps'
import Display from './Display'
import { FindModal } from './FindModal'
import Loading from './Loading'
import SaveAndUpload from './SaveAndUpload'


const EditorControls = (props: EditorControlsProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [drawerOpen, toggleDrawerOpen] = useState<boolean>(false);
    const [findModalOpen, toggleModalOpen] = useState<boolean>(false)
    const [uploadModalOpen, toggleUploadModalOpen] = useState<boolean>(false)
    const [searchedToken, setSearchedToken] = useState<string>('')

    const openUploadModal = () => {
        if (props.editorContent.html.trim() === '') {
            toast('Error ⚠️', {
                description: 'HTML content is missing.',
                position: 'bottom-left'
                
            })
        } else {
            toggleUploadModalOpen(true)
        }
    }

    const handelFormat = async (content: ContentProps) => {
        setLoading(true)
        try {
            const html = await htmlFormatter(content.html)
            const css = await cssFormatter(content.css)

            props.setEditorContent({ html, css })
        } catch (error) {
            toast('Formatter error ⚠️', {
                description: String(error),
                position: 'bottom-left'
            })
            props.setEditorContent({ html: "", css: "" });
        }
        setLoading(false)
    }


    const handelReset = () => {
        setSearchedToken('')
        props.setEditorContent({ css: "", html: '' })
    }


    if (loading) {
        return (<Loading />)
    } else {
        return (
            <>
                <TooltipProvider>
                    <div className="mt-4 flex justify-between px-8 w-full">
                        <Tooltip>
                            <TooltipTrigger disabled={loading} type="button" onClick={() => toggleModalOpen(true)}>
                                <Search className='hover:text-primary' />
                            </TooltipTrigger>
                            <TooltipContent>Find By TOKEN</TooltipContent>
                        </Tooltip>
                        <div className="flex gap-4">
                            <Tooltip>
                                <TooltipTrigger
                                    disabled={loading || props.editorContent.html.trim() === ''}
                                    onClick={() => toggleDrawerOpen(true)}
                                    className='disabled:cursor-not-allowed'
                                >
                                    <Eye />
                                </TooltipTrigger>
                                <TooltipContent>Preview</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger onClick={() => handelFormat(props.editorContent)} disabled={loading} type="button">
                                    <LetterText className='hover:text-primary' />
                                    <TooltipContent>Format Code</TooltipContent>
                                </TooltipTrigger>
                            </Tooltip>
                            <AlertDialog>
                                <Tooltip>
                                    <TooltipTrigger disabled={loading} type="button">
                                        <AlertDialogTrigger asChild>
                                            <ListRestart className='hover:text-primary' />
                                        </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Reset code</TooltipContent>
                                </Tooltip>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your
                                            html editor code.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handelReset}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Tooltip>
                                <TooltipTrigger disabled={loading} onClick={openUploadModal}>
                                    <Save className='hover:text-primary' />
                                </TooltipTrigger>
                                <TooltipContent>Upload</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </TooltipProvider >
                <FindModal
                    open={findModalOpen}
                    onClose={() => toggleModalOpen(false)}
                    setLoading={setLoading}
                    handelFormat={handelFormat}
                    setToken={(t) => setSearchedToken(t)}
                />
                <SaveAndUpload
                    open={uploadModalOpen}
                    handelFormat={handelFormat}
                    onClose={() => toggleUploadModalOpen(false)}
                    setLoading={setLoading}
                    content={{ html: props.editorContent.html, css: props.editorContent.css }}
                    token={searchedToken}
                />
                <Drawer open={drawerOpen} onClose={() => toggleDrawerOpen(false)}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>View content</DrawerTitle>
                            <DrawerDescription>Make it beautiful</DrawerDescription>
                        </DrawerHeader>
                        <div className='p-4'>
                            <Display htmlContent={props.editorContent.html} cssContent={props.editorContent.css} />
                        </div>
                        <DrawerFooter className='flex justify-center'>
                            <DrawerClose asChild>
                                <Button variant="outline" className='w-fit'>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        )
    }

}

interface EditorControlsProps {
    editorContent: ContentProps;
    setEditorContent: (args: ContentProps) => void
}

export default EditorControls