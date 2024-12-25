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

  const dbAccount =  await db.account.findUnique( {
    where : {
      id  : accountId,
      userId
    },
    select: {
      accessToken: true, // Explicitly fetch accessToken
    },
  });

  if (!dbAccount || !dbAccount.accessToken) return NextResponse.json({error : "Account not found"}, {status : 400})

  const account = new Account(dbAccount.accessToken);

  const response = await account.performInitialSync();

  if(!response) return NextResponse.json({ error : "Failed to perform the initial sync"} , {status : 500})

  const {emails, deltaToken} = response

  console.log(emails,deltaToken)

  return NextResponse.json({ message: "Initial sync completed", emails, deltaToken }, { status: 200 });

}
/*   await db.account.update({
    where: {
      id: accountId
    },
    data: { 
      nextDeltaToken : deltaToken
    }
  })

  await syncEmailsToDatabase(emails) */


