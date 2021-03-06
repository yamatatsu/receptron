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
    cognitoUsername: yup.string().required(),
    requestId: yup.string().required(),
    eventType: yup.string().required(),
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
          cognitoUsername: e.requestContext.authorizer?.claims?.sub,
          requestId: e.requestContext.requestId,
          eventType: body.eventType,
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
