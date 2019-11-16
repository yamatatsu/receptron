import { healthCheck, getAccount, createCall, callStream } from "./handlers";

const testDate = "2019-11-16T13:06:00.000Z";
const getNow = () => new Date(testDate);
const log = () => {};

test("healthCheck", async () => {
  const event = {};
  // @ts-ignore
  expect(await healthCheck(getNow)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ timestamp: testDate }),
  });
});

test("getAccount", async () => {
  const getItem = async () => ({ Item: "testtest" });
  const event = {
    requestContext: {
      authorizer: { claims: { sub: "test_username" } },
    },
  };
  // @ts-ignore
  expect(await getAccount(log, getItem)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify("testtest"),
  });
});

test("createCall", async () => {
  const putItem = async () => ({});
  const event = { body: '{ "organizationId": "test_organizationId" }' };
  // @ts-ignore
  expect(await createCall(log, getNow, putItem)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ count: 1 }),
  });
});

test("callStream", async () => {
  const postMessage = async () => ({});
  const event = {};
  // @ts-ignore
  expect(await callStream(log, postMessage)(event)).toBe(undefined);
});
