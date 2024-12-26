"use client"

import React,{useState} from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { cn } from '@/lib/utils'


type Props = {
    defaultLayout : number[] | undefined
    navCollapsedSize : number
    defaultCollapse: boolean
}

const Mail = ({ defaultLayout = [20,32,48],navCollapsedSize,defaultCollapse } : Props, ) => {


  const [isCollapsed, setIscollapsed] = useState(defaultCollapse)

  return (
    <TooltipProvider  delayDuration={0}> 

        <ResizablePanelGroup  direction='horizontal' onLayout={(sizes : number[]) => {
            console.log(sizes)
        }} className='items-stretch h-full min-h-screen'>
        
            <ResizablePanel defaultSize={defaultLayout[0]} collapsedSize={navCollapsedSize} 
                collapsible = {true}
                minSize={15}
                maxSize={40}
                onCollapse={() => {
                    setIscollapsed(true)
                }}
                onResize={() => {
                    setIscollapsed(false)
                }}

                className={cn(isCollapsed && 'min-w-[50px] trasition-all duration-300 ease-in-out')}
            >
            

                 <div className=' flex flex-col h-full flex-1'>

                        <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px]' : 'px-2')}>
                
                             Account Switcher
                        </div>
                        
                
                </div>
            
            
            </ResizablePanel>

        </ResizablePanelGroup>

    </TooltipProvider>
  )
}

export default Mail