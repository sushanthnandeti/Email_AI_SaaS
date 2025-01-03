import Select from 'react-select'
import React from 'react'

type Props = {
    defaultValues : {label : string , value : string} [],
    placeholder : string, 
    label : string 

    onChange : (values : {label : string , value : string}[]) => void
    value : {label: string , value : string}

}

const TagInput = ({defaultValues, placeholder, label, onChange, value}: Props) => {
  return (
        <div className='border rounded-md flex items-center'>
            <span className='ml-3 text-sm text-gray-500'>
                {label}
            </span>
            
            <Select
                value= {value}
                onChange = {onChange}
                options = {defaultValues}
                placeholder = {placeholder}
                isMulti = {true}
            />
        </div>
  )
}

export default TagInput