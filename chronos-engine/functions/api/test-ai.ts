export const onRequest: PagesFunction<{ AI: any }> = async (context) => {
    try {
        const result = await context.env.AI.run('@cf/baai/bge-small-en-v1.5', {
            text: ["Test the intelligence of the machine."]
        });
        return new Response(JSON.stringify({ success: true, ai: 'LIVING' }), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
