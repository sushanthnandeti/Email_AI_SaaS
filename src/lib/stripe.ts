

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia'  
})

// price_1QfHi4EAbMNVhIlPVXizfB3T
// price_1QfHi4EAbMNVhIlPVXizfB3T