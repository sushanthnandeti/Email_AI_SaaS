import { exchangeCodeForToken,  getAccountDetails } from "@/lib/aurinko";
import { auth, EmailAddress } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/server/db";

export const GET = async(req: NextRequest) => {

    const {userId} = await auth();

    if (!userId) throw NextResponse.json({ message : "unauthorized"}, {status: 401})
    
    const params = req.nextUrl.searchParams
    const status = params.get('status')   


    if(status != 'success') return NextResponse.json({ message: 'Failed to link account'}, {status : 401})

    // get the code to exchange for access token 

        const code = params.get('code');

        console.log("code is :", code);

        if(!code) return NextResponse.json({ message: 'Failed to link account'}, {status : 401})

        const token = await exchangeCodeForToken(code);

        if(!token) return NextResponse.json({ message: 'Failed to exchange for access token'}, {status : 401})
        
    // get the account details by exchanging the token 

        const accountDetails = await getAccountDetails(token.accessToken);
        
        console.log(token.accessToken);
        console.log(accountDetails);
        
        await db.account.upsert({
            where : {
                id: token.accountId.toString()
            },
            update: {
                accessToken : token.accessToken,
            },
            create : {
                id: token.accountId.toString(),
                userId, 
                emailAddress : accountDetails.email,
                name: accountDetails.name, 
                accessToken : token.accessToken, 
            }
        }
        )
        
        return NextResponse.redirect(new URL('/mail', req.url))
    };