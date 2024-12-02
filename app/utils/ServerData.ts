
class ServerData {
    private uri: string;
    private revalidate: number;

    constructor(params: { path: string, revalidate?: number, testDb: boolean }) {
        const server = process.env.NEXT_PUBLIC_SERVER;
        const admin = process.env.NEXT_PUBLIC_DB_ADMIN;

        this.uri = `${server}/${params.path}?testDb=${params.testDb}&dbAdmin=${admin}`
        this.revalidate = params.revalidate ?? 3600;
    }

    async request(params: { body: object } = { body: {} }): Promise<Response> {
        const res = await fetch(this.uri, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: process.env.NEXT_PUBLIC_DB_KEY, ...params.body }),
            next: { revalidate: this.revalidate }
        });

        return res;
    }

}

export { ServerData }