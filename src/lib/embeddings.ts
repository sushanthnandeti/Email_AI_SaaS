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

