const Display = (props: { htmlContent: string }) => {



    return (
        <div className="min-h-full w-full rounded-md border border-slate-800 dark:border-slate-500 py-4 px-2" dangerouslySetInnerHTML={{ __html: props.htmlContent }}>
        </div>
    )
}

export default Display