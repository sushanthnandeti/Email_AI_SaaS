import { Configuration, OpenAIApi } from "openai-edge";
import { Message, streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { OramaClient } from "@/lib/orama";
import { openai } from '@ai-sdk/openai';
import { getSubscriptionStatus } from "@/lib/stripe_actions";
import { db } from "@/server/db";
import { FREE_CREDITS_PER_DAY } from "@/constants";
import { toast } from "sonner";

// Initialize OpenAI client
/* const openai = new OpenAIApi(
    new Configuration({
        apiKey: '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'
    })
); */

export async function POST(req: Request) {

    const today = new Date().toDateString()

    try {
        // Authenticate the user
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const isSubscribed = await getSubscriptionStatus()
        
        if(!isSubscribed) {
            const chatbotInteraction = await db.chatbotInteraction.findUnique({
                where: {
                    day : today,
                    userId  
                }
            })
            if(!chatbotInteraction) {
                await db.chatbotInteraction.create({
                    data: {
                        day : today, 
                        userId,
                        count : 1
                    }
                })
            } else if (chatbotInteraction.count >= FREE_CREDITS_PER_DAY ) {
                
                return new Response("You have reached your daily free chat limit", { status: 429 });
                    }
            }

        // Parse request body
        const { accountId, messages } = await req.json();

        // Initialize Orama client
        const orama = new OramaClient(accountId);
        await orama.initialize();

        // Get the last user message and perform a vector search
        const lastMessage = messages[messages.length - 1];
        console.log("Last message:", lastMessage);

        const context = await orama.vectorSearch({ term: lastMessage.content });
        console.log(`${context.hits.length} hits found`);

        // Create the system prompt with context
        const prompt = {
            role: "system",
            content: `You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails.
            THE TIME NOW IS ${new Date().toLocaleString()}
            
            START CONTEXT BLOCK
            ${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
            END OF CONTEXT BLOCK
            
            When responding, please keep in mind:
            - Be helpful, clever, and articulate.
            - Rely on the provided email context to inform your responses.
            - If the context does not contain enough information to answer a question, politely say you don't have enough information.
            - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
            - Do not invent or speculate about anything that is not directly supported by the email context.
            - Keep your responses concise and relevant to the user's questions or the email being composed.`,
        };

        // Create a streaming chat completion
        const result = streamText({
            model: openai('gpt-3.5-turbo'),
            messages: [
                prompt,
                ...messages.filter((message: Message) => message.role === "user"),
            ],
           
        });
        // Return the streaming response
        async() => {
            await db.chatbotInteraction.update( {
                where : {
                    day: today, 
                    userId
                },
                data : {
                    count: {
                        increment : 1
                    }
                }
            })
        }
        return result.toDataStreamResponse();

      
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}