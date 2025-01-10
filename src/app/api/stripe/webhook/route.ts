import { headers } from 'next/headers'
import React from 'react'
import Stripe from 'stripe'
import { stripe } from "@/lib/stripe";
import { db } from '@/server/db';

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

    if (event.type === 'checkout.session.completed') {

            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string, 
                {
                    expand: ['items.data.price.product']
                }
            )
            if(!session?.client_reference_id) {
                return new Response('Webhook Error ', { status : 400})
            }

            const plan = subscription.items.data[0]?.price
            if(!plan) {
                return new Response ('Webhook error', {status : 400})
            }

            const productId =  (plan.product as Stripe.Product).id 

            if (!productId) {
                return new Response ('Webhook error', {status: 400})
            }

            await db.stripeSubscription.create({
                data: {
                    userId : session.client_reference_id,
                    priceId : plan.id,
                    customerId : subscription.customer as string,
                    currentPeriodEnd : new Date(subscription.current_period_end * 1000),
                    subscriptionId: subscription.id,
                }
            })
            
            return new Response('Webhook Received', {status: 200})
    }

    if (event.type === 'invoice.payment_succeeded') {

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string, 
            {
                expand: ['items.data.price.product']
            }
        )
        if(!session?.client_reference_id) {
            return new Response('Webhook Error ', { status : 400})
        }

        const plan = subscription.items.data[0]?.price
        if(!plan) {
            return new Response ('Webhook error', {status : 400})
        }

        const productId =  (plan.product as Stripe.Product).id 

        if (!productId) {
            return new Response ('Webhook error', {status: 400})
        }

        await db.stripeSubscription.update({
            where: {
                subscriptionId: subscription.id
            },
            data: {
               
                priceId : plan.id,
                currentPeriodEnd : new Date(subscription.current_period_end * 1000),
                
            }
        })
        
        return new Response('Webhook Received', {status: 200})
    }       

    if (event.type === 'customer.subscription.updated') {

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string, 
            {
                expand: ['items.data.price.product']
            }
        )

        const existingSubscription = await db.stripeSubscription.findUnique({
            where : {
                subscriptionId : session.id as string
            }
        })

        if(!existingSubscription) {
            return new Response('Subscription Not found', {status : 400})
        }

        await db.stripeSubscription.update({
            where: {
                subscriptionId: subscription.id
            },
            data: {
               
                updatedAt : new Date(),
                currentPeriodEnd : new Date(subscription.current_period_end * 1000),
                
            }
        })

    }

    return new Response('webhook received', {status: 200})
}