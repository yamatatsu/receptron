// @ts-ignore
import AwsXraySdk from "aws-xray-sdk";
import AWS from "aws-sdk";
import { APIGatewayProxyHandler, DynamoDBStreamHandler } from "aws-lambda";
import { GetItem, PutItem } from "./dbItems";
import { messenger } from "./slack";
import healthCheck from "./handlers/healthCheck";
import orgEventCreate from "./handlers/orgEventCreate";
import accountGet from "./handlers/accountGet";
import accountCreate from "./handlers/accountCreate";
import callCreate from "./handlers/callCreate";
import callStream from "./handlers/callStream";
import { log } from "./lib";

console.info("Loading function");

AwsXraySdk.captureAWS(AWS);
const { DynamoDB } = AWS;
const ddb = new DynamoDB();

const getNow = () => new Date();
const postMessage = messenger(process.env.SLACK_TOKEN);
const getItem: GetItem = params => ddb.getItem(params).promise();
const putItem: PutItem = params => ddb.putItem(params).promise();

const handlers: Record<
  string,
  APIGatewayProxyHandler | DynamoDBStreamHandler
> = {
  healthCheck: healthCheck(getNow),
  createOrgEvent: orgEventCreate(log),
  getAccount: accountGet(log, getItem),
  createAccount: accountCreate(log, putItem),
  createCall: callCreate(log, getNow, putItem),
  callStream: callStream(log, postMessage),
};

module.exports = handlers;
