import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'

const AskAi = ( {isCollapsed} : {isCollapsed : boolean}) => {

    const messages : any[] = []
    if (isCollapsed) return null
    return (
        <div className='p-4 mb-14'>
            <motion.div className='flex flex-1 flex-col items-end pb-4 rounded-lg bg-gray-100 shadow-inner dark:bg-gray-90'>
                <div className='max-h-[50vh] overflow-y-scroll w-full flex flex-col gap-2 ' id = 'message-container'> 
                    <AnimatePresence mode='wait' >
                        {messages.map(message => {
                            return <motion.div key={message.id} layout = 'position' 
                                className= {cn('z-10 mt-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800', {
                                    'self-end text-gray-900 dark:text-gray-100' : message.role === 'user', 
                                    'self-start bg-blue-500 text-white' : message.role === 'assistant'  
                                })}
                                layoutId = {`container - [${message.length - 1}]`}
                                transition={{
                                    type :'easeout', 
                                    duration: 0.2
                                }}
                            > 
                                <div className='px-3 py-2 text-[15px] leading-[15px]' > 
                                        {message.content}
                                </div>
                                
                            </motion.div>
                        })}
                        
                    </AnimatePresence>    
                 </div>   

                 <div className='w-full'>
                        <form className='w-full flex'>
                            <input type='text'
                                className='py-1 relative h-9 placeholder:text-[13px] flex-grow rounded-full border border-gray-200 bg-white px-3 text-[15px] outline-none'
                                placeholder='Ask AI'
                            />

                        <motion.div key = {messages.length}
                            layout = 'position'
                            layoutId = {`container - [${messages.length}]`}
                            transition = {{
                                type : 'easeOut',
                                duration : 0.2
                            }}
                            initial =  {{opacity : 0.6, zIndex : -1}}
                            animate  = {{opacity : 0.6, zIndex : -1}}
                            exit =     {{ opacity : 1, zIndex : 1}} 
                        >

                        <div className='px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100'>
                                // input    
                        </div>

                        </motion.div> 

                            <button type = 'submit' className='ml-2 flex size-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800'>
                                    <Send className='siz-4 text-gray-500 dark:text-gray-400' />
                            </button>
                        </form>

                 </div>
            </motion.div>
        </div>
    )
    }

export default AskAi