'use client'

import { Button } from '@/components/ui/button';
import { createBillingPortalSession, createCheckoutSession, getSubscriptionStatus } from '@/lib/stripe_actions';
import React, { useEffect, useState } from 'react'

const StripeButton = () => {

    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleClick = async () => {

        if (isSubscribed) {
            await createBillingPortalSession()
        }
        else {
        await createCheckoutSession();
        }
    }   

    useEffect (() => {
        ( async () => {
        const subscriptionStatus = await getSubscriptionStatus() 
        setIsSubscribed(subscriptionStatus)}) 
        
        ()}, [])

    return (
        
        <Button variant={'outline'} size='lg' onClick = {handleClick}>  
            {isSubscribed ? 'Manage Subscription' : 'Upgrade Plan'}
        </Button>
    )
}


export default StripeButton;