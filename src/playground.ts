
import { getEmbeddings } from "./lib/embeddings";
import { OramaClient } from "./lib/orama";
import { turndown } from "./lib/turndown";
import { db } from "./server/db";
import { create, insert, search, type AnyOrama} from "@orama/orama";

const orama = new OramaClient('87817')
await orama.initialize()


const emails = await db.email.findMany({
    select: {
        subject : true,
        body: true,
        from: true,
        to: true,
        sentAt : true,
        threadId : true,
        bodySnippet: true,
    }
})

await Promise.all(emails.map(async(email) => {

    const body = turndown.turndown(email.body ?? email.bodySnippet ?? "")
    const embeddings = await getEmbeddings(body)
    console.log(embeddings.length)
    await orama.insert({
        subject: email.subject,
        body: body,
        rawBody: email.bodySnippet ?? "",
        from: email.from.address,
        to: email.to.map(to => to.address),
        sentAt: email.sentAt.toLocaleString(),
        threadId: email.threadId,
        embeddings
    })
}))

await orama.saveIndex()

const searchResult = await orama.vectorSearch({
    term: "google",
})

console.log(searchResult.hits)