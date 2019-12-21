import { APIGatewayProxyResult } from "aws-lambda";
import { response } from "../lib";

type GetNow = () => Date;

export default (getNow: GetNow) => async (): Promise<APIGatewayProxyResult> => {
  return response({ timestamp: getNow().toISOString() });
};
