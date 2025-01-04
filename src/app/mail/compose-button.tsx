'use client'

import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import EmailEditor from './email-editor'
import { api } from '@/trpc/react'
import useThreads from '@/hooks/use-threads'
import { toast } from 'sonner'
  

const ComposeButton= () => {

    const [tovalues, setToValues] = React.useState<{ label: string, value : string }[]>([])
    const [ccValues, setCcValues] = React.useState<{ label: string, value : string }[]>([])
    const {account} = useThreads()

    const [subject, setSubject] = React.useState<string>('')

    const sendEmail = api.account.sendEmail.useMutation()

    const handleSend = ( value : string) => {
        if(!account) return 

        sendEmail.mutate( {
            accountId : account.id, 
            threadId : undefined,
            body : value, 
            from : { name: account?.name ?? "Me", address : account.emailAddress ?? "me@example.com"},
            to : tovalues.map( to => ({ name: to.value, address: to.value})),
            cc : ccValues.map( cc => ({ name: cc.value, address: cc.value})),
            replyTo : {name : account?.name?? "Me", address: account.emailAddress ?? "me@example.com"},
            subject: subject,
            inReplyTo: undefined
        }, {
            onSuccess: ()=> {
                toast.success("Email Sent")
            }, 
            onError: (error) => {
                console.log(error)
                toast.error("Error sending email")
            }

        })

    }

            return (
                <Drawer>
                    <DrawerTrigger>
                        <Button> <Pencil className='size-4 mr-1' /> Compose </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Compose Email</DrawerTitle> 
                        </DrawerHeader>

                        <EmailEditor 
                            toValues={tovalues}
                            setToValues={setToValues}
                            ccValues={ccValues}
                            setCcValues={setCcValues}
                            subject={subject}
                            setSubject={setSubject}

                            handleSend={handleSend}
                            isSending={sendEmail.isPending}
                            defaultToolbarExpanded={false} 
                            to={tovalues.map(to => to.value)}                        />

                     </DrawerContent>
                </Drawer>
            )
}

export default ComposeButton