'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ContentProps from '@/Interface/ContentProps'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearContentSlate, setCssContent, setHtmlContent } from '@/redux/slice/content'
import cssFormatter from '@/utils/CssFormatter'
import htmlFormatter from '@/utils/HtmlFormatter'
import { Eye, LetterText, ListRestart, Save, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Display from './Display'
import { FindModal } from './FindModal'
import Loading from './Loading'
import SaveAndUpload from './SaveAndUpload'


const EditorControls = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [drawerOpen, toggleDrawerOpen] = useState<boolean>(false);
    const [findModalOpen, toggleModalOpen] = useState<boolean>(false)
    const [uploadModalOpen, toggleUploadModalOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const { html, css, token } = useAppSelector((state) => state.contentSlice)

    const openUploadModal = () => {
        if (html.trim() === '') {
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
        htmlFormatter(content.html ?? "").then((h) => {
            dispatch(setHtmlContent(h))
        }).catch(err => {
            toast('Html Formatter error ⚠️', {
                description: String(err),
                position: 'bottom-left'
            })
            dispatch(setHtmlContent(""))
        })

        cssFormatter(content.css ?? "").then((c) => {
            dispatch(setCssContent(c))
        }).catch(err => {
            toast('Css Formatter error ⚠️', {
                description: String(err),
                position: 'bottom-left'
            })
            dispatch(setCssContent(""))
        })
        setLoading(false)
    }

    if (loading) {
        return (<Loading />)
    } else {
        return (
            <>
                <TooltipProvider>
                    <div className="flex justify-between px-8 w-full py-4">
                        <Tooltip>
                            <TooltipTrigger disabled={loading} type="button" onClick={() => toggleModalOpen(true)}>
                                <Search className='hover:text-primary' />
                            </TooltipTrigger>
                            <TooltipContent>Find By TOKEN</TooltipContent>
                        </Tooltip>
                        <div className="flex gap-4">
                            <Tooltip>
                                <TooltipTrigger
                                    disabled={loading || html.trim() === ''}
                                    onClick={() => toggleDrawerOpen(true)}
                                    className='disabled:cursor-not-allowed'
                                >
                                    <Eye />
                                </TooltipTrigger>
                                <TooltipContent>Preview</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger onClick={() => handelFormat({ html, css })} disabled={loading} type="button">
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
                                        <AlertDialogAction onClick={() => dispatch(clearContentSlate())}>
                                            Continue
                                        </AlertDialogAction>
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
                />
                <SaveAndUpload
                    open={uploadModalOpen}
                    onClose={() => toggleUploadModalOpen(false)}
                    setLoading={setLoading}
                    handelFormat={handelFormat}
                />
                <Drawer open={drawerOpen} onClose={() => toggleDrawerOpen(false)}>
                    <DrawerContent className=''>
                        <DrawerHeader>
                            <DrawerTitle>View content</DrawerTitle>
                            <DrawerDescription>Make it beautiful</DrawerDescription>
                        </DrawerHeader>
                        <div className='p-4'>
                            <Display htmlContent={html} cssContent={css} />
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

export default EditorControls