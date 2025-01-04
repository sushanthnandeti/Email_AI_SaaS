import axios from "axios";
import { SyncResponse, SyncUpdatedResponse } from "./types";
import { EmailMessage } from "./types"; 
import { EmailAddress } from "@clerk/nextjs/server";
import { Email } from "@prisma/client";
import { db } from "@/server/db";
import { syncEmailsToDatabase } from "./sync-to-db";

export class Account {
    private token: string;

    constructor(token:string) {
        this.token = token;
    }

    private async startSync()  {
        const response = await axios.post<SyncResponse>('https://api.aurinko.io/v1/email/sync', {}, {
        
            headers : {
                Authorization : `Bearer ${this.token}`,
            },
            params : {
                dayswithin : 2,
                bodyType : 'html'
            }
        })

        return response.data;   
    }

    async getUpdatedEmails( {deltaToken, pageToken} : {deltaToken? : string , pageToken? : string }) {

        let params : Record<string, string> = {}
        if (deltaToken) params.deltaToken = deltaToken
        if (pageToken) params.pageToken = pageToken

        const response = await axios.get<SyncUpdatedResponse>('https://api.aurinko.io/v1/email/sync/updated', {
            headers : {
                Authorization : `Bearer ${this.token}`,
            },
            params
        })

        return response.data

    }
 
    async performInitialSync() {
      try {
          // start the sync process here by providing the token to aurinko

          let syncResponse = await this.startSync()
          while(!syncResponse.ready) {
              await new Promise(resolve => setTimeout(resolve, 1000))
              syncResponse = await this.startSync()
  
          }
  
          // get the bookmark delta token from aurinko 
  
          let storedDeltaToken : string = syncResponse.syncUpdatedToken
  
          let updatedResponse = await this.getUpdatedEmails( {deltaToken : storedDeltaToken})
  
          if(updatedResponse.nextDeltaToken) {
              // sync has completed
  
              storedDeltaToken = updatedResponse.nextDeltaToken;
          }   
  
          let allEmails : EmailMessage[] = updatedResponse.records;
  
          // fetch all pages if there are more
  
          while(updatedResponse.nextPageToken) {
  
              updatedResponse = await this.getUpdatedEmails( {pageToken : updatedResponse.nextPageToken})
              allEmails = allEmails.concat(updatedResponse.records);
  
              if(updatedResponse.nextDeltaToken) {
                  // sync cycle has ended
                  storedDeltaToken = updatedResponse.nextDeltaToken;
              }
          }        
  
          console.log("Initial sync has completed", allEmails.length, 'emails');

        // store the latest delta token for future increments

            await this.getUpdatedEmails({deltaToken : storedDeltaToken})

            return { 
                emails : allEmails,
                deltaToken: storedDeltaToken
            }

      }
      catch (error) {{
            if(axios.isAxiosError(error)) {
                console.error('Error during sync' , JSON.stringify(error.response?.data, null, 2));  
            }
            else {
                console.error('Error during sync' , error);
      }
    }}
}

    async syncEmail() {
        const account =  await db.account.findUnique({
            where: {accessToken : this.token}
        })

        if(!account) throw new Error('Account not found')
        if(!account.nextDeltaToken) throw new Error("Account not ready for Sync")

        let response = await this.getUpdatedEmails({
            deltaToken: account.nextDeltaToken
        })
        let storedDeltaToken = account.nextDeltaToken
        let allEmails  : EmailMessage[] = response.records

        if(response.nextDeltaToken) {
            storedDeltaToken = response.nextDeltaToken
        }

        while (response.nextDeltaToken) { 
            response = await this.getUpdatedEmails({pageToken : response.nextPageToken} )
            allEmails  = allEmails.concat(response.records)
            
            if(response.nextDeltaToken) {
                storedDeltaToken = response.nextDeltaToken
            }
        }
         try {
            syncEmailsToDatabase(allEmails, account.id)
         } catch (error) {  
            console.log('Error during sync', error)
         }    

         return { 
            emails: allEmails,
            deltaToken : storedDeltaToken
         }
    }

    async sendEmail ( {
        from,
        subject,
        body,
        inReplyTo,
        threadId,
        references,
        to,
        cc,
        bcc,
        replyTo,
    }: {

        from: EmailAddress,
        subject: string,
        body: string, 
        inReplyTo?: string, 
        threadId? : string, 
        references?: string ,
        to: EmailAddress[],
        cc?: EmailAddress[],
        bcc?: EmailAddress[],
        replyTo?: EmailAddress[],
    
        }) {

            try {
                const response = await axios.post('https://api.aurinko.io/v1/email/messages', {
                    from,
                    subject,
                    body,
                    inReplyTo,
                    threadId,
                    references,
                    to,
                    cc,
                    bcc,
                    replyTo : [replyTo],
                }, {
                    params :  {
                        returnsId : true
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                    },
                 }) 

                 console.log('Email sent', response.data)
                 return response.data
                }
                    catch (error) {
                        if(axios.isAxiosError(error)) {
                        console.error('Error sending email', JSON.stringify(error.response?.data, null, 2));
                        }
                        else {
                            console.error('Error sending email', error)
                        }

                        throw error
            }

    }
}