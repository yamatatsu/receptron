import { Handler } from "aws-lambda";
import { getNum } from "./lib";

console.info("Loading function");
const handler: Handler = async () => {
  return { statusCode: 201, body: getNum() };
};

exports.handler = handler;
