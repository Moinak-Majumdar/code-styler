import Loading from "@/app/components/Loading";
import Output from "@/app/components/QR";
import { ServerData } from "@/app/utils/ServerData";
import { Poppins } from "next/font/google";
const poppins = Poppins({ display: 'swap', weight: ['400', '500', '600', '700'], subsets: ['latin'] });

const Token = async ({ params, searchParams }: { params: { token: string }, searchParams: { [key: string]: any } }) => {
    const { token } = params

    let testDb = true
    const queryParams = Object.keys(searchParams)

    if(queryParams.includes('tesDb')) {
        testDb = searchParams['testDb']
    }

    let loading = true

    const server = new ServerData({ path: 'getTailwindPlay', testDb: testDb })
    const res = await server.request({ body: { token: token.toUpperCase() } })

    if (!res.ok) {
        return (
            <main className="flex justify-center items-center mt-16">
                <p className="text-2xl mt-4">{`No data found with associated token: ${token}`}</p>
            </main>
        )
    }

    const json = await res.json()

    loading = false

    return (
        <main className="mt-16 flex justify-evenly">
            <div className="p-4 max-w-[65vw] rounded shadow" style={poppins.style}>
                {loading ? <Loading /> : <article className="h-fit w-full rounded-md border border-slate-800 dark:border-slate-500 py-4 px-2" dangerouslySetInnerHTML={{ __html: json['html'] }}></article>}
            </div>
            <Output token={json['token']} docId={json["_id"]} />
        </main>
    )
}

export default Token