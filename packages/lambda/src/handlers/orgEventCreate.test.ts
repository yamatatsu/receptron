import orgEventCreate from "./orgEventCreate";
import { DynamoDB } from "aws-sdk";
const marshall = DynamoDB.Converter.marshall;

const log = () => {};
const authorizedEvent = {
  body: JSON.stringify({ eventType: "test_eventType" }),
  requestContext: {
    requestId: "test_requestId",
    authorizer: { claims: { sub: "test_cognitoUsername" } },
  },
};

test("orgEventCreate", async () => {
  const event = authorizedEvent;
  const putItem = () => Promise.resolve({});

  expect(await orgEventCreate(log, putItem)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ok: true }),
  });
});

test("orgEventCreate/putItem", async () => {
  const event = authorizedEvent;
  const putItem = (params: any) => {
    expect(params.TableName).toEqual("ReceptronOrgEvent20191229");
    expect(params.ReturnConsumedCapacity).toEqual("TOTAL");
    expect(params.Item).toStrictEqual(
      marshall({
        cognitoUsername: "test_cognitoUsername",
        requestId: "test_requestId",
        eventType: "test_eventType",
        payload: { eventType: "test_eventType" },
      }),
    );
    return Promise.resolve({});
  };

  await orgEventCreate(log, putItem)(event);
});
