import { db } from "@/server/db";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { error } from "console";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { emailAddressSchema } from "@/lib/types";
import { Account } from "@/lib/account";
import { OramaClient } from "@/lib/orama";




export const authoriseAccountAccess = async( accountId : string, userId : string) => {
    const account = await db.account.findFirst( {
        where : {
            id: accountId,
            userId
        }, select : { 
            id: true, emailAddress: true, name: true, accessToken: true
        }
    })

    if(!account) throw error('Account not found');
    return account;
}

export const accountRouter = createTRPCRouter({

    getAccounts: privateProcedure.query(async ({ctx}) => {
        return await ctx.db.account.findMany({
            where: {
                userId : ctx.auth.userId
            },
            select: {
                id: true, emailAddress: true, name: true,
            }
        })
    }), 
    getNumThreads : privateProcedure.input(z.object({
            accountId : z.string(),
            tab: z.string()
    })).query(async ({ctx,input}) => {
            const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)

            let filter: Prisma.ThreadWhereInput = {}

            if (input.tab === "inbox") {
                filter.inboxStatus = true
            }
            else if (input.tab === "sent") {
                filter.sentStatus = true
            }
            else if (input.tab === "draft") {
                filter.draftStatus = true
            }
            return await ctx.db.thread.count({
                where: {
                    accountId : account.id,
                    ...filter
                }
            }) 
        }), 
        
    getThreads : privateProcedure.input(z.object({
        accountId: z.string(),
        tab : z.string(),
        done: z.boolean()
    })).query(async ({ ctx, input}) => {
        
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        
        // Adding the sync emails logic to the getThreads procedure 

        const acc = new Account(account.accessToken) 
        acc.syncEmails().catch(console.error)

        // Back to the getThreads section

        let filter: Prisma.ThreadWhereInput = {}

        if (input.tab === "inbox") {
            filter.inboxStatus = true
        }
        else if (input.tab === "sent") {
            filter.sentStatus = true
        }
        else if (input.tab === "draft") {
            filter.draftStatus = true
        }

        filter.done = {
            equals: input.done
        }
        return await ctx.db.thread.findMany({
            where : filter, 
            include : {
                emails : {
                    orderBy : { 
                        sentAt : "asc"
                    },
                    select : {
                        from: true, 
                        body: true, 
                        bodySnippet: true, 
                        emailLabel: true, 
                        subject: true, 
                        sysLabels: true, 
                        id: true, 
                        sentAt: true,
                    }
                }
            },
            take: 15,
            orderBy : {
                lastMessageDate: "desc"  
            }
        })
        //return threads
}),
    getSuggestions : privateProcedure.input(z.object({
        accountId : z.string()
    })).query(async ({ctx, input}) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        return await ctx.db.emailAddress.findMany({
            where : { 
                accountId : account.id, 
            },
            select : {
                address: true, 
                name : true,
            }
        })
    }), 

    getReplyDetails: privateProcedure.input(z.object({
        accountId: z.string(),
        threadId: z.string()
    })).query(async({ctx, input}) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        const thread = await ctx.db.thread.findFirst({
            where: {
                id: input.threadId,
            },
            include: {
                emails: {
                    orderBy: {sentAt: 'asc'},
                    select: {
                        from: true, 
                        to: true, 
                        cc: true, 
                        bcc: true, 
                        sentAt: true, 
                        subject : true,
                        internetMessageId: true
                    }
                }
            }
        })
        if(!thread || thread.emails.length === 0) throw new Error('Thread not')
            
        const lastEternalEmail  = thread.emails.reverse().find(email => email.from.address !== account.emailAddress)
        if(!lastEternalEmail) throw new Error('No External email found')

        return {
            subject : lastEternalEmail.subject,
            to : [lastEternalEmail.from, ...lastEternalEmail.to.filter(to => to.address !== account.emailAddress)],
            cc: lastEternalEmail.cc.filter(cc => cc.address !== account.emailAddress),
            from: {name: account.name, address : account.emailAddress}
        }
     }),

     sendEmail : privateProcedure.input(z.object({
        accountId : z.string(),
        body: z.string(),
        subject: z.string(),
        from: emailAddressSchema,
        cc: z.array(emailAddressSchema).optional(),
        bcc: z.array(emailAddressSchema).optional(),
        to: z.array(emailAddressSchema),

        replyTo: emailAddressSchema,
        inReplyTo: z.string().optional(),
        threadId: z.string().optional(),
     })).mutation( async ( { ctx, input}) => {
        const account  = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        const acc = new Account(account.accessToken)
        await acc.sendEmail({
            body: input.body, 
            subject: input.subject,
            from: input.from,
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            replyTo: input.replyTo,
            inReplyTo: input.inReplyTo,
            threadId: input.threadId,       
        })
     }),

     searchEmails: privateProcedure.input(z.object({
        accountId : z.string(),
        query: z.string()
     })).mutation(async ({ ctx, input}) => {
        const account  = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        const orama =  new OramaClient(account.id)
        await orama.initialize()
        const results = await orama.search({term: input.query})

        return results
     })
        
        
})