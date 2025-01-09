'use client'

import { FREE_CREDITS_PER_DAY } from '@/constants'
import React from 'react'
import StripeButton from './stripe-button'

const PremiumBanner= () => {

  const isSubscribed = false 
  const remainingCredits = 5

  if (!isSubscribed) return <div className='bg-gray-900 relative p-4 rounded-lg border overflow-hidden flex flex-col md:flex-row gap-4'>

          <img src = '/bot.webp' className='md:absolute md:-bottom-6 md:-right-10 h-[180px] w-auto'/>
          <div>
                <div className='flex items-center gap-2'>
                    <h1 className='text-white text-xl font-bold'> Basic Plan</h1>
                    <p className='text-gray-400 text-sm md:max-w-full'>
                          {remainingCredits} / {FREE_CREDITS_PER_DAY} messages remaining
                    </p>
                </div>
                <div className='h-4'></div>
                <p className='text-gray-400 text-sm md:max-w-[calc(100%-150px)]'>
                    Upgrade to pro to ask as many questions as you like
                </p>
                <div className='h-4'></div>
                <StripeButton />
          </div>


      </div>

  return (
    <div>premium-button</div>
  )
}

export default PremiumBanner