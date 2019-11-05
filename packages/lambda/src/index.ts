import { APIGatewayProxyHandler, DynamoDBStreamHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { createCallItem } from "./dbItems";
import { getParam } from "./lib";

console.info("Loading function");

const ddb = new DynamoDB();
const asyncApiResult = { statusCode: 202, body: JSON.stringify({ count: 1 }) };

const healthCheck: APIGatewayProxyHandler = async () => {
  return { statusCode: 200, body: new Date().toISOString() };
};
const createCall: APIGatewayProxyHandler = async event => {
  const timestamp = new Date().toISOString();
  const { body } = event;
  console.info({ timestamp, body });

  const item = createCallItem(getParam(body, "organizationId"), timestamp);
  console.info({ item });

  const result = await ddb.putItem(item).promise();
  console.info(result);

  return asyncApiResult;
};
const callStream: DynamoDBStreamHandler = async () => {
  console.info("called");
};
module.exports = {
  healthCheck,
  createCall,
  callStream,
};
