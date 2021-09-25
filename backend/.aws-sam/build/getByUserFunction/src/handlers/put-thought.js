// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

exports.putThoughtHandler = async (event) => {
  // All log statements are written to CloudWatch
  console.info('received:', 'TABLENAME:', tableName, event);

  // Get username and thought from the body of the request
  const { username, thought, image } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: { username: username, thought: thought, image: image, createdAt: Date.now() },
  };
  
  // Handle db operation errors w/ a try/catch block
  try {
    const reply = await docClient.put(params).promise();
  } catch(err) {
    console.error(err);
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify({ username, thought }),
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);

  return response;
};
