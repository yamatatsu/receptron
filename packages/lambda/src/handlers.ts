import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  DynamoDBStreamHandler,
} from "aws-lambda";
import {
  GetItem,
  PutItem,
  createGetAccountParams,
  createPutCallParams,
} from "./dbItems";
import { PostMessage, callingArguments } from "./slack";
import { getParam, assertIsDefined, log } from "./lib";

type GetNow = () => Date;

export const healthCheck = (
  getNow: GetNow,
): APIGatewayProxyHandler => async () => {
  return response({ timestamp: getNow().toISOString() });
};

export const getAccount = (
  getItem: GetItem,
): APIGatewayProxyHandler => async event => {
  log({ event });

  const result = await getItem(createGetAccountParams(getUsernme(event)));
  log({ result });
  return response(result.Item);
};

export const createCall = (
  getNow: GetNow,
  putItem: PutItem,
): APIGatewayProxyHandler => async event => {
  log({ event });

  const result = await putItem(
    createPutCallParams(
      getParam(event.body, "organizationId"),
      getNow().toISOString(),
    ),
  );
  log({ result });
  return response({ count: 1 });
};

export const callStream = (
  postMessage: PostMessage,
): DynamoDBStreamHandler => async () => {
  const result = await postMessage(callingArguments());
  log({ result });
};

// ================================================================
// private

function response(body: Object | undefined) {
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  };
}

function getUsernme(event: APIGatewayProxyEvent): string {
  const username = event.requestContext.authorizer?.claims?.sub;
  assertIsDefined(username);
  return username;
}
