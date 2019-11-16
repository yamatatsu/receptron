import { APIGatewayProxyHandler, DynamoDBStreamHandler } from "aws-lambda";
// @ts-ignore
import AwsXraySdk from "aws-xray-sdk";
import AWS from "aws-sdk";
import { WebClient } from "@slack/web-api";
import { createCallItem } from "./dbItems";
import { callingArguments } from "./slack";
import { getParam } from "./lib";

console.info("Loading function");

AwsXraySdk.captureAWS(AWS);
const { DynamoDB } = AWS;
const ddb = new DynamoDB();
const asyncApiResult = { statusCode: 202, body: JSON.stringify({ count: 1 }) };

const healthCheck: APIGatewayProxyHandler = async () => {
  return { statusCode: 200, body: new Date().toISOString() };
};
const createCall: APIGatewayProxyHandler = async event => {
  log({ event });
  const timestamp = new Date().toISOString();
  const { body } = event;
  log({ timestamp, body });

  const item = createCallItem(getParam(body, "organizationId"), timestamp);
  log({ item });

  const result = await ddb.putItem(item).promise();
  log({ result });

  return asyncApiResult;
};
const callStream: DynamoDBStreamHandler = async () => {
  const slack = new WebClient(process.env.SLACK_TOKEN);
  const result = await slack.chat.postMessage(callingArguments());
  log({ result });
};
module.exports = {
  healthCheck,
  createCall,
  callStream,
};

function log(obj: Object) {
  Object.entries(obj).forEach(([k, v]) => {
    console.log(`${k}:: ${JSON.stringify(v, null, 2)}`);
  });
}
