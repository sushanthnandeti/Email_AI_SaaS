import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts';
import {atom, useAtom} from 'jotai';

export const threadIdAtom = atom<string | null> (null)

const useThreads = () => {


  const {data : accounts, isFetching, refetch} = api.account.getAccounts.useQuery();
  console.log(accounts);
  const [accountId] = useLocalStorage("accountId", '');
  const [tab] = useLocalStorage("normalhuman-tab", "inbox");
  const [done] = useLocalStorage("normalhuman-done", false);
  const [threadId, setThreadId] = useAtom(threadIdAtom)

  console.log("Your account id is:", accountId)

  const {data: threads} = api.account.getThreads.useQuery({
    accountId,
    tab,
    done
  } , 
  {
    enabled : !!accountId && !! tab, placeholderData: (e) => e, refetchInterval : 5000
  })
  console.log(accountId);
  return {
    threads, 
    isFetching,
    refetch,
    accountId,
    threadId,
    setThreadId,
    account: accounts?.find(e=>e.id === accountId)
  }
}
export default useThreads