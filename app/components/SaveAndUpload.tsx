'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentProps from "@/Interface/ContentProps";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchedToken } from "@/redux/slice/content";
import { ServerData } from "@/utils/ServerData";
import { CloudUpload, DatabaseZap } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";



const SaveAndUpload = (props: Props) => {

    const router = useRouter();
    const { html, css, token } = useAppSelector((state) => state.contentSlice)
    const dispatch = useAppDispatch()

    function handelSave() {
        const content = JSON.stringify({ html, css })
        localStorage.setItem('editor-content', content)
        toast('Content Saved ... ✅✅')
        props.onClose()
    }

    async function handelUpload(e: FormEvent) {

        e.preventDefault()
        handelSave()
        props.setLoading(true)

        const form = e.target as HTMLFormElement
        if (form) {
            const formData = new FormData(form)

            const prodDb = formData.get('prodDb') === 'on'
            const accessKey = formData.get('accessKey')?.toString().trim()
            const insertOption = formData.get('insertOption')
            const server = new ServerData({ path: 'upsertTailwindPlay', testDb: !prodDb })

            const res = await server.request({
                body: {
                    html, css, accessKey,
                    ...token === insertOption && { token }
                }
            })

            const json = await res.json()

            if (!res.ok) {
                toast('Api Error ⚠️', {
                    description: json['error'],
                    position: 'bottom-left'
                })
            } else {
                dispatch(setSearchedToken(undefined))
                toast('Content saved and uploaded.', {
                    description: "Redirect to view content ...",
                    action: {
                        label: "Redirect",
                        onClick: () => router.push(`/find/${json['token']}?testDb=${!prodDb}`)
                    }
                })
            }
            props.setLoading(false)
        }
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Code Styler</DialogTitle>
                    <DialogDescription>
                        Upsert code styler content.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="local" className='w-full'>
                    <TabsList className="grid w-full grid-cols-2 h-fit">
                        <TabsTrigger value="local"><DatabaseZap /></TabsTrigger>
                        <TabsTrigger value="cloud"><CloudUpload /></TabsTrigger>
                    </TabsList>
                    <TabsContent value="local">
                        <div className='my-6'>
                            <p>Save current content at local storage.</p>
                            <DialogFooter>
                                <Button onClick={handelSave} type="button">Save</Button>
                            </DialogFooter>
                        </div>
                    </TabsContent>
                    <TabsContent value="cloud">
                        <form onSubmit={handelUpload}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Switch name='prodDb' id="prodDb" className='ml-auto' />
                                    <Label htmlFor="prodDb" className='col-span-3'>Use Prod Db</Label>
                                </div>
                                {!!token &&
                                    <RadioGroup className="ml-16 flex gap-x-4 items-center" name="insertOption" defaultValue={token}>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value={token} id={token} />
                                            <Label htmlFor={token}>Use: {token}</Label>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <RadioGroupItem value="fresh" id="fresh" />
                                            <Label htmlFor="fresh">Insert fresh</Label>
                                        </div>
                                    </RadioGroup>
                                }
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="accessKey" className='text-right'>Access Key</Label>
                                    <Input id='accessKey' name='accessKey' placeholder='Access Key' type='text' required className='col-span-3' />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Upload</Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>

            </DialogContent>
        </Dialog>
    )
}

interface Props {
    open: boolean;
    onClose: () => void;
    setLoading: (l: boolean) => void;
    handelFormat: (content: ContentProps) => void
}

export default SaveAndUpload