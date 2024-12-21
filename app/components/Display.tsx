const Display = ({ htmlContent, cssContent }: { htmlContent: string, cssContent: string }) => {



    if (htmlContent) {
        return (
            <div className="max-h-[75vh] overflow-y-auto w-full">
                <div className="m-4">
                    {/* html */}
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
                    {/* css */}
                    {!!cssContent && <style>{cssContent}</style>}
                </div>
            </div>
        )
    } else {
        return <div className="flex w-full justify-center h-full items-center">
            <p className="bg-gradient-to-r from-cyan-400 to-pink-600 bg-clip-text text-transparent text-4xl font-semibold">No HTML / CSS</p>
        </div>
    }
}



export default Display