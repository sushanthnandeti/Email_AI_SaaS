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
        console.log(result)
        return result.data[0].embedding as number[]

    } catch (error) {
        console.log("Error creating the embeddings from the api", error)
        throw error
    }
}

