import accountGet from "./accountGet";

const log = () => {};
const authorizerEvent = {
  requestContext: {
    authorizer: { claims: { sub: "test_username" } },
  },
};

test("accountGet", async () => {
  const getItem = async () => ({ Item: "testtest" });
  const event = authorizerEvent;
  // @ts-ignore
  expect(await accountGet(log, getItem)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify("testtest"),
  });
});
