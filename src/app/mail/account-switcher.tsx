"use client"
import {useLocalStorage} from "usehooks-ts";
import { api } from "@/trpc/react"
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

type Props = {
    isCollapsed : boolean
}

const AccountSwitcher = ({isCollapsed} : Props) => {

    const {data} = api.account.getAccounts.useQuery();
    const [accountId, setAccountId] = useLocalStorage("accountId", "")

    if(!data) return null

    return (
        <Select defaultValue={accountId} onValueChange={setAccountId}>

            <SelectTrigger 
                className={cn("flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                                isCollapsed &&
                                "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden")} aria-label=" Select Account">

                        <SelectValue placeholder = "Select an Account"> 
                            <span className={cn({"hidden" : !isCollapsed})}> 
                                {data.find(account =>  account.id === accountId)?.emailAddress[0]}
                            </span>

                            <span className={cn({"hidden" : isCollapsed})}> 
                                {data.find(account =>  account.id === accountId)?.emailAddress}
                            </span>
                        </SelectValue>

                        <SelectContent>
                                {data.map((account) => {
                                    return (
                                        <SelectItem key={account.id} value = {account.id}>
                                                {account.emailAddress}
                                        </SelectItem>
                                    )
                                })}
                            
                        </SelectContent>

            </SelectTrigger>

        </Select>    
    )
}

export default AccountSwitcher;