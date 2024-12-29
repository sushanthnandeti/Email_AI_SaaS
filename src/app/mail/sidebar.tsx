"use client"

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import { Inbox, Send, File } from 'lucide-react'
import { api } from '@/trpc/react'

type Props = {
    isCollapsed : boolean
}

const Sidebar = ({isCollapsed}: Props) => {

  const [accountId] = useLocalStorage("accountId", " ")
  const [tab] = useLocalStorage <'inbox' | 'draft' | 'sent' >("normalhuman-tab", "inbox")

  const { data: inboxThreads} = api.account.getNumThreads.useQuery({
    accountId,
    tab : 'inbox'
  });

  const { data: draftThreads} = api.account.getNumThreads.useQuery({
    accountId,
    tab : 'draft'
  });

  const { data: sentThreads} = api.account.getNumThreads.useQuery({
    accountId,
    tab : 'sent'
  });

  return(

    <Nav   
        isCollapsed = {isCollapsed}
        links={ [
            {
                title : "Inbox",
                label : inboxThreads?.toString() ?? "0",
                icon: Inbox,
                variant : tab === "inbox" ? "default" : "ghost"
            },
            {
                title : "Draft",
                label : draftThreads?.toString() ?? "0",
                icon: File,
                variant :  tab === "draft" ? "default" : "ghost"
            },
            {
                title : "Sent",
                label : sentThreads?.toString() ?? "0",
                icon: Send,
                variant :  tab === "sent" ? "default" : "ghost"
            },
        ]}
        > 

    </Nav>
  
  )
}

export default Sidebar