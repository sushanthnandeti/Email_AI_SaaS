import React, { useEffect } from 'react'
import { searchValueAtom } from './search-bar'
import { useAtom } from 'jotai'
import { api } from '@/trpc/react'
import { useDebounceValue } from 'usehooks-ts'
import DOMPurify from 'dompurify'
import useThreads from '@/hooks/use-threads'

const SearchDisplay = () => {

    const [searchValue]  = useAtom(searchValueAtom)
    const search = api.account.searchEmails.useMutation()
    const [debouncedSearchValue] = useDebounceValue(searchValue, 500)
    const {accountId} = useThreads()

    useEffect(()=> {
        if (!accountId) return

        search.mutate({
            accountId, 
            query: debouncedSearchValue,
        })

        console.log(debouncedSearchValue)
     },[debouncedSearchValue, accountId])

    return (
        <div className='p-4 max-h-calc[100vh-50px] overflow-y-scroll'>
            <div className='flex items-center gap-2 mb-4'>
                <h2 className='text-gray-600 text-sm dark:text-gray-400'>
                        Your Search for &quot; {searchValue} &quot; : came back with...
                </h2>
            </div>
            <ul className='flex flex-col gap-2'>
            {search.data?.hits.length === 0 ? (<>
                <p> No Results found. </p> </>) : <>
                {search.data?.hits.map(hit => (
                    <li key={hit.id} className="border rounded-md list-none p-4 hover:bg-gray-100 cursor-pointer transition-all dark:hover:bg-gray-900">
                        <h3 className='text-base font-medium'>
                                {hit.document.subject}
                        </h3>

                        <p className='text-sm text-gray-500'>
                            From : {hit.document.from}
                        </p>

                        <p className="text-sm text-gray-500">
                            To : {hit.document.to.join(' ')}
                        </p>

                        <p className='text-sm- mt-2' dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(hit.document.rawbody, { USE_PROFILES : {html: true}})
                        }} >

                        </p>
                    </li>

                    
                ))}
                </> }
                </ul>
        </div>
    )
}

export default SearchDisplay