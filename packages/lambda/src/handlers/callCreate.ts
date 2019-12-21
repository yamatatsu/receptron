import { APIGatewayProxyResult } from "aws-lambda";
import { PutItem, createPutCallParams } from "../dbItems";
import { getParam, response } from "../lib";

type Log = (args: any) => void;
type Event = { body: string | null };
type GetNow = () => Date;

export default (log: Log, getNow: GetNow, putItem: PutItem) => async (
  event: Event,
): Promise<APIGatewayProxyResult> => {
  log({ event });

  const result = await putItem(
    createPutCallParams(
      getParam(event.body, "organizationId"),
      getNow().toISOString(),
    ),
  );
  log({ result });
  return response({ ok: true });
};
