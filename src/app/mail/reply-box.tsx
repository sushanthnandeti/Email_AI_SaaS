"use client"

import React from 'react'
import EmailEditor from './email-editor'
import useThreads from '@/hooks/use-threads'
import { api, RouterOutputs } from '@/trpc/react'


const ReplyBox= () => { 
    const {threadId, accountId} = useThreads();
    const {data: replyDetails} = api.account.getReplyDetails.useQuery({
      threadId : threadId ?? "",
      accountId
    })
    
    if (!replyDetails) return null

    return <Component replyDetails = {replyDetails} />
}

const Component = ({replyDetails} : {replyDetails: RouterOutputs['account']['getReplyDetails']}) => {

    const {accountId, threadId} = useThreads()

    const [subject, setSubject] = React.useState(replyDetails.subject.startsWith('Re:') ? replyDetails.subject : `Re: ${replyDetails.subject}`);
    const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>(replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })) || [])
    const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>(replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })) || [])
      
    React.useEffect(() => {

      if(!threadId || !replyDetails) return 

      if(!replyDetails.subject.startsWith("Re:")) {
        setSubject(`Re:${replyDetails.subject}`)
      }
      else {
        setSubject(replyDetails.subject)
      }

      setToValues(replyDetails.to.map(to => ({label: to.address, value: to.address})))
      setToValues(replyDetails.to.map(cc => ({label: cc.address, value: cc.address})))

    }, [threadId, replyDetails])

    const handleSend = async ( value: string) => {
       console.log(value)
    }

      return (
        <EmailEditor 

          subject={subject}
          setSubject={setSubject}

          toValues={toValues}
          setToValues={setToValues}

          ccValues={ccValues}
          setCcValues={setCcValues}

          to={replyDetails.to.map(to => to.address)}

          isSending={false}
          handleSend={handleSend} defaultToolbarExpanded={false}        />
      )

}

export default ReplyBox