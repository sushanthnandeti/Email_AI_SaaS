"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { generateEmail } from './action'
import { readStreamableValue } from 'ai/rsc'
  

type Props = {
    isComposing : Boolean, 
    onGenerate : (token: string) => void

}

const AiComposeButton = (props: Props) => {

    const [open, setOpen] = React.useState(false)
    const [prompt, setPrompt] = React.useState('')

    const aiGenerate = async(prompt: string) => {
        const {output} = await generateEmail('', prompt)
        for await (const token of readStreamableValue(output)) {
            if(token) {
                console.log(token)
                props.onGenerate(token)
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button size='icon' variant={'outline'} onClick={() => setOpen(true)}>
                    <Bot className='size-5' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
                <div className="h-2"></div>
                <Textarea value={prompt} onChange = {(e) => setPrompt(e.target.value)} placeholder='Enter a prompt..' />
                <div className="h-2"></div>
                <Button onClick={() => {
                    aiGenerate(prompt)
                    setOpen(false)
                    setPrompt("")
                }} > 
                    Generate
                </Button>
                </DialogHeader>
            </DialogContent>
            </Dialog>

      )
    
}

export default AiComposeButton