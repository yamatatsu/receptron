import { APIGatewayProxyResult } from "aws-lambda";
import { PutItem, toPutOrgEventParams } from "../dbItems";
import { response } from "../lib";
import { of } from "rxjs";
import { map, tap, flatMap, mapTo } from "rxjs/operators";
import * as yup from "yup";

type Log = (args: any) => void;
type Event = {
  requestContext: {
    requestId: string;
    authorizer?: null | Record<string, any>;
  };
};

const schema = yup
  .object()
  .shape({
    requestId: yup.string().required(),
    username: yup.string().required(),
    evantType: yup.string().required(),
    payload: yup.object().required(),
  })
  .strict(true)
  .noUnknown();

export default (log: Log, putItem: PutItem) => async (
  event: Event,
): Promise<APIGatewayProxyResult> =>
  of(event)
    .pipe(
      tap(log),
      map(e => {
        const body = JSON.parse(e.body || "");
        return {
          requestId: e.requestContext.requestId,
          username: e.requestContext.authorizer?.claims?.sub,
          evantType: body.evantType,
          payload: body,
        };
      }),
      tap(log),
      flatMap(model => schema.validate(model)),
      map(toPutOrgEventParams),
      tap(log),
      flatMap(putItem),
      tap(log),
      mapTo(response({ ok: true })),
    )
    .toPromise();
