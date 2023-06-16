import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';
import * as util from "./util";

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log("Event", event);

    try{
        // let alias: string = 'dev';
        // if(event.requestContext.path.includes('/prod/') || event.requestContext.path.includes('/live/')) {
        //     alias = 'prod';
        // }

        const body: any = JSON.parse(event.body);
        let {messages} = body;
        if(!messages || (messages && messages.length === 0)){
            console.log("messages is required.");
            return sendResponse(102, [], 'message is required.');
        }

        console.log("typeof messages", typeof messages);
        console.log("messages", messages);
        let returnMessages = await util.callGptAPI(messages);
        console.log("returnMessages", returnMessages);

        if(!returnMessages){
            console.log("An error occurred while searching the gpt api. (103)");
            return sendResponse(103, [], 'An error occurred while searching the gpt api.');
        }

        return sendResponse(null, returnMessages, 'success');
    }catch (e) {
        console.log("An error occurred while searching the gpt api. (101)", e);
        return sendResponse(101, [], 'An error occurred while searching the gpt api.');
    }
};


/** 결과 리턴 함수 **/
function sendResponse(errorCode: number, answer: any[], message: string): object{
    let response: APIGatewayProxyResultV2 = {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true},
        body: ''
    };
    let responseBody: { message: string; errorCode: number, Items: any[]};
    responseBody = {
        message: '',
        errorCode: null,
        Items: []
    };

    if(errorCode)
        response.statusCode = 400;
    responseBody.message = message;
    responseBody.errorCode = errorCode;
    responseBody.Items = answer;
    response.body = JSON.stringify(responseBody);
    return response;
}