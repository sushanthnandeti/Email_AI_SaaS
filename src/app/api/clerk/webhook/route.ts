// src/app/api/clerk/webhook/route.ts

export async function POST(req: Request) {
    try {
        const { data } = await req.json();

        console.log("Clerk webhook received", data);

        return new Response("Webhook received", { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);

        return new Response("Error processing webhook", { status: 500 });
    }
}