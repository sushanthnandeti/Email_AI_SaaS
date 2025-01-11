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

