require('dotenv').config();

export default {
	MAX_ATTACHMENT_SIZE: 5000000,
	apiGateway: {
		URL: process.env.API_GATEWAY_URL,
	},
  cognito: {
    USER_POOL_ID : process.env.USER_POOL_ID,
    REGION: process.env.REGION,
    APP_CLIENT_ID : process.env.APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
  },
  s3: {
  	BUCKET: process.env.BUCKET
  }
};

