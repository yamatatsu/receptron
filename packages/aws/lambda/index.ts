import { Handler } from "aws-lambda";

console.info("Loading function");
const handler: Handler = async () => {
  return { statusCode: 201, body: "2" };
};

exports.handler = handler;
