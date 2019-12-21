import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { PutItem, createPutAccountParams } from "../dbItems";
import { assertIsDefined, response } from "../lib";

type Log = (args: any) => void;
type Event = { requestContext: { authorizer?: null | Record<string, any> } };

export default (log: Log, putItem: PutItem) => async (
  event: Event,
): Promise<APIGatewayProxyResult> => {
  log({ event });

  const result = await putItem(createPutAccountParams(getUsernme(event)));
  log({ result });
  return response(
    result.Attributes && DynamoDB.Converter.unmarshall(result.Attributes),
  );
};

// ================================================================
// private

function getUsernme(event: Event): string {
  const username = event.requestContext.authorizer?.claims?.sub;
  assertIsDefined(username);
  return username;
}
