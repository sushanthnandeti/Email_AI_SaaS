import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "@clerk/nextjs/server";
import { OramaClient } from "@/lib/orama";

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Ensure API key is loaded correctly
    })
);

export async function POST(req: Request) {
    try {
        // Authenticate user
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Parse request body
        const { accountId, messages } = await req.json();
        const orama = new OramaClient(accountId);
        await orama.initialize();

        // Fetch the last message and perform vector search
        const lastMessage = messages[messages.length - 1];
        console.log("Last message:", lastMessage);

        const context = await orama.vectorSearch({ term: lastMessage.content });
        console.log(`${context.hits.length} hits found`);

        // Build the system prompt
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

        // Create a streaming chat completion request
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [prompt, ...messages.filter((message: any) => message.role === "user")],
            stream: true,
        });

        // Return the streaming response directly
        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}