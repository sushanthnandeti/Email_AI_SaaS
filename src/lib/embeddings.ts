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

