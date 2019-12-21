import accountCreate from "./accountCreate";

const log = () => {};
const authorizerEvent = {
  requestContext: {
    authorizer: { claims: { sub: "test_username" } },
  },
};

test("accountCreate", async () => {
  const putItem = async () => ({ Attributes: { foo: { S: "bar" } } });
  const event = authorizerEvent;
  expect(await accountCreate(log, putItem)(event)).toStrictEqual({
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ foo: "bar" }),
  });
});
