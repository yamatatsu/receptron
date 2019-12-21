import { APIGatewayProxyResult } from "aws-lambda";
import { GetItem, createGetAccountParams } from "../dbItems";
import { response, assertIsDefined } from "../lib";

type Log = (args: any) => void;
type Event = { requestContext: { authorizer?: null | Record<string, any> } };

export default (log: Log, getItem: GetItem) => async (
  event: Event,
): Promise<APIGatewayProxyResult> => {
  log({ event });

  const result = await getItem(createGetAccountParams(getUsernme(event)));
  log({ result });
  return response(result.Item);
};

// ================================================================
// private

function getUsernme(event: Event): string {
  const username = event.requestContext.authorizer?.claims?.sub;
  assertIsDefined(username);
  return username;
}
