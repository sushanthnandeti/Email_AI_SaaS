import { headers } from 'next/headers'
import React from 'react'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body  = await req.text()
    const signature  = headers().get('Stripe-Signature') as string
    let event : Stripe.Event


    try {
            event = Stripe.webhooks.constructEvent(
                body, signature, process.env.STRIPE_WEBHOOK_SECRET as string
            )

    } catch (error) {
            return new Response('Webhook error', {status : 400})
    }

    const session = event.data.object as Stripe.Checkout.Session
    console.log('receivec stripe event', event.type)

    return new Response('webhook received', {status: 200})
}