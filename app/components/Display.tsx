'use client'

import { Poppins } from "next/font/google";
import { useEffect, useState } from 'react';
const poppins = Poppins({ display: 'swap', weight: ['400', '500', '600', '700'], subsets: ['latin'] });

const Display = (props: { htmlContent: string }) => {

    const { htmlContent } = props;
    const [frame, setFrame] = useState("")

    useEffect(() => {
        setFrame(
            `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body>
                    ${htmlContent}
                </body>
            </html>`
        )
    }, [htmlContent])


    return (
        <div className="relative dark:bg-[#000011] bg-white min-h-full w-full rounded-md border border-slate-800 dark:border-slate-500">
            <iframe
                className={poppins.className}
                srcDoc={frame}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Dynamic HTML"
            />
        </div>
    )
}

export default Display