"use client"

import React,{useState} from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AccountSwitcher from './account-switcher'



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
            
            {/* Panel 1 */}
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
                         {/* Account Switcher */}
                        <div className={cn('flex h-[52px] items-center justify-between', isCollapsed ? 'h-[52px]' : 'px-2')}>
                            
                             <AccountSwitcher isCollapsed = {isCollapsed} />    
                        </div>
                        
                        <Separator />
                         {/* SideBar */}
                         SideBar

                        <div className='flex-1'>  </div>
                           {/*  Ask AI */}
                           ASK AI
                </div>
            </ResizablePanel>    
            <ResizableHandle withHandle/>
            {/* Panel 2 */}
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                <Tabs defaultValue='inbox'>
                    <div className='flex items-center px-4 py-2'> 
                        <h1 className='text-xl font-bold'> Inbox</h1>
                        <TabsList className='ml-auto'>
                            <TabsTrigger value='inbox' className='text-xinc-600 dark:text-zinc-200'> Inbox</TabsTrigger>
                            <TabsTrigger value='done' className='text-xinc-600 dark:text-zinc-200'> Done</TabsTrigger>
                        </TabsList>
                    </div>

                <Separator />
                    {/* Seach Bar */}
                     Search Bar
                <TabsContent value={'inbox'}> 
                     Inbox
                </TabsContent>
                <TabsContent value={'done'}> 
                     done
                </TabsContent>
                </Tabs>

            </ResizablePanel>
            <ResizableHandle withHandle /> 
            {/* Panel 3 */}
            <ResizablePanel defaultSize= {defaultLayout[2]} minSize = {30}>
                    thread display here
            </ResizablePanel>
        </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default Mail