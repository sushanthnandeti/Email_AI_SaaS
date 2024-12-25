// receive the initial request from our end
import { db } from '@/server/db';
import React from 'react'
import { NextRequest, NextResponse } from 'next/server';
import { Account } from '@/lib/account';


export const POST = async( req: NextRequest) => {

  const {accountId, userId} = await req.json();

  if(!accountId || !userId) {
    return NextResponse.json({Error: 'Missing accountId or userId, Check again'}, {status : 400})
  }     

  const dbAccount = db.account.findUnique( {
    where : {
      id  : accountId,
      userId
    }
  })

  if (!dbAccount) return NextResponse.json({error : "Account not found"}, {status : 400})

  const account = new Account(dbAccount.AccessToken);


  const response = await account.performInitialSync();

  if(!response) return NextResponse.json({ error : "Failed to perform the initial sync"} , {status : 500})

  const {emails, deltaToken} = response

  console.log(emails,deltaToken)

/*   await db.account.update({
    where: {
      id: accountId
    },
    data: { 
      nextDeltaToken : deltaToken
    }
  })

  await syncEmailsToDatabase(emails) */
}

