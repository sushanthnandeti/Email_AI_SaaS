"use client"

import React from 'react'
import {KBarProvider, KBarPortal, KBarAnimator, KBarSearch, KBarPositioner} from 'kbar';


export default function KBar({ children } : {children : React.ReactNode}) {
    return <KBarProvider>
            <ActualComponent>
                {children}
            </ActualComponent>
    </KBarProvider>
}


const ActualComponent = ({children} : {children : React.ReactNode }) => {
  return (
    <>
    <KBarPortal>
        <KBarPositioner className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm scrollbar-hide !p-0 z-[99999]">
            <KBarAnimator className="max-w-[600px] !mt-64 w-full bg-white dark:bg-gray-800 text-foreground dark:text-gray-200 shadow-lg border dark:border-gray-700 rounded-lg overflow-hidden relative !-translate-y-12">
                <div className="bg-white dark:bg-gray-800">
                    <div className="border-x-0 border-b-2 dark:border-gray-700">
                        <KBarSearch className="py-4 px-6 text-lg w-full bg-white dark:bg-gray-800 outline-none border-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
                    </div>
                </div>
            </KBarAnimator>
        </KBarPositioner>
    </KBarPortal>
    {children}
</>
  )
}
