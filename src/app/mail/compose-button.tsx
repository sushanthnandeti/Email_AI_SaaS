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
  

const ComposeButton= () => {

    const [tovalues, setToValues] = React.useState<{ label: string, value : string }[]>([])
    const [ccValues, setCcValues] = React.useState<{ label: string, value : string }[]>([])


    const [subject, setSubject] = React.useState<string>('')

    const handleSend = () => {
        console.log('sent')
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
                            isSending={false}
                            defaultToolbarExpanded={false} 
                            to={tovalues.map(to => to.value)}                        />

                     </DrawerContent>
                </Drawer>
            )
}

export default ComposeButton