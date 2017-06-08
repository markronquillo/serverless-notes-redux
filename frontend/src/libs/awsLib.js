import AWS from 'aws-sdk';

import config from '../config.js';

import {
	CognitoUserPool,
	AuthenticationDetails,
	CognitoUser,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

export async function invokeApiGateway(
	{
		path,
		method = "GET",
		body	
	},
	userToken
) {

	const url = `${config.apiGateway.URL}${path}`;
	const headers = {
		Authorization: userToken,
	};

	body = (body) ? JSON.stringify(body) : body;

	const results = await fetch(url, {
		method,
		body,
		headers
	});

	if (results.status !== 200) {
		throw new Error(await results.text());
	}

	return results.json();
}

export async function s3Upload(file, userToken) {
	await getAwsCredentials(userToken);

	const s3 = new AWS.S3({
		params: {
			Bucket: config.s3.BUCKET,
		}
	});

	const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${file.name}`;
	return s3.upload({
		Key: filename,
		Body: file,
		ContentType: file.type,
		ACL: 'public-read'
	}).promise();
}


export function getAwsCredentials(userToken) {
	const authenticator = `cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

	AWS.config.update({ region: config.cognito.REGION });

	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
		Logins: {
			[authenticator]: userToken
		}
	});

	return AWS.config.credentials.getPromise();
}

export function getUserToken(currentUser) {
	return new Promise((resolve, reject) => {
	  currentUser.getSession(function(err, session) {
	    if (err) {
	      reject(err);
	      return;
	    }
	    resolve(session.getIdToken().getJwtToken());
	  });
	});
}

export function getCognitoUserPoolInstance() {
	const userPool = new CognitoUserPool({
	  UserPoolId: config.cognito.USER_POOL_ID,
	  ClientId: config.cognito.APP_CLIENT_ID
	});

	return userPool
}

export function login(username, password) {
	const userPool = getCognitoUserPoolInstance();

	const authenticationData = {
		Username: username,
		Password: password
	};
	const user = new CognitoUser({ Username: username, Pool: userPool });
	const authenticationDetails = new AuthenticationDetails(authenticationData);

	return new Promise((resolve, reject) => {
		user.authenticateUser(authenticationDetails, {
			onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
			onFailure: (err) => {
				reject(err)
			}
		})
	});
}

export function signup(username, password) {
	const userPool = getCognitoUserPoolInstance();
    const attributeEmail = new CognitoUserAttribute({ Name : 'email', Value : username });
    return new Promise((resolve, reject) => (
     userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
       if (err) {
         reject(err);
         return;
       }

       resolve(result.user);
     })
   ));
}

export function confirm(user, confirmationCode) {
	return new Promise((resolve, reject) => (
		user.confirmRegistration(confirmationCode, true, function(err, result) {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		})
	));
}

export function authenticate(user, username, password) {
	const authenticationData = {
		Username: username,
		Password: password
	};
	const authenticationDetails = new AuthenticationDetails(authenticationData)

	return new Promise((resolve, reject) => (
		user.authenticateUser(authenticationDetails, {
			onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
			onFailure: (err) => reject(err)
		})
	));
}


