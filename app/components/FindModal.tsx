'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@radix-ui/react-tabs'
import { CloudDownload, DatabaseZap } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setCssContent, setHtmlContent, setSearchedToken } from '../redux/slice/content'
import { ServerData } from '../utils/ServerData'

export const FindModal = (props: Props) => {

  const dispatch = useAppDispatch()
  const { html } = useAppSelector((state) => state.contentSlice)

  const [prompt, setPrompt] = useState("")

  async function findLocal() {
    const local = localStorage.getItem('editor-content')
    if (!!local) {
      setPrompt("Content found in local storage..😁")
    } else {
      setPrompt('No content available in local storage.')
    }
  }

  useEffect(() => {
    if (props.open) findLocal()
  }, [props.open])

  function handelLoad() {
    const local = localStorage.getItem('editor-content')
    if (!!local) {
      const content = JSON.parse(local)
      dispatch(setHtmlContent(content['html'] ?? ""))
      dispatch(setCssContent(content['css'] ?? ""))
      props.handelFormat()
      props.onClose()
    }
    return;
  }

  async function findByToken(e: FormEvent) {
    e.preventDefault();
    props.setLoading(true);
    props.onClose();

    const form = e.target as HTMLFormElement
    if (form) {
      const formData = new FormData(form)

      const prodDb = formData.get('prodDb') === 'on'
      const token = formData.get('token')?.toString().trim()

      try {
        const server = new ServerData({ path: 'getTailwindPlay', testDb: !prodDb })
        const res = await server.request({ body: { token } })

        const json = await res.json();
        if (res.ok) {
          dispatch(setHtmlContent(json['html'] ?? ""))
          dispatch(setCssContent(json['css'] ?? ""))
          dispatch(setSearchedToken(json['token']))
          props.handelFormat()
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
    props.setLoading(false);
  }


  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tailwind Play</DialogTitle>
          <DialogDescription>
            Find html by registered token and edit in editor.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="local" className='w-full'>
          <TabsList className="grid w-full grid-cols-2 h-fit">
            <TabsTrigger value="local"><DatabaseZap /></TabsTrigger>
            <TabsTrigger value="cloud"><CloudDownload /></TabsTrigger>
          </TabsList>
          <TabsContent value="local">
            <div className='my-6'>
              <p>{prompt}</p>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handelLoad}
                >
                  Load
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
          <TabsContent value="cloud">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog >
  )
}


interface Props {
  open: boolean;
  onClose: () => void;
  setLoading: (l: boolean) => void;
  handelFormat: () => void
}