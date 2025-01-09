import {OpenAIApi, Configuration} from 'openai-edge';

const config =  new Configuration({
    apiKey: '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'
    
})

const openai = new OpenAIApi(config)

export async function getEmbeddings( text: string ) {
    
    try {

        const response = await openai.createEmbedding({
            model : 'text-embedding-ada-002',
            input : text.replace(/\n/g, ' ')
        })
        const result = await response.json()
        console.log(result.length)
        return result.data[0].embedding as number[]

    } catch (error) {
        console.log("Error creating the embeddings from the api", error)
        throw error
    }
}

