// src/app/api/clerk/webhook/route.ts

import { db } from "@/server/db";

export async function POST(req: Request) {

    try {

        const { data } = await req.json();
        const emailAddress  = data.email_addresses[0].email_address;
        const firstName  = data.first_name; 
        const lastName = data.last_name;
        const imageUrl = data.image_url;
        const id = data.id;

        await db.user.create({
            data: {
            id: id,
            emailAddress: emailAddress,
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
            }
        })

        console.log("Clerk webhook received", data);
        return new Response("Webhook received", { status: 200 });

    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response("Error processing webhook", { status: 500 });

    }
}