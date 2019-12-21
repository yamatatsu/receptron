import { APIGatewayProxyResult } from "aws-lambda";
// import { DynamoDB } from "aws-sdk";
// import { PutItem, createPutAccountParams } from "../dbItems";
import { response } from "../lib";

type Log = (args: any) => void;

export default (
  log: Log,
  // putItem: PutItem,
) => async (event: any, context: any): Promise<APIGatewayProxyResult> => {
  log({ event, context });

  return response({ ok: true });
};
