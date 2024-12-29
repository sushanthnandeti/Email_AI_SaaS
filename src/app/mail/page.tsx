"use client"

import React from 'react'
//import Mail from './mail'
import dynamic from 'next/dynamic'


// Making sure Nextjs renders the Mail component on client side. 

const Mail = dynamic(() => {
    return import('./mail')
}, {
  ssr: false
})


const MailDashboard = () => {
  return (
    <Mail
        defaultLayout = {[20,32,48]}
        defaultCollapse = {false}
        navCollapsedSize = {4}
    />
  )
}

export default MailDashboard