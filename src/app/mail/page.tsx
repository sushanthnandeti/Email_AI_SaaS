"use client"

import React from 'react'
//import Mail from './mail'
import dynamic from 'next/dynamic'
import ThemeToggle from '@/components/theme-toggle'


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
                  <ThemeToggle/>
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