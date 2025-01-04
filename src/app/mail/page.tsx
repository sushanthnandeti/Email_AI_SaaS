"use client"

import React from 'react'
//import Mail from './mail'
import dynamic from 'next/dynamic'
import ThemeToggle from '@/components/theme-toggle'
import { UserButton } from '@clerk/nextjs'
import ComposeButton from './compose-button'


// Making sure Nextjs renders the Mail component on client side. 

const Mail = dynamic(() => {
    return import('./mail')
}, {
  ssr: false
})


const MailDashboard = () => {
  return (
        <>  
            <div className='absolute bottom-4 left-4'>
                  <div className='flex items-center gap-2'>
                      <UserButton />
                      <ThemeToggle/>
                      <ComposeButton />
                  </div>
                 
            </div>
            <Mail
                defaultLayout = {[20,32,48]}
                defaultCollapse = {false}
                navCollapsedSize = {4}
              />
        </>
  )
}

export default MailDashboard