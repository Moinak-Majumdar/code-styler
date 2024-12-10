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
import ContentProps from '../utils/Interface/ContentProps'
import { ServerData } from '../utils/ServerData'

export const FindModal = (props: Props) => {

  const [prompt, setPrompt] = useState("")
  const [content, setContent] = useState<ContentProps>()

  async function findLocal() {
    const local = localStorage.getItem('editor-content')
    if (!!local) {
      setPrompt("Content found in local storage..😁")
      setContent(JSON.parse(local))
    } else {
      setPrompt('No content available in local storage.')
    }
  }

  useEffect(() => {
    if (props.open) findLocal()
  }, [props.open])


  async function findByToken(e: FormEvent) {
    e.preventDefault();
    props.setLoading(true);
    props.onClose(false);

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
          props.handelFormat({ html: json['html'] ?? '', css: json['css'] ?? '' })
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
                  disabled={!!!content}
                  onClick={() => {
                    props.handelFormat(content!)
                    props.onClose(false);
                  }}
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
    </Dialog>
  )
}


interface Props {
  open: boolean;
  onClose: (val: boolean) => void;
  setLoading: (l: boolean) => void;
  handelFormat: (props: ContentProps) => void
  setToken: (t: string) => void;
}