'use client'

import { Poppins } from "next/font/google";
import { FormEvent, useRef, useState } from "react";
import { IconCopy, IconSearch } from "../components/icon";
import Loading from "../components/Loading";
import Output from "../components/QR";
import { ServerData } from "../utils/ServerData";
const poppins = Poppins({ display: 'swap', weight: ['400', '500', '600', '700'], subsets: ['latin'] });

interface Res { html: string; token: string; }

const Find = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [output, setOutput] = useState<Res>();

    function copyToClipboard() {
        const value = inputRef.current?.value.toUpperCase();
        navigator.clipboard.writeText(value!).then(() => {
            alert('Token copied to clipboard')
        }).catch(() => {
            alert('Token copy failed.')
        })
    }

    async function findByToken(e: FormEvent) {
        e.preventDefault();
        const value = inputRef.current?.value.toUpperCase();

        if (value === '') {
            return;
        } else {
            setLoading(true);
            try {
                const server = new ServerData({ path: 'getTailwindPlay' })

                const res = await server.request({ body: { token: value } })

                const json = await res.json();
                if (res.ok) {
                    navigator.clipboard.writeText(json['token'])
                    setOutput({ html: json['html'], token: json['token'] });
                } else {
                    alert(json['error'])
                    setOutput(undefined)
                }
            } catch (error) {
                console.log(error)
            }
            setLoading(false);
        }
    }



    return (
        <main className="mt-16">
            <form className="flex lg:w-1/4 w-fit mx-auto h-fit mb-8" onSubmit={findByToken}>
                <div className="w-full bg-slate-100 rounded  border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-indigo-800 p-2 leading-6 transition-colors duration-200 ease-in-out uppercase flex items-center">
                    <input ref={inputRef} type="text" className="w-full h-full outline-none px-4 py-2 bg-slate-100 uppercase" placeholder="Search..." required >
                    </input>
                    <button type="submit" className="flex items-center justify-center pr-2">
                        <IconSearch size='22' />
                    </button>
                </div>
                <button type="button" disabled={!!!inputRef.current?.value} onClick={copyToClipboard} className="flex items-center justify-center px-4 border rounded border-indigo-500 bg-indigo-800/40 disabled:cursor-not-allowed" title="Copy Token">
                    <IconCopy size='22' className="text-indigo-100" />
                </button>
            </form>
            {output &&
                <section className="flex justify-evenly">
                    <div className="p-4 max-w-[65vw] bg-white rounded shadow" style={poppins.style}>
                        {loading ? <Loading /> : <article dangerouslySetInnerHTML={{ __html: output?.html }}></article>}
                    </div>
                    <Output token={output.token} />
                </section>}
        </main>
    )
}

export default Find