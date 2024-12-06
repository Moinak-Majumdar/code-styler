'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, LetterText, ListRestart, Save, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import htmlFormatter from '../utils/HtmlFormatter'
import { ServerData } from '../utils/ServerData'
import Loading from './Loading'

const EditorControls = (props: EditorControlsProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [findByTokenModalOpen, toggleFindByTokenModalOpen] = useState<boolean>(false)
    const [uploadModalOpen, toggleUploadModalOpen] = useState<boolean>(false)
    const [searchedToken, setSearchedToken] = useState<string>('')


    const router = useRouter()

    const openUploadModal = () => {
        if (!!!props.editorContent) {
            toast('Error ⚠️', {
                description: 'HTML content is missing.',
                action: {
                    label: 'close',
                    onClick: () => { console.log('closed') }
                },
                position: 'bottom-left'
            })
        } else {
            toggleUploadModalOpen(true)
        }
    }


    async function handelUpload(e: FormEvent) {
        e.preventDefault()
        toggleUploadModalOpen(false)
        setLoading(true)

        const form = e.target as HTMLFormElement
        if (form) {
            const formData = new FormData(form)

            const prodDb = formData.get('prodDb') === 'on'
            const accessKey = formData.get('accessKey')

            const server = new ServerData({ path: 'upsertTailwindPlay', testDb: !prodDb })

            const res = await server.request({ body: { html: props.editorContent, token: searchedToken, accessKey } })

            const json = await res.json()

            if (!res.ok) {
                toast('Api Error ⚠️', {
                    description: json['error'],
                    position: 'bottom-left'
                })
            } else {
                router.push(`/find/${json['token']}?tesDb=${!prodDb}`)
            }
            setLoading(false)
        }
    }


    async function findByToken(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        toggleFindByTokenModalOpen(false);


        const form = e.target as HTMLFormElement
        if (form) {
            const formData = new FormData(form)

            const prodDb = formData.get('prodDb') === 'on'
            const token = formData.get('token')

            try {
                const server = new ServerData({ path: 'getTailwindPlay', testDb: !prodDb })
                const res = await server.request({ body: { token } })

                const json = await res.json();
                if (res.ok) {
                    const html = json['html']

                    htmlFormatter(html).then((res) => {
                        props.setEditorContent(res)
                        setSearchedToken(token as string)
                    }).catch((err) => {
                        toast('Api Error ⚠️', {
                            description: err,
                            position: 'bottom-left'
                        })
                        props.setEditorContent('')
                    })
                } else {
                    toast('Api Error ⚠️', {
                        description: json['error'],
                        position: 'bottom-left'
                    })
                }
            } catch (error) {
                console.log(error)
                toast('Api Error ⚠️', {
                    description: 'Open console',
                    position: 'bottom-left'
                })
            }
        }

        setLoading(false);
    }

    const handelFormat = async () => {
        setLoading(true)
        htmlFormatter(props.editorContent).then((res) => {
            props.setEditorContent(res)
        }).catch((err) => {
            alert(err)
            props.setEditorContent('')
        })
        setLoading(false)
    }

    const handelReset = () => {
        setSearchedToken('')
        props.setEditorContent('')
    }


    if (loading) {
        return (<Loading />)
    } else {
        return (
            <>
                <TooltipProvider>
                    <div className="mt-4 flex justify-between px-4 w-full">
                        <Tooltip>
                            <TooltipTrigger disabled={loading} type="button" onClick={() => toggleFindByTokenModalOpen(true)}>
                                <Search className='hover:text-primary'/>
                            </TooltipTrigger>
                            <TooltipContent>Find By TOKEN</TooltipContent>
                        </Tooltip>
                        <div className="flex gap-4">
                            <Tooltip>
                                <TooltipTrigger disabled={loading || props.editorContent.trim() === ''} onClick={props.onView} className='disabled:cursor-not-allowed'>
                                    <Eye />
                                </TooltipTrigger>
                                <TooltipContent>Preview</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger onClick={handelFormat} disabled={loading} type="button">
                                    <LetterText  className='hover:text-primary'/>
                                    <TooltipContent>Format Code</TooltipContent>
                                </TooltipTrigger>
                            </Tooltip>
                            <AlertDialog>
                                <Tooltip>
                                    <TooltipTrigger disabled={loading} type="button">
                                        <AlertDialogTrigger asChild>
                                            <ListRestart className='hover:text-primary'/>
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
                <Dialog open={findByTokenModalOpen} onOpenChange={toggleFindByTokenModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Tailwind Play</DialogTitle>
                            <DialogDescription>
                                Find html by registered token and edit in editor.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={findByToken}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Switch name='prodDb' id="prodDb" className='ml-auto' />
                                    <Label htmlFor="prodDb" className='col-span-3'>Use Prod Db</Label>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="token" className="text-right">Token</Label>
                                    <Input required name='token' id="token" placeholder='TOKEN' className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Find</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog open={uploadModalOpen} onOpenChange={toggleUploadModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Tailwind Play</DialogTitle>
                            <DialogDescription>
                                Upsert Tailwind Play content.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handelUpload}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Switch name='prodDb' id="prodDb" className='ml-auto' />
                                    <Label htmlFor="prodDb" className='col-span-3'>Use Prod Db</Label>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="accessKey" className='text-right'>Access Key</Label>
                                    <Input id='accessKey' name='accessKey' placeholder='Access Key' type='text' required className='col-span-3' />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

}

interface EditorControlsProps {
    onSave: () => void;
    onView: () => void;
    editorContent: string;
    setEditorContent: (c: string) => void
}

export default EditorControls