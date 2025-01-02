"use client"

import React from 'react';
import StarterKit from '@tiptap/starter-kit';
import {EditorContent, useEditor} from '@tiptap/react';
import {Text} from '@tiptap/extension-text'

 
type Props = {}

const EmailEditor = (props: Props) => {

    const [value, setValue] = React.useState<string>('')
    const CustomText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Meta-j': ()=> {
                    console.log("Email Autocomplete")
                    return true
                }
            }
        },
    })
    
    const editor = useEditor({
        autofocus : false,
        extensions : [StarterKit, CustomText],
        onUpdate : ({editor}) => {
            setValue(editor.getHTML())
        }
    })
    return (
        <div>
            <div className='prose w-full px-4'>
                <EditorContent editor={editor} value={value}></EditorContent>
            </div>
        </div>
    )
}

export default EmailEditor