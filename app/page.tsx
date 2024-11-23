'use client'

import { html } from '@codemirror/lang-html';
import { dracula } from '@uiw/codemirror-theme-dracula';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";
import Display from "./components/Display";
import { IconEdit, IconFormat, IconReset, IconSave } from "./components/icon";
import Loading from './components/Loading';
import htmlFormatter from "./utils/HtmlFormatter";
import { ServerData } from "./utils/ServerData";

const extension = [
  html({
    autoCloseTags: true,
    selfClosingTags: true,
    matchClosingTags: true,
  })
]


export default function Home() {

  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');

  async function findByToken(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const server = new ServerData({ path: 'getTailwindPlay' })

      const res = await server.request({ body: { token } })

      const json = await res.json();
      if (res.ok) {
        const html = json['html']
        setToken(json['token'])
        htmlFormatter(html).then((res) => {
          setHtmlContent(res)
        }).catch((err) => {
          alert(err)
          setHtmlContent('')
        })
      } else {
        alert(json['error'])
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  }

  const handelFormat = async () => {
    setLoading(true)
    htmlFormatter(htmlContent).then((res) => {
      setHtmlContent(res)
    }).catch((err) => {
      alert(err)
      setHtmlContent('')
    })
    setLoading(false)
  }

  function handelReset() {
    setHtmlContent('')
    setToken('')
  }


  async function handelUpload() {
    if (!!!htmlContent) {
      alert('HTML content is missing.')
      return;
    }
    setLoading(true)

    const server = new ServerData({ path: 'addTailwindPlay' })
    const res = await server.request({ body: { html: htmlContent, token } })

    const json = await res.json()

    if (!res.ok) {
      alert(json['error'])
    } else {
      router.push(`/find/${json['token']}`)
    }
    setLoading(false)
  }

  return (
    <main className="flex">
      <section>
        <CodeMirror
          value={htmlContent}
          extensions={extension}
          theme={dracula}
          onChange={(value: string, viewUpdate: ViewUpdate) => setHtmlContent(value)}
          height="85vh"
          width="50vw"
          className=""
          readOnly={loading}
        />
        {loading ?
          <Loading /> :
          <div className="my-1 flex justify-between px-4 w-[50vw]">
            <form className="flex w-fit h-fit" onSubmit={findByToken}>
              <input value={token} onChange={(e) => setToken(e.target.value.toUpperCase())} type="text" className="w-full px-4 py-2 bg-slate-100 rounded border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-indigo-800 p-2 leading-6 transition-colors duration-200 ease-in-out uppercase" placeholder="Token" required />
              <button disabled={loading} type="submit" className="flex items-center justify-center px-4 border rounded border-indigo-500" title='Edit'>
                <IconEdit size="24" />
              </button>
            </form>
            <div className="flex gap-4">
              <button disabled={loading} type="button" onClick={handelFormat} className="bg-teal-500 px-3 py-1 rounded" title='Reset'>
                <IconFormat className='text-teal-100' />
              </button>
              <button disabled={loading} type="button" onClick={handelReset} className="rounded bg-rose-500 px-3 py-1" title='Reset'>
                <IconReset className='text-red-100' />
              </button>
              <button disabled={loading} onClick={() => handelUpload()} className="rounded bg-cyan-400 px-3 py-1 text-cyan-100" title='Save'>
                <IconSave size='22' />
              </button>
            </div>
          </div>
        }
      </section>
      <Display htmlContent={htmlContent} />
    </main>
  );
}