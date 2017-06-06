import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
	const data = JSON.parse(event.body);
	const params = {
		TableName: 'notes',
		Key: {
			userId: event.requestContext.authorizer.claims.sub,
			noteId: event.pathParameters.id,
		},

		// 'UpdateExpression' efines the attributes to be updated
		// 'ExpressionAttributeValues' define the value in the update expression
		UpdateExpression: 'SET content = :content, attachment = :attachment',
		ExpressionAttributeValues: {
			':attachment': data.attachment ? data.attachment : null,
			':content': data.content ? data.content : null,
		},

		ReturnValues: 'ALL_NEW',
	};

	try {
		const result = await dynamoDbLib.call('update', params);
		callback(null, success({ status: true }));
	}
	catch(e) {
		console.log(e);
		callback(null, failure({ status: false }));
	}
};


