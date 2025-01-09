'use server'

import { auth } from "@clerk/nextjs/server";
import { stripe } from "./stripe";
import { redirect } from "next/navigation";


export async function createCheckoutSession() {
    const {userId} = await auth();
    
    if (!userId) throw new Error('unauthorized')

    const session = await stripe.checkout.sessions.create({

        payment_method_types : ['card'],
        line_items : [
            {
                price : 'price_1QfHi4EAbMNVhIlPVXizfB3T',
                quantity : 1
            }
        ], 
        mode: 'subscription',
        success_url : `${process.env.NEXT_PUBLIC_URL}/mail`,
        cancel_url : `${process.env.NEXT_PUBLIC_URL}/mail`,
        client_reference_id : userId
    })
    redirect(session.url as string)
}