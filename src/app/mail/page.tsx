"use client"

import React from 'react'
import Mail from './mail'

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