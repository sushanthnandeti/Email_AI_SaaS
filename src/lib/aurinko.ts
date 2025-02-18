"use server"

import { auth } from "@clerk/nextjs/server"
import axios from "axios";
import { getSubscriptionStatus } from "./stripe_actions";
import { db } from "@/server/db";
import { FREE_ACCOUNTS_PER_USER, PRO_ACCOUNTS_PER_USER } from "@/constants";


export const getAurinkoAuthUrl = async(serviceType : 'Google' | 'Office365') => {

    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized")
    
    const isSubscribed = await getSubscriptionStatus()
    const accounts = await db.account.count({ where : { userId }})
    
    if (isSubscribed) {
        if (accounts >= PRO_ACCOUNTS_PER_USER) {
            throw new Error('You have reached maximum number of accounts for your subscription')
        }
    } else {
            if (accounts >= FREE_ACCOUNTS_PER_USER) {
                throw new Error('You have reached the maximum number of accounts for your subscription')
            }
        }
    

    const params = new URLSearchParams({
        clientId : process.env.AURINKO_CLIENT_ID as string, 
        serviceType, 
        scopes :'Mail.Read Mail.ReadWrite Mail.send Mail.Drafts Mail.All',
        responseType :'code',
        returnUrl : `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
    })

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}


export const exchangeCodeForToken = async( code: string) => {

    try {
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
            auth: {
                username : process.env.AURINKO_CLIENT_ID as string,
                password : process.env.AURINKO_CLIENT_SECRET as string,
            }
        })
        console.log("Sushanth, the respons is ",response.data)
        return response.data as {
            accountId : number,
            accessToken : string,
            userId : string, 
            userSession : string
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data);
        }
        console.error(error); 
    }
}


export const getAccountDetails = async(accessToken : string) => {
    try {
        const response = await axios.get('https://api.aurinko.io/v1/account', {

            headers : {
                'Authorization' : `Bearer ${accessToken}`
            }
       
        })
            console.log("The response is :", response);
            return response.data as {
                email: string 
                name: string
            }
        
    } catch (error) {

        if(axios.isAxiosError(error)) {
            console.error('Error fetching account details', error.response?.data);
        } else { 
            console.error('Unexpected error fetching account details', error)
        }
        throw error;
    }
}