const Display = ({ htmlContent, cssContent }: { htmlContent: string, cssContent: string }) => {



    if (htmlContent) {
        return (
            <div className="min-h-full w-full rounded-md border border-slate-800 dark:border-slate-500 py-4 px-2">
                {/* html */}
                <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
                {/* css */}
                {!!cssContent && <style>{cssContent}</style>}
            </div>
        )
    } else {
        return <div className="flex w-full justify-center ">
            <p className="bg-gradient-to-r from-cyan-400 to-pink-600 bg-clip-text text-transparent text-3xl font-semibold">No HTML</p>
        </div>
    }
}



export default Display