import { Configuration, OpenAIApi } from "openai";

/** GPT API **/
export async function callGptAPI(messages: any[]): Promise<any>{
    try{
        const GPT_API_KEY: string = process.env.GPT_API_KEY;
        const configuration = new Configuration({
            apiKey: GPT_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
        });

        console.log(`callGptAPI response.data ${JSON.stringify(response.data, null, 2)}`);
        if(!response.data){
            console.log("GPT API response error");
            return false;
        }

        let answer: any = {};
        answer.role = 'system';
        answer.content = response.data.choices[0].message.content;

        messages.push(answer);

        return messages;
    }catch (e) {
        console.log("Error in callGptAPI", JSON.stringify(e, null, 2));
        return false;
    }
}

