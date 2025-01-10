'use client'

import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/stripe_actions';
import React from 'react'

const StripeButton = () => {

    const handleClick = async () => {
        await createCheckoutSession();
    }   

    return (
        
        <Button variant={'outline'} size='lg' onClick = {handleClick}>  

            Upgrade Plan
        </Button>
    )
}


export default StripeButton;