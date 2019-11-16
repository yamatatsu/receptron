// @ts-ignore
import AwsXraySdk from "aws-xray-sdk";
import AWS from "aws-sdk";
import { GetItem, PutItem } from "./dbItems";
import { messenger } from "./slack";
import { healthCheck, getAccount, createCall, callStream } from "./handlers";
import { log } from "./lib";

console.info("Loading function");

AwsXraySdk.captureAWS(AWS);
const { DynamoDB } = AWS;
const ddb = new DynamoDB();

const getNow = () => new Date();
const postMessage = messenger(process.env.SLACK_TOKEN);
const getItem: GetItem = params => ddb.getItem(params).promise();
const putItem: PutItem = params => ddb.putItem(params).promise();

module.exports = {
  healthCheck: healthCheck(getNow),
  getAccount: getAccount(log, getItem),
  createCall: createCall(log, getNow, putItem),
  callStream: callStream(log, postMessage),
};
