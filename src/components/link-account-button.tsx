"use client"

import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";

const LinkAccountButton = () => {
    
    return (
        <Button  className="flex justify-center items-center" onClick={ async() => {
            const authurl = await getAurinkoAuthUrl('Google');
            window.location.href = authurl;
            console.log(authurl);
        }}> 
            Link Account
        </Button>
    )
}

export default LinkAccountButton