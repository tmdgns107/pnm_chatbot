import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import * as util from "./util";

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log("Event", event);

    try{
        let alias: string = 'dev';
        if(event.requestContext.path.includes('/prod/') || event.requestContext.path.includes('/live/')) {
            alias = 'prod';
        }

        const body: any = JSON.parse(event.body);
        const {isFirst, userId, text} = body;

        let gptResponse = await util.callGptAPI(userId, text);
        console.log("gptResponse", gptResponse);

        return sendResponse(null, '', '');
    }catch (e) {
        console.log("An error occurred while searching the gpt api.", e);
        return sendResponse(101, '', 'An error occurred while searching the gpt api.');
    }
};


/** 결과 리턴 함수 **/
function sendResponse(errorCode: number, answer: string, message: string): object{
    let response: APIGatewayProxyResultV2 = {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true},
        body: ''
    };
    let responseBody: { message: string; errorCode: number, answer: string};
    responseBody = {
        message: '',
        errorCode: null,
        answer: ''
    };

    if(errorCode)
        response.statusCode = 400;
    responseBody.message = message;
    responseBody.errorCode = errorCode;
    responseBody.answer = answer;
    response.body = JSON.stringify(responseBody);
    return response;
}