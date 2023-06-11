import axios from 'axios';

/** GPT API **/
export async function callGptAPI(userId: string, text: string): Promise<any>{
    try{
        const GPT_API_KEY: string = process.env.GPT_API_KEY;
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci/completions',
            {
                prompt: `${text}\n 질문의 답변은 'answer' 변수에 전달해주기 바란다.`,
                max_tokens: 300,
                temperature: 0.7,
                n: 1,
                stop: '\n',
                user_id: userId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${GPT_API_KEY}`,
                },
            }
        );

        console.log(`callGptAPI response.data ${response.data}`);
        if(!response.data){
            console.log("GPT API response error");
            return false;
        }

        return response.data;
    }catch (e) {
        console.log("Error in addressExtract", e);
        return false;
    }
}

