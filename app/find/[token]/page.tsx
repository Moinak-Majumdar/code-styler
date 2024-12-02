import Loading from "@/app/components/Loading";
import Output from "@/app/components/QR";
import { ServerData } from "@/app/utils/ServerData";
import { Poppins } from "next/font/google";
const poppins = Poppins({ display: 'swap', weight: ['400', '500', '600', '700'], subsets: ['latin'] });

const Token = async ({ params }: { params: { token: string } }) => {
    const { token } = params
    let loading = true

    const server = new ServerData({ path: 'getTailwindPlay', testDb: true })
    const res = await server.request({ body: { token: token.toUpperCase() } })

    if (!res.ok) {
        return (
            <main className="flex justify-center items-center mt-16">
                <p className="text-slate-300 text-2xl mt-4">{`No data found with associated token: ${token}`}</p>
            </main>
        )
    }

    const json = await res.json()

    loading = false

    return (
        <main className="mt-16 flex justify-evenly">
            <div className="p-4 max-w-[65vw] bg-white rounded shadow" style={poppins.style}>
                {loading ? <Loading /> : <article dangerouslySetInnerHTML={{ __html: json['html'] }}></article>}
            </div>
            <Output token={json['token']} />
        </main>
    )
}

export default Token