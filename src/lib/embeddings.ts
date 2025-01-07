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
        return result.data[0].embedding as number[]

    } catch (error) {
        console.log("Error creating the embeddings from the api", error)
        throw error
    }
}



