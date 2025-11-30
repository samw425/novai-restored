export default async function ToolPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool: {id}</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                <p>Details for this tool are being indexed.</p>
                <p className="text-sm mt-2">Coming soon.</p>
            </div>
        </>
    );
}
