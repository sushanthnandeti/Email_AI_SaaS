'use client'

import { Input } from '@/components/ui/input'
import useThreads from '@/hooks/use-threads'
import { useAtom, atom} from 'jotai'
import { Loader2, Search, X } from 'lucide-react'
import React from 'react'

const searchValueAtom = atom('')

const SearchBar = () => {

    const [searchValue , setSearchValue] = useAtom(searchValueAtom)
    const {isFetching} = useThreads()
    
  return (
        <div className='relative m-4'>
            <Search className = 'absolute left-2 top-2.5 size-4 text-muted-foreground' />
                <Input 
                    placeholder='search...'
                    className='pl-8'
                    value = {searchValue}
                    onChange = {e => setSearchValue(e.target.value)}
                />

            <div className='absolute right-2 top-2.5 flex items-center gap-2'>
                {isFetching && <Loader2 className = 'size-4 animate-spin text-gray-400' /> }

                <button className='rounded-sm hover:bg-gray-400/20' onClick={() => setSearchValue('')}>
                    <X className = 'size-4 text-gray-400' />
                
                </button>
        </div>

       

        </div>
  )
}

export default SearchBar