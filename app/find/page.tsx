'use client'

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Poppins } from "next/font/google";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { IconCopy, IconSearch } from "../../components/icon";
import Loading from "../components/Loading";
import Output from "../components/QR";
import { ServerData } from "@/utils/ServerData";
const poppins = Poppins({ display: 'swap', weight: ['400', '500', '600', '700'], subsets: ['latin'] });


const Find = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [output, setOutput] = useState<Res>();

    function copyToClipboard() {
        navigator.clipboard.writeText(output?.token ?? "000000").then(() => {
            toast('😁😁', {
                description: 'Token copied to clip board',
                position: 'bottom-left'
            })
        }).catch(() => {
            toast('Error !', {
                description: 'Token copy failed.',
                position: 'bottom-left'
            })
        })
    }

    async function findByToken(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        const form = e.target as HTMLFormElement;
        if (form) {
            const formData = new FormData(form)

            const token = formData.get('token')?.toString().trim()
            const prodDb = formData.get('prodDb') === 'on'

            try {
                const server = new ServerData({ path: 'getTailwindPlay', testDb: !prodDb })

                const res = await server.request({ body: { token: token } })

                const json = await res.json();
                if (res.ok) {
                    setOutput({ html: json['html'], token: json['token'], _id: json['_id'], css: json['css'] });
                } else {
                    toast('Api Error ⚠️', {
                        description: json['error'] || json['errors'],
                        position: 'bottom-left'
                    })
                    setOutput(undefined)
                }
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false);
    }



    return (
        <main className="mt-16">
            <form className="flex lg:w-1/4 w-fit mx-auto h-fit mb-8 flex-col items-start" onSubmit={findByToken}>
                <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <Switch name='prodDb' id="prodDb" className='ml-auto' />
                    <Label htmlFor="prodDb" className='col-span-3'>Use Prod Db</Label>
                </div>
                <div className="flex">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded  border border-indigo-300 dark:border-indigo-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-indigo-800 dark:text-indigo-200 p-2 leading-6 transition-colors duration-200 ease-in-out uppercase flex items-center">
                        <input name='token' type="text" className="w-full h-full outline-none px-4 py-2 bg-slate-100 dark:bg-slate-800 uppercase" placeholder="Search..." required>
                        </input>
                        <button type="submit" className="flex items-center justify-center pr-2">
                            <IconSearch size='22' />
                        </button>
                    </div>
                    <button type="button" disabled={!!!output} onClick={copyToClipboard} className="flex items-center justify-center px-4 border rounded border-indigo-500 dark:border-indigo-800 bg-indigo-800/40 disabled:cursor-not-allowed" title="Copy Token">
                        <IconCopy size='22' className="text-indigo-100" />
                    </button>
                </div>
            </form>
            {loading &&
                <div className="w-full flex justify-center items-center">
                    <Loading />
                </div>
            }
            {output &&
                <section className="flex flex-col lg:flex-row justify-center lg:justify-evenly">
                    <div className="p-4 w-full lg:max-w-[65vw] rounded shadow" style={poppins.style}>
                        {output.css && <style data-dynamic-css="true">{output.css}</style>}
                        <article className="h-fit w-full rounded-md border border-slate-800 dark:border-slate-500 py-4 px-2" dangerouslySetInnerHTML={{ __html: output?.html }}></article>
                    </div>
                    <div className="mx-auto lg:mx-0 py-4 px-2">
                        <Output token={output.token} docId={output._id} />
                    </div>
                </section>
            }
        </main>
    )
}


interface Res { html: string; token: string; _id: string, css?: string }

export default Find